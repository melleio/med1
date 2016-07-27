"use strict";
var ang = angular
  .module('materialApp', ['ngMaterial',"ngCordova",'ui.router','ngRoute','firebase'])

  .run(function($rootScope, $cordovaDevice,$cordovaGeolocation,$mdToast){
    document.addEventListener("deviceready", function () {
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

    });
  });
  ang.config(function($locationProvider,$mdThemingProvider, $mdIconProvider,$sceDelegateProvider,$httpProvider,$stateProvider,$urlRouterProvider){

        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise("/home");
        //
        // Now set up the states
        $stateProvider
          .state('home', {
            url: "/home",
            templateUrl: "./themes/material/components/home.html"
          })
          .state('p', {
            url: "/p/:city/:id",
            templateUrl: "./themes/material/components/property-detail.html",
            controller: function($stateParams){
              $stateParams.id;  //*** Exists! ***//
              $stateParams.city;
            }
          })
          
        $mdThemingProvider.theme('default')
                 .primaryPalette('red',{
                  'default': '400', // by default use shade 400 from the pink palette for primary intentions
                  'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
                  'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                  'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class
                })
                .accentPalette('blue-grey',{
                  'default': '900', // by default use shade 400 from the pink palette for primary intentions
                  'hue-1': '900', // use shade 100 for the <code>md-hue-1</code> class
                  'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                  'hue-3': '400' // use shade A100 for the <code>md-hue-3</code> class
                });
            $mdThemingProvider.theme('green')
                .primaryPalette('green')
                .accentPalette('grey');

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

.controller('DashCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$mdSidenav,$timeout,$firebaseArray) {
//document.addEventListener("deviceready", function () {
  var self = this;
  $scope.selectedSearchId = 1;
  self.isLoading=true;
  $scope.searching = false;
  $rootScope.active_regions = null;
  $rootScope.subTitle = "Book Service";
  var config = {
    apiKey: "AIzaSyCmzpXA9l45E9DthYOVtdIFEYrgGD5fS",
    databaseURL: "https://project-5024312928467115441.firebaseio.com",
    storageBucket: "project-5024312928467115441.appspot.com",
  };
  firebase.initializeApp(config);
  $scope.surveys = null;

  self.toggleList=function(navID){
    $mdSidenav(navID)
      .toggle()
      .then(function () {
      });
  }
  $scope.searchByCity = function(ev,city){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('City Search')
        .textContent('Regional Search coming soon.')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK!')
        .targetEvent(ev)
    );
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

  $scope.checkInput = function($event){
    if($event.keyCode == 13){
      // cordova.plugins.Keyboard.close();
      $scope.searching = true;
      // console.log("Search: "+$rootScope.searchText);
      if($rootScope.searchText.length < 5){
        return true;
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
          $rootScope.currentCity = null;
          if($rootScope.active_regions == null){
            firebase.database().ref('active_regions').on('value', function(snapshot) {
              $rootScope.active_regions = snapshot.val();
              angular.forEach($rootScope.active_regions, function(v, k) {
                if(v == gResult.address_components[3].short_name)
                  city = gResult.address_components[3].short_name;
                $rootScope.currentCity = k;
              });
              if(city == null){
                $rootScope.gAddress = null;
              }else{
                $rootScope.gAddress = gResult.address_components[0].short_name+" "+gResult.address_components[1].short_name
              }
              console.log($rootScope.gAddress);
              var parcelid = null;
              parcelid = $rootScope.getParcel($rootScope.gAddress,$rootScope.currentCity);

            });
          }else{
            angular.forEach($rootScope.active_regions, function(v, k) {
              if(v == gResult.address_components[3].short_name)
                city = gResult.address_components[3].short_name;
              $rootScope.currentCity = k;
            });
            if(city == null){
              $rootScope.gAddress = null;
            }else{
              $rootScope.gAddress = gResult.address_components[0].short_name+" "+gResult.address_components[1].short_name
            }
          }
          
          if(r.results.length < 1){
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
    $rootScope.parcelId = $scope.listItems[num].account_number;
    $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
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
      params: {q:address,city:city}
    };
    $http(req)
    .success(function(data,status,headers,config){
      // console.log("Parcel id found!", data.response[0].ID);
      if(data.response["block"] != undefined){
        //Search by block 
        $rootScope.searchByBlock(data.response["block"]);
      }else{
      	if($rootScope.currentCity = 'philly')
          $rootScope.parcelId = data.response[0].AccountNumber;
        // $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
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
        city: 'phila',
        bgUrl: './img/philly.jpg',
        who: 'Philadelphia, PA',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        city: 'dc',
        bgUrl: './img/dc.jpg',
        who: 'Washington, DC',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        city: 'brooklyn',
        bgUrl: './img/brooklyn.jpg',
        who: 'Brooklyn, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        city: 'manhattan',
        bgUrl: './img/manhattan.jpg',
        who: 'Manhattan, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        city: 'bronx',
        bgUrl: './img/bronx.jpg',
        who: 'Bronx, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        city: 'si',
        bgUrl: './img/staten-island.jpg',
        who: 'Staten Island, NY',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
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

  $rootScope.openPage=function(page){
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
      {value:0,selected:false,name: "Residential"},
      {value:1,selected:false,name: "Commercial"},
      {value:2,selected:false,name: "Other"}
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

  $scope.saveSurvey = function(ev){
    console.log($rootScope.currentSurvey);
    //Save to firebase
    angular.forEach($rootScope.currentSurvey.survey.items, function(value, key) {
      delete $rootScope.currentSurvey.survey.items[key].$$hashKey;
      angular.forEach($rootScope.currentSurvey.survey.items[key].answer, function(v, k) {
        delete $rootScope.currentSurvey.survey.items[key].answer.$$hashKey;
        delete $rootScope.currentSurvey.survey.items[key].answer.$$mdSelectId;
      });
    });
    
    delete $rootScope.currentSurvey.doctor.$$mdSelectId;
    delete $rootScope.currentSurvey.survey.$$mdSelectId;
    $rootScope.currentSurvey.timestamp = firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref('saved').push($rootScope.currentSurvey, function(error) {
      if(error){
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('There was an error saving this survey. Please try again.')
            .ariaLabel('Alert Dialog')
            .ok('Ok!')
            .targetEvent(ev)
        );
      }else{
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Success')
            .textContent('Your survey was successfully saved.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Ok!')
            .targetEvent(ev)
        );
        $rootScope.currentSurvey = null;
      }
    });
  }
  var now = new Date();

function DownloadDialogController($scope,$rootScope, $mdDialog) {

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
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

    

})
