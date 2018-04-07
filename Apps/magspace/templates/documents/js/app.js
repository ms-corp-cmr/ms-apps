
app.controller("documents_ctrl",['$scope','$rootScope','$controller','$location','$http','$translate','$compile','$interval','$msThemes', '$mdSidenav','$mdDialog', function($scope,$rootScope,$controller,$location,$http,$translate,$compile,$interval,$msThemes,$mdSidenav,$mdDialog){

	$scope.app = {
		theme : welcome.configs.theme,
		init : function(){
			welcome.closeWindowsLoader();
		},
		gotoEditor : function(){
			msTheme.swiper.slidePrev();
		}
	}

	$rootScope.serverApp = $scope.app;

}]);
