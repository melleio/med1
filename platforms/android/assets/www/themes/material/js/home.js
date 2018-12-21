
"use strict";
angular
  .module('materialApp')
  .controller('HomeCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,$cordovaCamera,fbStorage) {
  	var vm = this;
    $rootScope.gAddress = null;
    $rootScope.onMap = false;
  	$rootScope.showSort = false;
    $rootScope.parcelId = null;
    $rootScope.searching = false;
    $rootScope.showGList = showGList;
    vm.loadProperty = loadProperty;
    $scope.getParclByAddress = getParclByAddress;

    $rootScope.searchHistory = _.uniq(JSON.parse($rootScope.storage.getItem('parcl_searchHistory')));
    $rootScope.mapFilters = _.uniq(JSON.parse($rootScope.storage.getItem('parcl_mapFilters')));
    $rootScope.mapSearchHistory = _.uniq(JSON.parse($rootScope.storage.getItem('parcl_mapSearchHistory')));
  

    if($rootScope.map != null){
      //Map still active. destroy
      // $rootScope.map.remove();
      $rootScope.map.setClickable(false);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.overlaysWebView(false);
      window.StatusBar.styleDefault();
    }

    document.addEventListener("backbutton", function(e){
       // $mdDialog.close();
       navigator.app.backHistory()
       
    }, false);

    $rootScope.simulateQuery = false;
    $rootScope.isDisabled    = false;
    $rootScope.querySearch   = querySearch;
    $rootScope.selectedItemChange = selectedItemChange;
    $rootScope.searchTextChange   = searchTextChange;
    $rootScope.searchAddresses = loadHistory();

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
      var results = query ? $rootScope.searchAddresses.filter( createFilterFor(query) ) : $rootScope.searchAddresses;
      return results;
    }
    function searchTextChange(text) {
      // console.log('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      // console.log('Item changed to ' + JSON.stringify(item));
      $rootScope.searchText = item;
    }

    function loadProperty(ev,item){
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
      if(item.geometry !== undefined){
        $state.go('m',{lat:item.geometry.location.lat,lng:item.geometry.location.lng});
        return true;
      }
        
      if(item.address !== undefined){
        $rootScope.searchText = item.address;
        $scope.checkInput(ev);
      }
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
 
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.indexOf(lowercaseQuery) === 0);
      };
    }

    function loadHistory(){
      if($rootScope.searchHistory != null){
        return $rootScope.searchHistory.toString().split(/, +/g).map( function (address) {
          return address.toLowerCase();
        });
      }else{
        return [];
      }
    }


    $scope.searchByCity = function(ev,city){
      $rootScope.activeRegion = city;
      $rootScope.searching = true;
      var r = _.filter($scope.todos,function(o) { return o.city==city});
      
      if(city == "philadelphia"){
        $rootScope.currentCity = "philadelphia";
        firebase.database().ref().child('neighborhoods').child($rootScope.activeRegion).once('value',function(snapshot){
          $rootScope.neighborhoods = snapshot.val();
          $rootScope.subTitle = r[0].who;
          $rootScope.searching = false;
          $rootScope.currentCity = "philadelphia";
          $scope.doSearch();
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

    $scope.searchTypeChange = function(ev){
      if ($scope.selectedSearchId == 1) {
        $rootScope.subTitle = "";
        // $rootScope.activeSearch.parcel_type = null;
        $rootScope.activeSearch.neighborhoods = null;
        $rootScope.neighborhoods = null;
        $rootScope.activeRegion = null;

      }else{
        $rootScope.activeSearch = {};
      }
    }

    $scope.doSearch = function(ev){
      // console.log($rootScope.activeSearch);
      $state.go('l');
    }
    $scope.closeKeyboard = function($event){
      cordova.plugins.Keyboard.close();
      var myEl = angular.element( document.querySelector( '#searchField' ) );
      myEl[0].getElementsByTagName("input")[0].blur();
    }
    $scope.showKeyboard = function($event){
      if(!cordova.plugins.Keyboard.isVisible)
        cordova.plugins.Keyboard.show();
    }
    

    $scope.checkInput = function($event){

      if($event.keyCode == 13){
        // Enter key pressed
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
          var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBfdI61qNxrgQ2qqXXyIKjMbRdi19HkjtY&address="+$rootScope.searchText+"&format=json&sensor=true";
      
          $http.get(url)
          .success(function(response){
            $scope.searching = false;
            // console.log(response);
            var list = [];
            angular.forEach(response.results, function(v, k) {
              var valid = _.find(v.address_components,function(o) { return o.types[0]=="locality"});
              if(valid !== undefined){
                v.address = v.address_components[0].long_name + " " + v.address_components[1].short_name + ". " + _.find(v.address_components, function(o){ return o.types[0] == "locality"}).short_name + ", " +_.find(v.address_components, function(o){ return o.types[0] == "administrative_area_level_1"}).short_name
                list.push(v);
              }
            });
            // console.log(list);
            if(list.length >= 1){
              //Show list
              $rootScope.showGList(list,'Results');
            }else if(list.length == 10000){
              $rootScope.storage.setItem("searchedItem",JSON.stringify(list[0]));
              // window.FirebasePlugin.logEvent("parcl_address_search", {query: $rootScope.searchText,lat:list[0].geometry.location.lat,lng:list[0].geometry.location.lng});
              cordova.plugins.Keyboard.close();
              $state.go('m',{lat:list[0].geometry.location.lat,lng:list[0].geometry.location.lng})
              // $rootScope.currentCity = "philadelphia";
              // var zip = _.filter(list[0].address_components,function(o) { return o.types[0]=="postal_code"});
              // $rootScope.zip = zip[0].short_name;
              // var houseNumber = null;
              // var hN = _.filter(list[0].address_components,function(o) { return o.types[0]=="street_number"});
              // var route = _.filter(list[0].address_components,function(o) { return o.types[0]=="route"});
              // if(hN == false){
              //   $rootScope.gAddress = route[0].short_name;
              // }else{
              //   if($rootScope.currentCity != 'philadelphia')
              //     houseNumber = pad(hN[0].short_name,4);
              //   else
              //     houseNumber = hN[0].short_name;
              //   $rootScope.gAddress = houseNumber+" "+route[0].short_name
              // }
              // $scope.getParclByAddress($rootScope.gAddress,$rootScope.currentCity);
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
            // console.log(data);
          });
        }
        
      }
    }

    function showGList(items,title) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: GListDialogController,
        templateUrl: './themes/material/components/glistDialog.html',
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

    function GListDialogController($scope, $mdDialog, items, title) {
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
        var item = $scope.listItems[num];
        $rootScope.storage.setItem("searchedItem",JSON.stringify(item));
        fbStorage.searchHistoryAdd({
          address:$rootScope.searchText,
          formatted_address: item.formatted_address,
          lat:item.geometry.location.lat,
          lng:item.geometry.location.lng
        });
        // window.FirebasePlugin.logEvent("parcl_address_search", {query: $rootScope.searchText,lat:item.geometry.location.lat,lng:item.geometry.location.lng});
        // cordova.plugins.Keyboard.close();
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
        // $state.go('m',{lat:item.geometry.location.lat,lng:item.geometry.location.lng})
        // if($rootScope.currentCity == 'philadelphia'){
        //   if($scope.listItems[num].parcel_number !== undefined){
        //     $rootScope.parcelId = $scope.listItems[num].parcel_number;
        //   }else{
        //     $rootScope.parcelId = $scope.listItems[num].account_number;
        //   }
          
        //   $state.go('property',{id:$rootScope.parcelId,city:$rootScope.currentCity});
        //   // $state.reload();
        // }else{
        //   if($scope.listItems[num].parcel_number !== undefined){
        //     $rootScope.parcelId = $scope.listItems[num].parcel_number;
        //   }else{
        //     $rootScope.parcelId = $scope.listItems[num].account_number;
        //   }
        //   $state.go('property',{id:$rootScope.parcelId,city:$rootScope.currentCity});
        // }
      }
    }

    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function processGoogleResults(response,blocklist){
      var r = response;
      // console.log(r);
      var gResult = r.results[0];
      //Check city
      var city = null;
      var zip = _.filter(gResult.address_components,function(o) { return o.types[0]=="postal_code"});
      $rootScope.zip = zip[0].short_name;
      $rootScope.currentCity = null;
      // if($rootScope.active_regions == null){
      //   firebase.database().ref('active_regions').on('value', function(snapshot) {
      //     $rootScope.active_regions = snapshot.val();
      //     angular.forEach($rootScope.active_regions, function(v, k) {
      //       var cityObj = _.filter(gResult.address_components,function(o) { return o.types[0]=="locality"});
      //       if(cityObj != false){
      //         if(v == cityObj[0].short_name){
      //           city = cityObj[0].short_name;
      //           $rootScope.currentCity = k;
      //         }
      //       }
      //     });
      //     if($rootScope.currentCity == null){
      //       $rootScope.gAddress = null;
      //     }else{
      //       var houseNumber = null;
      //       var hN = _.filter(gResult.address_components,function(o) { return o.types[0]=="street_number"});
      //       var route = _.filter(gResult.address_components,function(o) { return o.types[0]=="route"});
      //       if(hN == false){
      //         $rootScope.gAddress = route[0].short_name;
              
      //       }else{
      //         if($rootScope.currentCity != 'philadelphia')
      //           houseNumber = pad(hN[0].short_name,4);
      //         else
      //           houseNumber = hN[0].short_name;
      //         $rootScope.gAddress = houseNumber+" "+route[0].short_name
      //       }
            
      //     }
      //     console.log($rootScope.gAddress);
      //     var parcelid = null;
      //     if($rootScope.gAddress != null){
      //       $rootScope.latitude = gResult.geometry.location.lat;
      //       $rootScope.longitude = gResult.geometry.location.lng;
      //       parcelid = $scope.getParclByAddress($rootScope.gAddress,$rootScope.currentCity,blocklist);
      //     }else{
      //       // Out of available regions
      //       $mdToast.show(
      //         $mdToast.simple()
      //         .content("Region Unavailable at this time.")
      //         .position('bottom left')
      //         .hideDelay(3000)
      //       );
      //       return true;
      //     }

      //   });
      // }else{
      //   angular.forEach($rootScope.active_regions, function(v, k) {
      //       var cityObj = _.filter(gResult.address_components,function(o) { return o.types[0]=="locality"});
      //       if(cityObj != false){
      //         if(v == cityObj[0].short_name){
      //           city = cityObj[0].short_name;
      //           $rootScope.currentCity = k;
      //         }
      //       }
      //     });
      //     if(city == null){
      //       $rootScope.gAddress = null;
      //     }else{
      //       var houseNumber = null;
      //       var hN = _.filter(gResult.address_components,function(o) { return o.types[0]=="street_number"});
      //       var route = _.filter(gResult.address_components,function(o) { return o.types[0]=="route"});
      //       if(hN == false){
      //         $rootScope.gAddress = route[0].short_name;
              
      //       }else{
      //         if($rootScope.currentCity != 'philadelphia')
      //           houseNumber = pad(hN[0].short_name,4);
      //         else
      //           houseNumber = hN[0].short_name;
      //         $rootScope.gAddress = houseNumber+" "+route[0].short_name
      //       }
      //     }
      //     console.log($rootScope.gAddress);
      //     var parcelid = null;
      //     if($rootScope.gAddress != null){
      //       $rootScope.latitude = gResult.geometry.location.lat;
      //       $rootScope.longitude = gResult.geometry.location.lng;
      //       parcelid = $scope.getParclByAddress($rootScope.gAddress,$rootScope.currentCity);
      //     }else{
      //       // Out of available regions
      //       $mdToast.show(
      //         $mdToast.simple()
      //         .content("Region Unavailable at this time.")
      //         .position('bottom left')
      //         .hideDelay(3000)
      //       );
      //       return true;
      //     }
      // }
      
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
      }
    }

    function getParclByAddress(address,city){
      var req = {
          method: 'GET',
          url: 'https://x.emelle.me/jsonservice/Parcl/loadbyaddress',
          params: {address:address,city:city}
        };
        $http(req)
        .success(function(data,status,headers,config){
          if(data.response.error == true){
            //to do: show alert dialog
            $rootScope.searching = false;
            $scope.loadMap = false;
            // $rootScope.map.setClickable(true);
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title('Maintenance')
              .textContent("Hang tight. We'll be back online shortly.")
              .ariaLabel('Alert Dialog')
              .ok('Ok!')
            );
          }else{
            $rootScope.parcelId = data.response.parcel_number;
            var property = data.response;
            fbStorage.searchHistoryAdd({
              address:property.address,
              parcelid:property.parcel_number
            });
            $rootScope.storage.setItem("parcl_"+data.response.parcel_number,$rootScope.selectedItem);
            $state.go('p',{id:property.parcel_number,city:$rootScope.currentCity});
          } 
        })
        .error(function(data, status, headers, config){
          $mdToast.show(
            $mdToast.simple()
            .textContent("An error Occured.")
            .position('top right')
            .hideDelay(3000)
          );
        });
    }
});

