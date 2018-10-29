earth for netCDF files of Paleo-climate simulations
===================================================

"earth" is a project to visualize global weather conditions developed by [Cameron Beccario](https://github.com/cambecc/earth) to display weather data forecasts. A customized instance of "earth" is available at http://earth.nullschool.net.

Here, we have modified the application to allow users to upload their own netCDF files output from paleo-climate simulations. The application will internally convert the netCDF file to json using the [netcdfjs](https://github.com/cheminfo-js/netcdfjs) library. This libary to date only accepts netCDF v3x files, so we modified the code server-side to convert v4x files to v3x using the nco command `ncks -3 file_in.nc file_out.nc`, spawned as a child process.

For now, the continent contours were derived offline from the netCDF file into a topojson file (see [these steps](https://github.com/KatiRG/paleoClim_docs#create-a-topojson-file-from-netcdf)). The topojson file is hard-coded in the application and currently corresponds to the plate tectonics of the Cretaceous period.

building and launching
----------------------

After installing node.js and npm, clone "earth" and install dependencies:

  $  git clone https://github.com/KatiRG/earth.git
  $  cd earth
  $  npm install

Install [NCO](http://nco.sourceforge.net/) if you're planning to use netCDF v4x files.

You will also need a few dependencies:

  $  npm install express

  $  npm install netcdfjs

  $  npm install body-parser

Next, launch the development web server:

  $  node dev-server.js 8080

Finally, point your browser to:

    http://localhost:8080

For Ubuntu, Mint, and elementary OS, use `nodejs` instead of `node` instead due to a [naming conflict](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint-elementary-os).

font subsetting
---------------

This project uses [M+ FONTS](http://mplus-fonts.sourceforge.jp/). To reduce download size, a subset font is
constructed out of the unique characters utilized by the site. See the `earth/server/font/findChars.js` script
for details. Font subsetting is performed by the [M+Web FONTS Subsetter](http://mplus.font-face.jp/), and
the resulting font is placed in `earth/public/styles`.

[Mono Social Icons Font](http://drinchev.github.io/monosocialiconsfont/) is used for scalable, social networking
icons. This can be subsetted using [Font Squirrel's WebFont Generator](http://www.fontsquirrel.com/tools/webfont-generator).

implementation notes
--------------------

Building this project required solutions to some interesting problems. Here are a few:

   * The GFS grid has a resolution of 1°. Intermediate points are interpolated in the browser using [bilinear
     interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation). This operation is quite costly.
   * Each type of projection warps and distorts the earth in a particular way, and the degree of distortion must
     be calculated for each point (x, y) to ensure wind particle paths are rendered correctly. For example,
     imagine looking at a globe where a wind particle is moving north from the equator. If the particle starts
     from the center, it will trace a path straight up. However, if the particle starts from the globe's edge,
     it will trace a path that curves toward the pole. [Finite difference approximations](http://gis.stackexchange.com/a/5075/23451)
     are used to estimate this distortion during the interpolation process.
   * The SVG map of the earth is overlaid with an HTML5 Canvas, where the animation is drawn. Another HTML5
     Canvas sits on top and displays the colored overlay. Both canvases must know where the boundaries of the
     globe are rendered by the SVG engine, but this pixel-for-pixel information is difficult to obtain directly
     from the SVG elements. To workaround this problem, the globe's bounding sphere is re-rendered to a
     detached Canvas element, and the Canvas' pixels operate as a mask to distinguish points that lie outside
     and inside the globe's bounds.
   * Most configuration options are persisted in the hash fragment to allow deep linking and back-button
     navigation. I use a [backbone.js Model](http://backbonejs.org/#Model) to represent the configuration.
     Changes to the model persist to the hash fragment (and vice versa) and trigger "change" events which flow to
     other components.
   * Components use [backbone.js Events](http://backbonejs.org/#Events) to trigger changes in other downstream
     components. For example, downloading a new layer produces a new grid, which triggers reinterpolation, which
     in turn triggers a new particle animator. Events flow through the page without much coordination,
     sometimes causing visual artifacts that (usually) quickly disappear.
   * There's gotta be a better way to do this. Any ideas?

acknowledgements
----------------

Many thanks to [Sophie Szopa](https://www.lsce.ipsl.fr/Phocea/Pisp/index.php?nom=sophie.szopa) and [Pierre Sepulchre](https://www.lsce.ipsl.fr/Phocea/Pisp/index.php?nom=pierre.sepulchre) for supporting this project and providing scientific input, and to our summer intern [Camille Beaugendre](https://github.com/Superpiaf) who made the first [inroads](https://github.com/KatiRG/paleoClim_docs#customization-of-the-code) into the application, modifying it to read json files made [offline with python](https://github.com/KatiRG/paleoClim_docs#create-a-json-file-from-netcdf) and adding new variables to the menu.

The additional features allowing netCDF files to be uploaded directly and converted to v3x was made possible by the [netcdfjs](https://github.com/cheminfo-js/netcdfjs) library and the invaluable guidance of [Arseny Kurnikov](https://github.com/akurniko) and [Miika Pihjlaja](https://github.com/zonpantli), coders extraordinaire.
