

app.controller("welcome_ctrl",['$scope','$rootScope','$controller','$location','$http','$translate','$compile','$interval','$msThemes', function($scope,$rootScope,$controller,$location,$http,$translate,$compile,$interval,$msThemes){
    
	$scope.app = {
		init:function(){
			$(".welcome-global-container").scroll(function(){
	                if ($(".welcome-global-container").scrollTop() >= 200) {
	                   $('.nav').addClass('fixed-header');
	                }
	                else {
	                   $('.nav').removeClass('fixed-header');
	                }
	        });
		},
		renderPage(id){
			if(msTheme.renderPage(id))
            /* Welcome template */ angular.element(document.getElementById(id)).append($compile('<ms-page class="ms-page" titre="'+id+'" url="templates/'+id+'/index'+'-'+welcome.device.type+'.html"></ms-page>')($scope));
        
        },
        addTemplate : function(url){
            this.renderPage(welcome.templates[url]);
        }
			
	}
	$scope.app.init();

}]);

