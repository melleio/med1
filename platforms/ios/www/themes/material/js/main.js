
"use strict";

  angular
  .module('materialApp').config(function($locationProvider,$mdThemingProvider,$sceDelegateProvider, $mdIconProvider,$httpProvider,$stateProvider,$urlRouterProvider){

      $locationProvider.html5Mode(false);
      $urlRouterProvider.otherwise("/m/0/0");
      // Now set up the states
      $stateProvider
        .state('home', {
          url: "/home",
          templateUrl: "./themes/material/components/home.html",
          controller: function($stateParams){
          }
        })
        .state('options', {
          url: "/options",
          templateUrl: "./themes/material/components/options.html",
          controller: function($stateParams){
          }
        })
        .state('myparcls', {
          url: "/myparcls",
          templateUrl: "./themes/material/components/parcls.html",
          controller: function($stateParams){
          }
        })
        .state('login', {
          url: "/login",
          templateUrl: "./themes/material/components/login.html",
          controller: function($stateParams){
          }
        })
        .state('map', {
          url: "/map",
          templateUrl: "./themes/material/components/map.html",
          controller: function($stateParams){
          }
        })
        .state('m', {
          url: "/m/:lat/:lng",
          templateUrl: "./themes/material/components/m.html",
          controller: function($stateParams){
            $stateParams.lat;  //*** Exists! ***//
            $stateParams.lng;
          }
        })
        .state('l', {
          url: "/l",
          templateUrl: "./themes/material/components/property-list.html",
          controller: function($stateParams){
          }
        })
        .state('list', {
          url: "/list",
          templateUrl: "./themes/material/components/property-list.html",
          controller: function($stateParams){
          }
        })
        .state('claim', {
          url: "/claim/:city/:id",
          templateUrl: "./themes/material/components/claim-parcl.html",
          controller: function($stateParams){
            $stateParams.id;  //*** Exists! ***//
            $stateParams.city;
          }
        })
        .state('p', {
          url: "/p/:city/:id",
          templateUrl: "./themes/material/components/property-detail.html",
          controller: function($stateParams){
            $stateParams.id;  //*** Exists! ***//
            $stateParams.city;
          }
        })
        .state('property', {
          url: "/property/:city/:id",
          templateUrl: "./themes/material/components/property-detail.html",
          controller: function($stateParams){
            $stateParams.id;  //*** Exists! ***//
            $stateParams.city;

          }
        })

      $mdThemingProvider.definePalette('parclBlue', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': '1A75C2',
        '600': '1B97FE',
        '700': '63A2D6',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light

        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
      });
        
      $mdThemingProvider.theme('default')
       .primaryPalette('parclBlue',{
        'default': '500', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class
      })
      .accentPalette('grey',{
                          'default': '900', // by default use shade 400 from the pink palette for primary intentions
                          'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                        });
    $mdThemingProvider.theme('green')
      .primaryPalette('green')
      .accentPalette('blue-grey');

    
})
.filter('cleandate', function() {
  return function(input) {
    if(input !== undefined){
      var d =new Date(parseInt(input.substr(6,input.length-8)));
      var dd = moment(d);
      return dd.format('MMM Do YYYY');
    }
    
  }
})
.filter('getUnit', function() {
  return function(input) {
    if(input !== undefined){
      return input.replace(/\b0+/g, '');
    }
    
  }
})
.filter('textDate', function() {
  return function(input) {
    if(input !== undefined){
      var dd = moment(input.substring(5,input.length-1));
      return dd.format('MMM Do YYYY');
    }
    
  }
})
.filter('socratadate', function() {
  return function(input) {
    if(input !== undefined){
      var d =new Date(input);
      var dd = moment(d);
      return dd.format('MMM Do YYYY');
    }
    
  }
})
.filter('exteriorCondition', function(){
  return function(input){
    if(input === undefined){
      return;
    }
    var extcon = [{"ext_cond":0,"value": "Not Applicable"},
    {"ext_cond":1,"value": "Other"},
    {"ext_cond":2,"value": "New / Rehabbed"},
    {"ext_cond":3,"value": "Above Average"},
    {"ext_cond":4,"value": "Average"},
    {"ext_cond":5,"value": "Below Average"},
    {"ext_cond":6,"value": "Vacant"},
    {"ext_cond":7,"value": "Sealed / Structurally Compromised"}
  ];
    var val = _.filter(extcon,{"ext_cond":Number(input)});
    return val[0].value;
  }
})
.filter('cleanArcDate', function() {
  return function(input) {
    if(input !== undefined){
      var d =new Date(parseInt(input));
      var dd = moment(d);
      return dd.format('ddd, MMM Do YYYY');
    }
    
  }
})
.filter('formatMoney', function() {
  return function(input) {
    if(input !== undefined){
      var t = parseFloat(input)
      var d ='$'+t.toFixed(2);
      return d.toString();
    }
    
  }
})
.filter('debtType', function() {
  return function(input) {
    if(input !== undefined){
      var t = input.replace("_"," ");
      return t;
    }
    
  }
})
  .filter('formatDate',function(){
    return function(input){
      var d = moment(input);
      return d.format('ddd, MMM Do');
    }
  })
  .filter('formatTime',function(){
    return function(input){
      var d = moment(input);
      return d.format('h:mm a');
    }
  })
  .filter('formatTimeRelative',function(){
    return function(input){
      var d = moment(input);
      return d.format('MMM Do, h:mm a');
    }
  })
.controller('ClaimCtrl', function($scope,$rootScope, $mdBottomSheet,$mdDialog,fbStorage,$state) {
  var vm = this;
  if($rootScope.currentParcel === null)
    $state.go('map');
  $scope.address = $rootScope.currentParcel.address;
  $scope.myParcl = false;
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
  $scope.claimParcl=function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Complete Transaction?')
          .textContent('Select continue to complete this transaction.')
          .ariaLabel('Confirm Claim')
          .targetEvent(ev)
          .ok('Continue')
          .cancel('Back');

    $mdDialog.show(confirm).then(function() {
      $scope.myParcl = true;
    }, function() {
      $scope.myParcl = false;
    });
  };

  vm.connectUphold = connectUphold;
  vm.sandbox = "https://sandbox.uphold.com/authorize/6d1981331afcf5af353d4e27fe81ce4f2f161b9a?scope=cards:read%20cards:write%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20user:read%20transactions:read%20phones:read%20phones:write";
  function connectUphold(ev){

    var confirm = $mdDialog.confirm()
          .title('Identity Verification beta')
          .textContent('This verification is completed on the testnet blockchain. Learn more about how this works at the Parcl blog.')
          .ariaLabel('Confirm Uphold')
          .targetEvent(ev)
          .ok('Continue')
          .cancel('Back');

    $mdDialog.show(confirm).then(function() {
      var upholdCallback = window.location.href;
      firebase.database().ref("users/"+$rootScope.fireUser.$id+"/uphold_callback").set(upholdCallback).then(function(){
        vm.upholdUrl = "https://uphold.com/authorize/7fdc70df03db6241e62890ca697b5304dc29810f?state="+$rootScope.fireUser.refreshToken+"&scope=accounts:read%20cards:write%20cards:read%20transactions:transfer:self%20transactions:transfer:others%20user:read%20transactions:read";
        document.addEventListener("deviceready", function(){
          window.open = cordova.InAppBrowser.open;
          cordova.InAppBrowser.open(vm.sandbox,'_self');
          // window.location.href = vm.sandbox;
        });
        
      });//
    });

    //Write callback link to user space
    
  }

})
.controller('LandingCtrl', function($scope, $mdBottomSheet) {
  var vm = this;
  document.addEventListener("deviceready", function () {

  });
})

.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Save', icon: 'icon-save' },
    { name: 'Send', icon: 'icon-share' }
  ];

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
})
.controller('RightCtrl', function ($rootScope,$scope,$state, $timeout,$mdMedia, $mdSidenav, $log, $mdDialog,$http,$mdToast,fbStorage) {
  document.addEventListener("deviceready", onDeviceReady, false);
  $scope.filterSearch = filterSearch;
  $scope.loadParcl = loadParcl;
  if($rootScope.county === undefined){
    $rootScope.county = null;
  }

  $scope.close = close; 
  $scope.showLegend = showLegend;
  $scope.clearMap = clearMap;
  $scope.loadNeighborhoods = loadNeighborhoods;
  $scope.displayNeighborhoods = displayNeighborhoods;
  $rootScope.currentCity = ($rootScope.currentCity == null) ? "philadelphia" : $rootScope.currentCity;

  function clearMap(){
    if($rootScope.map == null)
      return true;

    $rootScope.map.clear();
    $rootScope.mapLayers.neighborhoods = [];
    $scope.close();

  }
  function displayNeighborhoods(){
    if($rootScope.mapLayers === undefined)
      return true;

    if($rootScope.mapLayers.neighborhoods == [])
      return true;

    if($rootScope.map == null)
          return true;

    if($rootScope.activeNeighborhoods !== undefined && $rootScope.activeNeighborhoods != null){
      angular.forEach($rootScope.activeNeighborhoods, function(an,i) {
        an.remove();
      });
    }
    angular.forEach($rootScope.mapLayers.neighborhoods, function(p,index) {
      // show neighborhood
      // Split WKB into array of integers (necessary to turn it into buffer)
      if(p.geoJson === undefined){
        var hexAry = p.the_geom.match(/.{2}/g);
        var intAry = [];
        for (var i in hexAry) {
          intAry.push(parseInt(hexAry[i], 16));
        }
        // console.log(intAry);
        // Generate the buffer
        var wkx = require('wkx');
        var buf = new buffer.Buffer(intAry);

        // Parse buffer into geometric object
        var geom = wkx.Geometry.parse(buf);
        var points = geom.toGeoJSON().coordinates[0][0];
        $rootScope.mapLayers.neighborhoods[index].geoJson = [];
        angular.forEach(points,function(value, key){
            // $scope.results.push(value.raw);
            $rootScope.mapLayers.neighborhoods[index].geoJson.push(new plugin.google.maps.LatLng(value[1],value[0]));
          
        });
      }

        // console.log($rootScope.currentParcel.neighborhood.geoJson);
        $rootScope.map.addPolygon({
          'points': $rootScope.mapLayers.neighborhoods[index].geoJson,
          'strokeColor' : '#0d47a1',
          'strokeWidth': 5,
          'fillColor' : '#0d48a01f'
        }, function(polygon) {
          if($rootScope.activeNeighborhoods === undefined)
            $rootScope.activeNeighborhoods = [];
          $rootScope.activeNeighborhoods.push(polygon);
          polygon.on(plugin.google.maps.event.OVERLAY_CLICK, function(overlay, latLng) {
            $mdToast.show(
              $mdToast.simple()
              .content("Neighborhood: "+$rootScope.mapLayers.neighborhoods[index].listname)
              .position('top right')
              .hideDelay(1200)
            );
          });
        });
    });
  }

  function loadNeighborhoods(){
      //Pre load neighborhoods
    if($rootScope.currentCity == "philadelphia"){
        // $rootScope.neighborhoods = JSON.parse($rootScope.storage.getItem('neighborhoods_'+$rootScope.currentCity));
        if($rootScope.neighborhoods == null){
          firebase.database().ref().child('neighborhoods').child('philly').once('value',function(snapshot){
            $rootScope.neighborhoods = snapshot.val();
            $rootScope.storage.setItem('neighborhoods_'+$rootScope.currentCity,JSON.stringify(snapshot.val()));
          });
        }
    }else{
      // $rootScope.neighborhoods = JSON.parse($rootScope.storage.getItem('neighborhoods_'+$rootScope.currentCity));
      if($rootScope.neighborhoods == null){
        firebase.database().ref().child('neighborhoods').child($rootScope.currentCity).once('value',function(snapshot){
          $rootScope.neighborhoods = snapshot.val();
          $rootScope.storage.setItem('neighborhoods_'+$rootScope.currentCity,JSON.stringify(snapshot.val()));
        });
      }
    }
  }
  
  function close() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
          if($rootScope.map != null){
            if($scope.isOpenRight()){
              $rootScope.map.setClickable(false);
            }else{
              $rootScope.map.setClickable(true);
            }
          }
        });
    };
    function ImageDialogController(scope, $mdDialog,$mdMedia, image, title) {
    scope.image = image;
    scope.title = title;
    scope.hide = function() {
      $mdDialog.hide();
    };
    scope.cancel = function() {
      $mdDialog.cancel();
    };
    scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    
  }

    $scope.showImage = function(ev,image,title){
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
      controller: ImageDialogController,
      templateUrl: './themes/material/components/imageDialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      targetEvent:ev,
      locals: {
           image: image,
           title: title

         },
       fullscreen: useFullScreen
      })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
    }

    function showLegend(ev){
      $mdToast.show(
        $mdToast.simple()
        .textContent("Loading Legend")
        .position('top right')
        .hideDelay(1000)
      );
      $mdSidenav('right').close()
      .then(function () {
        var zoningimg = "https://firebasestorage.googleapis.com/v0/b/project-5024312928467115441.appspot.com/o/philly%2Fzoning%2Fzoning.png?alt=media&token=81da12d9-4543-4314-a8cb-60c71ee105b1"; 
        $scope.showImage(ev,zoningimg,"Legend"); 
        
      })
    }
  function loadParcl(lat,lng){
      $rootScope.map.setClickable(false);
      $rootScope.searching = true;
      var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcel/nearbySearch',
      params: {
        'lat':lat,
        'lng':lng
      }
    };
    $http(req)
    .success(function(data,status,headers,config){
      $rootScope.searching = false;
      $rootScope.currentCity = data.city;
      $rootScope.selectedItem = data.response;
      //Show overlay
      if($rootScope.selectedItem.overlaydata !== undefined || $rootScope.selectedItem.overlaydata != null){
        var overlay=[];
        angular.forEach($rootScope.selectedItem.overlaydata, function(p,index) {
            overlay.push(new plugin.google.maps.LatLng(p[1],p[0]));
        });
        var zoned = _.find($rootScope.phillyZoning,function(o){return _.find(o.districts,{code:$rootScope.selectedItem.socrata[0].zoning})})
        var color = '#63A2D6';
        if(zoned !== undefined){
          color = zoned.color.toUpperCase();
        }
      //   $rootScope.map.addPolygon({
      //     'points':overlay,
      //     'strokeColor': '#06477D',
      //     'strokeWidth': 1,
      //     'fillColor':color,
      //     'fillOpacity':0.1
      //   },function(polygon){
      //     //
      //     _.pull($rootScope.mapList, _.find($rootScope.mapList,["parcel_number",$rootScope.selectedItem]));
      //     $rootScope.mapList.push($rootScope.selectedItem);
      //     $rootScope.storage.setItem("parcl_"+$rootScope.selectedItem.parcel_number,JSON.stringify($rootScope.selectedItem));
      //   })
      }
      // $rootScope.map.setClickable(true);
    })
    .error(function(data, status, headers, config){
      $rootScope.searching = false;
      $rootScope.map.setClickable(true);
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
  }
  function filterSearch(where,vacant,taxes,sheriff){
    $rootScope.map.setClickable(false);
    var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcl/query',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: {
        'county':$rootScope.county,
        'where':where,
        'vacant':vacant,
        'taxes':taxes
      }
    };
    $http(req)
    .success(function(data){
      var city = (data.response.city !== undefined ? data.response.city.toLowerCase() : "philadelphia");
      $rootScope.currentCity = city;
      
      var newFilter = firebase.database().ref("users/"+$rootScope.fireUser.uid+"/filters").push();
      newFilter.set({where:where,vacant:vacant,taxes:taxes,sheriff:sheriff});
      if($rootScope.map != null){
        //Load markers onto map
        // $rootScope.map.clear();
        $rootScope.mapList = [];
        angular.forEach(data.response, function(d,i) {
          _.pull($rootScope.mapList, _.find($rootScope.mapList,["parcel_number",d]));
          $rootScope.mapList.push(d);
          if(d.coordinates !== undefined){
            var icon = (d.vacant !== undefined ? $rootScope.grayicon : $rootScope.blueicon);
            // $rootScope.map.addMarker({
            //   'icon':icon,
            //   'position': new plugin.google.maps.LatLng(d.coordinates[1],d.coordinates[0]),
            //   'title': d.address,
            //   'snippet':d.zoning
            // }, function(marker) {
            //   marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
            //     // Get overlay
            //     $rootScope.toolbarTitle = "Loading...";
            //     $rootScope.selectedItem = null;
            //     $scope.loadParcl(data.response[i].coordinates[1],data.response[i].coordinates[0])
            //   });
            //   marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
            //     $state.go('p',{id:data.response[i].parcel_number,city:data.response[i].city});
            //   });
            // });
          }
        });
        $rootScope.searching = false;
        $rootScope.map.setClickable(true);
      }
    })
    .error(function(data, status, headers, config){
      $scope.searching = false;
      $rootScope.map.setClickable(true);
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
  }


  function onDeviceReady() {
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    if($rootScope.activeFilters !== undefined){
      $rootScope.filters = $rootScope.activeFilters;
    }else{
      $rootScope.filters = {};
    }
    

    //Load Zoning Philly
    $rootScope.phillyZoning = JSON.parse($rootScope.storage.getItem('phillyZoning'));
    if($rootScope.phillyZoning == null){
      firebase.database().ref('zoning/philly').once('value', function(snapshot) {
        $rootScope.phillyZoning = snapshot.val();
        $rootScope.storage.setItem("phillyZoning",JSON.stringify(snapshot.val()));
      });
    }
    $scope.loadZoning = loadZoning;

    function loadZoning(){
      return $rootScope.phillyZoning;
    }

    $scope.parcel_types = [
      {value:2,selected:false,name: "New / Rehabbed"},
      {value:3,selected:false,name: "Above Average"},
      {value:4,selected:false,name: "Average"},
      {value:5,selected:false,name: "Below Average"},
      {value:7,selected:false,name: "Sealed / Structurally Compliant"},
      {value:1,selected:false,name: "Other"}
    ];

    $rootScope.envelope = [
    "Nearby",
    "Within View"];

    $scope.vacant_type = [
    "Land",
    "Building"];

    $scope.sheriff_type = [
    "tax",
    "mortgage"];
    $scope.less_greater = [
    "less",
    "greater",
    "equals"];
    $rootScope.mapFilters = {};
    $rootScope.mapFilters.sheriff = [];
    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function() {
      return ($rootScope.mapFilters.sheriff.length !== 0 &&
          $rootScope.mapFilters.sheriff.length !== $scope.sheriff_type.length);
    };

    $scope.isChecked = function() {
      return $rootScope.mapFilters.sheriff.length === $scope.sheriff_type.length;
    };

    $scope.toggleAllSheriff = function() {
      if ($rootScope.mapFilters.sheriff.length === $scope.sheriff_type.length) {
        $rootScope.mapFilters.sheriff = [];
      } else if ($rootScope.mapFilters.sheriff.length === 0 || $rootScope.mapFilters.sheriff.length > 0) {
        $rootScope.mapFilters.sheriff = $scope.sheriff_type.slice(0);
      }
    };

    $scope.onFilterChange = function(cbState,obj){
      if(cbState == false){
        $rootScope.mapFilters[obj] = null;
      }
    }

    $scope.saveFilter = function (ev) {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $rootScope.searching = true;
          $mdToast.show(
            $mdToast.simple()
            .textContent("Searching...")
            .position('top right')
            .hideDelay(1000)
          );
          if($rootScope.map != null){
              $rootScope.map.setClickable(true);
          }
          //Load filters
          var whereClause = "";
          var vacantFilter = false;
          var taxes = false;
          // if($rootScope.vacantFilterState == true || $rootScope.inuseFilterState == true){
            //vacan filter
          if($rootScope.vacantFilterState == true){
           if($rootScope.mapFilters.vacant_type !== undefined && $rootScope.mapFilters.vacant_type.length == 1){
            vacantFilter = $rootScope.mapFilters.vacant_type[0];
           }else{
            vacantFilter = "land,building";
           }
          }

          if($rootScope.descriptionState == true){
            if($rootScope.mapFilters.parcel_type !== undefined){
               whereClause += "exterior_condition = '"+$rootScope.mapFilters.parcel_type.value+"' ";
            }
          }

          if($rootScope.zonedState == true){
            if($rootScope.mapFilters.zoning !== undefined){
              if(whereClause != "")
                whereClause += "AND ";
              whereClause += "zoning = '"+$rootScope.mapFilters.zoning+"' ";
            }
          }

          if($rootScope.totalAreaActive == true){
            if($rootScope.mapFilters.dimensions_less_greater !== undefined || $rootScope.mapFilters.dimensions_less_greater != null){

              whereClause += "AND ";
              if($rootScope.mapFilters.dimensions_less_greater == "less"){
                whereClause += "total_area<="+$rootScope.mapFilters.totalArea;
              }else if($rootScope.mapFilters.dimensions_less_greater == "greater"){
                whereClause += "total_area>="+$rootScope.mapFilters.totalArea;
              }else if($rootScope.mapFilters.dimensions_less_greater == "equals"){
                whereClause += "total_area="+$rootScope.mapFilters.totalArea;
              }
            }
          }

            //Taxes
          if($rootScope.mapFilters.taxesActive!== undefined){
            taxes = ($rootScope.mapFilters.taxYears === undefined ? 0 : $rootScope.mapFilters.taxYears);
            //
          }
            

          //envelope
          if($rootScope.mapFilters.envelope == "Nearby"){
            //Get Position
            navigator.geolocation.getCurrentPosition(function(position) {
              //promise
              
              whereClause += "AND within_circle(coordinates,"+position.coords.latitude+","+ position.coords.longitude+",2000)";
              $scope.filterSearch(whereClause,vacantFilter,taxes,false)
            }, function (error) {
              $rootScope.map.getVisibleRegion(function(latLngBounds) {
                //Promise compelete
                whereClause += "AND within_box(coordinates,"+latLngBounds.northeast.lat+","+latLngBounds.northeast.lng+","+latLngBounds.southwest.lat+","+latLngBounds.southwest.lng+")";
                $scope.filterSearch(whereClause,vacantFilter,taxes,false)
              });
            });
          }else{
            $rootScope.map.getVisibleRegion(function(latLngBounds) {
              //Promise compelete
              whereClause += "AND within_box(coordinates,"+latLngBounds.northeast.lat+","+latLngBounds.northeast.lng+","+latLngBounds.southwest.lat+","+latLngBounds.southwest.lng+")";
              $scope.filterSearch(whereClause,vacantFilter,taxes,false)
            });
          }
            
          // }
        });
    };
  }

  

  })
.controller('DashCtrl', function($rootScope,$state,$scope,$mdSidenav,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$cordovaGeolocation,fbStorage) {
//document.addEventListener("deviceready", function () {
  var self = this;
  $scope.isAuth = false;
  $scope.selectedSearchId = 1;
  self.isLoading=true;
  $rootScope.subTitle = "";
  $scope.searching = false;
  $rootScope.active_regions = null;
  $rootScope.gAddress = null;
  $rootScope.currentParcel = null;
  $rootScope.zip = null;
  $rootScope.map = null;
  $rootScope.latitude = null;
  $rootScope.longitude = null;
  $rootScope.activeSearch = {};
  $rootScope.map = null;
  

  $rootScope.conditions = [
    {"ext_cond":0,"value": "Not Applicable"},
    {"ext_cond":1,"value": "Other"},
    {"ext_cond":2,"value": "New / Rehabbed"},
    {"ext_cond":3,"value": "Above Average"},
    {"ext_cond":4,"value": "Average"},
    {"ext_cond":5,"value": "Below Average"},
    {"ext_cond":6,"value": "Vacant"},
    {"ext_cond":7,"value": "Sealed / Structurally Compliant"}];

  self.fireInOut = signInOut;
  self.getMyLocation = getMyLocation;
  self.registerUser = register;
  self.checkParclCode = checkCode;
  self.resendCode = resendCode;
  self.getParclCode = getCode;
  self.signIn = signIn;
  self.openProperty = openProperty;
  self.openBlockProperty = openBlockProperty;
  self.logIssue = logIssue;
  self.optionsMenu = optionsMenu;
  self.openMenu = openMenu;
  self.goBack = goBack;
  self.searchNearby = searchNearby;

  // Call auth change event
  fbStorage.onAuthChange();

  $scope.showList = showList;
  $scope.filterSelected = filterSelected;
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

  // Adjust Status bar
  if(window.StatusBar) {
    // org.apache.cordova.statusbar required
    window.StatusBar.overlaysWebView(true);
    window.StatusBar.styleDefault();
  }

  function goBack(){
    window.history.back();
  }

  function resendCode(){
    $rootScope.waitForCode = false;
    $rootScope.storage.setItem('waitForCode',$rootScope.waitForCode);
    $mdToast.show(
        $mdToast.simple()
        .content("Enter phone number")
        .position('top right')
        .hideDelay(2000)
      );
  }

  //Get code state
  $rootScope.waitForCode = $rootScope.storage.getItem('waitForCode');
  if($rootScope.waitForCode == null)
    $rootScope.waitForCode = false;
  function getCode(ev){
    var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcl/getCode',
      params: {phone:$rootScope.phoneNumber}
    };
    $http(req)
    .success(function(data,status,headers,config){
      $rootScope.waitForCode = true;
      $rootScope.storage.setItem('waitForCode',$rootScope.waitForCode);
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('parcl code')
          .textContent('Parcl code sent via SMS.')
          .ariaLabel('Parcl Code')
          .ok('OK')
          .targetEvent(ev)
      );
    })
    .error(function(data, status, headers, config){
      $mdToast.show(
        $mdToast.simple()
        .content("Invalid")
        .position('top right')
        .hideDelay(2000)
      );
    });
    
  }

  function checkCode($event,code){
    //Check code
    if(code == '100000'){
      fbStorage.anonAuth();
      if(cordova.plugins.Keyboard.isVisible)
        cordova.plugins.Keyboard.close();
      $state.go('m',{lat:0,lng:0});
    }else{
      if($rootScope.phoneNumber != null)
        fbStorage.checkCode(code,$rootScope.phoneNumber);
    }
  }

  $scope.loginUser = function(e){
    if($rootScope.parclcode == '100000'){
      $state.go('m',{lat:0,lng:0});
    }else{
      // fbStorage.emailAuth(scope.email,scope.password);
    }
  }

  function openProperty(item){
    if(item.data !== undefined){

      if(item.data.properties.length > 1){
        //show list
        $scope.showList(item.data.properties,"Choose below");

      }else if(item.account_number !== undefined){
        
      }else{
        $rootScope.parcelId = item.parcel_number;
        $rootScope.currentCity = 'philadelphia';
        $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
      }
    }else{
      $rootScope.parcelId = item.parcel_number;
      $rootScope.currentCity = 'philadelphia';
      $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
    }
    
  }

  function openBlockProperty(item){
    $rootScope.parcelId = item.account_number;
    $rootScope.currentCity = 'philadelphia';
    $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
  }

  function logIssue(ev){
    // window.FirebasePlugin.logEvent("log_issue", {page: "log"});
    var confirm = $mdDialog.prompt()
      .title('What is your issue?')
      .textContent('Describe your issue.')
      .placeholder('Issue')
      .ariaLabel('Issue name')
      .targetEvent(ev)
      .ok('Save')
      .cancel('cancel');

    $mdDialog.show(confirm).then(function(result) {
      if(cordova.plugins.Keyboard.isVisible)
        cordova.plugins.Keyboard.close();
      var newIssue = firebase.database().ref("issues").push();
      newIssue.set(result);
      $mdToast.show(
      $mdToast.simple()
      .textContent("Issue Logged. Thank you.")
      .position('top right')
      .hideDelay(3000)
    );
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
    
  }

  function optionsMenu(){
    // window.FirebasePlugin.logEvent("log_issue", {page: "log"});
    $state.go('options')
  }

  // on document ready event

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
      
    

  }
  
  

  function openMenu($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
    if($rootScope.map != null){
      // $rootScope.map.setClickable(false);
    }
  };

  

  function filterSelected(ev){
    var filter = $rootScope.activeSearch.filters;
    $rootScope.activeSearch.filters = null;
    $timeout(function(){
      $rootScope.activeSearch.filters = filter;
    },10)
    return true;
  }

   function searchNearby(lat,lng){
    //Get List to pass to dialog
    $rootScope.currentCity = "philadelphia";

    // var url = "http://api.phila.gov/opa/v1.1/nearby/"+lng+"/"+lat+"/300?format=json";
    
    // $http.get(url)
    var req = {
      method: 'GET',
      url: 'https://data.phila.gov/resource/tqtk-pmbv.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded','X-App-Token':'D3weSV9XH75ieSxloQwC1Tscl'},
      params: {
        '$where':'within_circle(coordinates,'+lat+','+lng+',300) ',
        '$limit':100,
        '$select':"*, distance_in_meters(coordinates, 'POINT ("+lng+" "+lat+")') AS range"/*,
        '$order': "distance_in_meters(location, 'Point("+lat+" "+lng+")')"*/
      }
    };
    $http(req)
    .success(function(response){
      $scope.searching = false;
      var r = _.orderBy(response,[function(prop){return parseFloat(prop.range)}],['asc']);
      $scope.showList(r,"Nearby");
    })
    .error(function(data, status, headers, config){
      $scope.searching = false;
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
  }

  function getMyLocation(ev){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    if($rootScope.searching == true){
      return true;
    }
    $mdToast.show(
      $mdToast.simple()
      .content("Searching nearby locations")
      .position('bottom left')
      .hideDelay(3000)
    );
    $rootScope.searching = true;
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      if(position.coords.accuracy > 200){
        var confirm = $mdDialog.confirm()
              .title('Poor Position Accuracy')
              .textContent('Your position accuracy is currently '+position.coords.accuracy+". Would you like to continue?")
              .ariaLabel('Poor Accuracy')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
          var lat  = position.coords.latitude
          var lng = position.coords.longitude
          $rootScope.myPosition = position;
          self.searchNearby(lat,lng);
        }, function() {
          $rootScope.searching = false;
          $mdToast.show(
            $mdToast.simple()
            .content("Search Canceled")
            .position('bottom left')
            .hideDelay(3000)
          );
        });
      }else{
        $rootScope.searching = true;
        var lat  = position.coords.latitude
        var lng = position.coords.longitude
        $rootScope.myPosition = position;
        self.searchNearby(lat,lng);
      }
    })
  }

  $scope.dcNeighborhoods = [
    {listname:'Northeast',cartodb_id:1},
    {listname:'Southeast',cartodb_id:2},
    // {listname:'Southwest',cartodb_id:3},
    {listname:'Northwest',cartodb_id:4},
  ];
  // var whereClause = "A=0";
  // var req = {
  //     method: 'GET',
  //     url: 'http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query',
  //     params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
  //   };
  //   $http(req)
  //   .success(function(data,status,headers,config){
  //     var fb = firebase.database().ref().child('property_types').child('dc');
  //     fb.set(data.features);
  //   })
  //   .error(function(data, status, headers, config){
  //     $mdToast.show(
  //       $mdToast.simple()
  //       .content("No Sale Info for this property.")
  //       .position('top right')
  //       .hideDelay(3000)
  //     );
  //   });
  
  $rootScope.showResults = function(ev){
    var title = "Results";
    $mdDialog.show({
      controller: ListDialogController,
      templateUrl: './themes/material/components/listDialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      targetEvent:ev,
      locals: {
           items: $rootScope.mapList,
           title: title

         }/*,
       fullscreen: useFullScreen*/
      })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  }

  function showList(items,title) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: ListDialogController,
      templateUrl: './themes/material/components/listDialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      locals: {
           items: items,
           title: title

         }/*,
       fullscreen: useFullScreen*/
      })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };



  function ListDialogController($scope, $mdDialog, items, title) {
    $scope.listItems = items;
    $scope.title = title;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.open = function(num){
      $mdDialog.hide();
      if($rootScope.currentCity == 'philadelphia'){
        if($scope.listItems[num].parcel_number !== undefined){
          $rootScope.parcelId = $scope.listItems[num].parcel_number;
        }else{
          $rootScope.parcelId = $scope.listItems[num].account_number;
        }
        
        $state.go('property',{id:$rootScope.parcelId,city:$rootScope.currentCity});
        // $state.reload();
      }else{
        if($scope.listItems[num].parcel_number !== undefined){
          $rootScope.parcelId = $scope.listItems[num].parcel_number;
        }else{
          $rootScope.parcelId = $scope.listItems[num].account_number;
        }
        $state.go('property',{id:$rootScope.parcelId,city:$rootScope.currentCity});
      }
    }
  }

  
  $rootScope.searchByBlock = function(address){
    //Get List to pass to dialog

    var url = "http://api.phila.gov/opa/v1.1/block/"+address+"/?format=json";
    
    $http.get(url)
    .success(function(response){
      $scope.searching = false;
      var r = response;
      $scope.showList(r.data.properties,"Nearby");
    })
    .error(function(data, status, headers, config){
      $scope.searching = false;
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });

  }

  $scope.dsRegions = [
      {
        disable: false,
        city: 'philly',
        bgUrl: './img/philly.jpg',
        who: 'Philadelphia, PA',
      },
      {
        disable: false,
        city: 'dc',
        bgUrl: './img/dc.jpg',
        who: 'Washington, DC',
      },
      {
        disable: true,
        city: 'brooklyn',
        bgUrl: './img/brooklyn.jpg',
        who: 'Brooklyn, NY',
      },
      {
        disable: true,
        city: 'manhattan',
        bgUrl: './img/manhattan.jpg',
        who: 'Manhattan, NY',
      },
      {
        disable: true,
        city: 'bronx',
        bgUrl: './img/bronx.jpg',
        who: 'Bronx, NY',
      },
      {
        disable: true,
        city: 'si',
        bgUrl: './img/staten-island.jpg',
        who: 'Staten Island, NY',
      },
      {
        disable: true,
        city: 'queens',
        bgUrl: './img/queens.jpg',
        who: 'Queens, NY',
      },
    ];
  var originatorEv;
  self.openNotificationsMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };
  $scope.saveForm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Form Saved!')
        .textContent('Some description here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK!')
        .targetEvent(ev)
    );
  };

  $scope.addNotes = function(ev) {
    $mdDialog.show({
      controller: NoteDialogController,
      templateUrl: './themes/material/components/addNote.html',
      targetEvent: ev,
      locals: {
         item: null
      },
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  }

  function NoteDialogController(scope, $mdDialog,item) {
    var prop = $scope.selectedItem.raw;
    if(item != null){
      scope.newStatus = $firebaseObject(self.ref.child('parcels').child(prop.account_number).child('status').child(item));
        scope.newStatus.$loaded().then(function(){
        // note.$bindTo(scope,newStatus);
       });

        
     scope.status = null;
    }else{
      scope.newStatus={};
      scope.newStatus.by = $rootScope.userEmail;
      scope.newStatus.timestamp = Firebase.ServerValue.TIMESTAMP;
      scope.status = $firebaseArray(self.ref.child('parcels').child(prop.account_number).child('status'));

      scope.status.$loaded().then(function() {
        if(scope.status.length <1){
          $log.debug( 'no status field. creating one');
            $log.debug( 'saved');
        }
      });
    }

    scope.hide = function() {
      $mdDialog.hide();
    };
    scope.cancel = function() {
      $mdDialog.cancel();
    };
    scope.answer = function(answer) {
      if(answer == "save"){
        if(scope.status != null){
          scope.status.$add(scope.newStatus);
        }
      }
      $mdDialog.hide(answer);
    };
    
  };

  $rootScope.printList = function(ev){
    if($rootScope.mapList === undefined){
      $state.go('m');
      return true;
    }
    if($rootScope.mapList.length > 0){
      $state.go('list');
      return true;
    }
  }
  $rootScope.openPage=function(page){
    $mdDialog.show({
      controller: LoadingDialogController,
      templateUrl: './themes/material/components/loadingDialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:false
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });

    if($rootScope.map != null && (page == 'map' || page == 'm')){
      $rootScope.map.setClickable(true);
      
    }
    var lat = 0;
    var lng = 0;
    if($rootScope.currentParcel != null){
      lat = $rootScope.currentParcel.socrata[0].coordinates.coordinates[1];
      lng = $rootScope.currentParcel.socrata[0].coordinates.coordinates[0];
    }
    $rootScope.subTitle = "";
    if (page == 'm')
      $state.go(page,{lat:lat,lng:lng});
    else
      $state.go(page);
    
  }

  function LoadingDialogController(scope){
    scope.hide = function() {
      $mdDialog.hide();
    };
    scope.cancel = function() {
      $mdDialog.cancel();
    };
    scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    }
    
  function signIn(){
    $state.go('login');
    
  }
  function register(){
    $state.go('register');
  }

  function signInOut(){
    if($rootScope.fireUser !== undefined){
      if($rootScope.fireUser == null){
        self.signIn();
      }else{
        fbStorage.signOut();
        $state.go('login');
        window.location.reload(true);
    }
    }else{
      //undefined; login
      self.signIn();
    }
  }
})
.controller('WalletCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,$cordovaCamera) {
  var vm = this;
  $rootScope.subTitle = "Wallet";
  vm.connectUphold = connectUphold;
  vm.sandbox = "https://sandbox.uphold.com/authorize/6d1981331afcf5af353d4e27fe81ce4f2f161b9a?scope=cards:read%20cards:write%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20user:read%20transactions:read%20phones:read%20phones:write";
  function connectUphold(){
    //Write callback link to user space
    var upholdCallback = window.location.href;
    firebase.database().ref("users/"+$rootScope.fireUser.$id+"/uphold_callback").set(upholdCallback).then(function(){
      vm.upholdUrl = "https://uphold.com/authorize/7fdc70df03db6241e62890ca697b5304dc29810f?state="+$rootScope.fireUser.refreshToken+"&scope=accounts:read%20cards:write%20cards:read%20transactions:transfer:self%20transactions:transfer:others%20user:read%20transactions:read";
      window.location.href = vm.sandbox;
    });//
  }

  $rootScope.$watch(function(scope) { return $rootScope.fireUser },
    function() {
      if($rootScope.fireUser !== undefined){
        if($rootScope.fireUser.wallet !== undefined){
          //check for transactions to uphold
            if($rootScope.fireUser.wallet.uphold !== undefined){
            //check for transactions to uphold
              if($rootScope.fireUser.wallet.uphold.gladiator_card !== undefined){
              //check for transactions to uphold
              var url = "https://dev.gladiatorfantasy.com/jsonservice/Coin/getTransactions?uid="+$rootScope.fireUser.$id+"&cardId="+$rootScope.fireUser.wallet.uphold.gladiator_card.id;
    
              $http.get(url)
              .success(function(response){
                $mdToast.show(
                  $mdToast.simple()
                  .content("Transactions Loaded.")
                  .position('top right')
                  .hideDelay(3000)
                );
              })
              .error(function(data, status, headers, config){
                $rootScope.searching = false;
                $mdToast.show(
                  $mdToast.simple()
                  .content("An error Occured.")
                  .position('top right')
                  .hideDelay(3000)
                );
              });
            }
          }
        }
      }
      
    }
   );
});
