"use strict";
angular

.module('materialApp')
.controller('ListBottomSheetCtrl', function($rootScope,$state,$scope,$mdBottomSheet) {
  $scope.items = [
    { name: 'View on Map', icon: 'icon-map',value:"map" },
    { name: 'Street View', icon: 'icon-streetview',value:"street" }
  ];
document.addEventListener("deviceready", function () {
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    if(clickedItem.value == "map"){
      $state.go('m',{lat:$rootScope.currentParcel.socrata[0].coordinates.coordinates[1],lng:$rootScope.currentParcel.socrata[0].coordinates.coordinates[0]});
      // $state.go('m'{lat:$rootScope.currentParcel.lat,lng:$rootScope.currentParcel.lng});
    }else if(clickedItem.value == "street"){
        
        document.addEventListener("deviceready", function(){
          var url = "https://deputydashboard.com/#/sv/"+$rootScope.currentParcel.socrata[0].coordinates.coordinates[1]+"/"+$rootScope.currentParcel.socrata[0].coordinates.coordinates[0];
          var target = "_blank";
          var options = "location=no";
          
          window.open = cordova.InAppBrowser.open;
          cordova.InAppBrowser.open(url, target,options);
          // window.location.href = vm.sandbox;
        });

        // ref.addEventListener('loadstart', function(){
        //   console.log('loading');
        // });

        // ref.addEventListener('loadstop', function(){
        //   if(ref != undefined){
        //     ref.show();
        //   }
        // });
    }
    $mdBottomSheet.hide(clickedItem);
  };
});
})
.controller('PropertyListCtrl', function(fbStorage,$rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce) {
  // $scope.list = $rootScope.filterResults;
  var vm = this;
  $scope.open = open;
  $scope.backToMap = backToMap;
  

  vm.city = ($rootScope.city ? $rootScope.city : 'philadelphia');
  if($rootScope.county === undefined){
    $rootScope.county = null;
  }
  $scope.list = $rootScope.mapList;
  
  function backToMap(){
    if($rootScope.selectedItem){
      $state.go('m')
    }
  }
    
  $rootScope.searching = false;
  $scope.salesData = false;
  $scope.email = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Email sent')
        .textContent('This list has been sent to you via Email.')
        .ariaLabel('list send')
        .ok('Got it!')
        .targetEvent(ev)
    );
  }
  $scope.sms = function(ev){
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('SMS sent')
        .textContent('This list has been sent to you via SMS.')
        .ariaLabel('list send')
        .ok('Got it!')
        .targetEvent(ev)
    );
  }

  
  function open(item){
    $state.go('p',{id:$scope.list[item].parcel_number,city:vm.city});
  }
  })
.controller('PropertyCtrl', function(fbStorage,$rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce,$cordovaCamera) {
	$rootScope.currentCity = $state.params.city;
	$rootScope.parcel_id = $state.params.id;
  $rootScope.subTitle = "";
  $rootScope.searching = false;
  $scope.salesData = false;
  $scope.claimProperty = claimProperty;
  $scope.openStreet = openStreet;


  function openStreet(){
    document.addEventListener("deviceready", function(){
      var url = "https://deputydashboard.com/#/sv/"+$rootScope.currentParcel.socrata[0].coordinates.coordinates[1]+"/"+$rootScope.currentParcel.socrata[0].coordinates.coordinates[0];
      var target = "_blank";
      var options = "location=no";
      
      window.open = cordova.InAppBrowser.open;
      cordova.InAppBrowser.open(url, target,options);
      // window.location.href = vm.sandbox;
    });
  }

  var vm = this;
  vm.loadParcel = loadParcel;

  if(window.StatusBar) {
    // org.apache.cordova.statusbar required
    window.StatusBar.overlaysWebView(false);
    window.StatusBar.styleDefault();
  }

  document.addEventListener("backbutton", function(e){
       // $mdDialog.close();
       navigator.app.backHistory()
       
    }, false);

  

  if($rootScope.map != null){
      //Map still active. destroy
      // $rootScope.map.remove();
      $rootScope.map.setClickable(false);
    }

  // $rootScope.note_categories = [
  //   {name:"condition"}];
  if($rootScope.note_categories === undefined){
      $rootScope.note_categories = $firebaseArray(firebase.database().ref().child('note_categories'));


    $rootScope.note_categories.$loaded().then(function() {
      // console
    });
    }
  //Category compleete
  $rootScope.selectedNoteItemChange = selectedItemChange;
  $rootScope.noteCategorySearch = noteCategorySearch;
  $rootScope.searchNoteChange   = catSearchTextChange;
  $rootScope.addNoteCategory = function($event,text){
    var pd = {name:text};
    var pk = firebase.database().ref().child('note_categories').push().key;

    var updates = {};
    updates['/note_categories/' + pk] = pd;
    firebase.database().ref().update(updates).then(
      function(){
        $mdToast.show(
          $mdToast.simple()
          .textContent("Category Saved!")
          .position('top right')
          .hideDelay(3000)
        );
      },
      function(error) {
      if(error){
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('There was an error saving this Note. Please try again.')
            .ariaLabel('Alert Dialog')
            .ok('Ok!')
        );
      }
    });
  }

  // ******************************
  // Internal methods
  // ******************************
  /**
   * Search for Notes... use $timeout to simulate
   * remote dataservice call.
   */
  function noteCategorySearch (query) {
    var results = query ? $rootScope.note_categories.filter( createFilterFor(query) ) : $rootScope.note_categories;
    return results;
  }
  function catSearchTextChange(text) {
    // console.log('Text changed to ' + text);
  }
  function selectedItemChange(item) {
    // console.log('Item changed to ' + JSON.stringify(item));
  }
  /**
   * Build `components` list of key/value pairs
   */
  function loadAll() {
    var Notes = [
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
      return (item.name.indexOf(lowercaseQuery) === 0);
    };
  }

   

/******/
$scope.showImageOptions = imageOptions;

function imageOptions(ev){
  $mdBottomSheet.show({
    templateUrl: './themes/material/components/mapOptions.html',
    controller: 'ListBottomSheetCtrl'
  }).then(function(clickedItem) {
    $scope.alert = clickedItem['name'] + ' clicked!';
  });
}
/******/

function claimProperty(id){
  $state.go('claim',{id:id,city:$rootScope.currentCity});
}


  //Load Camera
  // document.addEventListener("deviceready", function () {

    // var options = {
    //   quality: 50,
    //   destinationType: Camera.DestinationType.DATA_URL,
    //   sourceType: Camera.PictureSourceType.CAMERA,
    //   allowEdit: true,
    //   encodingType: Camera.EncodingType.JPEG,
    //   targetWidth: 100,
    //   targetHeight: 100,
    //   popoverOptions: CameraPopoverOptions,
    //   saveToPhotoAlbum: false,
    // correctOrientation:true
    // };
    // // Hide Keyboard
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.close();
    // }
    // $scope.takePicture = function(){
    //   console.log('camera')
    //   $cordovaCamera.getPicture(options).then(function(imageData) {
        
    //     if($rootScope.currentParcel.images == undefined){
    //       $rootScope.currentParcel.images = [];
    //     }
    //     var image = new Image();
    //     image.src = "data:image/jpeg;base64," + imageData;
    //     $rootScope.currentParcel.images.push(image);
    //     console.log($rootScope.currentParcel.images);
    //     $mdToast.show(
    //         $mdToast.simple()
    //         .textContent("Image successfully loaded!")
    //         .position('top right')
    //         .hideDelay(3000)
    //       );
    //   }, function(err) {
    //     // error
    //   });
    // }

  // }, false);

	switch ($rootScope.currentCity) {
    case "philly":
        $rootScope.cityState = "Philadelphia, PA";
        break;
    case "dc":
        $rootScope.cityState = "Washington, DC";
        break;
    case "nyc":
        $rootScope.cityState = "New York, New York";
        break;
  }

  // $scope.getDCSale = function(address){
  //   var whereClause = "PROPERTY_ADDRESS='"+address+"'";
  //   var req = {
  //     method: 'GET',
  //     url: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/57/query',
  //     params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
  //   };
  //   $http(req)
  //   .success(function(data,status,headers,config){
  //     if($rootScope.currentParcel,data.features != false){
  //       $rootScope.currentParcel = _.merge($rootScope.currentParcel,data.features[0].attributes);
  //       $scope.salesData = true;
  //     }
  //     console.log("Datas!", $rootScope.currentParcel);
  //   })
  //   .error(function(data, status, headers, config){
  //     console.log("No Datas :(", data);
  //     $mdToast.show(
  //       $mdToast.simple()
  //       .textContent("No Sale Info for this property.")
  //       .position('top right')
  //       .hideDelay(3000)
  //     );
  //   });
  // }

  // $scope.getDCUseCode = function(code){
  //   var whereClause = "CODE='"+code+"'";
  //   var req = {
  //     method: 'GET',
  //     url: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query',
  //     params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
  //   };
  //   $http(req)
  //   .success(function(data,status,headers,config){
  //     if($rootScope.currentParcel,data.features != false){
  //       $rootScope.currentParcel.land_use = data.features[0].attributes;

  //     }
  //     console.log("Datas!", $rootScope.currentParcel);
  //   })
  //   .error(function(data, status, headers, config){
  //     console.log("No Datas :(", data);
  //     $mdToast.show(
  //       $mdToast.simple()
  //       .textContent("An error Occured.")
  //       .position('top right')
  //       .hideDelay(3000)
  //     );
  //   });
  // }

  

  $scope.getNeighborhood = function(x,y){
    
    var statement = "select * from azavea.philadelphia_neighborhoods where ST_Contains(the_geom, ST_GeomFromText('POINT("+x+" "+y+")',4326))";
    var req = {
      method: 'GET',
      url: 'https://azavea.carto.com/api/v2/sql',
      params: {q:statement}
    };
    $http(req)
    .success(function(data,status,headers,config){
      $rootScope.currentParcel.neighborhood = data.rows[0];

      // // Split WKB into array of integers (necessary to turn it into buffer)
      // var hexAry = $rootScope.currentParcel.neighborhood.the_geom.match(/.{2}/g);
      // var intAry = [];
      // for (var i in hexAry) {
      //   intAry.push(parseInt(hexAry[i], 16));
      // }
      // // console.log(intAry);
      // // Generate the buffer
      // var wkx = require('wkx');
      // var buf = new buffer.Buffer(intAry);

      // // Parse buffer into geometric object
      // var geom = wkx.Geometry.parse(buf);
      // var points = geom.toGeoJSON().coordinates[0][0];
      // $rootScope.currentParcel.neighborhood.geoJson = [];
      // angular.forEach(points,function(value, key){
      //     // $scope.results.push(value.raw);
      //     $rootScope.currentParcel.neighborhood.geoJson.push([value[0],value[1]]);
        
      // });
      // console.log($rootScope.currentParcel.neighborhood.geoJson);
      // console.log("Neighborhood!", $rootScope.currentParcel);
      
    })
    .error(function(data, status, headers, config){
      // console.log("No Neighborhood :(", data);
      $mdToast.show(
        $mdToast.simple()
        .textContent("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
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

  $scope.taxQuery = {
    order: 'tax_period',
    limit: 15,
    page: 1
  };

  if($rootScope.currentCity == "philadelphia" || $rootScope.currentCity == "philly"){
    //Check firebase
    $rootScope.currentCity = "philadelphia";
    vm.loadParcel($rootScope.parcel_id);
    var propref = firebase.database().ref().child($rootScope.currentCity).child($rootScope.parcel_id);
    $rootScope.currentParcel = $firebaseObject(propref);
    // window.FirebasePlugin.logEvent("parcl_load", {parcl: $rootScope.parcel_id});
    vm.unwatch = $rootScope.currentParcel.$watch(function(){
      $rootScope.subTitle = $rootScope.currentParcel.address;
      // console.log($rootScope.currentParcel);
      // console.log($rootScope.currentParcel);
      if($rootScope.currentParcel.$value == null)
        return true;
      if($rootScope.currentParcel.staticImageUrl === undefined){
        $rootScope.currentParcel.staticImageUrl = vm.getStaticImage($rootScope.currentParcel.socrata[0].coordinates.coordinates[0],$rootScope.currentParcel.socrata[0].coordinates.coordinates[1]);
        
        $rootScope.currentParcel.$save();
      }

      if($rootScope.currentParcel.lat === undefined){
        $rootScope.currentParcel.lng = $rootScope.currentParcel.socrata[0].coordinates.coordinates[1];
        $rootScope.currentParcel.lat = $rootScope.currentParcel.socrata[0].coordinates.coordinates[0];
        $rootScope.currentParcel.$save();
      }
      
      if($rootScope.currentParcel.permits !== undefined && $rootScope.currentParcel.permits != false){
        //sort permits
        _.sortBy($rootScope.currentParcel.permits, function(value){
          return new Date(value.permitissuedate);
        })
      }
      if($rootScope.currentParcel.violations !== undefined && $rootScope.currentParcel.violations != false){
        //sort violations
        _.sortBy($rootScope.currentParcel.violations, function(value){
          return new Date(value.caseresolutiondate);
        })
      }else{
        vm.loadParcel($rootScope.parcel_id);
      }
      if($rootScope.currentParcel.service_requests !== undefined && $rootScope.currentParcel.service_requests != false){
        //sort service_requests
        _.sortBy($rootScope.currentParcel.service_requests, function(value){
          return new Date(value.sr_resolutiondate);
        })
      }
      if($rootScope.currentParcel.taxes !== undefined && $rootScope.currentParcel.totalTaxes === undefined){
        //sort service_requests
        $rootScope.currentParcel.totalTaxes = _.sumBy($rootScope.currentParcel.taxes,'total');
        $rootScope.currentParcel.$save();
        
      }

      
    });
    
    var nRef = $firebaseObject(propref.child('neighborhood'));
    vm.unwatchNeigborhood = nRef.$watch(function(){
      if($rootScope.currentParcel.neighborhood){
        var news = firebase.database().ref().child('news');
        $rootScope.allNews = $firebaseArray(news);
        $rootScope.allNews.$loaded().then(function(){
          $scope.parclNews = _.remove($rootScope.allNews,function(o){ return _.find(o,{neighborhood:$rootScope.currentParcel.neighborhood.name})})
        });
        vm.unwatchNeigborhood = null;
      }
    });

    var parclprops = firebase.database().ref().child('opps');
    $rootScope.parclprops = $firebaseArray(parclprops);
    $rootScope.parclprops.$loaded().then(function(){
    });
  }

  vm.getStaticImage = function(x,y){
    var gkey = "AIzaSyCiwD9Lpecc4zSBYYffME6D-LbeyjLrXV0";
    return "https://maps.googleapis.com/maps/api/staticmap?currentParceler="+y+","+x+"&markers=color:green%7C"+y+","+x+"&zoom=18&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:road%7Chue:0x006eff&style=feature:water%7Chue:0x004cff%7Clightness:-45&key="+gkey;
  }

  function loadParcel(id){
    var req = {
      method: 'GET',
      // url:'https://data.phila.gov/resource/tqtk-pmbv.json',
      url: 'https://x.emelle.me/jsonservice/Parcl/loadParcel',
      params: {parcel_number:id}
    };

    $http(req)
    .success(function(data,status,headers,config){
      if(data.response.status != true){
        //to do: show alert dialog
        var a1 =
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Maintenance')
            .textContent("Hmm, we can't seem to find that property.")
            .ariaLabel('Alert Dialog')
            .ok('Ok')
        $mdDialog.show(a1).then(function() {
          $state.go('m');
        });
      }
      // $rootScope.currentParcel.socrata = data;
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

  function NoteDialogController($rootScope,scope, $mdDialog,item) {
    var ref = firebase.database().ref().child($rootScope.currentCity).child($rootScope.parcel_id).child('notes');
    scope.newStatus={};
    scope.status = $firebaseArray(ref);


    scope.status.$loaded().then(function() {
      // console.log(scope.status);  // "Marie Curie"
      if(scope.status.length <1){
        // window.FirebasePlugin.logEvent("parcl_note_save", {parcl: $rootScope.parcel_id});
      }
    });

    
    scope.hide = function() {
      $mdDialog.hide();
    };
    scope.cancel = function() {
      $mdDialog.cancel();
    };
    scope.answer = function(answer) {
      // console.log(answer)
      if(answer == "save"){
        
        scope.newStatus.parcel_number = $rootScope.currentParcel.$id;
        scope.newStatus.by = $rootScope.fireUser.uid;
        scope.newStatus.category = $rootScope.noteCategory;
        scope.newStatus.timestamp = firebase.database.ServerValue.TIMESTAMP;
        
        scope.status.$add(scope.newStatus).then(function(snap){
          $mdToast.show(
            $mdToast.simple()
            .textContent("Note Added!")
            .position('top right')
            .hideDelay(3000)
          );
          // console.log(snap);

        });

        
      }
      $mdDialog.hide(answer);
    };
  }

});
