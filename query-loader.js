var QueryLoader = (function () {
  /*
	 * QueryLoader		Preload your site before displaying it!
	 * Author:			Gaya Kessler
	 * Date:			23-09-09
	 * URL:				http://www.gayadesign.com
	 * Version:			1.0
	 * 
	 * A simple jQuery powered preloader to load every image on the page and in the CSS
	 * before displaying the page to the user.
	 */
	
	
	var overlay = ""
    , loadBar = ""
    , preloader = ""
    , doneStatus = 0
    , doneNow = 0
    , ieLoadFixTime = 2000
    , ieTimeout = ""
    , selectorPreload = "body"
    , scripts = []
    , images = []
    , scriptPrefix = ''
	;
	
	var flatten = function(array) {
	  return $.map(array, function (x) {
	    if(x instanceof Array){
	      return $.map(x,arguments.callee);
	    } else {
	      return x;
	    }
	  });
	};
	
	return {
	  
  	init: function (options) {
  	  options = options || {};
	    
  	  selectorPreload = options.selectorPreload || selectorPreload;
  	  options.scripts && (scripts = options.scripts);
  	  options.images && (images = options.images);
  	  options.scriptPrefix && (scriptPrefix = options.scriptPrefix);
	    
  		if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") {
  			//break if IE6			
  			return false;
  		}
  		if (selectorPreload == "body") {
  			this.spawnLoader();
  			this.getImages(selectorPreload);
  			this.createPreloading();
  		} else {
  			$(document).ready(function() {
  				this.spawnLoader();
  				this.getImages(selectorPreload);
  				this.createPreloading();
  			});
  		}
		
  		//help IE drown if it is trying to die :)
  		var self = this;
  		ieTimeout = setTimeout("QueryLoader.ieLoadFix()", function () {
  		  self.ieLoadFixTime();
  		});
  	},
	
  	ieLoadFix: function() {
  		var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
  		if (ie && ie[0].match("MSIE")) {
  			while ((100 / doneStatus) * doneNow < 100) {
  				this.loadedCallback();
  			}
  		}
  	},
	
  	loadedCallback: function() {
  		doneNow += 1;
  		this.animateLoader();
  	},
	
  	getImages: function(selector) {
  		var everything = $(selector).find("*:not(script)").each(function() {
  			var url = "";
			
  			if ($(this).css("background-image") != "none") {
  				var url = $(this).css("background-image");
  			} else if (typeof($(this).attr("src")) != "undefined" && $(this).attr("tagName").toLowerCase() == "img") {
  				var url = $(this).attr("src");
  			}
			
  			url = url.replace("url(\"", "");
  			url = url.replace("url(", "");
  			url = url.replace("\")", "");
  			url = url.replace(")", "");
			
  			if (url.length > 0) {
  				images.push(url);
  			}
  		});
  	},
	
  	createPreloading: function() {
  		preloader = $("<div></div>").appendTo(selectorPreload);
  		$(preloader).css({
  			height: 	"0px",
  			width:		"0px",
  			overflow:	"hidden"
  		});
		
  		var length = images.length + flatten(scripts).length;
  		doneStatus = length;
		
		  var self = this;
  		for (var i = 0; i < images.length; i++) {
  			var imgLoad = $("<img></img>");
  			$(imgLoad).attr("src", images[i]);
  			$(imgLoad).unbind("load");
  			$(imgLoad).bind("load", function() {
  				self.loadedCallback();
  			});
  			$(imgLoad).appendTo($(preloader));
  		}
		
      // load scripts asynchronously when possible, while at the same
      // time respecting the dependency list
		  var _scripts = scripts;
		  (function () {
        
        if(_scripts === null) return;
        
        var length = _scripts.length
          , loader = arguments.callee
          , last = _scripts[length - 1]
          , loadsLeft = length
        ;
        
        var scriptCallback = function () {
  		    self.loadedCallback();
  		    loadsLeft -= 1;
  		    if(loadsLeft == 0) loader();
  		  };
        
		    for (var i = 0; i < length - 1; i++) {
    		  $.getScript(scriptPrefix + _scripts[i], scriptCallback);
    		}

    		if(typeof last == "string") {
    		  _scripts = null;
    		  $.getScript(scriptPrefix + last, function () {
    		    self.loadedCallback();
    		  });
    		}
    		else {
    		  _scripts = last;
    		  loadsLeft -= 1;
    		}
		  })();
  	},

  	spawnLoader: function() {
  		if (selectorPreload == "body") {
  			var height = $(window).height();
  			var width = $(window).width();
  			var position = "fixed";
  		} else {
  			var height = $(selectorPreload).outerHeight();
  			var width = $(selectorPreload).outerWidth();
  			var position = "absolute";
  		}
  		var left = $(selectorPreload).offset()['left'];
  		var top = $(selectorPreload).offset()['top'];
		
  		overlay = $("<div></div>").appendTo($(selectorPreload));
  		$(overlay).addClass("QOverlay");
  		$(overlay).css({
  			position: position,
  			top: top,
  			left: left,
  			width: width + "px",
  			height: height + "px"
  		});
		
  		loadBar = $("<div></div>").appendTo($(overlay));
  		$(loadBar).addClass("QLoader");
		
  		$(loadBar).css({
  			position: "relative",
  			top: "50%",
  			width: "0%"
  		});
  	},
	
  	animateLoader: function() {
  		var perc = (100 / doneStatus) * doneNow;
  		var self = this;
  		if (perc > 99) {
  			$(loadBar).stop().animate({
  				width: perc + "%"
  			}, 500, "linear", function() { 
  				self.doneLoad();
  			});
  		} else {
  			$(loadBar).stop().animate({
  				width: perc + "%"
  			}, 500, "linear", function() { });
  		}
  	},
	
  	doneLoad: function() {
  		//prevent IE from calling the fix
  		clearTimeout(ieTimeout);
		
  		//determine the height of the preloader for the effect
  		if (selectorPreload == "body") {
  			var height = $(window).height();
  		} else {
  			var height = $(selectorPreload).outerHeight();
  		}
		
  		//The end animation, adjust to your likings
  		$(loadBar).animate({
  			height: height + "px",
  			top: 0
  		}, 500, "linear", function() {
  			$(overlay).fadeOut(800);
  			$(preloader).remove();
  		});
  	}
	}
})();
