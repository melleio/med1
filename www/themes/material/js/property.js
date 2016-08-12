"use strict";
ang.controller('PropertyCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray) {
	$rootScope.currentCity = $state.params.city;
	$rootScope.parcel_id = $state.params.id;
	$rootScope.subTitle = " - Results";
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
      console.log($scope.results);
      $rootScope.currentParcel.staticImageUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&markers=color:green%7C"+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&zoom=18&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:landscape|color:0x080504&style=feature:poi|visibility:off&style=feature:landscape.man_made|visibility:off&style=feature:road|visibility:simplified";
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

});