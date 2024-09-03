const { Origin, Horoscope } = require('circular-natal-horoscope-js');
var { getAspectTraces } = require('./components/xyAspects.js');
var { plotData } = require('./components/plotData.js');
var { plotStyle, plotXyStyle } = require('./components/plotStyle.js');

function userInput(req) { // Save User Input to Variables
	var date = req.query.date.split("."),
		year = date[2],
		month = date[1],
		day = date[0];
	var name = req.query.name,
		lat = req.query.lati,
		lon = req.query.longi, 
		loca = req.query.loca;
	var hour = req.query.hour,
		minu = req.query.minu,
		house_system = req.query.house; 
	var zodi = req.query.zodi;

	function zipArraysIntoObject(keys, values) {
		const result = {};
		try {
			keys.forEach((key, index) => {
				result[key] = values[index];
			});
		} catch (error) {
			console.log("error in aspect checks", error);
			keys.forEach((key, index) => {
				result[key] = '1';
			});
		}
		return result;
	}

	var aspectChecksBinary = req.query.aspectChecks;
	var keys = [ "opposition", "trine",	"square", "semi-square", "conjunction", "sextile", "semi-sextile", "quintile", "quincunx", "septile" ];
	var valid_keys = [];
	try {
		var aspectChecksDict = zipArraysIntoObject( keys, aspectChecksBinary );
		Object.entries( aspectChecksDict ).forEach( ([ key, value ]) => {
			if ( value === "1" ) {
				valid_keys.push(key);
			}		
		});
	} catch ( err ) {
		console.log( err );
		valid_keys = keys;
	}

	var zodiac = "sidereal";
	if ( zodi === "true") {
		zodiac = "tropical";
	}
	if ( Math.abs( parseFloat( lon ) ) > 180) {
		return true;
	}	else if ( Math.abs( parseFloat( lat ) ) > 90) {
		return true;
	}
	var isChecked = req.body.Check; // undefined or 'on'
	if ( isChecked ) {
		hour = '12';
		minu = '00';
		house_system = 'whole-sign';
	}

	try {
		var origiin = new Origin({ 
			year: parseInt(year), month: parseInt(month) - 1,	//0 = January, 11 = December!
			date: parseInt(day), hour: parseInt(hour), minute: parseInt(minu), latitude: parseFloat(lat), longitude: parseFloat(lon)
		});
	} catch (error) {
		console.log(error);
	}
	
	var horoscope = new Horoscope({ 
		origin: origiin, houseSystem: house_system, zodiac: zodiac, aspectPoints: [ 'bodies', 'points', 'angles' ],
		aspectWithPoints: [ 'bodies', 'points', 'angles' ], aspectTypes: [ "major", "minor" ], customOrbs: {}, language: 'en'
	});
	var user_data = {	
		"name": name, "day": day, "month": month, "year": year, "minute": minu, "hour": hour,
		"lon": lon, "lat": lat, "house": house_system, "sunsign": horoscope.SunSign.key, "moonsign": horoscope.CelestialBodies.moon.Sign.key,
		"asc": horoscope.Ascendant, "loca": loca
	};
	const { traces_data, midheaven_theta, ascendant_theta, planet_symbols } = plotData( horoscope, isChecked, zodiac, valid_keys );

	var { aspects_plot_traces, planet_xy_symbols } = getAspectTraces(horoscope, isChecked); 
	var offset = 180 - ascendant_theta;	// offset for plot rotation -> Ac always left
	var MC = midheaven_theta;					
	var IC = MC + 180; 
	if (MC > 180) {			// bugfix for horoscope module
		IC = MC - 180;	
	}
	var AC = ascendant_theta;					
	var DC = AC + 180;						   
	if (AC > 180) {
		DC = AC - 180;
	}
	if ( isChecked ) {
		MC = 444; AC = 444;  DC = 444; IC = 444;
	}
	plotStyle.layout.polar.angularaxis.tickvals = [AC, MC, DC, IC];
	plotStyle.layout.polar.angularaxis.rotation = offset;
	plotStyle.layout.images = planet_symbols;
	plotXyStyle.layout.images = planet_xy_symbols;

	return {
		user: user_data,
		traces: traces_data,
		aspects: aspects_plot_traces,
		symbols: planet_symbols
	};
}

module.exports = { userInput };	
