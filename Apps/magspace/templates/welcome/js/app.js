

app.controller("welcome_ctrl",['$scope','$rootScope','$controller','$location','$http','$translate','$compile','$interval','$timeout','$msThemes','$mdDialog',  function($scope,$rootScope,$controller,$location,$http,$translate,$compile,$interval,$timeout,$msThemes,$mdDialog){
 	
    $scope.app = {
		appName  : welcome.configs.name,
		appVerion: welcome.configs.version,
		Systeme  : {
					projets: {list : {}, prop : {selected:null}},  // Liste des projets
					user   : null,
					prop   : { // Propriétés
								clock:{hour:"00",min:"00",sec:"00"}
						 	 }
		},
		projets : loadAll(),
        autocomplete : {
        	searchTextChange: function(text) {
		      //alert('Text changed to ' + text);
		    },
		    selectedItemChange : function(item) {
		      //alert('Item changed to ' + JSON.stringify(item));
		    },
		    querySearch : function (tab, query) {
		      var results = query ? tab.filter( this.createFilterFor(query) ) : tab,
		          deferred;
		      if (self.simulateQuery) {
		        deferred = $q.defer();
		        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
		        return deferred.promise;
		      } else {
		        return results;
		      }
		    },
		    createFilterFor : function (query) {
		      var lowercaseQuery = angular.lowercase(query);

		      return function filterFn(state) {
		        return (state.value.indexOf(lowercaseQuery) === 0);
		      };
		    }
        },
		init: function(){
			$this = this;
			
			$rootScope.appRoot.check(welcome.templates.welcome, welcome.templates.editor, ["project"]);
			// welcome.closeWindowsLoader();
		},
		enterEdit : function(action,project){
			$rootScope.appRoot.save("project", project);
			$rootScope.appRoot.addTemplate(welcome.templates.editor);
		},
		openProfile : function(){
			var somedialog = document.getElementById("somedialog"),
				dlg = new DialogFx( somedialog );
				dlg.toggle(dlg);
		},
		openProfile : function(ev) {
		    $mdDialog.show({
		      controller: this.DialogController,
		      templateUrl: "templates/welcome/template/"+welcome.device.type+"/profile.html",
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: false // Only for -xs, -sm breakpoints.
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		},
		DialogController : function($scope, $mdDialog) {
		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.answer = function(answer) {
		      $mdDialog.hide(answer);
		    };
		}

	}

	$rootScope.welcome_ctrl = $scope.app;
	
	function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

}]);

