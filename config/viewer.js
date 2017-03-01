define([
    'esri/units',
    'esri/layers/ImageParameters',
    'esri/urlUtils',
    'dojo/topic'
], function (units, ImageParameters, urlUtils) {

    // helper function returning ImageParameters for dynamic layers
    // example:
    // imageParameters: buildImageParameters({
    //     layerIds: [0],
    //     layerOption: 'show'
    // })

    urlUtils.addProxyRule({
        urlPrefix: "sampleserver1.arcgisonline.com",  
        proxyUrl: "http://wsdtxmal/DotNet/proxy.ashx"
    }); 

    function buildImageParameters (config) {
        config = config || {};
        var ip = new ImageParameters();
        //image parameters for dynamic services, set to png32 for higher quality exports
        ip.format = 'png32';
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                ip[key] = config[key];
            }
        }
        return ip;
    }

    return {
        // used for debugging your app
        isDebug: true,

        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            basemap: 'streets',
            center: [-96.59179687497497, 39.09596293629694],
            zoom: 5,
            sliderStyle: 'small'
        },

        layout: {
            map: 'mapViewDiv'
        },

        // custom titles
        titles: {
            header: 'CMV with Calcite Maps',
            subHeader: 'make it your own',
            pageTitle: 'CMV with Calcite Maps'
        },

        // operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
        // The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
        // 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [{
            type: 'feature',
            url: 'https://services1.arcgis.com/6bXbLtkf4y11TosO/arcgis/rest/services/Restaurants/FeatureServer/0',
            title: 'Restaurants',
            options: {
                id: 'restaurants',
                opacity: 1.0,
                visible: true,
                outFields: ['*'],
                mode: 0
            }
        }, {
            type: 'feature',
            url: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0',
            title: 'SF 311 Incidents',
            options: {
                id: 'sf311Incidents',
                opacity: 1.0,
                visible: true,
                outFields: ['req_type', 'req_date', 'req_time', 'address', 'district'],
                mode: 0
            }
        }, {
            type: 'dynamic',
            url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer',
            title: 'Louisville Public Safety',
            options: {
                id: 'louisvillePubSafety',
                opacity: 1.0,
                visible: true,
                imageParameters: buildImageParameters({
                    layerIds: [0, 2, 4, 5, 8, 10, 12, 21],
                    layerOption: 'show'
                })
            },
            identifyLayerInfos: {
                layerIds: [2, 4, 5, 8, 12, 21]
            },
            layerControlLayerInfos: {
                layerIds: [0, 2, 4, 5, 8, 9, 10, 12, 21]
            },
            legendLayerInfos: {
                layerInfo: {
                    hideLayers: [21]
                }
            }
        }, {
            type: 'dynamic',
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
            title: 'Damage Assessment',
            options: {
                id: 'damageAssessment',
                opacity: 1.0,
                visible: true,
                imageParameters: buildImageParameters()
            },
            legendLayerInfos: {
                exclude: true
            },
            layerControlLayerInfos: {
                swipe: true,
                metadataUrl: true,
                expanded: true
            }
        }
        ],
        // set include:true to load. For titlePane type set position the the desired order in the sidebar
        widgets: {
            growler: {
                include: true,
                id: 'growler',
                type: 'domNode',
                path: 'gis/dijit/Growler',
                srcNodeRef: 'growlerDijit',
                options: {}
            },
            overviewMap: {
                include: true,
                id: 'overviewMap',
                type: 'map',
                path: 'esri/dijit/OverviewMap',
                options: {
                    map: true,
                    attachTo: 'bottom-right',
                    color: '#0000CC',
                    height: 100,
                    width: 125,
                    opacity: 0.30,
                    visible: false
                }
            },
            scalebar: {
                include: true,
                id: 'scalebar',
                type: 'map',
                path: 'esri/dijit/Scalebar',
                options: {
                    map: true,
                    attachTo: 'bottom-left',
                    scalebarStyle: 'line',
                    scalebarUnit: 'dual'
                }
            },
            mapInfo: {
                include: true,
                id: 'mapInfo',
                type: 'domNode',
                path: 'gis/dijit/MapInfo',
                srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true,
                    mode: 'dms',
                    firstCoord: 'y',
                    unitScale: 3,
                    showScale: true,
                    xLabel: '',
                    yLabel: '',
                    minWidth: 286
                }
            },
            homeButton: {
                include: true,
                id: 'homeButton',
                type: 'domNode',
                path: 'esri/dijit/HomeButton',
                srcNodeRef: 'homeButton',
                options: {
                    map: true
                }
            },
            locateButton: {
                include: true,
                id: 'locateButton',
                type: 'domNode',
                path: 'gis/dijit/LocateButton',
                srcNodeRef: 'locateButton',
                options: {
                    map: true,
                    publishGPSPosition: true,
                    highlightLocation: true,
                    useTracking: true,
                    geolocationOptions: {
                        maximumAge: 0,
                        timeout: 15000,
                        enableHighAccuracy: true
                    }
                }
            },
            search: {
                include: true,
                type: 'domNode',
                srcNodeRef: 'searchNavDiv',
                path: 'esri/dijit/Search',
                options: {
                    map: true,
                    visible: true,
                    enableInfoWindow: false,
                    enableButtonMode: true,
                    expanded: false
                }
            },
            searchMenu: {
                include: true,
                type: 'titlePane',
                path: 'esri/dijit/Search',
                title: 'Search',
                visibilityClass: 'visible-xs',
                iconClass: 'fa-search',
                position: 0,
                options: {
                    map: true,
                    visible: true,
                    enableInfoWindow: false
                }
            },
            basemaps: {
                include: true,
                id: 'basemaps',
                type: 'domNode',
                path: 'gis/dijit/Basemaps',
                srcNodeRef: 'basemapsDijit',
                options: 'cmvConfig/basemaps'
            },
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: 'Layers',
                iconClass: 'fa-th-list',
                open: false,
                position: 0,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true
                }
            },
            legend: {
                include: true,
                id: 'legend',
                type: 'titlePane',
                path: 'gis/dijit/Legend',
                title: 'Legend',
                iconClass: 'fa-picture-o',
                open: false,
                position: 1,
                options: {
                    map: true,
                    legendLayerInfos: true
                }
            },
            bookmarks: {
                include: true,
                id: 'bookmarks',
                type: 'titlePane',
                path: 'gis/dijit/Bookmarks',
                title: 'Bookmarks',
                iconClass: 'fa-bookmark',
                open: false,
                position: 2,
                options: 'cmvConfig/bookmarks'
            },
            find: {
                include: true,
                id: 'find',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Find',
                title: 'Find',
                iconClass: 'fa-search',
                open: false,
                position: 3,
                options: 'cmvConfig/find'
            },
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Draw',
                title: 'Draw',
                iconClass: 'fa-paint-brush',
                open: false,
                position: 4,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            measure: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Measurement',
                title: 'Measure',
                iconClass: 'fa-expand',
                open: false,
                position: 5,
                options: {
                    map: true,
                    mapClickMode: true,
                    defaultAreaUnit: units.SQUARE_MILES,
                    defaultLengthUnit: units.MILES
                }
            },
            print: {
                include: true,
                id: 'print',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Print',
                title: 'Print',
                iconClass: 'fa-print',
                open: false,
                position: 6,
                options: {
                    map: true,
                    printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                    copyrightText: 'Copyright 2014',
                    authorText: 'Me',
                    defaultTitle: 'Viewer Map',
                    defaultFormat: 'PDF',
                    defaultLayout: 'Letter ANSI A Landscape'
                }
            },
            directions: {
                include: true,
                id: 'directions',
                type: 'titlePane',
                path: 'gis/dijit/Directions',
                title: 'Directions',
                iconClass: 'fa-map-signs',
                open: false,
                position: 7,
                options: {
                    map: true,
                    mapRightClickMenu: true,
                    options: {
                        routeTaskUrl: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
                        routeParams: {
                            directionsLanguage: 'en-US',
                            directionsLengthUnits: units.MILES
                        },
                        active: false //for 3.12, starts active by default, which we dont want as it interfears with mapClickMode
                    }
                }
            },
            editor: {
                include: true,
                id: 'editor',
                type: 'titlePane',
                path: 'gis/dijit/Editor',
                title: 'Editor',
                iconClass: 'fa-pencil',
                open: false,
                position: 8,
                options: {
                    map: true,
                    mapClickMode: true,
                    editorLayerInfos: true,
                    settings: {
                        toolbarVisible: true,
                        showAttributesOnClick: true,
                        enableUndoRedo: true,
                        createOptions: {
                            polygonDrawTools: ['freehandpolygon', 'autocomplete']
                        },
                        toolbarOptions: {
                            reshapeVisible: true,
                            cutVisible: true,
                            mergeVisible: true
                        }
                    }
                }
            },
            streetview: {
                include: true,
                id: 'streetview',
                type: 'titlePane',
                canFloat: true,
                position: 9,
                path: 'gis/dijit/StreetView',
                title: 'StreetView',
                iconClass: 'fa-street-view',
                paneOptions: {
                    resizable: true,
                    resizeOptions: {
                        minSize: {
                            w: 250,
                            h: 250
                        }
                    }
                },
                options: {
                    map: true,
                    mapClickMode: true,
                    mapRightClickMenu: true
                }
            },
            identify: {
                include: true,
                id: 'identify',
                type: 'titlePane',
                path: 'gis/dijit/Identify',
                title: 'Identify',
                iconClass: 'fa-info-circle',
                open: false,
                position: 3,
                options: 'cmvConfig/identify'
            },
            locale: {
                include: true,
                id: 'locale',
                type: 'titlePane',
                position: 100,
                path: 'gis/dijit/Locale',
                title: 'Locale',
                iconClass: 'fa-flag',
                options: {
                    style: 'margin-left: 30px;'
                }
            },

            calciteStyler: {
                include: true,
                type: 'titlePane',
                path: 'widgets/CalciteStyler',
                position: 100,
                title: 'Calcite Styler',
                open: true,
                iconClass: 'fa-cog',
                options: {}
            },

            dnd: {
                include: true,
                id: 'dnd',
                type: 'titlePane',
                path: 'widgets/DnD',
                position: 100,
                title: 'DnD',
                open: true,
                iconClass: 'fa-cog',
                options: {}
            },

            attributesTable: {
                include: true,
                id: 'attributesContainer',
                type: 'domNode',
                srcNodeRef: 'attributesContainer',
                path: 'widgets/AttributesTable',
                options: {
                    map: true,
                    mapClickMode: true,

                    // use a tab container for multiple tables or
                    // show only a single table
                    useTabs: true,

                    // used to open the sidebar after a query has completed
                    sidebarID: 'sidebarBottom',

                    // optional tables to load when the widget is first instantiated
                    tables: [
                        {
                            title: 'Census',
                            topicID: 'censusQuery',
                            queryOptions: {
                                queryParameters: {
                                    url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/4',
                                    maxAllowableOffset: 100,
                                    where: 'STATE_FIPS = \'06\' OR STATE_FIPS = \'08\''
                                },
                                idProperty: 'ObjectID'
                            }
                        }
                    ]
                }
            },

            search: {
                include: true,
                id: 'search',
                type: 'titlePane',
                path: 'widgets/Search',
                canFloat: false,
                title: 'Search',
                open: false,
                position: 100,
                options: 'config/searchWidget'
            },
            exportDialog: {
                include: true,
                id: 'export',
                type: 'floating',
                path: 'widgets/Export',
                title: 'Export',
                options: {}
            },
            nexred: {
                include: true,
                id: 'Nexrad',
                type: 'titlePane',
            //    canFloat: true,
                position: 100,
                path: 'widgets/Nexrad',
                title: 'Current Weather',
                iconClass: 'fa-cog',
                options: {
                    map: true
                }
            },        

            population: {
                include: true,
                id: 'population',
                type: 'titlePane', //titlePane, invisible
                canFloat: false,
                title: 'Summarize Population',
                path: 'widgets/Population',
                iconClass: 'fa-cog',
                position: 100,
                open: false,
                options: {
                    map: true,
                }
            },

            elevation: {
                include: true,
                id: 'elevationnew',
                type: 'titlePane',
                path: 'widgets/ElevationProfile',
                canFloat: true,
                title: 'Elevation Profile',
                iconClass: 'fa-cog',
                open: false,
                position: 100,
                options: {
                    map: true
                }
            },        

            about: {
                include: true,
                type: 'floating',
                position: 100,
                path: 'dijit/layout/ContentPane',
                title: 'About CMV',
                open: true,
                iconClass: 'fa-info',
                options: {
                    className: 'text-center',
                    style: 'max-height:90%;',
                    content: [
                        '<h4 style="color:#C00;">Using CMV with Calcite Maps</h4>',
                        '<hr/>',
                        '<div class="text-center" style="min-width:260px;font-size:60px;vertical-align:middle;width:90%;white-space:no-break;">',
                        '<a href="https://cmv.io/" target="_blank"><image style="height:60px;margin-top:-18px;" src="https://cmv.io/images/rocket-logo.png"></a>',
                        '<span class="fa fa-fw fa-plus"></span>',
                        '<a href="http://esri.github.io/calcite-maps/" target="_blank" class="esri-icon esri-icon-map-pin"style="color:#0079c1;text-decoration:none !important;"></a>',
                        '</div>',
                        '<h5>This is a demonstration of using <a href="https://cmv.io/" target="_blank">CMV</a> with Esri\'s <a href="http://esri.github.io/calcite-maps/" target="_blank">Calcite Maps</a>. You can use the styler widget to explore the different colors, styles and layouts. When you are done, apply the CSS styles and classes to your own apps.</h5>',
                        '<br/>',
                        '<button type="button" class="btn btn-success btn-lg"  data-dismiss="modal">Get started</a>'
                    ].join('')
                }
            }
        }
    };
});
