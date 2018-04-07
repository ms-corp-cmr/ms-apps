
	var platform = {
		electron : null,
		remote : require('electron').remote,
		win : null,
		splash : null,
		init : function(context){
			var $this = this;
			$this.socketServerAddr = context.socketServerAddr;
			$this.remote = require('electron').remote;

			$this.connectSocket();
		},

		connectSocket : function(){
	        var $this = this;
	        
	        $this.socket = io.connect($this.socketServerAddr);
	        
	        $this.listeningSocket();
	    },

	    listeningSocket : function(){
	        var $this = this;

	        $this.socket.on('connect', function() {
	        	$this.socket.emit('join', 'Hello World from client');
	   			$this.connect_success();
	  		});

			$this.socket.on('connect_error', function() {
			    $this.connect_error();
			});

	        $this.socket.on('page-change', function(data) {
	            window.location.reload();
	        });
	    },

	    connect_success : function(){
	    	var $this = this;
	    	$this.favicon.setAttribute('href', "img/connect-success.png");
	    	win.setOverlayIcon(__dirname + "/img/connect-success.png","connect-success");
	    },
	    connect_error : function(){
	    	var $this = this;
	    	var win = $this.remote.getGlobal('win');
	    	win.setOverlayIcon(__dirname + "/img/connect-error.png","connect-error");
	    	
	    },

	    toString: function() {
	        return "Plate-forme Electron";
	    }
	}
