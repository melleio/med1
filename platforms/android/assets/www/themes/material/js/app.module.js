"use strict";
angular
.module('materialApp', ['ngMaterial','md.data.table',"ngCordova",'ui.router','ngRoute','firebase','ngSanitize','ngAnimate'])
.run(function($rootScope, $cordovaDevice,$cordovaGeolocation,$mdToast,fbStorage,$http){

  AndroidFullScreen.leanMode(successFunction, errorFunction);
  $rootScope.storage = window.localStorage;
  $rootScope.phoneNumber = null;
  $rootScope.filterState = $rootScope.storage.getItem('filterState');
  if($rootScope.filterState == null){
    $rootScope.filterState = false;
  }
  $rootScope.blueicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAy0lEQVR4ARTIJWIDUQAFwPdhmRl1UZV8GY5QllWlgxRyv5gwyZjwwsghqFi7D39M9b8IVwpCObBZN5gafDNr/+mXMf52d/cq7O+fkTDISW/QPtys5x5liv95dfOiquYOIOSwnR3sbZ+Iqm5+UMoVKEqADTFQFAQFkZBGCTzHAAeh6I+HSLMYYHVMMZw0IQkMtBxQ+aQrN0//vXJlL8O3D1cZHt87wHDm1LafqnJCExlAQMGtq1/db8o/s6g5/2wS5v9LadjcL+7YywAAHcc65prwVR8AAAAASUVORK5CYII=";
  $rootScope.grayicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAM5JREFUCB1jZACCgICwfiYWlgJGRqb/QAwU+T9xzarFhYyBgWF9/xkZ0lXVdLnY2LkZvn39wvD0yb1fDP//T2PW1jXYpqiowcbNI8TAzMzOwMrKDhT/z/z7928zJiZGZgY2dg4GJkYWkA0MIGP5+PgZ2DnYGZgYGBkYPn36xPD7z0+G///+Mfxn+Mvw+fN7oCnMDMxa2nqCP358M/3x4wfQTUwMHz68Ynj5/NFPaRnZKczXrl7aqadvIvif4Z/5798/QC5lkJGTn9LVXl8EAPQTRLIgRERiAAAAAElFTkSuQmCC";
  $rootScope.parcelIcon = "data:image/png;base64,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";
  $rootScope.defaultPosition = {coords:{latitude:39.963846,longitude:-75.1603751,zoom:13}};
  // console.log($rootScope.searchHistory);

  $rootScope.greyIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAX5JREFUOI1jYaAyYBk1EBkw+fv7h5uZmdkJCAiIMzAw/Hv9+vWTQ4cO7dq3b982Ug0Uqa2tneTm5ubFxcXFjyxhb28frq+vv7G/v7+YgYHhKzEGMjc1NU338vIKYWRkxJDk4+OTiIqKSmVlZWXp6upKIWhgSkpKmqurqz82w2CAiYmJycvLK+T+/ftbVq9evQGvgQYGBl5sbGysOE2DAl5eXn4zM7Mgggby8fGpEDIMBgQFBZXQxTAMZGRkZCfWQCYmJgy1GAb+/PnzJQMDgyIxBn779u01QQNfvnx54u/fvxbMzMx4Dfvx4wfDixcvDhA08PLly1WioqI+xsbGOMPy////DGfOnDnX0tLSQ9DAFStWfNfU1Iw8f/78Wl1dXTkWFlQlv379Yjh//vz1Fy9eBDIwMPwjaCADAwNDfX39ma6uLr1jx45NEhYWtmVjY5NiYGD49+PHj4fv3r3b9fr165L29vbf2PTizMtlZWUfGRgY4nHJ4wJDu/giCwAArBF4NZw3ZqgAAAAASUVORK5CYII=";
  
  document.addEventListener("deviceready", function () {
    $rootScope.platform = device.platform;

    var networkState = navigator.connection.type;

    var states = {};
    $rootScope.initialLimit = 40;
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if(networkState == Connection.CELL_3G || networkState == Connection.CELL_3G){
      $rootScope.initialLimit = 5;
    }

    window.plugins.sim.getSimInfo(successCallback, errorCallback);

    // universalLinks.subscribe('checkBetaUser', checkBetaUser);

    // function checkBetaUser(eventData){
    //   // console.log(eventData);

    // }

    function successCallback(result) {
      if(result.carrierName != ""){
        $rootScope.phoneNumber = result.phoneNumber;
        $rootScope.carrierName = result.carrierName;
        // console.log(result);
        $mdToast.show(
          $mdToast.simple()
          .textContent("Welcome.")
          .position('top right')
          .hideDelay(1300)
        );
      }
    }

function errorCallback(error) {
  // console.log(error);
}

// Android only: check permission
function hasReadPermission() {
  window.plugins.sim.hasReadPermission(successCallback, errorCallback);
}

// Android only: request permission
function requestReadPermission() {
  window.plugins.sim.requestReadPermission(successCallback, errorCallback);
}
    // //Load crime Map icons
    // var policeIcons = $rootScope.storage.getItem("crimeIcons");
    // if(!policeIcons){
    //   var req = {
    //     method: 'GET',
    //     url: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/Police_Incidents_Part1_Part2/MapServer/legend?f=pjson'
    //   };
    //   $http(req)
    //   .success(function(data,status,headers,config){
    //     //Save Icons!
    //     $rootScope.storage.setItem("crimeIcons",JSON.stringify(data));
    //     $rootScope.crimeIcons = data;
    //   })
    //   .error(function(data, status, headers, config){
    //     console.log("Unable to load icons");
    //   });
    // }else{
    //   $rootScope.crimeIcons = JSON.parse($rootScope.storage.getItem('crimeIcons'));
    // }
    
  });

$rootScope.mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        { "invert_lightness": true }
      ]
    },{
      "featureType": "landscape",
      "stylers": [
        { "visibility": "simplified" },
        { "invert_lightness": true }
      ]
    },{
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        { "visibility": "on" },
        { "lightness": 100 },
        { "color": "#f9fff9" }
      ]
    },{
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        { "lightness": 77 }
      ]
    },{
      "featureType": "road",
      "elementType": "labels.text",
      "stylers": [
        { "visibility": "simplified" }
      ]
    },{
    },{
      "featureType": "transit",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#f14728" },
        { "weight": 1 }
      ]
    },{
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        { "lightness": 69 }
      ]
    },{
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        { "visibility": "simplified" }
      ]
    },{
      "featureType": "administrative.neighborhood",
      "elementType": "labels",
      "stylers": [
        { "visibility": "simplified" },
        { "saturation": -30 },
        { "color": "#252651" },
        { "invert_lightness": true },
        { "lightness": -41 }
      ]
    },{
      "featureType": "poi",
      "elementType": "geometry.fill",
      "stylers": [
        { "lightness": 52 }
      ]
    },{
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        { "visibility": "simplified" }
      ]
    },{
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        { "lightness": 47 }
      ]
    },{
      "featureType": "poi.school",
      "elementType": "geometry",
      "stylers": [
        { "lightness": 12 }
      ]
    },{
      "featureType": "poi.medical",
      "elementType": "geometry.fill",
      "stylers": [
        { "invert_lightness": true },
        { "visibility": "on" },
        { "lightness": 44 }
      ]
    },{
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "simplified" }
      ]
    },{
    }
    ];
});