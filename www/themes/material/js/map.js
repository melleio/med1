
/* Todo: Reset navigation menu after search */

"use strict";
angular
  .module('materialApp')
  .controller('MCtrl', function($rootScope,$state,$scope,$mdSidenav,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,$cordovaCamera,fbStorage) {
    var vm = self;
    $rootScope.gAddress = null;
    $scope.loadMap = true;
    $rootScope.parcelId = null;
    $rootScope.position = {};
    $rootScope.showSort = true;
    $rootScope.map =  null;
    $rootScope.mapLoaded = false;
    $rootScope.toolbarTitle = "Tap and hold to view";
    $rootScope.parclMarker = null;
    $rootScope.activeCity = null;
    $rootScope.activeCounty = null;
    $rootScope.mapList = [];
    var searchedItem = JSON.parse($rootScope.storage.getItem('searchedItem'));
    if(searchedItem != null){
      $rootScope.storage.setItem("searchedItem",null);
      $rootScope.currentParcl = searchedItem;

      var city = _.find(searchedItem.address_components,function(o) { return o.types[0]=="locality" });
      $rootScope.activeCity = city.long_name;
      $rootScope.currentCity = city.long_name;
      var county = _.find(searchedItem.address_components,function(o) { return o.types[0]=="administrative_area_level_2" });
      $rootScope.activeCounty = county.long_name;
    }

    angular.element(document).ready(function(){
      $mdSidenav('right').onClose(function () {
        if($rootScope.map != null){
          $rootScope.map.setClickable(true);
        }
      });

      // Toggle Right Nav
      $rootScope.toggleRight = buildToggler('right');
      $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
      };

      function buildToggler(navID) {
        return function() {
          // Component lookup should always be available since we are not using `ng-if` 
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              //Load neighborhoods
              
              if($rootScope.map != null){
                // $rootScope.loadCounty($rootScope.map.getCameraPosition().target.lat,$rootScope.map.getCameraPosition().target.lng)
                $rootScope.map.setClickable(false);
              }
            });
        }
      }
    });
    
    document.addEventListener("deviceready", function () {

      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.overlaysWebView(true);
        window.StatusBar.styleDefault();
      }
      vm.lat = ($state.params.lat != "") ? parseFloat($state.params.lat) : null;
      vm.lng = ($state.params.lng != "") ? parseFloat($state.params.lng) : null;

      vm.lat = ($state.params.lat != 0) ? parseFloat($state.params.lat) : null;
      vm.lng = ($state.params.lng != 0) ? parseFloat($state.params.lng) : null;

      if(vm.lat == null && vm.lng == null){
        // vm.start_position = new plugin.google.maps.LatLng($rootScope.defaultPosition.coords.latitude,$rootScope.defaultPosition.coords.longitude);
      }else{
        // $rootScope.mapLoaded = true;
        // vm.start_position = new plugin.google.maps.LatLng(vm.lat,vm.lng);
      }

      $scope.loadParcl = loadParcl;

      // Hide Keyboard
      if(cordova.plugins.Keyboard.isVisible)
        cordova.plugins.Keyboard.close();

      function loadParcl(lat,lng){
        var req = {
          method: 'GET',
          url: 'https://x.emelle.me/jsonservice/Parcl/asearch',
          params: {
            'lat':lat,
            'lng':lng,
            'city':$rootScope.activeCity,
            'county':$rootScope.activeCounty
          }
        };

        $http(req)
        .success(function(data,status,headers,config){
          $rootScope.map.setClickable(true);
          
            if(data.response.address != null){
              var city = data.response.city.toLowerCase() ? data.response.city.toLowerCase() : "philadelphia";
              $rootScope.currentCity = city;
              $rootScope.searching = false;
              $scope.loadMap = false;
              
              $rootScope.selectedItem = data.response;
              _.pull($rootScope.mapList, _.find($rootScope.mapList,["parcel_number",$rootScope.selectedItem]));
              $rootScope.mapList.push($rootScope.selectedItem);

              // // $rootScope.storage.setItem("parcl_"+$rootScope.selectedItem.parcl_number,$rootScope.selectedItem);  
              // $mdToast.show(
              //   $mdToast.simple()
              //   .textContent("Parcl Loaded")
              //   .position('top right')
              //   .hideDelay(700)
              // );
            }else{
              // CHeck for list
              $rootScope.searching = false;
              $scope.loadMap = false;
              // $rootScope.parclMarker.remove();
              $rootScope.map.setClickable(true);
              $mdToast.show(
                $mdToast.simple()
                .textContent("Error loading address")
                .position('top right')
                .hideDelay(3000)
              );
            }
          //Show overlay
          if(data.response.overlaydata !== undefined || data.response.overlaydata != null){
            var overlay=[];
            angular.forEach(data.response.overlaydata, function(p,index) {
                overlay.push(new plugin.google.maps.LatLng(p[1],p[0]));
            });
            var zoned = _.find($rootScope.phillyZoning,function(o){return _.find(o.districts,{code:$rootScope.selectedItem.zoning})})
            var color = '#63A2D6';
            if(zoned !== undefined && zoned != null){
              color = zoned.color.toUpperCase();
            }
            // $rootScope.map.addPolygon({
            //   'points':overlay,
            //   'strokeColor': '#06477D',
            //   'strokeWidth': 1,
            //   'fillColor':color,
            //   'fillOpacity':0.1
            // },function(polygon){
            //   if(data.response.parcel_number !== undefined){
            //     fbStorage.mapHistoryAdd($rootScope.selectedItem);
            //     fbStorage.searchHistoryAdd({
            //       address:$rootScope.selectedItem.address,
            //       parcel_number:$rootScope.selectedItem.parcel_number
            //     });
            //   }
            // })
          }
          $rootScope.map.setClickable(true);
          // console.log(data);
        })
        .error(function(data, status, headers, config){
          $rootScope.searching = false;
          $rootScope.map.setClickable(true);
          // console.log("No Datas :(", data);
          $mdToast.show(
            $mdToast.simple()
            .content("Region Unavailable.")
            .position('top right')
            .hideDelay(3000)
          );
        });
      }

      var div = document.getElementById("map_canvas");
      var deviceheight = window.screen.height;
      // if($rootScope.currentParcel)
      $rootScope.map = plugin.google.maps.Map.getMap(div,{
        'controls': {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': false,
          'zoom': true
        },
        'gestures': {
          'scroll': true,
          'tilt': true,
          'rotate': true,
          'zoom': true
        },
        'camera': {
          'latLng': vm.start_position,
          'tilt': 10,
          'zoom': 16
        },
        'styles': $rootScope.mapStyle
      });
      
      $rootScope.map.on(plugin.google.maps.event.MAP_READY, onMapInit);

      

      function onMapInit(map) {
        
        // map.setMapTypeId(plugin.google.maps.MapTypeId.HYBRID);

        $scope.loadMap = false;
        $rootScope.mapLoaded = true;
        $rootScope.searching = false;

        
        if($rootScope.platform == 'iOS'){
          div.style.height = deviceheight - 48 + "px";
          map.setMyLocationEnabled(true);
        }else{
          div.style.height = deviceheight - 48 + "px";
        }
        // window.FirebasePlugin.logEvent("map_init", {page: "m"});
       
        // $rootScope.map = map;
        if(vm.lat != null && vm.lng != null){
          var loc = new plugin.google.maps.LatLng(vm.lat, vm.lng);
          $rootScope.map.setOptions({
            'camera': {
              'latLng': loc,
              'zoom': 18
            }
          });
          $scope.loadParcl(vm.lat,vm.lng);

          // $rootScope.map.addMarker({
          //   position: vm.start_position,
          //   icon: $rootScope.parcelIcon,
          //   title:"Loading...",
          //   animation: plugin.google.maps.Animation.DROP
          // }, function(marker) {
          //   $rootScope.parclMarker = marker;
          // });
        }else{
          if($rootScope.mapList){
            //To do: show previous property
          }
          $mdToast.show(
            $mdToast.simple()
            .textContent("Map Loaded")
            .position('top right')
            .hideDelay(700)
          );
        }

        var shortClick = plugin.google.maps.event.MAP_LONG_CLICK;

        //Do something on single click
        $rootScope.map.on(shortClick, function(latLng) {
          // $rootScope.map.clear();
          navigator.vibrate(66);

          $rootScope.map.setClickable(false);
          if($rootScope.searching == true){
            return true;
          }
          var loc = new plugin.google.maps.LatLng(latLng.lat, latLng.lng);

          $scope.loadParcl(latLng.lat,latLng.lng);
          // $rootScope.map.setOptions({
          //   'camera': {
          //     'latLng': loc,
          //     'zoom': 18
          //   }
          // });
          //show marker
            $rootScope.map.addMarker({
              position: loc,
              icon: $rootScope.parcelIcon,
              title:"More Info",
              animation: plugin.google.maps.Animation.DROP
            }, function(marker) {
              $rootScope.parclMarker = marker;
              $rootScope.parclMarker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
                $state.go('p',{id:$rootScope.selectedItem.parcel_number,city:$rootScope.currentCity});
              });
            });

          $rootScope.searching = true;
          // window.FirebasePlugin.logEvent("map_click", {page: "map",latlng:latLng});
          var clickCount = $rootScope.storage.getItem("mapClickCount");

          $rootScope.storage.setItem("clickCount",clickCount+1);
          
          //Search for parcl
          
        });

        //Do something on location button click
        // $rootScope.map.on(locationButtonClick, function(latLng) {
        //     console.log("Location Button was clicked.\n" +
        //         latLng.toUrlValue());
        // });
        //Load current position
      } // end map init

    });
  })
.controller('PropertyDetailCtrl', function($state,$rootScope,$scope, $mdDialog,property,city,total,fbStorage) {
  $scope.property = property;
  
  
  $scope.items = [
    { name: 'Property Details', icon: 'icon-home' },
    { name: 'Add a note', icon: 'icon-save' },
  ];

  $scope.hide = function() {
      $mdDialog.hide();
    };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    // console.log(clickedItem);
    if(clickedItem.name == "Property Details"){
      //go to property
      $rootScope.parcelId = $scope.property.account_number;
      $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
    }
    $mdDialog.cancel();
    $rootScope.map.setClickable(true);
  };
})
.controller('GridBottomSheetCtrl', function($state,$rootScope,$scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Hangout', icon: 'hangout' },
    { name: 'Mail', icon: 'mail' },
    { name: 'Message', icon: 'message' },
    { name: 'Copy', icon: 'copy2' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'Twitter', icon: 'twitter' },
  ];

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
    $rootScope.map.setClickable(true);
  };
});

