"use strict";
angular
  .module('materialApp').controller('PropertyCtrl', function(fbStorage,$rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,$cordovaCamera) {
	$rootScope.currentCity = $state.params.city;
	$rootScope.parcel_id = $state.params.id;
  $rootScope.subTitle = "";
  $rootScope.searching = false;
  $scope.salesData = false;
  this.items = [];
  console.log('log it');

  for (var i = 0; i < 1000; i++) {
    this.items.push(i);
  }
  //Load Camera
  document.addEventListener("deviceready", function () {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };

    $scope.takePicture = function(){
      console.log('camera')
      $cordovaCamera.getPicture(options).then(function(imageData) {
        
        if($rootScope.currentParcel.images == undefined){
          $rootScope.currentParcel.images = [];
        }
        var image = new Image();
        image.src = "data:image/jpeg;base64," + imageData;
        $rootScope.currentParcel.images.push(image);
        console.log($rootScope.currentParcel.images);
        $mdToast.show(
            $mdToast.simple()
            .content("Image successfully loaded!")
            .position('top right')
            .hideDelay(3000)
          );
      }, function(err) {
        // error
      });
    }

  }, false);

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

$scope.getDCSale = function(address){
  var whereClause = "PROPERTY_ADDRESS='"+address+"'";
  var req = {
      method: 'GET',
      url: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/57/query',
      params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
    };
    $http(req)
    .success(function(data,status,headers,config){
      if($rootScope.currentParcel,data.features != false){
        $rootScope.currentParcel = _.merge($rootScope.currentParcel,data.features[0].attributes);
        $scope.salesData = true;
      }
      console.log("Datas!", $rootScope.currentParcel);
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
}

$scope.getDCUseCode = function(code){
  var whereClause = "CODE='"+code+"'";
  var req = {
      method: 'GET',
      url: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query',
      params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
    };
    $http(req)
    .success(function(data,status,headers,config){
      if($rootScope.currentParcel,data.features != false){
        $rootScope.currentParcel.land_use = data.features[0].attributes;

      }
      console.log("Datas!", $rootScope.currentParcel);
    })
    .error(function(data, status, headers, config){
      console.log("No Datas :(", data);
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
}

$scope.getCharacteristics = function(id){
  var req = {
    method: 'GET',
    url: 'https://data.phila.gov/resource/tqtk-pmbv.json',
    headers: {'Content-Type': 'application/x-www-form-urlencoded','X-App-Token':'D3weSV9XH75ieSxloQwC1Tscl'},
    params: {parcel_number:id}
  };
  $http(req)
  .success(function(data,status,headers,config){
    $rootScope.currentParcel.characteristics = _.merge($rootScope.currentParcel.characteristics,data[0])
    console.log("Characteristics!", $rootScope.currentParcel);
  })
  .error(function(data, status, headers, config){
    console.log("No Datas :(", data);
    $mdToast.show(
      $mdToast.simple()
      .content("An error Occured.")
      .position('top right')
      .hideDelay(3000)
    );
  });
}
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
        // console.log("Neighborhood!", $rootScope.currentParcel);
        
        
      })
      .error(function(data, status, headers, config){
        console.log("No Neighborhood :(", data);
        $mdToast.show(
          $mdToast.simple()
          .content("An error Occured.")
          .position('top right')
          .hideDelay(3000)
        );
      });
    }

if($rootScope.currentCity == "philly"){

	if(!isNaN($rootScope.parcel_id) && angular.isNumber(+$rootScope.parcel_id)){
		var url = "http://api.phila.gov/opa/v1.1/account/"+$rootScope.parcel_id+"?format=json";
	}else{
		var url = "http://api.phila.gov/opa/v1.1/address/"+$rootScope.parcel_id+"/?format=json";

	}  
		
    $http.get(url)
    .success(function(response){
      $scope.searching = false;
      var r = response;
      if(!isNaN($rootScope.parcel_id) && angular.isNumber(+$rootScope.parcel_id)){
        $scope.results = [r.data.property];
        $rootScope.currentParcel = r.data.property;
      }else{
        $scope.results = r.data.properties;
        $rootScope.currentParcel = r.data.properties[0];
      }

      //Get Charcteristcs and merge
      $scope.getCharacteristics($rootScope.parcel_id);
      $scope.getNeighborhood($rootScope.currentParcel.geometry.x,$rootScope.currentParcel.geometry.y);
      $rootScope.subTitle = $sce.trustAsHtml("<b>"+$rootScope.currentParcel.full_address+"</b><br>"+$rootScope.cityState+" "+$rootScope.currentParcel.zip.substring(0,5));
      $rootScope.subTitleClass = "prop-detail";
      console.log($scope.results);
      $rootScope.currentParcel.staticImageUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&markers=color:green%7C"+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&zoom=18&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:landscape|color:0x080504&style=feature:poi|visibility:off&style=feature:landscape.man_made|visibility:off&style=feature:road|visibility:simplified";
      fbStorage.updateHistory($rootScope.parcel_id,$rootScope.currentCity);

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
}else{
  if($rootScope.currentParcel == null){
    //Get Parcel http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query?where=CODE+%3D+126&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson
    var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcel/getParcel',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: {q:$rootScope.parcel_id,city:$rootScope.currentCity}
    };
    $http(req)
    .success(function(data,status,headers,config){
      // console.log("Parcel id found!", data.response[0].ID);
      if(data.response["block"] != undefined){
        //Search by block 
        $rootScope.searchByBlock(data.response["block"]);
      }else{
        if($rootScope.currentCity == 'dc'){
          $rootScope.parcelId = data.response[0].ID;

          if(data.response.length > 1){
            //show list
            $scope.showList(data.response);
          }else{
            $rootScope.currentParcel = data.response[0];
          }
          $rootScope.subTitle = $sce.trustAsHtml("<b>"+$rootScope.currentParcel.PremiseAdd+"</b><br>"+$rootScope.cityState+" "+$rootScope.currentParcel.Zip.substring(0,5));
      
          $rootScope.currentParcel.staticImageUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&markers=color:green%7C"+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&zoom=15&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:landscape|color:0x080504&style=feature:poi|visibility:off&style=feature:landscape.man_made|visibility:off&style=feature:road|visibility:simplified";
          $scope.getDCUseCode($rootScope.currentParcel.UseCode);
          $scope.getDCSale($rootScope.currentParcel.PremiseAdd);
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
  }else{
    $rootScope.currentParcel.staticImageUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&markers=color:green%7C"+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&zoom=15&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:landscape|color:0x080504&style=feature:poi|visibility:off&style=feature:landscape.man_made|visibility:off&style=feature:road|visibility:simplified";
    $scope.getDCUseCode($rootScope.currentParcel.UseCode);
    $scope.getDCSale($rootScope.currentParcel.PremiseAdd);
  }
}  
});
