Query Loader
============

### What?

Query Loader is a jQuery plugin that lets you pre-load static assets with a nice loading UI, all in a few lines of javascript.

## Quick Start

Add the necessary files:

    <link rel="stylesheet" href="queryLoader.css" type="text/css" />
    
    <script type='text/javascript' src='jquery.min.js'></script>
    <script type='text/javascript' src='queryLoader.js'></script>

Now place this at the bottom of your page:

    <script type='text/javascript'>
    	QueryLoader.init();
    </script>

That's it!

## Demo

[Click here](http://jsfiddle.net/mindeavor/G4Ayu/2/embedded/result/) for a live demo.
[Fiddle with the live demo source](http://jsfiddle.net/mindeavor/G4Ayu/2/)

## Documentation

### QueryLoader.init()

    QueryLoader.init([options])

By default, searches for all `img` tags and `background-image`s on the page and pre-loads them behind an animated loading bar.

Options:

- `images` An additional array of image source urls to preload during the preloading process.

- `imagePrefix` A handy helper that prefixes all the given image sources with the given string.

        QueryLoader.init({
          imagePrefix: '/images/',
          images: ['popup-button.png','larger-image.png']
        });


- `scripts` A script dependency pipeline represented as a multi-level array. See *Dependency Pipeline* for details.

- `scriptPrefix` A handy helper that prefixes all the given scripts with the given string.

        QueryLoader.init({
          scriptPrefix: '/javascripts/',
          scripts: ['support/underscore.js',
                    ['support/backbone.js',
                     ['myApp.js','myHelpers.js','myUtils.js']]],
        });

- `onComplete` A callback function that triggers after the loading animation has fully completed.

        QueryLoader.init({
          onComplete: function () {
            alert('Loading animation complete!');
          }
        });


Credits
=======

Major credit goes to [Gaya Design](http://www.gayadesign.com/)'s [QueryLoader jQuery plugin](http://www.gayadesign.com/diy/queryloader-preload-your-website-in-style/) for the original idea and implementation.
