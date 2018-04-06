/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(window,angular,undefined) {

    'use strict';
    
    var msModules = angular.module('ms-themes', []);
    var msPages = {root:"",list:[],history:[],current:"",previous:"",state:false};;
   
                  
        msModules.directive("msPage", function() {
        
            var Controller = function( $scope, $rootScope, $element, $attrs, $transclude, $timeout, $interval, $compile,$location) {
              
              $rootScope.app = {
                page : {"id":"","url":($attrs['url']?$attrs['url']:'')},
                msPages : null,
                template : '',
                init:function(){
                  this.page.id = "ms-page-"+$attrs['titre'];
                  this.template = '<div ng-include="\''+this.page.url+'\'" id="'+this.page.id+'"></div>';
                  if(msPages.list.indexOf($attrs['titre']) < 0){ // Nouvelle page
                    if(msPages.list.length == 0){ // Première page
                      msPages.root = $attrs['titre'];
                      msPages.history.push($attrs['titre']);
                      var nav_pages_controllers =  '<div class="ms-page-navigation">';
                          nav_pages_controllers += '<i class="fa left fa-arrow-left" aria-hidden="true" ng-click="app.previousPage()"></i>';
                          nav_pages_controllers += '<i class="fa right fa-arrow-right" aria-hidden="true" ng-click="app.nextPage()"></i>';
                          nav_pages_controllers += '</div>';
                      angular.element(document.body).append($compile(nav_pages_controllers)($scope));
                    }

                    msPages.current = $attrs['titre'];
                    msPages.list.push($attrs['titre']);

                    this.render();
                    this.navControls();
                  }
                  else{
                    this.template = '<div></div>';
                    this.render();
                    $element[0].style.display = "none";

                    var page =  $attrs['titre'];
                    for(var i=0;i<msPages.list.length;i++){
                      document.getElementById("ms-page-"+msPages.list[i]).parentNode.style.display = "none";
                    }
                    document.getElementById("ms-page-"+page).parentNode.style.display = "block";
                    msPages.current =  page;

                    msPages.list.splice(msPages.list.indexOf($attrs['titre']), 1); 
                    msPages.list.push($attrs['titre']);
                  }

                  
                },
                render : function(){
                  // Ajout de la route nécessaire
                  //window.location.href = $location.absUrl().split("#")[0]+"#"+$attrs['titre'];
                  $element.text('');
                  $element.append($compile(this.template)($scope));
                },
                navControls : function(){
                  
                  if(!msPages.state){
                    if(window.history && history.pushState){ // check for history api support
                      // create history states
                        history.pushState(-1, null); // back state
                        history.pushState(0, null); // main state
                        history.pushState(1, null); // forward state
                        history.go(-1); // start in main state
                            
                        window.addEventListener('popstate', function(event, state){
                          // check history state and fire custom events
                          if(state = event.state){
                      
                            event = document.createEvent('Event');
                            event.initEvent(state > 0 ? 'next' : 'previous', true, true);
                            this.dispatchEvent(event);
                            
                            if((state > 0 ? 'next' : 'previous') == "next")
                              $rootScope.app.nextPage();
                            else
                              $rootScope.app.previousPage();
                            
                            // reset state
                            history.go(-state);
                          }
                        }, false);
                    }

                    msPages.state = true;
                  }
                  

                },
                nextPage : function(){
                    var page = msPages.list[(msPages.list.indexOf(msPages.current)<msPages.list.length-1?msPages.list.indexOf(msPages.current)+1:msPages.list.indexOf(msPages.current))];

                    document.getElementById("ms-page-"+msPages.current).parentNode.style.display = "none";
                    document.getElementById("ms-page-"+page).parentNode.style.display = "block";

                    msPages.current = page;
                },
                previousPage : function(){
                    var page = msPages.list[(msPages.list.indexOf(msPages.current)>0?msPages.list.indexOf(msPages.current)-1:msPages.list.indexOf(msPages.current))];

                    document.getElementById("ms-page-"+msPages.current).parentNode.style.display = "none";
                    document.getElementById("ms-page-"+page).parentNode.style.display = "block";

                    msPages.current = page;
                },
                setCookie: function(cname,cvalue,exdays) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    var expires = "expires=" + d.toGMTString();
                    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                },
                getCookie: function(cname) {
                    var name = cname + "=";
                    var decodedCookie = decodeURIComponent(document.cookie);
                    var ca = decodedCookie.split(';');
                    for(var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return "";
                }
              }

              $rootScope.app.init();

            }
            var Link = function(scope, element, attrs) {}
            var Compile = function compile( tElement, tAttributes ){
                return {
                    pre: function preLink( scope, element, attributes ) { },
                    post: function postLink( scope, element, attributes ) { }
                };
            }

            var Module = {
                controller : Controller,
                compile : Compile,
                link:Link
            }
            
            return Module;
        });
        msModules.service('$msThemes', function() {
            this.navigate = function(){
              alert("oui")
            }
        });
        
})(window,window.angular);