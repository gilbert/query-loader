var QueryLoader = (function () {
  
  var overlay = ""
    , loadBar = ""
    , preloader = ""
    , doneStatus = 0
    , doneNow = 0
    , ieLoadFixTime = 2000
    , ieTimeout = ""
  ;
  
  var flatten = function (array) {
    return $.map(array, function (x) {
      if(x instanceof Array){
        return $.map(x,arguments.callee);
      } else {
        return x;
      }
    });
  };
  
  return {
    
    images: [],
    scripts: [],
    selectorPreload: '',
    
    init: function (options) {
      var self = this;
      this.ops = {};

      $.extend(this.ops, {
        images: [],
        scripts: [],
        imagePrefix: '',
        scriptPrefix: '',
        selectorPreload: 'body',
      }, options);
      
      this.selectorPreload = this.ops.selectorPreload;
      $.merge(this.scripts,this.ops.scripts);

      $.each(this.ops.images, function (idx,src) {
        self.images.push(self.ops.imagePrefix + src);
      });
      
      if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") {
        //break if IE6      
        return false;
      }
      if (this.selectorPreload == "body") {
        this.spawnLoader();
        this.getImages(this.selectorPreload);
        this.createPreloading();
      }
      else {
        $(document).ready(function () {
          this.spawnLoader();
          this.getImages(this.selectorPreload);
          this.createPreloading();
        });
      }
    
      //help IE drown if it is trying to die :)
      ieTimeout = setTimeout("QueryLoader.ieLoadFix()", function () {
        self.ieLoadFixTime();
      });
    },
  
    ieLoadFix: function () {
      var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
      if (ie && ie[0].match("MSIE")) {
        while ((100 / doneStatus) * doneNow < 100) {
          this.loadedCallback();
        }
      }
    },
  
    loadedCallback: function () {
      doneNow += 1;
      this.animateLoader();
    },
  
    getImages: function (selector) {
      var self = this;
      
      var everything = $(selector).find("*:not(script)").each(function () {
        var url = "";
      
        if ($(this).css("background-image") != "none") {
          var url = $(this).css("background-image");
        }
        else if (typeof($(this).attr("src")) != "undefined" &&
                 $(this).attr("tagName").toLowerCase() == "img")
        {
          var url = $(this).attr("src");
        }
      
        url = url.replace("url(\"", "");
        url = url.replace("url(", "");
        url = url.replace("\")", "");
        url = url.replace(")", "");
      
        if (url.length > 0) {
          self.images.push(url);
        }
      });
    },
  
    createPreloading: function () {
      preloader = $("<div></div>").appendTo(this.selectorPreload);
      $(preloader).css({
        height:   "0px",
        width:    "0px",
        overflow: "hidden"
      });
    
      var length = this.images.length + flatten(this.scripts).length;
      doneStatus = length;
    
      var self = this;
      for (var i = 0; i < this.images.length; i++) {
        $("<img></img>")
          .attr("src", this.images[i])
          .unbind("load")
          .bind("load", function () { self.loadedCallback(); })
          .appendTo($(preloader))
        ;
      }
    
      // load scripts asynchronously when possible, while at the same
      // time respecting the dependency list
      var _scripts = this.scripts;
      (function () {
        
        if (_scripts === null) return;
        
        var length = _scripts.length
          , loader = arguments.callee
          , last = _scripts[length - 1]
          , loadsLeft = length
        ;
        
        var scriptCallback = function () {
          self.loadedCallback();
          loadsLeft -= 1;
          if (loadsLeft == 0) loader();
        };
        
        for (var i = 0; i < length - 1; i++) {
          if(!_scripts[i].match(/^http/))
            _scripts[i] = self.ops.scriptPrefix + _scripts[i];
          $.getScript(_scripts[i], scriptCallback);
        }

        if (typeof last == "string") {
          if(!last.match(/^http/))
            last = self.ops.scriptPrefix + last;
          _scripts = null;
          $.getScript(last, function () {
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
      if (this.selectorPreload == "body") {
        var height = $(window).height()
          , width = $(window).width()
          , position = "fixed"
          , left = 0
          , top = 0
        ;
      }
      else {
        var height = $(this.selectorPreload).outerHeight()
          , width = $(this.selectorPreload).outerWidth()
          , position = "absolute"
          , left = $(this.selectorPreload).offset()['left']
          , top = $(this.selectorPreload).offset()['top']
        ;
      }
    
      overlay = $("<div></div>").appendTo($(this.selectorPreload));
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
        }, 500, "linear", function () { 
          self.doneLoad();
        });
      }
      else {
        $(loadBar).stop().animate({
          width: perc + "%"
        }, 500, "linear", function () { });
      }
    },
  
    doneLoad: function() {
      //prevent IE from calling the fix
      clearTimeout(ieTimeout);
    
      //determine the height of the preloader for the effect
      if (this.selectorPreload == "body") {
        var height = $(window).height();
      }
      else {
        var height = $(this.selectorPreload).outerHeight();
      }
      
      var onComplete = this.ops.onComplete;
      this.ops.onLoad && this.ops.onLoad();
      //The end animation, adjust to your likings
      $(loadBar).animate({
        height: height + "px",
        top: 0
      }, 500, "linear", function () {
        $(overlay).fadeOut(800);
        $(preloader).remove();
        onComplete && onComplete();
      });
    }
  }
})();
