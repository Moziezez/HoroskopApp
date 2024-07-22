//XY Plot Data
function xyPlotGrid() {
  var aspects_plot_grid = [];
	for (var i = 0; i < 18; i++) {
		aspects_plot_grid.push({
			x: [0.5, i + 0.5],
			y: [17.5 - i, 17.5 - i],
			mode: 'lines',
			line: {
				dash: 'dot',
				color: 'white',
				width: 0.5
			},
			type: 'scatter',
		});	
		aspects_plot_grid.push({
			x: [ i + 0.5, i + 0.5],
			y: [0.5, 17.5 - i],
			mode: 'lines',
			line: {
				dash: 'dot',
				color: 'white',
				width: 0.5
			},
			type: 'scatter',
		});	
	}
}

function xyPlotPlanets() {
  	var aspect_planet_traces_text = [];
	var aspect_planet_traces = JSON.parse(JSON.stringify(planet_traces));

	for (var i = 0; i < aspect_planet_traces.length; i++) {
		var aspect_x = Number(aspect_planet_traces[i].x);
		var aspect_y = Number(aspect_planet_traces[i].y);

		aspect_planet_traces[i].type = 'scatter';
		aspect_planet_traces[i].hovertext = aspect_planet_traces[i].key + " " + aspect_planet_traces[i].name;
		aspect_planet_traces[i].hoverinfo = 'text';

		aspect_planet_traces_text.push({
			x: [aspect_x + 1.2],
			y: [aspect_y + 0.08],
			mode: 'text',
			text: "test", //aspect_planet_traces[i].name,
			textfont: {
				family: 'sans serif', 
				size: 14,
				color: "white" 
			},
			type: 'scatter',
			hovertext: "Position",
			hoverinfo: "text"
		});
	};
	var aspects_plot_traces = aspects_plot_grid.concat(aspect_planet_traces);
	var aspects_plot_traces = aspects_plot_traces.concat(aspect_planet_traces_text);
}
function xyPlotAspects() {
	var aspects_traces = [];
	for (j = 0; j < all_aspects.length; j++) {
		var key1 = all_aspects[j].point1Key;
		var key2 = all_aspects[j].point2Key;
		if (all_aspects[j].aspectKey === 'trine') {
			aspects_traces.push({
				x: planets_style_dict[key1].x,
				y: planets_style_dict[key2].y,
				mode: 'text',
				text: '\u1401',
				textfont: {
					family: 'sans serif', 
					size: 12,
					color: 'rgb(144,238,144)'
				},
				type: 'scatter',
				name: planets_style_dict[key1].utf8 + "  \u1401  " + planets_style_dict[key2].utf8,
				hovertext: 'Trigon',
				hoverinfo: 'name'
			});
		} else if (all_aspects[j].aspectKey === 'sextile') {
			aspects_traces.push({
				x: planets_style_dict[key1].x,
				y: planets_style_dict[key2].y,
				mode: 'text',
				text: '\u2B21',
				textfont: {
					family: 'sans serif', 
					size: 12,
					color: 'rgb(255,245,238)'
				},
				type: 'scatter',
				name: planets_style_dict[key1].utf8 + " \u2B21 " + planets_style_dict[key2].utf8,
				hovertext: 'Sextile',
				hoverinfo: 'name'
			});
		} else if (all_aspects[j].aspectKey === 'square') {
			aspects_traces.push({
				x: planets_style_dict[key1].x,
				y: planets_style_dict[key2].y,
				mode: 'text',
				text: '\u25A1',
				textfont: {
					family: 'sans serif', 
					size: 12,
					color: 'rgb(255,182,193)'
				},
				type: 'scatter',
				name: planets_style_dict[key1].utf8 + " \u25A1 " + planets_style_dict[key2].utf8,
				hovertext: 'Square',
				hoverinfo: 'name'
			});
		} else if (all_aspects[j].aspectKey === 'opposition') {
			aspects_traces.push({
				x: planets_style_dict[key1].x,
				y: planets_style_dict[key2].y,
				mode: 'text',
				text: '\u260D',
				textfont: {
					family: 'sans serif', 
					size: 12,
					color: 'rgb(205,92,92)'
				},
				type: 'scatter',
				name: planets_style_dict[key1].utf8 + " \u260D " + planets_style_dict[key2].utf8,
				hovertext: 'Opposition',
				hoverinfo: 'name'
			});
		};
	};
	var aspects_plot_traces = aspects_plot_traces.concat(aspects_traces);
}
