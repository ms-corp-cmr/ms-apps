
	var platform = {

		init : function(context){
			var $this = this;
			$this.socketServerAddr = context.socketServerAddr;
			$this.favicon = context.favicon;

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

	    sendMessage : function(label, message){

	    	if((typeof {"papa":""})=="object")
	    		message = JSON.stringify(message);

	    	$this.socket.emit(label, message);

	    	$this.socket.on('get-'+label, function(data) {
			    alert("reponse du serveur : "+JSON.stringify(data));
			});

	    },

	    connect_success : function(){
	    	var $this = this;
	    	$this.favicon.setAttribute('href', "img/connect-success.png");
	    },
	    connect_error : function(){
	    	var $this = this;
	    	$this.favicon.setAttribute('href', "img/connect-error.png");
	    },

	    toString: function() {
	        return "Plate-forme Electron";
	    }
	}
