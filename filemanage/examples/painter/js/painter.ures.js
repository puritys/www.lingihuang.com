//this is all constant variable
//but it maybe change usually!
UM.extend({URES : {
    defaults: {
        latlng: {
            lat: 25.047377279499894,
            lng: 121.51455999753944
        },
        zoomlevel: 9,
        fileSize: {
            width: 800,
            height: 500
        }
    },
    isSaved: true,
    fileSize: {
        min: {
            width: 100,
            height: 100
        },
        max: {
            width: 1280,
            height: 600
        }
    },
    mapPanelBox: {
        top: 38,
        bottom: 9,
        left: 10,
        right: 10
    },
    lightboxCss: {
        url: '../css/lightbox/',
        filename: '/lightbox.css',
        idSuffix: 'LightboxCss'
    },
    iconCssClass: {
        layerIconCssClass: 'layer-icon',
        groupIconCssClass: 'group-icon'
    },
    recordLabels: {
        layer: '圖層',
        group: '群組'
    }
}});

