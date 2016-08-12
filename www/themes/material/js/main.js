
"use strict";

  angular
  .module('materialApp').config(function($locationProvider,$mdThemingProvider,$sceDelegateProvider, $mdIconProvider,$httpProvider,$stateProvider,$urlRouterProvider){

        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise("/home");
        //
        // Now set up the states
        $stateProvider
          .state('home', {
            url: "/home",
            templateUrl: "./themes/material/components/home.html",
            controller: function($stateParams){
            }
          })
          .state('l', {
            url: "/l",
            templateUrl: "./themes/material/components/property-list.html",
            controller: function($stateParams){
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
            templateUrl: "./themes/material/components/dc-property-detail.html",
            controller: function($stateParams){
              $stateParams.id;  //*** Exists! ***//
              $stateParams.city;
            }
          })
          
        $mdThemingProvider.theme('default')
         .primaryPalette('blue',{
          'default': '900', // by default use shade 400 from the pink palette for primary intentions
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

      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
          // console.log(navigator.compass);
      }
  })
.filter('cleandate', function() {
  return function(input) {
    if(input !== undefined){
      var d =new Date(parseInt(input.substr(6)));
      var dd = moment(d);
      return dd.format('ddd, MMM Do YYYY');
    }
    
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

.controller('DashCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$cordovaGeolocation,fbStorage) {
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
  $rootScope.latitude = null;
  $rootScope.longitude = null;
  self.fireInOut = signInOut;
  var config = {
    apiKey: "AIzaSyCmzpXA9l45E9DthYOVtdIFEYrgGD5fS",
    databaseURL: "https://project-5024312928467115441.firebaseio.com",
    storageBucket: "project-5024312928467115441.appspot.com",
  };
  // firebase.initializeApp(config);
  self.signIn = signIn;
  self.signIn();
  fbStorage.onAuthChange();

  self.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
  self.getMyLocation = function(ev){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    if($rootScope.searching == true){
      return true;
    }
    $rootScope.searching = true;
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $mdToast.show(
        $mdToast.simple()
        .content("Position Accuracy: "+position.coords.accuracy+"m")
        .position('bottom left')
        .hideDelay(3000)
      );

      var lat  = position.coords.latitude
      var lng = position.coords.longitude
      $rootScope.myPosition = position;
      var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBfdI61qNxrgQ2qqXXyIKjMbRdi19HkjtY&latlng="+lat+", "+lng+"&format=json";
    
        $http.get(url)
        .success(function(response){
          
          $rootScope.searching = false;
          var r = response;
          console.log(r);
          var gResult = r.results[0];
          //Check city
          var city = null;
          $rootScope.currentCity = null;
            firebase.database().ref('active_regions').once('value', function(snapshot) {
              $rootScope.active_regions = snapshot.val();
              angular.forEach($rootScope.active_regions, function(v, k) {
                var cityObj = _.filter(gResult.address_components,function(o) { return o.types[0]=="locality"});
                if(v == cityObj[0].short_name)
                  city = cityObj[0].short_name;
                $rootScope.currentCity = k;
              });
              if(city == null){
                $rootScope.gAddress = null;
              }else{
                var houseNumber = null;
                var hN = _.filter(gResult.address_components,function(o) { return o.types[0]=="street_number"});
                var route = _.filter(gResult.address_components,function(o) { return o.types[0]=="route"});
               
                  if(hN == false){
                    $rootScope.gAddress = route[0].short_name;
                    
                  }else{
                    houseNumber = pad(hN[0].short_name,4);
                    $rootScope.gAddress = houseNumber+" "+route[0].short_name;
                  }
                $rootScope.searchByBlock($rootScope.gAddress);
              }

            });
          if(r.results.length < 1){
            $mdToast.show(
            $mdToast.simple()
            .content("Unable to determine address.")
            .position('bottom left')
            .hideDelay(3000)
          );
          }
        })
        .error(function(data, status, headers, config){
          $rootScope.searching = false;
          $mdToast.show(
            $mdToast.simple()
            .content("An error Occured.")
            .position('top right')
            .hideDelay(3000)
          );
          console.log(data);
        });

    }, function(err) {
      // error
    });
  }

  // FCMPlugin.getToken(
  //   function(token){
  //     console.log(token);
  //   },
  //   function(err){
  //     console.log('error retrieving token: ' + err);
  //   }
  // )

  // FCMPlugin.onNotification(
  //   function(data){
  //     if(data.wasTapped){
  //       //Notification was received on device tray and tapped by the user.
  //       console.log( JSON.stringify(data) );
  //     }else{
  //       //Notification was received in foreground. Maybe the user needs to be notified.
  //       console.log( JSON.stringify(data) );
  //     }
  //   },
  //   function(msg){
  //     console.log('onNotification callback successfully registered: ' + msg);
  //   },
  //   function(err){
  //     console.log('Error registering onNotification callback: ' + err);
  //   }
  // );

  $scope.dcNeighborhoods = [
    {listname:'Northeast',cartodb_id:1},
    {listname:'Southeast',cartodb_id:2},
    {listname:'Southwest',cartodb_id:3},
    {listname:'Northwest',cartodb_id:4},
  ];
  var whereClause = "A=0";
  var req = {
      method: 'GET',
      url: 'http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query',
      params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
    };
    $http(req)
    .success(function(data,status,headers,config){
      var fb = firebase.database().ref().child('property_types').child('dc');
      fb.set(data.features);
    })
    .error(function(data, status, headers, config){
      console.log("No Datas :(", data);
      $mdToast.show(
        $mdToast.simple()
        .content("No Sale Info for this property.")
        .position('top right')
        .hideDelay(3000)
      );
    });

    $scope.searchTypeChange = function(ev){
      if ($scope.selectedSearchId == 1) {
        $rootScope.subTitle = "";
        $rootScope.activeSearch.parcel_type = null;
        $rootScope.activeSearch.neighborhoods = null;
        $rootScope.neighborhoods = null;
        $rootScope.activeRegion = null;

      }else{
        $rootScope.activeSearch = {};
      }
    }
  $scope.searchByCity = function(ev,city){
    $rootScope.activeRegion = city;
    $rootScope.searching = true;
    var r = _.filter($scope.todos,function(o) { return o.city==city});
    
    if(city == "philly"){
      firebase.database().ref().child('neighborhoods').child($rootScope.activeRegion).once('value',function(snapshot){
        $rootScope.neighborhoods = snapshot.val();
        $rootScope.subTitle = r[0].who;
        $rootScope.searching = false;
        
        $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(r[0].who)
          .textContent('The active region is now set to '+city+".")
          .ariaLabel('Alert Dialog Demo')
          .ok('OK!')
          .targetEvent(ev)
        );
      });
    }else if(city == "dc"){
      $rootScope.subTitle = r[0].who;
        $rootScope.searching = false;
        $rootScope.neighborhoods = $scope.dcNeighborhoods;
        $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(r[0].who)
          .textContent('The active region is now set to '+city+".")
          .ariaLabel('Alert Dialog Demo')
          .ok('OK!')
          .targetEvent(ev)
        );
    }
    
  }

  $scope.doSearch = function(ev){
    $state.go('p',{id:$rootScope.gAddress,city:$rootScope.currentCity});
  }
  $scope.closeKeyboard = function($event){
    // cordova.plugins.Keyboard.close();
    var myEl = angular.element( document.querySelector( '#searchField' ) );
    myEl[0].getElementsByTagName("input")[0].blur();
  }
  $scope.showKeyboard = function($event){
    if(!cordova.plugins.Keyboard.isVisible)
      cordova.plugins.Keyboard.show();
  }

  function pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  }

  $scope.checkInput = function($event){
    if($event.keyCode == 13){
      // cordova.plugins.Keyboard.close();
      $rootScope.searching = true;
      $mdToast.show(
            $mdToast.simple()
            .content("Searching")
            .position('bottom left')
            .hideDelay(3000)
          );
      // console.log("Search: "+$rootScope.searchText);
      if($rootScope.searchText.length < 5){
        return true;
        $rootScope.searching = false;
      }
      if(!isNaN($rootScope.searchText) && angular.isNumber(+$rootScope.searchText) && $rootScope.searchText.length == 5){
        //Zip Code
        $rootScope.zipSearch = true;
      }else{
        var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBfdI61qNxrgQ2qqXXyIKjMbRdi19HkjtY&address="+$rootScope.searchText+"&format=json";
    
        $http.get(url)
        .success(function(response){
          $scope.searching = false;
          var r = response;
          console.log(r);
          var gResult = r.results[0];
          //Check city
          var city = null;
          var zip = _.filter(gResult.address_components,function(o) { return o.types[0]=="postal_code"});
          $rootScope.zip = zip[0].short_name;
          $rootScope.currentCity = null;
          if($rootScope.active_regions == null){
            firebase.database().ref('active_regions').on('value', function(snapshot) {
              $rootScope.active_regions = snapshot.val();
              angular.forEach($rootScope.active_regions, function(v, k) {
                var cityObj = _.filter(gResult.address_components,function(o) { return o.types[0]=="locality"});
                if(v == cityObj[0].short_name){
                  city = cityObj[0].short_name;
                  $rootScope.currentCity = k;
                }
              });
              if($rootScope.currentCity == null){
                $rootScope.gAddress = null;
              }else{
                var houseNumber = null;
                var hN = _.filter(gResult.address_components,function(o) { return o.types[0]=="street_number"});
                var route = _.filter(gResult.address_components,function(o) { return o.types[0]=="route"});
                if(hN == false){
                  $rootScope.gAddress = route[0].short_name;
                  
                }else{
                  if($rootScope.currentCity != 'philly')
                    houseNumber = pad(hN[0].short_name,4);
                  else
                    houseNumber = hN[0].short_name;
                  $rootScope.gAddress = houseNumber+" "+route[0].short_name
                }
                
              }
              console.log($rootScope.gAddress);
              var parcelid = null;
              $rootScope.latitude = gResult.geometry.location.lat;
              $rootScope.longitude = gResult.geometry.location.lng;
              parcelid = $rootScope.getParcel($rootScope.gAddress,$rootScope.currentCity);

            });
          }else{
            angular.forEach($rootScope.active_regions, function(v, k) {
                var cityObj = _.filter(gResult.address_components,function(o) { return o.types[0]=="locality"});
                if(v == cityObj[0].short_name){
                  city = cityObj[0].short_name;
                  $rootScope.currentCity = k;
                }
              });
              if(city == null){
                $rootScope.gAddress = null;
              }else{
                var houseNumber = null;
                var hN = _.filter(gResult.address_components,function(o) { return o.types[0]=="street_number"});
                var route = _.filter(gResult.address_components,function(o) { return o.types[0]=="route"});
                if(hN == false){
                  $rootScope.gAddress = route[0].short_name;
                  
                }else{
                  if($rootScope.currentCity != 'philly')
                    houseNumber = pad(hN[0].short_name,4);
                  else
                    houseNumber = hN[0].short_name;
                  $rootScope.gAddress = houseNumber+" "+route[0].short_name
                }
              }
              console.log($rootScope.gAddress);
              var parcelid = null;
              $rootScope.latitude = gResult.geometry.location.lat;
              $rootScope.longitude = gResult.geometry.location.lng;
              parcelid = $rootScope.getParcel($rootScope.gAddress,$rootScope.currentCity);
          }
          
          if(r.results.length < 1){
            $rootScope.searching = false;
            $mdToast.show(
            $mdToast.simple()
            .content("No address found.")
            .position('bottom left')
            .hideDelay(3000)
          );
          }else if(r.results.length == 1){
            $rootScope.zipSearch = false;
            // $mdToast.show(
            //   $mdToast.simple()
            //   .content("Address found!")
            //   .position('bottom left')
            //   .hideDelay(3000)
            // );
          }else{
            $rootScope.searching = false;
            $mdToast.show(
              $mdToast.simple()
              .content("Multiple addresses found!")
              .position('bottom left')
              .hideDelay(3000)
            );
          }
        })
        .error(function(data, status, headers, config){
          $scope.searching = false;
          $mdToast.show(
            $mdToast.simple()
            .content("An error Occured.")
            .position('top right')
            .hideDelay(3000)
          );
          console.log(data);
        });
      }
      
    }
  }

  $scope.showList = function(items) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: ListDialogController,
      templateUrl: './themes/material/components/listDialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      locals: {
           items: items

         },
      fullscreen: useFullScreen
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



  function ListDialogController($scope, $mdDialog, items) {
    $scope.listItems = items;
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
    if($rootScope.currentCity == 'philly'){
      $rootScope.parcelId = $scope.listItems[num].account_number;
      $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
      $state.reload();
    }else{
      $rootScope.parcelId = $scope.listItems[num].ID;
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
      $scope.showList(r.data.properties);
    })
    .error(function(data, status, headers, config){
      $scope.searching = false;
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
      console.log(data);
    });

    //Open Dialog
    var items = [];
    
  }
  $rootScope.getParcel = function(address,city){
    var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcel/getParcel',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: {q:address,city:city,lat:$rootScope.latitude,lng:$rootScope.longitude,zip:$rootScope.zip}
    };
    $http(req)
    .success(function(data,status,headers,config){
      // console.log("Parcel id found!", data.response[0].ID);
      if(data.response["block"] != undefined){
        //Search by block 
        $rootScope.searchByBlock(data.response["block"]);
      }else{
        if($rootScope.currentCity == 'philly'){
          $rootScope.parcelId = data.response[0].AccountNumber;
          $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
        }else if($rootScope.currentCity == 'dc'){
          $rootScope.parcelId = data.response[0].ID;
          if(data.response.length > 1){
            //show list
            $scope.showList(data.response);
          }else{
            $rootScope.currentParcel = data.response[0];
            $state.go('property',{id:$rootScope.parcelId,city:$rootScope.currentCity});
          }
          
        }
      }
    })
    .error(function(data, status, headers, config){
      // console.log("Parcel id failed:", status);
      $mdToast.show(
        $mdToast.simple()
        .content(data.message)
        .position('top right')
        .hideDelay(3000)
      );
    });
  }
  $scope.answers =  $scope.answers  || [
        { id: 1, name: 'Yes' },
        { id: 2, name: 'No' },
        { id: 3, name: 'N/A' }
      ];
  $scope.questions=[
  {q:"Code Status?",a:true},
  {q:"Sedation Holiday Goal?",a:true},
  {q:"Pain/Agitation/Delirium addressed?",a:true},
  {q:"Spontaneous Breathing trial?",a:true},
  {q:"Tidal volumne < 8 ml/kg?",a:true},

  ];

  $scope.searchOptions = [{
      'id': 1,
      'fullName': 'Maria Guadalupe',
      'lastName': 'Guadalupe',
      'title': "Search by address or zipcode"
    }, {
      'id': 2,
      'fullName': 'Gabriel García Marquéz',
      'lastName': 'Marquéz',
      'title': "search by region"
    }];

var imagePath = 'img/list/60.jpeg';
  $scope.todos = [
      {
        face : imagePath,
        disable: false,
        city: 'philly',
        bgUrl: './img/philly.jpg',
        who: 'Philadelphia, PA',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        disable: false,
        city: 'dc',
        bgUrl: './img/dc.jpg',
        who: 'Washington, DC',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        disable: true,
        city: 'brooklyn',
        bgUrl: './img/brooklyn.jpg',
        who: 'Brooklyn, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        disable: true,
        city: 'manhattan',
        bgUrl: './img/manhattan.jpg',
        who: 'Manhattan, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        disable: true,
        city: 'bronx',
        bgUrl: './img/bronx.jpg',
        who: 'Bronx, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        disable: true,
        city: 'si',
        bgUrl: './img/staten-island.jpg',
        who: 'Staten Island, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        disable: true,
        city: 'queens',
        bgUrl: './img/queens.jpg',
        who: 'Queens, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];
var originatorEv;
    this.openNotificationsMenu = function($mdOpenMenu, ev) {
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

  $scope.loadNeighborhoods = function(){
    /*var statement = "select * from azavea.philadelphia_neighborhoods";
      var req = {
        method: 'GET',
        url: 'https://azavea.carto.com/api/v2/sql',
        params: {q:statement}
      };
      $http(req)
      .success(function(data,status,headers,config){
        // $rootScope.currentParcel.neighborhood = data.rows[0];
        console.log("Neighborhood!", $rootScope.currentParcel);
        var nKey = firebase.database().ref().child('neighborhoods').child('philly');
        return nKey.set(data.rows);
        
      })
      .error(function(data, status, headers, config){
        console.log("No Neighborhood :(", data);
        $mdToast.show(
          $mdToast.simple()
          .content("An error Occured.")
          .position('top right')
          .hideDelay(3000)
        );
      });*/
    if($rootScope.activeRegion !== undefined){
      if($rootScope.neighborhoods === undefined){
        
      }
    }
  }

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
        console.log(scope.status);  // "Marie Curie"
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
      console.log(answer)
      if(answer == "save"){
        if(scope.status != null){
          scope.status.$add(scope.newStatus);
        }
      }
      $mdDialog.hide(answer);
    };
    
  };

  $rootScope.openPage=function(page){
    $rootScope.subTitle = "";
    $state.go(page);
    
  }
  $scope.newSurvey=function(){
    $rootScope.currentSurvey = null;
    $state.go('home');
  }

  $scope.loadDoctors = function() {
    // Use timeout to simulate a 650ms request.
    if($scope.doctors == null){
    return firebase.database().ref('doctors').on('value', function(snapshot) {
        $scope.doctors = snapshot.val();
        $mdToast.show(
                $mdToast.simple()
                .content("Doctors loaded")
                .position('top left')
                .hideDelay(1000)
              );
      });
    }
  };

  $scope.loadParcelTypes = function() {
    // Use timeout to simulate a 650ms request.
    $scope.parcel_types = [
  {value:0,selected:false,name: "Vacant/Not Applicable"},
  {value:1,selected:false,name: "Other"},
  {value:2,selected:false,name: "New / Rehabbed"},
  {value:3,selected:false,name: "Above Average"},
  {value:4,selected:false,name: "Average"},
  {value:5,selected:false,name: "Below Average"},
  {value:6,selected:false,name: "Vacant"},
  {value:7,selected:false,name: "Sealed / Structurally Compliant"}
  ];
  }

  $scope.loadAnswers = function() {
    // Use timeout to simulate a 650ms request.
    return $timeout(function() {
      $scope.answers =  $scope.answers  || [
        { id: 1, name: 'Yes' },
        { id: 2, name: 'No' },
        { id: 3, name: 'N/A' }
      ];
    }, 10);
  };

  $scope.openSurvey=function(key){
    firebase.database().ref('saved/'+key).once('value', function(snapshot) {
      $rootScope.activeSurvey = snapshot.val();
      $mdToast.show(
        $mdToast.simple()
        .content("Survey loaded")
        .position('top left')
        .hideDelay(1000)
      );
      $state.go('survey');
    });
  }

    $rootScope.simulateQuery = false;
    $rootScope.isDisabled    = false;
    $rootScope.patients = $firebaseArray(firebase.database().ref().child('patients'))
    $rootScope.patients.$loaded(function(){
      $rootScope.patients = $rootScope.patients.map( function (patient) {
        patient.value = patient.name.toLowerCase();
        return patient;
      });
    });
    

    $rootScope.querySearch   = querySearch;
    $rootScope.selectedItemChange = selectedItemChange;
    $rootScope.searchTextChange   = searchTextChange;
    var parentEl = angular.element(document.body);
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for patients... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? $rootScope.patients.filter( createFilterFor(query) ) : $rootScope.patients;
      return results;
    }
    function searchTextChange(text) {
      console.log('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      console.log('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var patients = [
        {
          'name'      : 'Jane Doe',
          'mrn'       : '123456',
        }
      ];
      
      
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }

    function signIn(){
      //Show Sign In dialog
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $rootScope.customFullscreen;
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        templateUrl:
        './themes/material/components/loginDialog.html',
        controller: LoginDialogController,
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: useFullScreen
      });

      $rootScope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });
      
    }

    function signInOut(){
      if($rootScope.fireUser !== undefined){
        if($rootScope.fireUser == null){
          self.signIn();
        }else{
          fbStorage.signOut();
          $state.go('home');
          window.location.reload(true);
        }
      }else{
        //undefined; login
        self.signIn();
      }
    }

    function LoginDialogController(scope, $mdDialog,$firebaseAuth) {
      var auth = $firebaseAuth();
      scope.email = '';
      scope.test = 'true';
      scope.warning = 'Sign In';
      scope.closeDialog = function() {
        $mdDialog.hide();
      }

      scope.loginUser = function(e){
          fbStorage.emailAuth(scope.email,scope.password);
      }

      $rootScope.$watch(function(scope) { return $rootScope.fireUser },
      function() {
        if($rootScope.fireUser !== undefined && $rootScope.fireUser != null){
          scope.closeDialog();
        }else{

        }
        
      }
     );
    }

    function RegisterDialogController(scope, $mdDialog,$firebaseAuth) {
      var auth = $firebaseAuth();
      scope.email = '';
      scope.test = 'true';
      scope.warning = 'Sign In';
      scope.closeDialog = function() {
        $mdDialog.hide();
      }

      scope.loginUser = function(e){
          fbStorage.registerUser(scope.firstName,scope.email,scope.password);
      }

      $rootScope.$watch(function(scope) { return $rootScope.fireUser },
      function() {
        if($rootScope.fireUser !== undefined && $rootScope.fireUser != null){
          scope.closeDialog();
        }else{

        }
        
      }
     );
    }
})

