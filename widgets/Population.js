define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Button',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom', 
    'dojo/domReady!',
    'dojo/on',
    'dojo/text!./Population/templates/Population.html',
    'dojo/topic',
    'dojo/aspect',
    'xstyle/css!./Population/css/Population.css',
    'dojo/dom-construct',
    'dojo/_base/Color',
    'esri/graphic',
    'esri/tasks/Geoprocessor',
    'esri/tasks/FeatureSet',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/graphicsUtils',
    'esri/tasks/LinearUnit',
    'esri/toolbars/draw',
    'dojo/string'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Button, lang, arrayUtils, dom, ready, on, template, topic, aspect, css, domConstruct, Color, Graphic, Geoprocessor, FeatureSet, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, graphicsUtils, LinearUnit, Draw, string) {
    var gp;
    var map;
    var pointSymbol;
    var outline;
    var polySymbol;
    var toolbar;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        name: 'Population',
        map: true,
        widgetsInTemplate: true,
        templateString: template,

        postCreate: function(){
            this.inherited(arguments);
            map = this.map;
            //Add Watershed Delineation Geoprocessing Function
            if (this.parentWidget) {
                if (this.parentWidget.toggleable) {
                    this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                        this.onLayoutChange(this.parentWidget.open);
                    })));
                }
            } 
        },

        initPopulation: function (evtObj) {
            gp = new Geoprocessor("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/GPServer/PopulationSummary");

            console.log("1");

            gp.setOutputSpatialReference({wkid: 4326});

            gp.on("execute-complete", lang.hitch(this, "displayResults"));
            toolbar = new Draw(this.map);
            toolbar.activate(Draw.FREEHAND_POLYGON);
            toolbar.on("draw-end", lang.hitch(this, "computeZonalStats") );
            console.log("2");
            console.log(toolbar);
        },

        computeZonalStats: function(evtObj){
            console.log("3");
            var geometry = evtObj.geometry;
            /*After user draws shape on map using the draw toolbar compute the zonal*/
            this.map.showZoomSlider();
            this.map.graphics.clear();
            
            var symbol = new SimpleFillSymbol("none", new SimpleLineSymbol("dashdot", new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
            var graphic = new Graphic(geometry,symbol);

            this.map.graphics.add(graphic);
            toolbar.deactivate();

            var features= [];
            features.push(graphic);

            var featureSet = new FeatureSet();
            featureSet.features = features;
            
            var params = { "inputPoly":featureSet };
            gp.execute(params);
        },

        displayResults: function (evtObj) {
            var results = evtObj.results;
            var content = string.substitute("The population in the user defined polygon is ${number:dojo.number.format}.",{number:results[0].value.features[0].attributes.SUM});

            console.log(content);
            document.getElementById("thePopulation").value = content;  
                // registry.byId("dialog1").setContent(content);
                // registry.byId("dialog1").show();
        },

        onPopulation: function()
        {
            $('html,body').css('cursor','crosshair');
            this.initPopulation();
        },

        onClear: function()
        {
            $('html,body').css('cursor','default');
            document.getElementById("thePopulation").value = "";
            this.map.graphics.clear();
        },

        onLayoutChange: function (open) {
            if (open) {
                this.disconnectMapClick();            
            } else {
                this.onClear();
            }
        },

        disconnectMapClick: function() {
            topic.publish("mapClickMode/setCurrent", "draw");
        },

        connectMapClick: function() {
            topic.publish("mapClickMode/setDefault");
        },

        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }

    });
});