var welcome = {
    constructor : function() {
        var $this                    = this;
        $this.cordova                = null;
        $this.words                  = null;
        $this.logs                   = [];
        $this.errorBar               = "footer-page-error";
        this.libsPath                = "libs/";   
        this.serverPath              = "";  
        this.templates               =  {
                        					"welcome":"welcome",
                                            "editor":"editor",
                                            "startup":"startup",
                                            "server":"server"
                                        };
        this.hideNavsTo = [];
        this.hideNavsTo.push(this.templates.editor);

        $this.loadLibs();
        
    },

    begin : function(){
        var $this = this;

        document.addEventListener('deviceready', function(){}, false);
        document.addEventListener('pause', function(){}, false);
        document.addEventListener('resume', function(){}, false);
        document.addEventListener('deviceready', function(){
            $this.cordova = cordova;

            window.resolveLocalFileSystemURL($this.cordova.file.applicationDirectory + "www/configs/app.json", function(fileEntry){
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        try{
                            $this.configs = JSON.parse(this.result);
                        }catch(err){ 
                            $this.configs = [];
                            $this.logError("<i class=\"fa fa-meh-o\" aria-hidden=\"true\" style=\"color:#FFB5B3\"></i> Erreur de chargement des paramètres de l'application");
                        }

                        $this.start();
                    };

                    reader.readAsText(file);

                }, function(){
                        $this.logError("<i class=\"fa fa-meh-o\" aria-hidden=\"true\" style=\"color:#FFB5B3\"></i> Erreur de chargement des paramètres de l'application");
                });
            }, function(){$this.logError("<i class=\"fa fa-meh-o\" aria-hidden=\"true\" style=\"color:#FFB5B3\"></i> Erreur de chargement des paramètres de l'application");});
        }, false);

        $this.start();
    },

    start : function(){
        var $this = this;
        this.setAppParams();

        this.lang = $this.configs.defaultLang;
        this.serverPath = $this.configs.serverPath;
        this.socketServerAddr = $this.configs.socketServerAddr;
        this.theme = $this.configs.theme;
        this.device = {};
         this.device.type = window.innerWidth>992?"pc":window.innerWidth>768?"portable":window.innerWidth>400?"tablette":"mobile";
        
        this.msPages = [];

        // Nécessaires pour exportation
        this.socket = null;

        angular.element(document.body).scope().init();
        $this.init();
        platform.init($this);
    },

    init : function(){
        var $this = this;
 
        $(".conteneur-global").scroll(function(){
                if ($(".conteneur-global").scrollTop() >= 200) {
                   $('.nav').addClass('fixed-header');
                }
                else {
                   $('.nav').removeClass('fixed-header');
                }
        });

        $(".swiper-button-next,.swiper-button-prev").css({"visibility":"hidden"});
    },

    personnalize : function(){
        var $this = this;

        /*
            Tout object voulant appliquer la couleur du theme devra avoir comme classe
                - tbgColor pour le background-color
                - tcolor pour la couleur
                
                Par défaut, la couleur des icônes importées de fontawesome sera identique à celle définit dans les configs
            NB: l'objet de devra pas spécifier un background-color, dans ce cas l'application du theme sera pertubée

        */

        var rule = '.fa{color:'+$this.configs.theme.color+';}';
            rule += '.tcolor{color:'+$this.configs.theme.color+';}';
            rule += '.tbgColor{background-color:'+$this.configs.theme.bgColor+';}';

            rule += ".ms-scroll-bar::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px "+$this.configs.theme.scrollColor+";background-color: "+$this.configs.theme.scrollBgColor+";}";
            rule += ".ms-scroll-bar::-webkit-scrollbar{width: 7px;background-color: "+$this.configs.theme.scrollBgColor+";}";
            rule += ".ms-scroll-bar::-webkit-scrollbar-thumb{background-color: "+$this.configs.theme.scrollColor+";background-image: -webkit-gradient(linear, 0 0, 0 100%,color-stop(.5, rgba(255, 255, 255, .2)),color-stop(.5, transparent), to(transparent));}";

            $("<div />", {html: '&shy;<style>'+rule+'</style>'}).appendTo("body");    
    },

    setAppParams : function(){
        var $this = this;
        document.title = $this.configs.name;
        document.body.style.font = $this.configs.theme.font;
        var appName = document.getElementById("app-name");
            appName.innerHTML = $this.configs.name;
    },

    platform: function(){
        if(typeof cordova != 'undefined')
            return 'cordova';
        else
            return 'web';
    },

    logError: function(message){
        var $this = this;

        $this.logs.push(message);
        var error = document.getElementById($this.errorBar),
            contain = document.getElementById($this.errorBar+"-contain");

            error.style.display = "flex";
            contain.innerHTML = message;
    },

    loadLibs: function(){
        var $this = this;

        var js = [
                    // NB : l'ordre d'importation de ces librairies est primordial, par exemple: jquery ne peut pas ê^tre au dessus
                     $this.libsPath+"angular/angular.min.js"
                    ,$this.libsPath+"angular/angular-translate.min.js"
                    ,$this.libsPath+"angular/angular-translate-loader-static-files.js"
                    ,$this.libsPath+"jquery/jquery.min.js"
                    ,$this.libsPath+"socket/socket.io.js"
                    ,$this.libsPath+"ms-theme/js/ms-theme.js"   /* The magspace-theme js */
                    ,$this.libsPath+"platforms/cordova.js"
                    ,"js/app.js"
                ]
                
                // Load js of templates
                for(var i in $this.templates){
                    js.push("templates/"+this.templates[i]+"/js/app.js");

                    /* The magspace-editor-init js */
                    if(this.templates[i] == "editor"){
                        js.push("templates/"+this.templates[i]+"/js/editor-init.js");
                    }
                }

        var css = [ /* Css libs */
                        $this.libsPath+"font-awesome/css/font-awesome-http.min.css" /* The font-awesome css */
                       ,$this.libsPath+"bootstrap/bootstrap.min.css"   /* The Bootstrap css */
                       ,$this.libsPath+"angular/angular-material.min.css"   /* The Angular-Material css */
                       ,$this.libsPath+"ms-theme/css/ms-theme.css"   /* The magspace-theme css */
                       ,"css/style.css"
                  ];


        $this.loadCSSRecursively(css,0);
        $this.loadJSRecursively(js,0);

    },


    loadJSRecursively: function(tab, id) {
        var $this = this;

        $this.loadJS(tab[id], function(id) {
            $this.loadJSRecursively(tab,id+1);
        },id);

        if(tab.length == id){
            //$this.init();
            $this.begin();
        }
    },

    loadCSSRecursively: function(tab, id) {
        var $this = this;

        $this.loadCSS(tab[id], function(id) {
            $this.loadCSSRecursively(tab,id+1);
        },id);
    },


    loadJS: function(src, callback,id) {
        var $this = this;
        
        var script = document.createElement('script'),
            loaded;
        //script.setAttribute('src', src);
        if(src)
            script.src = src;
        if (callback) {
            script.onreadystatechange = script.onload = function() {
                
                if (!loaded) {
                  callback(id);
                }
                loaded = true;
            };

            script.onreadystatechange = script.onerror = function() {
                if(src)
                $this.logError("<i class=\"fa fa-meh-o\" aria-hidden=\"true\" style=\"color:#FFB5B3\"></i> Erreur de chargement survenue - js/css");
            };

        }//alert(script.src);
        document.getElementsByTagName('head')[0].appendChild(script);
        
    },

    loadCSS: function(src, callback, id) {
        var $this = this;

        var css = document.createElement('link'),
            loaded;
        if(src){
            css.setAttribute('rel', "stylesheet");
            css.setAttribute('href', src);
        }
        if (callback) {
            css.onreadystatechange = css.onload = function() {
                if (!loaded) {
                  callback(id);
                }
                loaded = true;
            };
            css.onreadystatechange = css.onerror = function() {
                if(src)
                $this.logError("<i class=\"fa fa-meh-o\" aria-hidden=\"true\" style=\"color:#FFB5B3\"></i> Erreur de chargement survenue - js/css");
            };
        }
        document.getElementsByTagName('head')[0].appendChild(css);
    },
    closeWindowsLoader : function(){
        $(".swiper-container").css({'display': 'block'}); 
        $(".loader-page").css({'display': 'none'}); 

        window.setTimeout(function(){
            navigator.splashscreen.hide();
        }, 200);

    },
    showWindowsLoader : function(){
        $(".swiper-container").css({'display': 'none'});
        $(".loader-page").css({'display': 'block'}); 
        $(".loader-page").css({'z-index': '100000000000000000000'});
        $(".loader-page").css({'margin-left': '0%'});
    },

    toString: function() {
        return "MsApp Version 1.0.0";
    }
}

welcome.constructor();

