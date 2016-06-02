"use strict";
var ang = angular
  .module('materialApp', ['ngMaterial',"ngCordova","firebase"])

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
         .primaryPalette('red',{
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

.controller('DashCtrl', function($rootScope,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$cordovaCalendar,$firebaseArray,$firebaseObject) {
//document.addEventListener("deviceready", function () {
  var self = this;
  self.isLoading=true;
  self.fireLink = "https://jumpinevents.firebaseio.com/";
  self.ref = new Firebase(self.fireLink);
  var now = new Date();

  self.deals        = loadAllDeals();
    self.qSearch   = qSearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.selectedDeal = "";
    self.newDeal = newDeal;
    
    function newDeal(ev,dealName,property) {
      $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Debugging')
        .textContent('This feature is currently in development.')
        .ariaLabel('Alert Deals')
        .ok('Got it!')
        .targetEvent(ev)
    );
    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for deals... use $timeout to simulate
     * remote dataservice call.
     */
    function qSearch (query) {
      var results = query ? self.deals.filter( createFilterFor(query) ) : self.deals,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `deals` list of key/value pairs
     */
    function loadAllDeals() {
      $scope.allDeals = $firebaseArray(self.ref.child('deals').orderByKey());
        $scope.allDeals.$loaded().then(function() {
      // var allDeals = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
      //         Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
      //         Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
      //         Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
      //         North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
      //         South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
      //         Wisconsin, Wyoming';
      return $scope.allDeals
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }

  self.search=function(ev){
    if(ev.keyCode == 13){
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Search coming soon')
          .textContent('Stay tuned, this feature is coming soon!')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
    }
  };
  self.soon=function(ev){
    $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Soon Come')
          .textContent('Stay tuned, this feature is coming soon!')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
  }
  self.share=function(ev){
    self.soon(ev);
  }

  self.fireEvents = self.ref.child("events").orderByChild('timestamp');
  $rootScope.events = null;
  var paginator = new Paginator(self.fireEvents, 250);
  var limitStep = 10;
$scope.limit = limitStep;
$scope.incrementLimit = function() {
    $scope.limit += limitStep;
};
$scope.decrementLimit = function() {
    $scope.limit -= limitStep;
};
self.loadMore = function(ev){
  self.isLoading = true;
  // paginator.nextPage(eventsLoaded);
  $scope.incrementLimit();
}

self.addEvent = function(ev,event){
  $cordovaCalendar.createEvent({
    title: event.title,
    location: event.venue_name,
    notes: event.description,
    startDate: new Date(Date.parse(event.start_date+" "+event.start_time)),
    endDate: new Date(Date.parse(event.start_date+" "+event.start_time))
  }).then(function (result) {
    // success
    $mdToast.show(
      $mdToast.simple()
      .content("Events successfully created!")
      .position('bottom right')
      .hideDelay(1000)
    );
  }, function (err) {
    // error
    $mdToast.show(
      $mdToast.simple()
      .content("Unable to create event.")
      .position('bottom right')
      .hideDelay(1000)
    );
  });

}

  function eventsLoaded(vals){
    for (var key in vals) {
      // console.log(vals[key]);
      $rootScope.events[key] = vals[key];
    }
    self.isLoading = false;
    $mdToast.show(
      $mdToast.simple()
      .content("Events loaded")
      .position('bottom right')
      .hideDelay(1000)
    );
  }

  self.openNotificationsMenu = function($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };
document.addEventListener("deviceready", function () {
  self.ref.child("events").orderByChild('timestamp').startAt(parseInt((now.getTime())/1000)).limitToFirst($rootScope.initialLimit).on("value",function(snapshot){
    $rootScope.events = snapshot.val();
    self.isLoading = false;
    $mdToast.show(
      $mdToast.simple()
      .content("Events loaded")
      .position('bottom right')
      .hideDelay(1000)
    );
  });
});

  self.currentLocation=function(ev){
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: LocationDialogController,
      templateUrl: './themes/material/components/currentLocationDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
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
  }

  self.login = function(ev){
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: './themes/material/components/loginDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
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
  }

  self.download = function(ev){
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DownloadDialogController,
      templateUrl: './themes/material/components/downloadDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
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
  }

  function authDataCallback(authData) {
    if (authData) {
      $rootScope.authData = authData;
      $rootScope.isAuth = true;
      console.log(authData);
      console.log("User " + authData.auth.uid + " is logged in with " + authData.provider);
      $cordovaCalendar.listCalendars().then(function (result) {
        // success
        console.log(result);
      }, function (err) {
        // error
        console.log(err);
      });
      
      
      
    } else {
      console.log("User is logged out");
      //   $mdDialog.show({
      //   controller: DialogController,
      //   templateUrl: './themes/material/components/loginDialog.html',
      //   parent: angular.element(document.body),
      //   clickOutsideToClose:true
      // })
      // .then(function(answer) {
      //   $scope.status = 'You said the information was "' + answer + '".';
      // }, function() {
      //   $scope.status = 'You cancelled the dialog.';
      // });
      // self.login()
    }
  }
  document.addEventListener("deviceready", function () {
    self.ref.onAuth(authDataCallback);
  });


function LocationDialogController(scope,$rootScope,$mdDialog,$cordovaGeolocation){
scope.locationContent = "Determining your current location...";
var posOptions = {timeout: 10000, enableHighAccuracy: false};
$cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      self.ref.child("users").child($rootScope.authData.uid).child('position').push(position,function(){
        scope.locationContent = "We've found you on planet earth. At this time we are only curating events in \
        Philadelphia. Stay tuned for more cities in the future!";
        $mdToast.show(
          $mdToast.simple()
          .content("Location acquired.")
          .position('top left')
          .hideDelay(3000)
        );

      });
      var lat  = position.coords.latitude
      var long = position.coords.longitude
    }, function(err) {
      // error
      $mdToast.show(
          $mdToast.simple()
          .content("Unable to geo locate.")
          .position('bottom left')
          .hideDelay(3000)
        );
    });
scope.cancel = function() {
    $mdDialog.cancel();
  };
  scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
};

document.addEventListener("deviceready", function () {
  function DialogController($scope,$rootScope, $mdDialog) {
    $scope.fbAuth = function($event){
      window.open = cordova.InAppBrowser.open;
      self.provider = "facebook";
        self.ref.authWithOAuthPopup(self.provider, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          $mdToast.show(
                  $mdToast.simple()
                  .content("Not Connected.")
                  .position('top left')
                  .hideDelay(3000)
                );
        } else {
          console.log("Authenticated successfully with payload:", authData);
          //Write latest user data to firebase
            self.providerId = authData.facebook.id;
            self.email = authData.facebook.email;
            var googleRef = self.ref.child("users").child(authData.auth.uid);
            googleRef.set({
              provider:"facebook",
              provider_id: authData.facebook.id,
              display_name: authData.facebook.displayName,
              email: authData.facebook.email,
              picture: authData.facebook.cachedUserProfile.picture,
              provider_token:authData.facebook.accessToken,
              first_name:authData.facebook.cachedUserProfile.first_name
            });
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'themes/material/components/landing/confirmDialog.html',
              parent: angular.element(document.body),
              targetEvent: $event,
              clickOutsideToClose:true
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });

            window.plugins.calendar.createCalendar('JumpIn Calendar',function (result) {
        // success
        // console.log(result);
        $mdToast.show(
          $mdToast.simple()
          .content("JumpIn Calendar Created.")
          .position('top left')
          .hideDelay(3000)
        );
      }, function (err) {
        // error
      });
          //send to server for check
          // self.providerauth(authData.token);
        }
        delete window.open;
      },{
        scope: "email"
      });
    };

    $scope.twAuth = function($event){
      window.open = cordova.InAppBrowser.open;
      self.provider = "twitter";
      self.ref.authWithOAuthPopup(self.provider, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $mdDialog.cancel();
        console.log("Authenticated successfully with payload:", authData);
        //Write latest user data to firebase
          self.providerId = authData.twitter.id;
          // self.email = authData.twitter.email;
          var twitterRef = self.ref.child("users").child(authData.auth.uid);
          twitterRef.set({
            provider:self.provider,
            provider_id: authData.twitter.id,
            display_name: authData.twitter.displayName,
            username: authData.twitter.username,
            picture: authData.twitter.profileImageURL,
            profile:authData.twitter.cachedUserProfile,
            provider_token:authData.twitter.accessToken
          });

          $mdDialog.show({
            controller: DialogController,
            templateUrl: 'themes/material/components/landing/confirmDialog.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });

          window.plugins.calendar.createCalendar('JumpIn Calendar',function (result) {
            // success
            // console.log(result);
            $mdToast.show(
              $mdToast.simple()
              .content("JumpIn Calendar Created.")
              .position('top left')
              .hideDelay(3000)
            );
          }, function (err) {
            // error
          });
      }
      delete window.open
    });
  }

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
};


})
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