
class appRoute {
	constructor() {
		this.$this =null;
	}

	start($this){

		$this.app.use($this.express.static($this.pathName + '/www/'));
		
		$this.useFileRecursively = app_route.useFileRecursively;
		$this.useAppsRecursively = app_route.useAppsRecursively;

		$this.useFileRecursively(0, $this.config.libs, $this);
	}

	useFileRecursively(id, tab, $this) {
		if(id <= tab.length-1){
			var file = tab[id];
			$this.app.use($this.express.static(file.src));
			$this.app.get('/'+file.src.split("libs/")[1], function (req, res) {
				res.sendFile($this.path.join($this.pathName+'/'+file.src));
			});
			this.useFileRecursively(id+1, tab, $this);
			
		}
		else{
			$this.useAppsRecursively(0, $this.config.apps.list, $this);
		}
	}

	useAppsRecursively(id, tab, $this) {
		if(id <= tab.length-1){
			var app = tab[id];
			$this.app.use(this.express.static(app));
			this.useAppsRecursively(id+1, tab, $this);
		}
		else{
			$this.app.use($this.express.static($this.config.apps.path));

			$this.app.get('/*', function (req, res) {
				var params = req["params"]; 

				var path = params["0"].indexOf("/")>=0?params["0"].split("/")[0]:params["0"];
				
				if(path == "")
					res.sendFile($this.path.join($this.pathName+'/www/index.html'));
				else if($this.config.apps.list && $this.config.apps.list.indexOf(path.toLowerCase()) >= 0){
					// Chemin vers une application
					res.send("hoffer");
				}
				else{
					$this.sendErrorPage(res);
				}

			});


			$this.startServer();
		}
	}

	toString() {
		return "MsApp Routes v1.0";
	}
}

let app_route = new appRoute();
module.exports = app_route.start;








