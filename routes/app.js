
class appRoute {
	constructor() {
		this.$this =null;
	}

	start($this){

		$this.app.use($this.express.static($this.pathName + '/www/'));
		$this.Apps = $this.fs.readdirSync($this.config.apps.path);
		$this.config.apps.list = [];
		$this.useFileRecursively = app_route.useFileRecursively;
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
			$this.app.use($this.express.static($this.config.apps.path));

			$this.app.get('/*', function (req, res) {
				var params = req["params"]; 

				var path = params["0"].indexOf("/")>=0?params["0"].split("/")[0]:params["0"];
				
				if(path == "")
					res.sendFile($this.path.join($this.pathName+'/www/index.html'));
				else if($this.Apps && $this.Apps.indexOf(path.toLowerCase()) >= 0){
					// Chemin vers une application
				}
				else{
					$this.sendErrorPage(res);
				}

			});
		}
	}

	toString() {
		return "MsApp Routes v1.0";
	}
}

let app_route = new appRoute();
module.exports = app_route.start;








