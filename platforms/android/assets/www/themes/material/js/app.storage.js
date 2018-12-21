'use strict';

    angular
        .module('materialApp')
        .factory('fbStorage', storage);

    function storage($firebaseAuth,$mdDialog,$rootScope,$mdMedia,$mdToast,$state,$http) {
    	var config = {
			apiKey: "AIzaSyCmzpXA9l45E9DthYOVtdIFEYrgGD5fS-Q",
			authDomain: "project-5024312928467115441.firebaseapp.com",
			databaseURL: "https://project-5024312928467115441.firebaseio.com",
			storageBucket: "project-5024312928467115441.appspot.com",
		};
		firebase.initializeApp(config);

		var auth = $firebaseAuth();
		var service = {};

		service.onAuthChange = authChange;
		service.emailAuth = emailAuth;
		service.anonAuth = anonAuth;
		service.authWithToken = authWithToken;
		// service.signIn = signIn;
		service.searchHistoryAdd = historyAdd;
		service.mapHistoryAdd = maphistoryAdd;
		service.getParcl = getParcl;
		service.checkCode = checkCode;
		service.signOut = signOut;
		service.register = register;
		service.setParcelNote = setParcelNote;
		service.updateHistory = updateHistory;
		service.pushLocation = pushLocation;
		service.savefcmToken = savefcmToken;

		function savefcmToken(token){
			var newLocation = firebase.database().ref("users/"+$rootScope.fireUser.uid+"/fcmToken").set(token);
		}

		function checkCode(code,phone){
			var req = {
		      method: 'GET',
		      url: 'https://x.emelle.me/jsonservice/Parcl/checkCode',
		      params: {phone:phone,code:code}
		    };
		    $http(req)
		    .success(function(data,status,headers,config){
		      authWithToken(data.response.token);
		    })
		    .error(function(data, status, headers, config){
		    	console.log(data);
		      $mdToast.show(
		        $mdToast.simple()
		        .content("Invalid")
		        .position('top right')
		        .hideDelay(2000)
		      );
		    });
		}

		function getParcl(parcelid,city){
			// check local storage
			var parcl = $rootScope.storage.getItem('parcl_'+parcelid);
    		if(parcl == null){
    			//Check firebase
				firebase.database().ref(city+'/'+parcelid).once('value', function(snapshot) {
					parcl = snapshot.val();
					$rootScope.storage.setItem("parcl_"+parcelid,JSON.stringify(snapshot.val()));
					return parcl;
				});
			}else{
				return parcl;
			}
			
		}

		/*
		address:property.full_address,
      zip:property.zip,
      parcelid:property.account_number,
      geometry:property.geometry
       */
		function historyAdd(r){
			if($rootScope.searchHistory == null){
				$rootScope.searchHistory = [];
			}
			_.pull($rootScope.searchHistory, _.find($rootScope.searchHistory,["formatted_address",r.formatted_address]));
			$rootScope.searchHistory.push(r);

			//Save to localStorage
			$rootScope.storage.setItem("parcl_searchHistory",JSON.stringify($rootScope.searchHistory));
		}

		function maphistoryAdd(r){
			if($rootScope.mapSearchHistory == null){
				$rootScope.mapSearchHistory = [];
			}
			$rootScope.mapSearchHistory.push(r);
			firebase.database().ref($rootScope.currentCity+'/'+r.parcel_number).update(r);
			//Save to localStorage
			$rootScope.storage.setItem("parcl_mapSearchHistory",JSON.stringify($rootScope.mapSearchHistory));
		}

		function pushLocation(location){
			if($rootScope.fireUser == null){
				return true;
			}
			var ld = {};
			ld.accuracy = location.coordinates.accuracy;
			ld.lat = location.coordinates.latitude;
			ld.lng = location.coordinates.longitude; 
			ld.timestamp = firebase.database.ServerValue.TIMESTAMP;
			ld.location  = location;
			var newLocation = firebase.database().ref("users/"+$rootScope.fireUser.uid+"/locations").push();
			newLocation.set(ld);
			return newLocation.key;
		}

		function authChange(){
			
			auth.$onAuthStateChanged(function(firebaseUser) {
				if(firebaseUser == null){
					$rootScope.fireUser = null;
					if($state.$current.name != "login"){
						$state.go("login");
					}
					return true;
				}
				$rootScope.waitForCode = false;
      			$rootScope.storage.setItem('waitForCode',$rootScope.waitForCode);
				$rootScope.fireUser = firebaseUser;
				if($state.$current.name == "login"){
					$state.go('m/0/0');
				}
				// console.log($state.$current.name);
				// $mdToast.show(
		  //         $mdToast.simple()
		  //         .content("Success!")
		  //         .position('top left')
		  //         .hideDelay(1000)
		  //       );
				// var fcmT = $rootScope.storage.getItem('fcmToken');
				// if(fcmT == null){
				// 	window.FirebasePlugin.getToken(function(token){
				// 	  //Send token to server
				// 	  $rootScope.fcmToken = token;
				// 	  service.savefcmToken(token);
				// 	  $rootScope.storage.setItem("fcmToken",JSON.stringify(token));
				// 	},function(error){
				// 	  console.log(error);
				// 	});

				// 	window.FirebasePlugin.onTokenRefresh(function(token) {
				// 	// save this server-side and use it to push notifications to this device
				// 	    console.log(token);
				// 	    $rootScope.fcmToken = token;
				// 	    service.savefcmToken(token);
				// 	    $rootScope.storage.setItem("fcmToken",JSON.stringify(token));
				// 	}, function(error) {
				// 	    console.error(error);
				// 	});
				// }else{
				// 	$rootScope.fcmToken = JSON.parse(fcmT);
				// }

				// //Set User id in FCM
				// window.FirebasePlugin.setUserId(firebaseUser.uid);
				// var settings = {
				//     developerModeEnabled: true
				// }
				// window.FirebasePlugin.setConfigSettings(settings);
			})
		}

		function updateHistory(parcelid,city){
			return firebase.database().ref(city+'/'+parcelid).update($rootScope.currentParcel);
		}

		function emailAuth(email,password){
			auth.$signInWithEmailAndPassword(email,password).then(function(firebaseUser){
	          console.log(firebaseUser) 
	        }).catch(function(error){
	          console.log(error);
	        })
		}

		function authWithToken(token){
			auth.$signInWithCustomToken(token).then(function(firebaseUser){
	          console.log(firebaseUser) 
	          $rootScope.fireUser = firebaseUser;
	          $rootScope.waitForCode = false;
      			$rootScope.storage.setItem('waitForCode',$rootScope.waitForCode);
	        }).catch(function(error){
	          console.log(error);
	        })
		}

		function anonAuth(){
			auth.$signInAnonymously().then(function(firebaseUser){
	          // console.log(firebaseUser) 
	          $rootScope.fireUser = firebaseUser;
	        }).catch(function(error){
	          console.log(error);
	        })
		}

		function signOut(){
			auth.$signOut();
		}

		function register(firstName,email,pass){
			auth.$createUserWithEmailAndPassword(email,pass).then(function(firebaseUser){
				console.log(firebaseUser);
				$mdToast.show(
		          $mdToast.simple()
		          .content("Success!")
		          .position('top left')
		          .hideDelay(1000)
		        );
		        //write user first name and email to user space
		        firebase.database().ref("users/"+firebaseUser.uid).update({
		        	firstName:firstName,
		        	email:email
		        });
				service.emailAuth(email,pass);
			}).catch(function(error){
				console.log(error);
				$mdToast.show(
		        $mdToast.simple()
		        .content("Error: ")
		        .position('bottom left')
		        .hideDelay(3000)
		      );
			})
		}

		function setParcelNote(parcelid,city){
			firebase.database().ref(city+'/'+parcelid+'/notes').once('value', function(snapshot) {
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


		return service;
    }

    