const textfont = "Times New Roman";

const { colors } = require("./colorCodes.js");

const plotStyle = {
	layout: {
		autosize: false,
		paper_bgcolor: colors.bg,
		plot_bgcolor: colors.bg,
		width: 800,
		height: 720,
		margin: { l: 0, r: 0, b: 0, t: 39 },
		showlegend: false,
		dragmode: false,
		polar: {
			domain: {
				x: [0, 1],
				y: [0.06, 0.96]
			},
			radialaxis: {
				visible: false,
				range: [-180, 180],
			},
			angularaxis: {
				visible: true,
				tickvals: [0, 110, 210, 310],
				ticktext: ["<b>AC</b>", "MC", "DC", "IC"],
				tickfont: {
					family: textfont,
					size: 14,
					color: "black"
				},
				rotation: 90,
				linecolor: colors.bg,
				linewidth: 2,
				tickangle: "auto",
				direction: "counterclockwise"
			},
		},
		xaxis: {
			domain: [0.1, 0.9],
			range: [-25, 25],
			visible: false,
		},
		yaxis: {
			domain: [0.04, 0.98],
			range: [-25, 25],
			visible: false,
		},
	},
	config: {
		toImageButtonOptions: {
			format: 'svg', // one of png, svg, jpeg, webp
			filename: 'custom_horoscope_chart',
			height: 655,
			width: 714,
			scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
		},
		responsive: false,
		editable: false,
		displaylogo: false,
		displayModeBar: false
	}
};
const shapesList = [];
for (let index = 0; index < 11; index += 2) {
	shapesList.push({		// second row in aspect plot lightgrey
		type: 'rect',
		xref: 'x',
		yref: 'x',
		x0: 0.5,
		y0: index + 1.5,
		x1: 10.5 - index,
		y1: index + 2.5,
		fillcolor: '#d3d3d3',
		opacity: 0.1,
		line: {
			width: 0
		}
	})
}
for (let index = 1; index < 11; index++) {
	shapesList.push({		// square backgrounnd of planets in aspects plot
		type: 'rect',
		xref: 'x',
		yref: 'x',
		x0: 10.5 - index,
		y0: index + 1.5,
		x1: 11.5 - index,
		y1: index + 2.5,
		fillcolor: 'orange',
		opacity: 0.1,
		line: {
			width: 0
		}
	})
};
shapesList.push({
	type: 'rect',
	xref: 'x',
	yref: 'x',
	x0: 10.5,
	y0: 0.5,
	x1: 12,
	y1: 1.48,
	fillcolor: 'orange',
	opacity: 0.1,
	line: {
		width: 0
	}
},
	{
		type: 'rect',
		xref: 'x',
		yref: 'x',
		x0: 10.5,
		y0: 1.52,
		x1: 12,
		y1: 2.5,
		fillcolor: 'orange',
		opacity: 0.1,
		line: {
			width: 0
		}
	}
)
const plotXyStyle = {
	layout: {
		shapes: shapesList,
		autosize: true,
		dragmode: false,
		showlegend: false,
		margin: { l: 7, r: 0, b: 20, t: 0 },
		paper_bgcolor: colors.bg,
		plot_bgcolor: colors.bg,
		domain: {
			x: [0, 1],
			y: [0, 1]
		},
		xaxis: {
			visible: false,
			range: [0, 12.5],
		},
		yaxis: {
			visible: false,
			range: [0, 12.5],
			scaleanchor: "x",
			scaleratio: 1
		},
	},
	config: {
		responsive: true,
		editable: false,
		displayModeBar: false,
		displaylogo: false
	}
};
//Create Circles
var theta360 = Array.from({ length: 361 }, (e, i) => i);
var radius3 = Array.from({ length: 361 }, () => 67);
var radius4 = Array.from({ length: 361 }, () => 128);
var radius5 = Array.from({ length: 361 }, () => 180);

var circ3 = {
	r: radius3,
	theta: theta360,
	name: 'Oben',
	mode: 'lines',
	fill: 'toself',
	fillcolor: colors.bg,
	line: {
		color: colors.tick,
		width: 1.5
	},
	type: 'scatterpolar',
	hovertext: 'Winkel',
	hoverinfo: 'theta'
};
var circ4 = {
	r: radius4,
	theta: theta360,
	name: 'Oben',
	mode: 'lines',
	fill: 'toself',
	fillcolor: colors.bgTertiary,
	line: {
		width: 0
	},
	type: 'scatterpolar',
	hovertext: 'Winkel',
	hoverinfo: 'theta'
};
var circ5 = {
	r: radius5,
	theta: theta360,
	mode: 'lines',
	fill: 'toself',
	fillcolor: colors.bgSecondary,
	line: {
		width: 0
	},
	hoverinfo: 'none',
	type: 'scatterpolar'
};
var circ_data = [circ5, circ4, circ3];
var rad = radius4;
var abstand = 3.5;

for (var n = 0; n < theta360.length - 1; n++) {	//Append Scaling Degrees 360°
	if (n % 10 == 0) {							//Append 10er ticks
		circ_data.push({
			r: [rad[n] - 8 - abstand, rad[n] - abstand],
			theta: [theta360[n], theta360[n]],
			mode: 'lines',
			line: {
				color: colors.tick,
				width: 2
			},
			type: 'scatterpolar',
			hovertext: 'Winkel',
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: 'theta'
		});
	} else if (n % 5 == 0) {					//Append 5er ticks
		circ_data.push({
			r: [rad[n] - 6 - abstand, rad[n] - abstand],
			theta: [theta360[n], theta360[n]],
			mode: 'lines',
			line: {
				color: colors.tick,
				width: 2
			},
			type: 'scatterpolar',
			hovertext: 'Winkel',
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: 'theta'
		});
	} else { // Append 1er ticks
		circ_data.push({
			r: [rad[n] - 4 - abstand, rad[n] - abstand],
			theta: [theta360[n], theta360[n]],
			mode: 'lines',
			line: {
				color: colors.tick,
				width: 1.5
			},
			type: 'scatterpolar',
			hovertext: 'Winkel',
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: 'theta'
		});
	}
}
const circles = circ_data;

module.exports = { plotStyle, plotXyStyle, circles };
