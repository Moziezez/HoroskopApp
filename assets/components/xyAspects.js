var { planets_style_dict, signs_style_dict, aspects_style_dict } = require("./planetStyles");
const {     
	titleColor,
  textColor,
  textFadedColor,
  bgColor,
  bgSecondaryColor,
  bgTertiaryColor,
  bgAltColor,
  bgAltSecondaryColor,
  bgAltTertiaryColor,
  borderColor,
  borderLightColor 
} = require("./colorCodes.js");
const bgColorDark = bgSecondaryColor;
const { createText } = require("./aspectTexts");
const fs = require("fs");
const path = require("path");

function createDataURLFromSVG(svgPath) {
	// Read the SVG file content
	const svgContent = fs.readFileSync(path.join(__dirname, 'svg', svgPath), 'utf8');
	// Convert SVG content to Base64
	const base64SVG = Buffer.from(svgContent).toString('base64');
	const dataURL = `data:image/svg+xml;base64,${base64SVG}`;
	
	return dataURL;
}

function getAspectTraces( horoscope, isChecked ) {
  var skip_planets = [  "northnode", "southnode", "chiron", "lilith", "sirius" ];

  var midheaven_arc = horoscope.Midheaven.ChartPosition.Ecliptic.ArcDegreesFormatted30;
  var midheaven_sign_symbol = signs_style_dict[ horoscope.Midheaven.Sign.key ].utf8;
 
  var ascendant_arc = horoscope.Ascendant.ChartPosition.Ecliptic.ArcDegreesFormatted30;
  var ascendant_sign_symbol = signs_style_dict[ horoscope.Ascendant.Sign.key ].utf8;

  var planets = horoscope.CelestialBodies.all;
  var points = horoscope.CelestialPoints.all;
  var objects = planets.concat( points );

  var len = objects.length - skip_planets.length;

  planets_style_dict.ascendant.x = [ len + 1.3 ];
  planets_style_dict.midheaven.x = [ len + 1.3 ];
  planets_style_dict.ascendant.y = [ 2 ];
  planets_style_dict.midheaven.y = [ 1 ];

  var acmc = [{
    key: 'ascendant',
    x: [ len + 1.3 ],
    y: [ 2 ],
    text: 'AC',
    mode: 'text',
    textfont: { family: 'Times', size: 14, color: 'black' },
    hovertext: "Aszendent " + ascendant_sign_symbol + " " + ascendant_arc,
    hoverlabel: { bgcolor: bgColorDark, font: {color: 'black'} },
    type: 'scatter',
    hoverinfo: 'text',
  },
  {
    key: 'midheaven',
    x: [ len + 1.3 ],
    y: [ 1 ],
    text: 'MC',
    mode: 'text',
    textfont: { family: 'Times', size: 14, color: 'black' },
    hovertext: "Medium Coeli " + midheaven_sign_symbol + " " + midheaven_arc,
    hoverlabel: { bgcolor: bgColorDark, font: {color: 'black'} },
    type: 'scatter',
    hoverinfo: 'text'
  }];


  var filtered_objects = objects.filter( planet => !skip_planets.includes(planet.key) );
  var all_aspects = horoscope.Aspects.points;

  var { aspect_planet_traces, planet_xy_symbols } = createSymbols( filtered_objects );
  var aspects_traces = createAspects( all_aspects, isChecked, skip_planets );
  var aspects_plot_grid = createGrid( len, isChecked );

  var aspects_plot_traces = aspect_planet_traces.concat( aspects_traces ).concat( aspects_plot_grid );

  if ( !isChecked ) {
    aspects_plot_traces = aspects_plot_traces.concat( acmc );
  }
  
  return { aspects_plot_traces, planet_xy_symbols };
}

function createSymbols( filtered_objects ) {
  var len = filtered_objects.length;
  var aspect_planet_traces = []; planet_xy_symbols = [];

  filtered_objects.forEach( (planet, i) => {
    var key = planet.key;
    var plnt_name = planets_style_dict[ key ].text;
    var plnt_symbol = planets_style_dict[ key ].utf8;
    var deg_text = planet.ChartPosition.Ecliptic.ArcDegreesFormatted30;
    var sign_utf8 = signs_style_dict[ planet.Sign.key ].utf8;
    var hover_text = plnt_name +" "+ sign_utf8 +" "+ deg_text;
    var aspect_x = [ i + 1 ];
    var aspect_y = [ len + 2 - i ];

    aspect_planet_traces.push({
      key: key,
      x: aspect_x,
      y: aspect_y,
      text: plnt_symbol,
      mode: 'marker',
      marker: {
				color: 'rgb(17, 157, 255)',
				size: 12,
				opacity: 0
			},
      hovertext: hover_text,
			hoverlabel: { bgcolor: bgColorDark, font: {color: 'black'} },
      type: 'scatter',
      hoverinfo: 'text'
    });
    planets_style_dict[ key ].x = aspect_x;
    planets_style_dict[ key ].y = aspect_y;
  });

  aspect_planet_traces.forEach( trace => {					// Symbols Traces Loop
		var svgFile = trace.key + '.svg';
		var svgDataURL = createDataURLFromSVG( svgFile );
    var symbol_pos_x = trace.x[ 0 ];
    var symbol_pos_y = trace.y[ 0 ];
		planet_xy_symbols.push({
			x: symbol_pos_x,
			y: symbol_pos_y,
			sizex: 0.55,	
			sizey: 0.55,
			source: svgDataURL,
			xanchor: "center",
			xref: "x",
			yanchor: "middle",
			yref: "y"
		});
	});

  return { aspect_planet_traces, planet_xy_symbols };
}

function createAspects( aspect_planets, isChecked, invalid_keys ) {
  var aspects_traces = [];
  var valid_keys = [ 
    "sun","moon","mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "ascendant", "midheaven"
  ]; 

  if ( isChecked ) {
    invalid_keys.push('ascendant');
    invalid_keys.push('midheaven');
  }

  for (const key of Object.keys( aspects_style_dict )) {    // Reset the objects list of each aspect
    aspects_style_dict[ key ].objects = [ ];
  }

  valid_keys.forEach( object_key => {
    try {
      var aspects_of_key = aspect_planets[ object_key ];
      var key_aspects_len = aspects_of_key.length;
  
      for ( var j = 0; j < key_aspects_len; j++ ) {
        var key1 = aspects_of_key[ j ].point1Key;
        var key2 = aspects_of_key[ j ].point2Key;
        var orbi = Math.round( aspects_of_key[ j ].orb );
  
        if ( invalid_keys.includes( key1 ) || invalid_keys.includes( key2 ) ) {
          continue;
        }
        
        var dx = planets_style_dict[ key1 ].x;
        var dy = planets_style_dict[ key2 ].y;
  
        var aspect_key = aspects_of_key[ j ].aspectKey;
        
        try {
          var marker = aspects_style_dict[ aspect_key ].marker;  
        } catch  ( err ) {
          console.log( err );
          var marker = "O";
        }
        var name = aspects_style_dict[ aspect_key ].name;
        var deg = aspects_style_dict[ aspect_key ].deg;
        var color = aspects_style_dict[ aspect_key ].color;
  
        aspects_traces.push({
          x: dx,
          y: dy,
          mode: 'text',
          text: marker,
          textfont: {
            family: 'sans serif', 
            size: aspects_style_dict[ aspect_key ].size,
            color: color
          },
          type: 'scatter',
          hovertext: name+" "+deg+"<br>"+marker +": "+planets_style_dict[ key1 ].utf8+" + "+planets_style_dict[ key2 ].utf8+"<br>Orbis: "+orbi+"°", // + createText(aspect_key , key1, key2),
          hoverinfo: 'text',
          hoverlabel: { bgcolor: color },
        });  
      }
      
    } catch ( err ) {
      console.log(`error with ${ object_key }:`, err);      
    }
  });  
  return aspects_traces;
}

function createGrid( grid_len, isChecked ) {
  //var bgColorDark = '#fcca94';
  var lineWidth = 1.5;
  var x_grid_cut = 0;
  if ( isChecked ) {
    x_grid_cut = 2;
  }

  let plot_grid_x = [{
    x: [ 0.5, 0.5 ],
    y: [ 0.5 + x_grid_cut, grid_len + 1.5 ],
    mode: 'lines',
    line: {
     dash: 'dot',
     color: bgColorDark,
     width: lineWidth,
    },
    type: 'scatter',
    hoverinfo: 'none'
  }];

  let plot_grid_y = [];

  for ( let i = 1; i < grid_len + 1; i++ ) {
   plot_grid_y.push({
    x: [ 0.5, i + 0.5 ],
    y: [ grid_len + 2.5 - i, grid_len + 2.5 - i ],
    mode: 'lines',
    line: {
     dash: 'dot',
     color: bgColorDark,
     width: lineWidth,
    },
    type: 'scatter',
    hoverinfo: 'none'
   });	
     if ( i === grid_len && !isChecked ) {
       plot_grid_y.push({
         x: [ 0.5, i + 0.5 ],
         y: [ grid_len + 1.5 - i, grid_len + 1.5 - i ],
         mode: 'lines',
         line: {
           dash: 'dot',
           color: bgColorDark,
           width: lineWidth,
         },
         type: 'scatter',
         hoverinfo: 'none'
       });
       plot_grid_y.push({
         x: [ 0.5, i + 0.5 ],
         y: [ grid_len + 0.5 - i, grid_len + 0.5 - i ],
         mode: 'lines',
         line: {
           dash: 'dot',
           color: bgColorDark,
           width: lineWidth,
         },
         type: 'scatter',
         hoverinfo: 'none'
       });
     }
   plot_grid_x.push({
    x: [ i + 0.5, i + 0.5 ],
    y: [ 0.5 + x_grid_cut, grid_len + 2.5 - i ],
    mode: 'lines',
    line: {
     dash: 'dot',
     color: bgColorDark,
     width: lineWidth,
    },
    type: 'scatter',
    hoverinfo: 'none'
   });	
     if (i === 0 && !isChecked ) {
       plot_grid_x[0] = {
         x: [ i + 0.5, i + 0.5 ],
         y: [ 0.5, grid_len + 1.5 - i ],
         mode: 'lines',
         line: {
           dash: 'dot',
           color: bgColorDark,
           width: lineWidth,
         },
         type: 'scatter',
         hoverinfo: 'none'
       };
     }
  }

  if ( isChecked ) {
    plot_grid_y[grid_len - 1].x = [ 0.5, grid_len - 0.5 ];
  }

  return plot_grid_x.concat( plot_grid_y );
}

module.exports = { getAspectTraces };
