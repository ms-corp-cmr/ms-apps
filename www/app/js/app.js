document.body.setAttribute("ng-app", "app");
document.body.setAttribute("ng-controller", "root");

var app = angular.module('app', ['pascalprecht.translate','ms-themes']);


app.config(function($translateProvider) {
        
        // Récupération du dictionnaire de langue dans les différents fichier de langue .json du repertoire "/ressources/lang/"
        $translateProvider
        .useStaticFilesLoader({
            prefix: '/ressources/lang/',
            suffix: '.json'
        })

        // choix de la langue par défaut
        $translateProvider.preferredLanguage(welcome.lang);
        
});

app.controller("root",['$scope','$rootScope','$translate','$compile','$msThemes','$timeout',function($scope,$rootScope,$translate,$compile,$msThemes,$timeout){
           
        $rootScope.appRoot = {
            lang:welcome.lang,
            configs:welcome.configs,
            init : function(){
                msTheme.swiper = new Swiper('.swiper-container', {
                       pagination: '.swiper-pagination',
                       slidesPerView: 1,
                       paginationClickable: true,
                       loop: false,
                       paginationBulletRender: function (index, className) {
                            return "";
                       },
                       pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                       },
                       navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                       }
                });
                this.addTemplate();
            },
            renderPage(id){
                if(msTheme.renderPage(id))
                /* Welcome template */ angular.element(document.getElementById(id)).append($compile('<ms-page class="ms-page" titre="'+id+'" url="templates/'+id+'/index'+'-'+welcome.device.type+'.html"></ms-page>')($scope));
            
            },
            addTemplate : function(){
                this.renderPage(welcome.templates.welcome);
            },
            closeWindowsLoader : function(){
                $(".content-page").css({'display': 'block'}); 
                $timeout(function () {
                    $(".loader-page").animate({'margin-left': '-150%'}, "fast",function(){
                        $(".loader-page").css({'display': 'none'}); 
                    }); 
                }, 200);
               
            },
            showWindowsLoader : function(){
                $(".loader-page").css({'z-index': '100000000000000000000'});
                $(".loader-page").animate({'margin-left': '0%'}, "slow",function(){}); 
            },
            changeLang :function(lg){
                this.lang = lg;
                $translate.use(lg);
            }
        }
        $scope.appRoot.init();
}]);

