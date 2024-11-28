//recieve horoscope and return plot_data
const textfont = 'Arial';
const path = require("path");
const fs = require('fs');

const { planets_style_dict, signs_style_dict, aspects_style_dict, houses_style_dict } = require("./planetStyles.js");
const { colors } = require("./colorCodes.js");
const connection_traces_tickwidth = 1.5;
const r1 = 58; const r2 = 74;

function createDataURLFromSVG(svgPath) {
	// Read the SVG file content
	const svgContent = fs.readFileSync(path.join(__dirname, 'svg', svgPath), 'utf8');
	// Convert SVG content to Base64
	const base64SVG = Buffer.from(svgContent).toString('base64');
	const dataURL = `data:image/svg+xml;base64,${base64SVG}`;

	return dataURL;
}

const svgSymbolOpacity = 0;
function plotData(horoscope, isChecked, zodiacSys, valid_keys) {
	var midheaven_theta = horoscope.Midheaven.ChartPosition.Ecliptic.DecimalDegrees;
	planets_style_dict.midheaven.theta = midheaven_theta;
	var ascendant_theta = horoscope.Ascendant.ChartPosition.Ecliptic.DecimalDegrees;
	planets_style_dict.ascendant.theta = ascendant_theta;
	var offset = 180 - ascendant_theta;
	for (var n = 1; n < Object.keys(houses_style_dict).length + 1; n++) {
		houses_style_dict[n].planet = [];
		houses_style_dict[n].planet_text = [];
	}
	/* Calculate and store the following vars for each planet via for-loop */
	let planet_traces = [], planets_pos = [], missing_ids = []; planet_symbols = [];
	var planet_obj = horoscope.CelestialBodies.all;

	var connection_traces = [{
		r: [r1, r2],
		theta: [ascendant_theta, ascendant_theta],
		mode: 'lines',
		line: {
			color: colors.tick,
			width: connection_traces_tickwidth
		},
		name: signs_style_dict[horoscope.Angles.ascendant.Sign.key].utf8 + " " + horoscope.Angles.ascendant.ChartPosition.Ecliptic.ArcDegreesFormatted30,
		type: 'scatterpolar',
		hovertext: "AC",
		hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
		hoverinfo: 'text+name'
	}, {
		r: [r1, r2],
		theta: [midheaven_theta, midheaven_theta],
		mode: 'lines',
		line: {
			color: colors.tick,
			width: 1.5
		},
		name: signs_style_dict[horoscope.Angles.midheaven.Sign.key].utf8 + " " + horoscope.Angles.midheaven.ChartPosition.Ecliptic.ArcDegreesFormatted30,
		type: 'scatterpolar',
		hovertext: "MC",
		hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
		hoverinfo: 'text+name'
	}];

	var collTheta = 5;
	for (var i = 0; i < planet_obj.length; i++) {
		var planet_key = planet_obj[i].key;
		if (planet_key === "sirius") {
			continue
		}

		planets_style_dict[planet_key].aspect_keys = [];
		planets_style_dict[planet_key].aspects = [];

		var planet = horoscope.CelestialBodies[planet_key];
		var plnt_pos = Math.round(planet.ChartPosition.Ecliptic.DecimalDegrees * 10) / 10;
		var planet_name = planets_style_dict[planet_key].text;
		var planet_marker = planets_style_dict[planet_key].utf8;
		var planet_radius = 95;

		planets_pos.push({ rad: planet_radius, theta: plnt_pos });

		var current_zodi = planet.Sign.key;
		var current_zodi_utf8 = signs_style_dict[current_zodi].utf8;

		connection_traces.push({ 						// Connection Traces Loop
			r: [r1, r2],
			theta: [plnt_pos, planets_pos[i].theta],
			mode: 'lines',
			line: {
				color: colors.tick,
				width: connection_traces_tickwidth
			},
			name: current_zodi_utf8 + " " + planet.ChartPosition.Ecliptic.ArcDegreesFormatted30,
			type: 'scatterpolar',
			hovertext: planet_marker,
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: 'text+name'
		});
		planets_style_dict[planet_key].x = [i + 1];
		planets_style_dict[planet_key].y = [planet_obj.length + 5 - i];

		planet_traces.forEach((trace, j) => {
			var theta_diff = trace.theta[0] - plnt_pos;
			var shiftTheta = (collTheta - Math.abs(theta_diff)) / 2;
			if (theta_diff > 0 && theta_diff < collTheta) { // plnt_pos < trace.theta 
				plnt_pos -= shiftTheta;
				planet_traces[j].theta[0] = trace.theta[0] + shiftTheta;
			}
			if (theta_diff < 0 && theta_diff > -collTheta) { // plnt_pos > trace.theta
				plnt_pos += shiftTheta;
				planet_traces[j].theta[0] = trace.theta[0] - shiftTheta;
			}
		})

		var retro_text = "";
		if (planet.isRetrograde) {
			retro_text = " (R)";
		}

		planets_style_dict[planet_key].sign_key = planet.Sign.key;
		planets_style_dict[planet_key].theta = plnt_pos;
		var pos_name = planet.ChartPosition.Ecliptic.ArcDegreesFormatted30 + " " + current_zodi_utf8;
		planets_style_dict[planet_key].pos_name = pos_name;

		planet_traces.push({ //PLANET TRACES LOOP
			key: planet_key,
			text: planet_marker,
			r: [planet_radius],
			theta: [plnt_pos],
			name: pos_name,
			mode: 'marker',
			marker: {
				color: 'black',
				size: 12,
				opacity: svgSymbolOpacity
			},
			type: 'scatterpolar',
			hovertext: planet_name + retro_text,
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: "text+name"
		}); // pos of ["sun","moon","planets","chiron", "sirius"]

		try {
			houses_style_dict[planet.House.id].planet.push(planet_key);
			houses_style_dict[planet.House.id].planet_text.push(" " + planet_marker + " " + planet_name);
			planets_style_dict[planet_key].house_id = planet.House.id;
			planets_style_dict[planet_key].sign_id = planet.Sign.key;
		}
		catch (err) {
			missing_ids.push(planet.key);
			planet.House = { id: 12 };
			houses_style_dict[planet.House.id].planet.push(planet_key);
			houses_style_dict[planet.House.id].planet_text.push(" " + planet_marker + " " + planet_name);

			console.log(err.message, " of ", planets_style_dict[planet.key].text);
		}
	}

	var celestial_obj = horoscope.CelestialPoints.all;
	for (var m = 0; m < celestial_obj.length; m++) { //Loop Celestial Points
		var hover_text = celestial_obj[m].ChartPosition.Ecliptic.ArcDegreesFormatted30;
		var celestial_key = celestial_obj[m].key;
		var celestial_sign_key = celestial_obj[m].Sign.key;
		var clst_pos = celestial_obj[m].ChartPosition.Ecliptic.DecimalDegrees;
		planets_style_dict[celestial_key].theta = clst_pos;
		var planet_marker = planets_style_dict[celestial_key].utf8;

		var object = horoscope.CelestialPoints[celestial_key];

		try {
			planets_style_dict[celestial_key].house_id = object.House.id;
			planets_style_dict[celestial_key].sign_id = object.Sign.key;
		} catch (err) {
			missing_ids.push(celestial_key);
			object.House = { id: 12 };
			planets_style_dict[celestial_key].house_id = object.House.id;
			planets_style_dict[celestial_key].sign_id = object.Sign.key;

			console.log(err.message, " of ", celestial_key);

		}

		// connection_traces.push({ 						// Connection Traces Loop
		// 	r: [r1, r2],
		// 	theta: [clst_pos, clst_pos],
		// 	mode: 'lines',
		// 	line: {
		// 		color: colors.tick,
		// 		width: 0 //connection_traces_tickwidth
		// 	},
		// 	name: current_zodi_utf8 + " " + planet.ChartPosition.Ecliptic.ArcDegreesFormatted30,
		// 	type: 'scatterpolar',
		// 	hovertext: planet_marker,
		// 	hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
		// 	hoverinfo: 'text+name'
		// });

		planet_traces.forEach((trace, j) => {
			var theta_diff = Math.round(trace.theta[0] - clst_pos);
			var shiftTheta = (collTheta - Math.abs(theta_diff)) / 2;
			if (theta_diff > 0 && theta_diff < collTheta) { // clst_pos < trace.theta 
				clst_pos -= shiftTheta;
				planet_traces[j].theta[0] = trace.theta[0] + shiftTheta;
			}
			if (theta_diff < 0 && theta_diff > -collTheta) { // clst_pos > trace.theta 
				clst_pos += shiftTheta;
				planet_traces[j].theta[0] = trace.theta[0] - shiftTheta;
			}
		})

		current_zodi_utf8 = signs_style_dict[celestial_sign_key].utf8;
		var pos_name = hover_text + " " + current_zodi_utf8;
		planets_style_dict[celestial_key].pos_name = pos_name;

		planet_traces.push({
			key: celestial_key,
			text: planets_style_dict[celestial_key].utf8,
			r: [planet_radius],
			theta: [clst_pos],
			name: pos_name,
			mode: 'marker',
			marker: {
				color: 'black',
				size: 12,
				opacity: svgSymbolOpacity
			},
			type: 'scatterpolar',
			hovertext: planets_style_dict[celestial_key].text,
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: "text+name"
		});
	} // pos of ["northnode", "southnode", "lilith"]

	console.log("planets added to house 12: ", missing_ids); 	// planets without listed houses.

	planet_traces.forEach(trace => {					// Symbols Traces Loop
		var planet_key = trace.key;
		var svgFile = planet_key + '.svg';
		var svgDataURL = createDataURLFromSVG(svgFile);
		var symbol_radius = 18.3;
		var symbol_pos_x = symbol_radius * Math.cos(((trace.theta[0] + offset) / 360) * 2 * Math.PI);
		var symbol_pos_y = symbol_radius * Math.sin(((trace.theta[0] + offset) / 360) * 2 * Math.PI);

		var svg_pos_x = (symbol_pos_x / 17.4) * 182;
		var svg_pos_y = -(symbol_pos_y / 17.4) * 182;

		planets_style_dict[planet_key].svgx = svg_pos_x;
		planets_style_dict[planet_key].svgy = svg_pos_y;

		planet_symbols.push({
			source: svgDataURL,
			x: symbol_pos_x,
			y: symbol_pos_y,
			xref: "x",
			yref: "y",
			xanchor: "center",
			yanchor: "middle",
			sizex: 1.4,
			sizey: 1.4,
		});
	});
	planet_symbols.push({
		source: createDataURLFromSVG("vedara_symbol.svg"),
		x: 0,
		y: 0,
		xref: "x",
		yref: "y",
		xanchor: "center",
		yanchor: "middle",
		sizex: 3.9,
		sizey: 3.9,
	});



	let { signs_traces, signsep_traces, signs_symbols } = signTraces(horoscope, offset, zodiacSys);
	planet_symbols = planet_symbols.concat(signs_symbols);
	let { houses_nums, housesep_traces, house_symbols } = houseTraces(horoscope, -155, isChecked, offset);
	planet_symbols = planet_symbols.concat(house_symbols);
	var traces_data = signsep_traces.concat(housesep_traces).concat(signs_traces).concat(connection_traces);

	let aspect_radius = 54;
	var aspect_traces = []; var aspect_traces_radius = [aspect_radius, aspect_radius];
	var all_aspect_types = horoscope.Aspects.types;
	var exclude_keys = [];
	var filtered_keys = valid_keys.filter(key => !exclude_keys.includes(key));
	var skip_objects = ["northnode", "southnode", "chiron", "lilith", "sirius"];
	const aspects_line_width = 1;
	filtered_keys.forEach(aspect_key => {
		var aspects_of_key = all_aspect_types[aspect_key];
		var aspects_key_length = 0;
		if (aspects_of_key != undefined) { // 13.06.1940 4Uhr 52°N/13°O Koch - quincunx undefined
			aspects_key_length = aspects_of_key.length;
		} else {
			console.log("undefined aspects for ", aspect_key);
		}
		for (var m = 0; m < aspects_key_length; m++) { //Loop All Aspects
			var obj1_key = aspects_of_key[m].point1Key;
			var obj2_key = aspects_of_key[m].point2Key;
			if (skip_objects.includes(obj1_key) || skip_objects.includes(obj2_key)) {
				continue;
			}
			if (isChecked) {
				var skip_points = ['ascendant', 'midheaven'];
				if (skip_points.includes(obj1_key) || skip_points.includes(obj2_key)) {
					continue;
				}
			}
			// ORBS
			var orb = aspects_of_key[m].orb;
			var orbUsed = aspects_of_key[m].orbUsed;
			var orbis = orb / orbUsed;
			var orbRating = classifyOrb(orbis);
			// console.log( orb, orbUsed, orbis, orbRating );
			const allPoints = Object.assign({}, horoscope.CelestialBodies, horoscope.CelestialPoints, horoscope.Angles)
			var aspect_theta1 = allPoints[obj1_key].ChartPosition.Ecliptic.DecimalDegrees;
			var aspect_theta2 = allPoints[obj2_key].ChartPosition.Ecliptic.DecimalDegrees;

			var aspect_type = aspects_of_key[m].aspectKey;
			planets_style_dict[obj1_key].aspect_keys.push(aspect_type);
			const tuple = [aspect_type, obj2_key, orbRating];
			planets_style_dict[obj1_key].aspects.push(tuple);
			var aspect_color = aspects_style_dict[aspect_type].color;
			var aspect_utf8 = aspects_style_dict[aspect_type].marker;
			var aspect_name = aspects_style_dict[aspect_type].name;
			aspect_traces.push({
				r: aspect_traces_radius,
				theta: [aspect_theta1, aspect_theta2],
				mode: 'lines',
				name: planets_style_dict[obj1_key].utf8 + " " + aspect_utf8 + " " + planets_style_dict[obj2_key].utf8,
				hovertext: aspects_style_dict[aspect_type].name,
				hoverlabel: { bgcolor: aspect_color, font: { color: 'black' } },
				text: aspect_name,
				hoverinfo: 'none',
				line: {
					//dash: 'dot',
					color: aspect_color,
					width: aspects_line_width,
				},
				type: 'scatterpolar',
			});
		}
	});

	traces_data = traces_data.concat(aspect_traces).concat(planet_traces);
	var theta360 = Array.from({ length: 361 }, (e, i) => i);
	var radius1 = Array.from({ length: 361 }, () => -148);
	var radius2 = Array.from({ length: 361 }, () => -133);
	var circ1 = {
		r: radius1,
		theta: theta360,
		name: 'Erde',
		mode: 'lines',
		fill: 'toself',
		fillcolor: colors.bg,
		line: {
			color: 'black',
			width: 0
		},
		type: 'scatterpolar',
	};
	var circ2 = {
		r: radius2,
		theta: theta360,
		hoverinfo: 'none',
		mode: 'lines',
		fill: 'toself',
		fillcolor: colors.bgSecondary,
		line: {
			width: 1,
			color: colors.bgSecondary
		},
		type: 'scatterpolar'
	};
	traces_data = traces_data.concat(circ2).concat(circ1).concat(houses_nums);
	return { traces_data, midheaven_theta, ascendant_theta, planet_symbols };
}

function signTraces(horoscope, offset, zodiacSys) {
	var siderealSys = 0;
	if (zodiacSys === "sidereal") {
		siderealSys = -30;
	}
	let signsep_traces = [], signs_traces = [], signs_symbols = []
	// SIGNS TRACES LOOP
	for (let i = 0; i < 12; i++) {
		var zodi_theta = horoscope.ZodiacCusps[i].ChartPosition.Ecliptic.DecimalDegrees;
		var sign_key = horoscope.ZodiacCusps[i].Sign.key;
		signs_traces.push({
			key: sign_key,
			r: [144],
			theta: [zodi_theta + 15 + siderealSys],
			name: signs_style_dict[sign_key].utf8 + signs_style_dict[sign_key].ele,
			mode: 'marker',
			marker: {
				color: 'red',
				size: 12,
				opacity: svgSymbolOpacity
			},
			type: 'scatterpolar',
			hovertext: signs_style_dict[sign_key].text,
			hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
			hoverinfo: "name+text"
		});
		signsep_traces.push({
			r: [128, 179],
			theta: [zodi_theta + siderealSys, zodi_theta + siderealSys],
			mode: 'lines',
			line: { color: '#fcf4ea', width: 1.5 },
			type: 'scatterpolar',
			hoverinfo: 'none'
		});
	}
	signs_traces.forEach(trace => {					// Signs Symbols Traces Loop
		var sign_key = trace.key;
		var svgFile = sign_key + '.svg';
		var svgDataURL = createDataURLFromSVG(svgFile);
		var symbol_radius = 22.2;
		var symbol_pos_x = symbol_radius * Math.cos(((trace.theta[0] + offset) / 360) * 2 * Math.PI);
		var symbol_pos_y = symbol_radius * Math.sin(((trace.theta[0] + offset) / 360) * 2 * Math.PI);

		var svg_pos_x = (symbol_pos_x / 17.4) * 182;
		var svg_pos_y = -(symbol_pos_y / 17.4) * 182;

		signs_style_dict[sign_key].svgx = svg_pos_x;
		signs_style_dict[sign_key].svgy = svg_pos_y;

		signs_symbols.push({
			x: symbol_pos_x,
			y: symbol_pos_y,
			sizex: 2.3,
			sizey: 2.3,
			source: svgDataURL,
			xanchor: "center",
			xref: "x",
			yanchor: "middle",
			yref: "y"
		});
	});
	return { signs_traces, signsep_traces, signs_symbols };
}

function houseTraces(horoscope, radius, isChecked, offset) {
	let housesep_traces = [], houses_nums = []; house_symbols = []; end_radius = 67; first_house_start = horoscope.Houses[0].ChartPosition.StartPosition.Ecliptic.DecimalDegrees;

	for (let i = 0; i < 12; i++) {
		var house_sign_key = horoscope.Houses[i].Sign.key;
		var house_sign = signs_style_dict[house_sign_key].text;

		// housenums even spaces
		var house_start = horoscope.Houses[i].ChartPosition.StartPosition.Ecliptic.DecimalDegrees;
		var house_end = horoscope.Houses[i].ChartPosition.EndPosition.Ecliptic.DecimalDegrees;

		var house_mid = house_start + (house_end - house_start) / 2;
		if (house_end - house_start < 0) {
			house_mid = house_start + (360 - house_start + house_end) / 2;
			if (house_mid > 360) {
				house_mid = house_mid - 360;
			}
		}

		housesep_traces.forEach((trace, c) => { // bugfix for 19.04.2023 - 20Uhr, koch
			var current_theta = trace.theta[0];
			if (current_theta >= house_start - 1 && current_theta <= house_start + 1) {
				console.log("relocated house: ", c + 1);
				if (c == 0) {
					first_house_start = current_theta + 180;
				}
				houses_nums[c].theta = [house_mid + 180];
				housesep_traces[c].theta = [current_theta + 180, current_theta + 180];
			}
		});

		if (i == 11 && house_end === 0) {
			if (first_house_start - house_start < 0) {
				house_mid = house_start + (360 - house_start + first_house_start) / 2;
			} else {
				house_mid = house_start + (first_house_start - house_start) / 2;
			}
			if (house_mid > 360) {
				house_mid = house_mid - 360;
			}
		}

		if ([0, 3, 6, 9].includes(i)) {
			end_radius = 190;
		} else {
			end_radius = 67;
		}
		housesep_traces.push({
			r: [radius + 1, end_radius],
			theta: [house_start, house_start],
			mode: 'lines',
			line: { color: '#fcdec2', width: 1 },
			type: 'scatterpolar',
			hoverinfo: 'none'
		});
		houses_style_dict[i + 1].sign = signs_style_dict[house_sign_key].utf8 + " " + house_sign;
		houses_style_dict[i + 1].sign_key = house_sign_key;

		var svgFile = house_sign_key + '.svg';
		var svgDataURL = createDataURLFromSVG(svgFile);

		var symbol_radius = 2.67;
		var symbol_pos_x = symbol_radius * Math.cos(((house_mid + offset) / 360) * 2 * Math.PI);
		var symbol_pos_y = symbol_radius * Math.sin(((house_mid + offset) / 360) * 2 * Math.PI);

		// var svg_pos_x = (symbol_pos_x / 17.4) * 182;
		// var svg_pos_y = -(symbol_pos_y / 17.4) * 182;

		// signs_style_dict[house_sign_key].svgx = svg_pos_x;
		// signs_style_dict[house_sign_key].svgy = svg_pos_y;

		if (isChecked) {
			houses_nums.push({
				r: [-140],
				theta: [house_mid],
				mode: 'marker',
				marker: {
					color: 'black',
					size: 12,
					opacity: svgSymbolOpacity
				},
				type: 'scatterpolar',
				hovertext: house_sign,
				hoverlabel: { bgcolor: colors.bgSecondary, font: { color: 'black' } },
				hoverinfo: 'text'
			});
			house_symbols.push({
				x: symbol_pos_x,
				y: symbol_pos_y,
				sizex: 0.67,
				sizey: 0.67,
				source: svgDataURL,
				xanchor: "center",
				xref: "x",
				yanchor: "middle",
				yref: "y"
			});
			console.log(signs_style_dict[house_sign_key])
		} else {
			houses_nums.push({
				r: [-140],
				theta: [house_mid],
				mode: 'text',
				text: horoscope.Houses[i].id,
				textfont: { family: textfont, size: 7, color: 'black' },
				type: 'scatterpolar',
				hovertext: houses_style_dict[i + 1].name + ": " + house_sign,
				hoverinfo: 'text'
			});
		}
	}
	return { housesep_traces, houses_nums, house_symbols };
}
function classifyOrb(orbis) {
	if (orbis > 0.66) {
		return 1;
	} else if (orbis > 0.33) {
		return 2;
	} else return 3;
}

module.exports = { plotData };
