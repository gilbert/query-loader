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

[Click here](http://jsfiddle.net/mindeavor/G4Ayu/embedded/result/) for a live demo.
[Fiddle with the live demo source](http://jsfiddle.net/mindeavor/G4Ayu/)

## Documentation

### QueryLoader.init()

    QueryLoader.init([options])

By default, searches for all `img` tags and `background-image`s in the selected element and pre-loads them behind an animated loading bar.

Options:

- `elem` (defaults to `'body'`): A jQuery selector that determines which element to preload.

        QueryLoader.init({
          elem: '#image-gallery'
        });

- `images` An additional array of image source urls to preload during the preloading process.

- `imagePrefix` A handy helper that prefixes all the given image sources with the given string.

        QueryLoader.init({
          imagePrefix: '/images/',
          images: ['popup-button.png','larger-image.png']
        });


- `scripts` A script dependency pipeline represented as a multi-level array. See **Dependency Pipeline** for details.

- `scriptPrefix` A handy helper that prefixes all the given scripts with the given string.

        QueryLoader.init({
          scriptPrefix: '/javascripts/',
          scripts: ['support/underscore.js',
                    ['support/backbone.js',
                     ['myApp.js','myHelpers.js','myUtils.js']]],
        });

- `onLoad` A callback function that triggers once all assets have been loaded, but before the page is shown.

- `onComplete` A callback function that triggers after the loading animation has fully completed.

        QueryLoader.init({
          onLoad: function () {
            alert('Loading complete. Now fading into your web page...');
          },
          onComplete: function () {
            alert('Loading animation complete!');
          }
        });

## Dependency Pipeline

The `scripts` option provides a way to load multiple scripts asynchronously, while still maintaining dependencies. Every level of the array is considered a dependency for the next deeper level.

For example, if A and B both depend on X:

    QueryLoader.init({
      scripts: ['X.js',
                ['A.js', 'B.js']]
    });

In this example, X is loaded first. Once X is loaded, both A and B are loaded asynchronously.

Credits
=======

Major credit goes to [Gaya Design](http://www.gayadesign.com/)'s [QueryLoader jQuery plugin](http://www.gayadesign.com/diy/queryloader-preload-your-website-in-style/) for the original idea and implementation.
