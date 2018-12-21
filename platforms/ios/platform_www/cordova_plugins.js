cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-camera.Camera",
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "id": "cordova-plugin-camera.camera",
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "file": "plugins/cordova-plugin-camera/www/ios/CameraPopoverHandle.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-fullscreen.AndroidFullScreen",
        "file": "plugins/cordova-plugin-fullscreen/www/AndroidFullScreen.js",
        "pluginId": "cordova-plugin-fullscreen",
        "clobbers": [
            "AndroidFullScreen"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.Coordinates",
        "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.PositionError",
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.Position",
        "file": "plugins/cordova-plugin-geolocation/www/Position.js",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Position"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.geolocation",
        "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "cordova-plugin-sim.Sim",
        "file": "plugins/cordova-plugin-sim/www/sim.js",
        "pluginId": "cordova-plugin-sim",
        "merges": [
            "window.plugins.sim"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "cordova-plugin-vibration.notification",
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "id": "cordova-universal-links-plugin.universalLinks",
        "file": "plugins/cordova-universal-links-plugin/www/universal_links.js",
        "pluginId": "cordova-universal-links-plugin",
        "clobbers": [
            "universalLinks"
        ]
    },
    {
        "id": "ionic-plugin-keyboard.keyboard",
        "file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.BaseClass",
        "file": "plugins/cordova-plugin-googlemaps/www/BaseClass.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.BaseArrayClass",
        "file": "plugins/cordova-plugin-googlemaps/www/BaseArrayClass.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.LatLng",
        "file": "plugins/cordova-plugin-googlemaps/www/LatLng.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.LatLngBounds",
        "file": "plugins/cordova-plugin-googlemaps/www/LatLngBounds.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Location",
        "file": "plugins/cordova-plugin-googlemaps/www/Location.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.CameraPosition",
        "file": "plugins/cordova-plugin-googlemaps/www/CameraPosition.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Polyline",
        "file": "plugins/cordova-plugin-googlemaps/www/Polyline.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Polygon",
        "file": "plugins/cordova-plugin-googlemaps/www/Polygon.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Marker",
        "file": "plugins/cordova-plugin-googlemaps/www/Marker.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.InfoWindow",
        "file": "plugins/cordova-plugin-googlemaps/www/InfoWindow.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Circle",
        "file": "plugins/cordova-plugin-googlemaps/www/Circle.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.TileOverlay",
        "file": "plugins/cordova-plugin-googlemaps/www/TileOverlay.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.GroundOverlay",
        "file": "plugins/cordova-plugin-googlemaps/www/GroundOverlay.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Common",
        "file": "plugins/cordova-plugin-googlemaps/www/Common.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.encoding",
        "file": "plugins/cordova-plugin-googlemaps/www/encoding.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.spherical",
        "file": "plugins/cordova-plugin-googlemaps/www/spherical.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Geocoder",
        "file": "plugins/cordova-plugin-googlemaps/www/Geocoder.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.ExternalService",
        "file": "plugins/cordova-plugin-googlemaps/www/ExternalService.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Map",
        "file": "plugins/cordova-plugin-googlemaps/www/Map.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.event",
        "file": "plugins/cordova-plugin-googlemaps/www/event.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.MapTypeId",
        "file": "plugins/cordova-plugin-googlemaps/www/MapTypeId.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.KmlOverlay",
        "file": "plugins/cordova-plugin-googlemaps/www/KmlOverlay.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.Environment",
        "file": "plugins/cordova-plugin-googlemaps/www/Environment.js",
        "pluginId": "cordova-plugin-googlemaps",
        "runs": true
    },
    {
        "id": "cordova-plugin-googlemaps.CordovaGoogleMaps",
        "file": "plugins/cordova-plugin-googlemaps/www/googlemaps-cdv-plugin.js",
        "pluginId": "cordova-plugin-googlemaps",
        "clobbers": [
            "plugin.google.maps"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-camera": "2.3.0",
    "cordova-plugin-device": "1.1.3",
    "cordova-plugin-fullscreen": "1.1.0",
    "cordova-plugin-geolocation": "2.2.0",
    "cordova-plugin-inappbrowser": "1.2.1",
    "cordova-plugin-network-information": "1.2.0",
    "cordova-plugin-sim": "1.3.2",
    "cordova-plugin-statusbar": "2.1.3",
    "cordova-plugin-vibration": "2.1.3",
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-universal-links-plugin": "1.2.1",
    "ionic-plugin-keyboard": "2.2.1",
    "com.googlemaps.ios": "2.1.1",
    "cordova-plugin-googlemaps": "2.0.0-beta"
};
// BOTTOM OF METADATA
});