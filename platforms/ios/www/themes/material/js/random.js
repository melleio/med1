if(!isNaN($rootScope.parcel_id) && angular.isNumber(+$rootScope.parcel_id)){
    var pref = firebase.database().ref().child($rootScope.currentCity).child($rootScope.parcel_id)
    $rootScope.parcel = $firebaseObject(pref);
    $rootScope.parcel.$loaded().then(function(){
      // Check for google data
      if($rootScope.parcel.gdata === undefined){
        var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBfdI61qNxrgQ2qqXXyIKjMbRdi19HkjtY&address="+$rootScope.parcel.full_address+", "+$rootScope.parcel.zip+"&format=json";
      
          $http.get(url)
          .success(function(response){
            $scope.searching = false;
            $rootScope.parcel.gData = response.results[0];
            $rootScope.parcel.$save();
            console.log($rootScope.parcel);
            $mdToast.show(
              $mdToast.simple()
              .textContent("Update.")
              .position('top right')
              .hideDelay(3000)
            );

            // processGoogleResults(response.results[0],false);
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
      console.log($rootScope.parcel);
    });
		var url = "http://api.phila.gov/opa/v1.1/account/"+$rootScope.parcel_id+"?format=json";
	}else{
		var url = "http://api.phila.gov/opa/v1.1/address/"+$rootScope.parcel_id+"/?format=json";
	}  