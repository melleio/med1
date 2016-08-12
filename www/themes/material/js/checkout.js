"use strict";
ang.controller('CheckoutController', 
	function($rootScope,$scope,$location,$mdDialog){
		var vm = this;
		$rootScope.additionalServices =[];
		var parentEl = angular.element(document.body);
		$rootScope.addonservices=[
	        {name:"Laundry",value:10,amount:1},
	        {name:"Refridgerator",value:10,amount:1},
	        {name:"Basement",value:10,amount:1},
	        {name:"Baseboard",value:10,amount:1},
	        {name:"Carpet",value:10,amount:1},
	        ]
		$scope.loadParcelTypes = function() {
		// Use timeout to simulate a 650ms request.
			$scope.parcel_types = [
			  {value:0,disabled:false,selected:false,name: "Residential/Office"},
			  {value:1,disabled:true,selected:false,name: "Commercial"},
			  {value:2,disabled:true,selected:false,name: "Other"}
			];
		}

		$scope.removeAdditionalItem=function (item, list) {
			
			list.splice(item, 1);

			$rootScope.additionalServices = list;
			$rootScope.additionalServicesTotal =0;
				angular.forEach(list, function(v, k) {
        		$rootScope.additionalServicesTotal += v.value;
        	});
		};
		vm.additionalServices = function($event){
			$mdDialog.show({
				parent: parentEl,
				targetEvent: $event,
				templateUrl:
				 './themes/material/components/additionalServices.html',
				locals: {
				},
				controller: DialogController,
				clickOutsideToClose: true,
				escapeToClose: false
			});
		}

		function DialogController(scope, $mdDialog) {
	        scope.contact = {};

	        // scope.isChecked=function(){
	        // 	//sum checked
	        // 	$rootScope.additionalServicesTotal = 0;
	        // 	angular.forEach(_.map($rootScope.services, function(v, k) {
	        // 		$rootScope.additionalServicesTotal += $rootScope.addonservices[k].value;
	        // 	});
	        	
	        // }

	        scope.selected = $rootScope.additionalServices;
			scope.toggle = function (item, list) {
				var idx = list.indexOf(item);
				if (idx > -1) {
				  list.splice(idx, 1);
				}
				else {
				  list.push(item);
				}
				$rootScope.additionalServices = list;
				$rootScope.additionalServicesTotal =0;
					angular.forEach(list, function(v, k) {
	        		$rootScope.additionalServicesTotal += v.value;
	        	});
			};
			scope.exists = function (item, list) {
				return list.indexOf(item) > -1;
			};
			scope.isIndeterminate = function() {
				return (scope.selected.length !== 0 &&
			    scope.selected.length !== $rootScope.addonservices.length);
			};
			scope.isChecked = function() {
				return scope.selected.length === $rootScope.addonservices.length;
			};
			scope.toggleAll = function() {
				if (scope.selected.length === $rootScope.addonservices.length) {
				  scope.selected = [];
				} else if (scope.selected.length === 0 || scope.selected.length > 0) {
				  scope.selected = $rootScope.addonservices.slice(0);
				}
			};
	        
	        scope.hide = function() {
	          $mdDialog.hide();
	        }
	    }


		vm.myDate = new Date();
		vm.minDate = vm.myDate;
	  	vm.maxDate = new Date(
		vm.myDate.getFullYear(),
		vm.myDate.getMonth() + 2,
		vm.myDate.getDate());
		vm.config = {
			"bedrooms":[1,2,3,4,5,6,7,8],
			"bathrooms":[0,1,2,3,4,5,6,7,8]
		};

		vm.save = function(){
			vm.newReqDiag = function($event){
		    	var confirm = $mdDialog.confirm()
			          .title('Work in Progress')
			          .textContent('We are cleaning out the bugs with our new site. Thank you for your patience!')
			          .ariaLabel('Lucky day')
			          .targetEvent($event)
			          .ok('OK!')
			          .cancel('Back');
			    $mdDialog.show(confirm).then(function() {
			      vm.commercialCB = false;
			    }, function() {
			      vm.commercialCB = false;
			    });
			}
		}

	    // establish reference
	    console.log('loaded home');
	    vm.commercialChecked = function($event){
	    	var confirm = $mdDialog.confirm()
		          .title('For Our Commercial Cleaning Services')
		          .textContent('Please call us at 215-240-1197')
		          .ariaLabel('Lucky day')
		          .targetEvent($event)
		          .ok('OK!')
		          .cancel('Back');
	    $mdDialog.show(confirm).then(function() {
	      vm.commercialCB = false;
	    }, function() {
	      vm.commercialCB = false;
	    });
	    }
	    

	});