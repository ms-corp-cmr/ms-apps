'use strict';


class MsApp {
	constructor() {
		let	$this = this;

		$this.fs = require('fs');
		$this.config = null;
		$this.express = require('express');
		$this.path    = require("path");
		$this.logger  = require("complete-logger");  
		$this.logger.init({output:"loggers"});
		$this.browseDir = require("browse-directory");
		$this.pathName = __dirname;
		$this.app = $this.express();
		

		$this.setConfig();
	}

	setConfig() {
		let	$this = this;

		$this.logger.log("\t #####  MsApp v1.0  ##### ");

		$this.logger.log("* Recuperation de la configuration de msapp dans : config.json ");
		try{
			$this.config = $this.fs.readFileSync($this.pathName+'/config.json', {"encoding":"utf8","flag":"a+"});
			$this.config = JSON.parse($this.config.toString());
		}catch(err){ 
		    $this.logger.log("Impossible de récupérer les paramètres de configuration : vérifiez le fichier de configuration","error");
		}

		$this.config.libs = $this.browseDir.browseFiles("files/libs");
		$this.config.apps.list = $this.fs.readdirSync($this.path.join($this.pathName+"/"+$this.config.apps.path));
		$this.getRoutes();
	}

	getRoutes() {
		let	$this = this;
		// Add headers
		$this.app.use(function (req, res, next) {

		    // Website you wish to allow to connect
		    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

		    // Request methods you wish to allow
		    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		    // Request headers you wish to allow
		    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		    // Set to true if you need the website to include cookies in the requests sent
		    // to the API (e.g. in case you use sessions)
		    res.setHeader('Access-Control-Allow-Credentials', true);

		    // Pass to next layer of middleware
		    next();
		});
		
		var routes = $this.fs.readdirSync($this.path.join($this.pathName+'/routes'));
		for(var i=0;i<routes.length;i++){
			require($this.path.join($this.pathName+'/routes/'+routes[i]))($this);
		}
	}

	startServer() {
		let	$this = this;
		let port = $this.config.port?$this.config.port:process.env.PORT || 5000;
		$this.app.listen(port || 5000, function () {
		  $this.logger.log('Example app listening on port '+port+". Client access to : http://localhost:"+port,"success");
		});
	}

	sendErrorPage(res) {
		var $this = this;
		
		res.sendFile($this.path.join($this.pathName+'/access-secure/error-access.html'));
	}

	toString() {
		return "MsApp v1.0";
	}
		
}


let msapp = new MsApp();







