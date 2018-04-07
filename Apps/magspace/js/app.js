document.body.setAttribute("ng-app", "app");
document.body.setAttribute("ng-controller", "root");

var app = angular.module('app', ['pascalprecht.translate','ms-themes','ngAnimate', 'ngMaterial']);


app.config(function($translateProvider, $mdThemingProvider) {
        
        // Récupération du dictionnaire de langue dans les différents fichier de langue .json du repertoire "/ressources/lang/"
        $translateProvider
        .useStaticFilesLoader({
            prefix: 'ressources/lang/',
            suffix: '.json'
        })

        // choix de la langue par défaut
        $translateProvider.preferredLanguage(welcome.lang);

});

app.controller("root",['$scope','$rootScope','$translate','$compile','$msThemes','$timeout','$controller',function($scope,$rootScope,$translate,$compile,$msThemes,$timeout,$controller){
           $this = this;
           $scope.init = function(){
                angular.extend($this, $controller('rootApp', {$scope: $scope,$rootScope:$rootScope,$translate:$translate,$compile:$compile,$msThemes:$msThemes,$timeout:$timeout,$controller:$controller}));
           };
}]);


app.controller("rootApp",['$scope','$rootScope','$translate','$compile','$msThemes','$timeout','$controller',function($scope,$rootScope,$translate,$compile,$msThemes,$timeout,$controller){
    $rootScope.appRoot = {
            lang:welcome.lang,
            configs:welcome.configs,
            datas : {},
            init : function(){
              $this = this;

              msTheme.swiper = new Swiper('.swiper-container', {
                     pagination: '.swiper-pagination',
                     slidesPerView: 1,
                     paginationClickable: true,
                     // direction: "vertical",
                     shortSwipes : false,
                     noSwipingClass:"global-container",
                     noSwiping : true,
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
              msTheme.swiper.on('slideChange', function () {
                //alert("Previous : "+msTheme.swiper.previousIndex+"  Active : "+msTheme.swiper.activeIndex);
                var activePage = msTheme.pages[msTheme.swiper.activeIndex];

                if(msTheme.hideNavsTo.indexOf(activePage) >= 0){
                    $(".swiper-button-next,.swiper-button-prev").css({"visibility":"hidden"});
                }
                else
                    $(".swiper-button-next,.swiper-button-prev").css({"visibility":"visible"});

              });

            
              $this.addTemplate(welcome.templates.startup);
              welcome.personnalize();
              
              // Re-Chargement des données ....
              // Toutes les données sont chargées dans le appRoot via la méthode save() de celui-ci
              $rootScope.appRoot.datas = JSON.parse($this.getLocalStorage("ms-app-data"));
              if(!$rootScope.appRoot.datas) $rootScope.appRoot.datas = {};
              for(var id in $rootScope.appRoot.datas){
                $rootScope.appRoot[id] = $rootScope.appRoot.datas[id];//alert("id = "+id+" ; data = "+$rootScope.appRoot[id]);
              }

            },
            renderPage : function(id){
                if(msTheme.renderPage(id))
                /* Welcome template */ angular.element(document.getElementById(id)).append($compile('<ms-page class="ms-page" titre="'+id+'" url="templates/'+id+'/index'+'-'+welcome.device.type+'.html"></ms-page>')($scope));
            },
            addTemplate : function(template){
                if(msTheme.pages.indexOf(template)<0)
                   welcome.showWindowsLoader();

                this.renderPage(template);
            },
            changeLang :function(lg){
                $translate.use(lg);
            },
            save : function(key, data){
              $this = this;
              // Enregistre les données dans le appRoot et dans la session
              $rootScope.appRoot[key] = data;
              $rootScope.appRoot.datas[key] = data;
              $this.setLocalStorage("ms-app-data",$rootScope.appRoot.datas);
            },
            refreshApp : function(){
              $this = this;
              $this.setLocalStorage("ms-app-data", {});
            },
            setLocalStorage : function(lname, lvalue){
                var storage = window.localStorage;

                try{
                    storage.setItem(lname, JSON.stringify(lvalue));
                }catch(err){ 
                  storage.setItem(lname, lvalue);
                }

            },
            getLocalStorage : function(lname){
                var storage = window.localStorage;

                return storage.getItem(lname);
            },
            check : function(level, next, datasCheck){
              $this = this;

              if(Object.keys($rootScope.appRoot.datas).length > 0 && appData.save.pages){ 
                 var isDatas = true;

                  if(datasCheck){
                    for(var i = 0; i < datasCheck.length; i++){//alert($rootScope.appRoot[datasCheck[i]]);
                      if(!$rootScope.appRoot[datasCheck[i]])
                        isDatas = false;
                    }
                  }
                 

                  if(isDatas)
                    $rootScope.appRoot.addTemplate(next);
                  else
                    welcome.closeWindowsLoader();
              }
              else{
                 welcome.closeWindowsLoader();
              }

            }
        }
        $scope.appRoot.init();
}]);

document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);