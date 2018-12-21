var ang = angular
    .module('materialApp', ['ngMaterial', 'ui.router']);
	
	ang.config(function($locationProvider,$mdThemingProvider, $mdIconProvider,$sceDelegateProvider,$httpProvider,$stateProvider, $urlRouterProvider){

        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
          .state('garments', {
            url: "/garments",
            templateUrl: "./garments.html"
          })
          .state('garment', {
            url: "/garment",
            templateUrl: "./garment.html"
          })
          .state('login', {
            url: "/login",
            templateUrl: "./login.html"
          })
          .state('images', {
            url: "/images",
            templateUrl: "./themes/material/components/images.html"
          })
          .state('animations', {
            url: "/animations",
            templateUrl: "./animations.html"
          })
          .state('viewfinder', {
            url: "/viewfinder",
            templateUrl: "./viewfinder.html"
          })
          .state('partymode', {
            url: "/partymode",
            templateUrl: "./partymode.html"
          })
          .state('settings', {
            url: "/settings",
            templateUrl: "./settings.html"
          });

        $mdThemingProvider.theme('default')
         .primaryPalette('deep-purple',{
          'default': '900', // by default use shade 400 from the pink palette for primary intentions
          'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
          'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class
        })
        .accentPalette('grey',{
                            'default': '100', // by default use shade 400 from the pink palette for primary intentions
                            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                            'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                          });
    	$mdThemingProvider.theme('green')
        .primaryPalette('green')
        .accentPalette('blue-grey');
	})
.filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
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
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          console.log("close LEFT is done");
        });
    };
  })
.controller('ListCtrl', function($scope, $mdDialog,$state,$mdSidenav) {
  $scope.garments = [
    ];
  $scope.leftMenu = [
    { name: 'Images', extraScreen: 'Images menu', icon: 'icon-photo_library', enabled: false,go:'images' },
    { name: 'Animations', extraScreen: 'Animations', icon: 'icon-burst_mode', enabled: false,go:'animations' },
    { name: 'Garments', extraScreen: 'Garments menu', icon: 'icon-bluetooth_searching', enabled: false,go:'garments' },
    // { name: 'View Finder', extraScreen: 'View Finder menu', icon: 'icon-add_a_photo', enabled: false,go:'images' },
    // { name: 'Party Mode', extraScreen: 'party menu', icon: 'icon-pets', isSwitch: true,go:'images' },
    { name: 'Settings', extraScreen: 'settings menu', icon: 'icon-settings', enabled: false,go:'settings' },
  ];
  $scope.messages = [
    {id: 1, title: "Message A", selected: false},
    {id: 2, title: "Message B", selected: true},
    {id: 3, title: "Message C", selected: true},
  ];
  $scope.people = [
    { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
    { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
    { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
  ];
  $scope.goToPerson = function(person, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('Inspect ' + person)
        .ariaLabel('Person inspect demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
  $scope.navigateTo = function(to, event) {
    // $mdDialog.show(
    //   $mdDialog.alert()
    //     .title('Navigating')
    //     .textContent('Imagine being taken to ' + to)
    //     .ariaLabel('Navigation demo')
    //     .ok('Neat!')
    //     .targetEvent(event)
    // );
    $state.go(to);
    $mdSidenav('left').close()
    .then(function () {
      console.log("close LEFT is done");
    });
  };
  $scope.doPrimaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Primary Action')
        .textContent('Primary actions can be used for one click actions')
        .ariaLabel('Primary click demo')
        .ok('Awesome!')
        .targetEvent(event)
    );
  };
  $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .textContent('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
})
.controller('ViolettController', function($rootScope,$scope,$mdSidenav,$mdBottomSheet,$mdDialog,$mdToast,$mdMedia,$timeout,$http,$state) {
  var vm = this;
  $rootScope.Title = 'spektrum';
  $rootScope.serviceUUID = '783a0000-b056-48ee-8b3c-d0dd6c96b713';
  $rootScope.chromaTypeChar = '783a0001-b056-48ee-8b3c-d0dd6c96b713';
  $rootScope.chromaTypes = [
    {name:"chroma150",width:15,height:10},
    {name:"chroma225",width:15,height:15},
    {name:"custom",width:10,height:5}
  ]
  $rootScope.savedDevices = [];
  vm.LoadingFile = false;
  $scope.toggleLeft = buildToggler('left');

  vm.fireRef = new Firebase('https://chromacolour.firebaseio.com');
  vm.fireRef.child('images').orderByKey().limitToLast(100).on('value',function(snapshot){
    var imgs = snapshot.val();
    $rootScope.allImages = Object.keys(imgs).map(function(k) {
      return imgs[k]
    });
    $rootScope.allImages.reverse();
    $mdToast.show(
        $mdToast.simple()
       .content("Loaded")
       .position('bottom left')
       .hideDelay(1500)
      );
  });

  // Create a callback which logs the current auth state
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      //Add event listeners!
      $rootScope.user = authData;
      vm.fireRef.child('users').child($rootScope.user.uid).once('value',function(snapshot){
        var u = snapshot.val();
        vm.fireRef.child('users').child($rootScope.user.uid).child('email').set($rootScope.user.password.email);
        
        console.log(snapshot.val());
        // Check for garments

      });
      vm.fireRef.child('users').child($rootScope.user.uid).child('garments').on('value',function(snapshot){
        var u = snapshot.val();
        $rootScope.savedDevices = Object.keys(u).map(function(k) {
          return u[k]
        });
        // $mdToast.show(
        //   $mdToast.simple()
        //  .content("Garment Saved")
        //  .position('top left')
        //  .hideDelay(1500)
        // ); 
      });
    } else {
      console.log("User is logged out");
      // Show login dialog
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
            .title('Sign In')
            .textContent('Enter your email address')
            .placeholder('email address')
            .ariaLabel('Dog name')
            .ok('Continue');
      $mdDialog.show(confirm).then(function(result) {
        $rootScope.tempEmail = result;
        vm.loginWithPassword(result);
        
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
    }
  }


  vm.fireRef.onAuth(authDataCallback);

  vm.loginWithPassword=function(email){
    var confirm = $mdDialog.prompt()
      .title('Sign In')
      .textContent('Enter your pass code')
      .placeholder('pass code')
      .ariaLabel('pass code')
      .ok('Sign In')
      .cancel('Send Pass code');
      $mdDialog.show(confirm).then(function(result) {
        vm.fireRef.authWithPassword({
          email    : email,
          password : result
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
            vm.retryPassword(email);
          } else {
            $rootScope.user = authData;
            console.log("Authenticated successfully with payload:", authData);
            vm.fireRef.child('users').child($rootScope.user.uid).child('lastLogin').set(Firebase.ServerValue.TIMESTAMP);
          }
        });
      }, function() {
        vm.resetUserPass(email);
      });
  }

  vm.resetUserPass = function(email){
    vm.fireRef.resetPassword({
      email : email
    }, function(error) {
      if (error === null) {
        console.log("Password reset email sent successfully");
        var confirm = $mdDialog.prompt()
        .title('Sign In')
        .textContent('A passcode was sent to your email. Enter below.')
        .placeholder('pass code')
        .ariaLabel('Dog name')
        .ok('Sign In');
        $mdDialog.show(confirm).then(function(result) {
          vm.fireRef.authWithPassword({
            email    : email,
            password : result
          }, function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
              vm.retryPassword(email);
            } else {
              $rootScope.user = authData;
              console.log("Authenticated successfully with payload:", authData);
              vm.fireRef.child('users').child($rootScope.user.uid).child('lastLogin').set(Firebase.ServerValue.TIMESTAMP);
              vm.changePassword(email,result);
            }
          });
        }, function() {
          $scope.status = 'You didn\'t name your dog.';
        });

      } else {
        console.log("Error sending password reset email:", error);
        vm.fireRef.createUser({
          email    : email,
          password : "chromaTemp123"
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Login Error')
                .textContent('Unable to Sign In at this time. Please try again later.')
                .ariaLabel('Alert Signin error')
                .ok('Ok')
            );
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            $rootScope.user = userData;
            // Send reset password
            vm.resetUserPass(email);
          }
        });
      }
    });
  };

  vm.changePassword=function(email,oldPass){
    var confirm = $mdDialog.prompt()
      .title('Update Pass code')
      .textContent('Enter a new pass code.')
      .placeholder('pass code')
      .ariaLabel('pass code update')
      .ok('Save')
      .cancel("Later");
      $mdDialog.show(confirm).then(function(result) {
        vm.fireRef.changePassword({
          email       : email,
          oldPassword : oldPass,
          newPassword : result
        }, function(error) {
          if (error === null) {
            console.log("Password changed successfully");
            $mdToast.show(
              $mdToast.simple()
             .content("Password changed successfully")
             .position('top left')
             .hideDelay(2500)
            ); 
          } else {
            console.log("Error changing password:", error);
            $mdToast.show(
              $mdToast.simple()
             .content("Error updating password")
             .position('top left')
             .hideDelay(2500)
            ); 
            vm.changePassword(email,oldPass);
          }
        });
      }, function() {
        console.log('no password change');
      });
  };
  vm.retryPassword=function(email){
    var confirm = $mdDialog.prompt()
      .title('Sign In')
      .textContent('Invalid Pass code. Try again.')
      .placeholder('pass code')
      .ariaLabel('pass code')
      .ok('Sign In');
      $mdDialog.show(confirm).then(function(result) {
        vm.fireRef.authWithPassword({
          email    : email,
          password : result
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
            vm.retryPassword(email);
          } else {
            $rootScope.user = authData;
            console.log("Authenticated successfully with payload:", authData);
            vm.fireRef.child('users').child($rootScope.user.uid).child('lastLogin').update(Firebase.ServerValue.TIMESTAMP);
          }
        });
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
  }

  $scope.garments = [
  {id: 1, title: "Message A", selected: false},
    {id: 2, title: "Message B", selected: true},
    {id: 3, title: "Message C", selected: true},
    ];

  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          // console.log("toggle " + navID + " is done");
        });
    }
  }

  $rootScope.devices = [];
  $rootScope.connectedDevices = [];
  bleConst = {  
    SCAN_MODE_OPPORTUNISTIC: -1,
  SCAN_MODE_LOW_POWER: 0,
  SCAN_MODE_BALANCED: 1,
  SCAN_MODE_LOW_LATENCY: 2,
  MATCH_NUM_ONE_ADVERTISEMENT: 1,
  MATCH_NUM_FEW_ADVERTISEMENT: 2,
  MATCH_NUM_MAX_ADVERTISEMENT: 3,
  MATCH_MODE_AGGRESSIVE: 1,
  MATCH_MODE_STICKY: 2,
  CALLBACK_TYPE_ALL_MATCHES: 1,
  CALLBACK_TYPE_FIRST_MATCH: 2,
  CALLBACK_TYPE_MATCH_LOST: 4,
};
  $scope.isEmpty = function() {
    if (Object.keys($rootScope.devices).length === 0) {
      return true;
    }
    return false;
  };

  $rootScope.sendToGarment=function($event,imageId){
    if($rootScope.connectedDevices.length == 0){
      $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .clickOutsideToClose(true)
        .title('0 Garments Found')
        .targetEvent($event)
        .textContent('Please connect to garment first!')
        .ariaLabel('Alert garment error')
        .ok('Ok')
      ).then(function(){
        $state.go('garments');
      });
    }else{
      
      if($rootScope.connectedDevices.length == 1){
        $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .targetEvent($event)
          .title('Uploading...')
          .textContent('Uploading to garment. Please wait.')
          .ariaLabel('Alert garment error')
          .ok('Ok')
        )
      }else{
        //Garments connected show chooser dialog if more than one connected
      }

    }
  }
  // $rootScope.initialize = function() {
  //   var params = {request:true};

  //   console.log("Initialize : " + JSON.stringify(params));

  //   ble.initialize(params).then(null, null, function(obj) {
  //     console.log("Initialize Success : " + JSON.stringify(obj));
  //   });
  // };

  // $rootScope.initialize();

  $rootScope.enable = function() {
    console.log("Enable");

    ble.enable(
      function(obj) {
        console.log("Bluetooth is enabled "+obj);
      },
      function() {
          console.log("The user did *not* enable Bluetooth");
      });
  };

  $rootScope.disable = function() {
    console.log("Disable");

    ble.disable().then(null, function(obj) {
      console.log("Disable Error : " + JSON.stringify(obj));
    });
  };

  $rootScope.startScan = function() {
      var params = {
        services:[]
      };
      $rootScope.isScanning = true;
      console.log("Start Scan : " + JSON.stringify(params));

      ble.startScan([], function(device) {
          console.log(JSON.stringify(device));
          if ($rootScope.devices[device.id] !== undefined) {
            console.log("Object in list" + JSON.stringify(device))
          }else{
            $rootScope.devices.push(device);
          }
      }, function() {
          console.log("Fail");
      });

      setTimeout(ble.stopScan,
          5000,
          function() { console.log("Scan complete");
          $mdToast.show(
            $mdToast.simple()
           .content("Scanning Complete")
           .position('top left')
           .hideDelay(1500)
          ); 
          $rootScope.isScanning = false},
          function() { console.log("stopScan failed"); }
      );
  };

  $rootScope.connectSelected=function(index,address,$event){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .clickOutsideToClose(false)
        .title('Connecting')
        .textContent('Connecting. Stand by')
        .ariaLabel('Connecting')
        .ok('OK!')
        .targetEvent($event)
    );
    ble.connect(address,function(obj){
      obj.lastConnected = new Date().getTime();
      $rootScope.connectedDevices.push(obj);
      var g = obj;
      vm.fireRef.child("users").child($rootScope.user.uid).child('garments').child(g.name).set(g).then(function(){
        //do stuff here
      });
      $rootScope.devices = [];
      console.log("Connect Success : " + JSON.stringify(obj));
      $mdDialog.hide();
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Connected!')
          .textContent('You are now connected to '+obj.name)
          .ariaLabel('Alert Missing fields')
          .ok('OK!')
          .targetEvent($event)
      );
    },function(){

    });

  }

  $rootScope.selectGarment=function(index){
    $rootScope.selectedGarment = $rootScope.connectedDevices[index];
    $state.go('garment');

  }

  $rootScope.sendChromaType=function($event){
    // var params = 
    var buffer = new ArrayBuffer(4);
    var data = new Uint32Array(1);
    var t = '00001111000011110000000000001000';
    var tt= Bin2Dec(t);
    data[0] = parseInt(tt,10);

    ble.write($rootScope.selectedGarment.id,$rootScope.serviceUUID,$rootScope.chromaTypeChar,data.buffer,
      function(obj){
        console.log(obj);
      },function(error){
        console.log(error);
      });
  }
  $rootScope.readSelected=function(address,service,characteristic){
    var discoverParams = {address:address};
    
    //Discover first then read
    ble.discover(discoverParams).then(function(obj1){
      var params = {address:address,service:service,characteristic:characteristic};
      ble.read(params).then(function(obj){
        var bytes = ble.encodedStringToBytes(obj.value);
        console.log("Read Success : "+ bytes[0]);

      },function(obj){
        console.log("Read Error : " + JSON.stringify(obj));
      })
    })
    
  }

  $rootScope.stopScan = function() {
    console.log("Stop Scan");

    ble.stopScan().then(function(obj) {
      console.log("Stop Scan Success : " + JSON.stringify(obj));
      $rootScope.devices = [];
      $mdToast.show(
        $mdToast.simple()
       .content("Scanning Stopped")
       .position('top left')
       .hideDelay(1500)
      );
    }, function(obj) {
      console.log("Stop Scan Error : " + JSON.stringify(obj));
    });
  };

  $rootScope.close = function(itemIndex,address) {
    var params = {address:address};

    console.log("Close : " + JSON.stringify(params));

    ble.close(params).then(function(obj) {
     console.log("Close Success : " + JSON.stringify(obj));
    }, function(obj) {
      console.log("Close Error : " + JSON.stringify(obj));
    });

    var device = $rootScope.devices[itemIndex];
    device.services = {};
  };

  $rootScope.retrieveConnected = function() {
    var params = {services:["180F"]};

    console.log("Retrieve Connected : " + JSON.stringify(params));

    ble.retrieveConnected(params).then(function(obj) {
      console.log("Retrieve Connected Success : " + JSON.stringify(obj));

      // for (var i = 0; i < obj.length; i++) {
      //   addDevice(obj[i]);
      // }
    }, function(obj) {
      console.log("Retrieve Connected Error : " + JSON.stringify(obj));
    });
  };

  $rootScope.isInitialized = function() {
    console.log("Is Initialized");

    ble.isInitialized().then(function(obj) {
      console.log("Is Initialized Success : " + JSON.stringify(obj));
    });
  };

  $rootScope.isEnabled = function() {
    console.log("Is Enabled");

    ble.isEnabled().then(function(obj) {
      console.log("Is Enabled Success : " + JSON.stringify(obj));
    });
  };

  function addDevice(obj) {
    if (obj.status == "scanStarted") {
      return;
    }

    if ($rootScope.devices[obj.address] !== undefined) {
      return;
    }

    obj.services = {};
    $rootScope.devices[obj.address] = obj;
  }


});

// ASCII only
function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

//Hexadecimal Operations
function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}
//Useful Functions
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}

function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}
