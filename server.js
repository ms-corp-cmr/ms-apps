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







