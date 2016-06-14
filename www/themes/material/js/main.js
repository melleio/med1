"use strict";
var ang = angular
  .module('materialApp', ['ngMaterial',"ngCordova"])

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
  ang.config(function($locationProvider,$mdThemingProvider, $mdIconProvider,$sceDelegateProvider,$httpProvider){

        $locationProvider.html5Mode(false);
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

.controller('DashCtrl', function($rootScope,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout) {
//document.addEventListener("deviceready", function () {
  var self = this;
  self.isLoading=true;
  var config = {
    apiKey: "AIzaSyBnq1xgkCIL95S_aSfmjVLXLproyt1NTnc",
    authDomain: "project-1885830840049226859.firebaseapp.com",
    databaseURL: "https://project-1885830840049226859.firebaseio.com",
    storageBucket: "project-1885830840049226859.appspot.com",
  };
  firebase.initializeApp(config);
  $scope.surveys = null;
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

  $scope.loadUsers = function() {
    // Use timeout to simulate a 650ms request.
    return $timeout(function() {
      $scope.users =  $scope.users  || [
        { id: 1, name: 'Scooby Doo' },
        { id: 2, name: 'Shaggy Rodgers' },
        { id: 3, name: 'Fred Jones' },
        { id: 4, name: 'Daphne Blake' },
        { id: 5, name: 'Velma Dinkley' }
      ];
    }, 650);
  };

  $scope.loadSurveys = function() {
    // Use timeout to simulate a 650ms request.
    if($scope.surveys == null){
      return firebase.database().ref('surveys').on('value', function(snapshot) {
        $scope.surveys = snapshot.val();
      });
    }
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
  var now = new Date();

function DownloadDialogController($scope,$rootScope, $mdDialog) {

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
}
// }); 
})
