

app.controller("page_ctrl",['$scope','$rootScope','$controller','$location','$http','$translate','$compile','$interval','$msThemes', function($scope,$rootScope,$controller,$location,$http,$translate,$compile,$interval,$msThemes){
    
	$scope.app = {
		init:function(){

		},
		addPage :function(url){
			var title = welcome.templates[url];
			//if(!(document.getElementById("ms-page-"+title))){
				url = 'templates/'+title+'/index'+'-'+welcome.device.type+'.html';
				angular.element(document.getElementById("app-container")).append($compile('<ms-page class="ms-page" titre="'+title+'" url="'+url+'"></ms-page>')($scope));
			/*}
			else{
				$msThemes.navigate(title);
			}
			*/
		}
			
	}

	$scope.app.init();

}]);

