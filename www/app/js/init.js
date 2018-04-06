class Welcome {
    constructor() {
        var $this = this;

        this.logs = [];
        this.errorBar = "footer-page-error";
        
        // Cordova/Electron Conflict Implementation : avec cordova ou électron ceci ne marchera pas car - pb de chemin file:// au lieu de http://
        // Requête asynchrone
        var requestURL = 'app.json';
        var request = new XMLHttpRequest();
        request.open("GET", requestURL, false);
        request.send();
        
        try{
            $this.configs = JSON.parse(request.responseText);
            $this.start();
        }catch(err){ 
            $this.logError("<i class=\"fa fa-meh-o\" aria-hidden=\"true\" style=\"color:#FFB5B3\"></i> Erreur de chargement des paramètres de l'application, veuillez contacter l'administrateur");
        }

    }

    start(){
        var $this = this;
        this.setAppParams();

        this.lang = $this.configs.defaultLang;
        this.serverPath = $this.configs.serverPath;
        this.socketServerAddr = $this.configs.socketServerAddr;
        this.theme = $this.configs.theme;
        this.device = {};
        this.device.type = window.innerWidth>780?"pc":window.innerWidth>500?"tablette":"mobile";
        this.templates = {
                            "welcome":"welcome",
                            "admin":"admin",
                            "page":"page",
                            "aide":"aide"
                         };
        
        // Nécessaires pour exportation
        this.libsPath = $this.configs.platform=="web"?"../":"";   // Export value = ""
        this.socket = null;

        $this.loadLibs();

    }

    setAppParams(){
        var $this = this;
        document.title = $this.configs.name;
        document.body.style.font = $this.configs.theme.font;
        var appName = document.getElementById("app-name");
            appName.innerHTML = $this.configs.name;
    }

    // Appelé après chargement des librairies
    init(){
        var $this = this;

        $this.connectSocket();
    }

    loadLibs(){
        var $this = this;

        var js = [
                    // NB : l'ordre d'importation de ces librairies est primordial, par exemple: jquery ne peut pas ê^tre au dessus
                    $this.serverPath+"../angular/angular.min.js"
                    ,$this.serverPath+"../angular/angular-translate.min.js"
                    ,$this.serverPath+"../angular/angular-translate-loader-static-files.js"
                    ,$this.serverPath+"../jquery/jquery.min.js"
                    ,$this.serverPath+"../socket/socket.io.js"
                    ,$this.serverPath+"../ms-theme/js/ms-theme.js"   /* The magspace-theme js */
                    ,"app/js/app.js"
                ]
                
                // Load js of templates
                for(var i in $this.templates){
                    js.push("templates/"+this.templates[i]+"/js/app.js");
                }

        var css = [ /* Css libs */
                       this.libsPath+"font-awesome/css/font-awesome-http.min.css" /* The font-awesome css */
                       ,$this.serverPath+"../ms-theme/css/ms-theme.css"   /* The magspace-theme css */
                       ,"app/css/style.css"
                  ];

        $this.loadCSSRecursively(css,0);
        $this.loadJSRecursively(js,0);
    }


    loadJSRecursively(tab, id) {
        var $this = this;

        $this.loadJS(tab[id], function(id) {
            $this.loadJSRecursively(tab,id+1);
        },id);

        if(tab.length == id){
            $this.init();
        }
    }

    loadCSSRecursively(tab, id) {
        var $this = this;

        $this.loadCSS(tab[id], function(id) {
            $this.loadCSSRecursively(tab,id+1);
        },id);
    }

    loadJS(src, callback,id) {
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
        
    }

    loadCSS(src, callback, id) {
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
    }

    logError(message){
        var $this = this;

        $this.logs.push(message);
        var error = document.getElementById($this.errorBar),
            contain = document.getElementById($this.errorBar+"-contain");

            error.style.display = "flex";
            contain.innerHTML = message;
    }

    reload(){
        var $this = this;

        window.location.reload();
    }

    closeErrorBar(){
        var $this = this;

        var error = document.getElementById(app.errorBar);
            error.style.display = "none";
    }


    connectSocket(){
        var $this = this;

        $this.socket = io.connect($this.socketServerAddr);
        $this.listeningSocket();
    }

    listeningSocket(){
        var $this = this;

        $this.socket.on('connect', function(data) {
            $this.socket.emit('join', 'Hello World from client');
        });

        $this.socket.on('page-change', function(data) {
            window.location.reload();
        });
    }



}

var welcome = new Welcome();