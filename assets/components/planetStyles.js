var planets_style_dict = {	// Markers, Colors, Descriptions and Aspects for Planets
	sun: {
		utf8: '\u2609',
		text: 'Sonne'
	},
	moon: {
		utf8: '\u263D',
		text: 'Mond'
	},
	mercury: {
		utf8: '\u263F',
		text: 'Merkur'
	},
	venus: {
		utf8: '\u2640',
		text: 'Venus'
	}, 
	mars: {
		utf8: '\u2642',
		text: 'Mars'
	},
	jupiter: {
		utf8: '\u2643',
		text: 'Jupiter'
	},
	saturn: {
		utf8: '\u2644',
		text: 'Saturn'
	},
	uranus: {
		utf8: '\u2645',
		text: 'Uranus'
	},
	neptune: {
		utf8: '\u2646',
		text: 'Neptun'
	},
	pluto: {
		utf8: '\u2647',
		text: 'Pluto'
	},
	chiron: {
		utf8: '\u26B7',
		text: 'Chiron'
	},
	sirius: {
		utf8: '\u26B9',
		text: 'Sirius'
	},
	northnode: {
		utf8: '\u260A',
		text: 'Aufst. Mondknoten (R)'
	}, 
	southnode: {
		utf8: '\u260B',
		text: 'Abst. Mondknoten (R)'
	},
	lilith: {
		utf8: '\u26B8',
		text: 'Lilith'
	},
	ascendant: {
		utf8: 'AC',
		text: 'Aszendent'
	},
	midheaven: {
		utf8: 'MC',
		text: 'Medium Coeli'
	}
};

var signs_style_dict = {
	aries: {
		utf8: '\u2648',
		text: 'Widder',
		ele: 'Feuer'
	},
	taurus: {
		utf8: '\u2649', 
		text: 'Stier',
		ele: 'Erde'
	},
	gemini: {
		utf8: '\u264A',
		text: 'Zwilling',
		ele: 'Luft'
	},
	cancer: {
		utf8: '\u264B',
		text: 'Krebs',
		ele: 'Wasser'
	},
	leo: {
		utf8: '\u264C',
		text: 'Löwe',
		ele: 'Feuer'
	},
	virgo: {
		utf8: '\u264D',
		text: 'Jungfrau',
		ele: 'Erde'
	},
	libra: {
		utf8: '\u264E',
		text: 'Waage',
		ele: 'Luft'
	},
	scorpio: {
		utf8: '\u264F',
		text: 'Skorpion',
		ele: 'Wasser'
	},
	sagittarius: {
		utf8: '\u2650',
		text: 'Schütze',
		ele: 'Feuer'
	},
	capricorn: {
		utf8: '\u2651',
		text: 'Steinbock',
		ele: 'Erde'
	},
	aquarius: {
		utf8: '\u2652',
		text: 'Wassermann',
		ele: 'Luft'
	},
	pisces: {
		utf8: '\u2653',
		text: 'Fische',
		ele: 'Wasser'
	}
};

var aspects_style_dict = {
	trine: {
		color: 'rgb(73, 127, 2)',
		marker: '\u1401',
		size: 18,
		name: 'Trigon',
		deg: '120°' 
	},
	square:{
		color: 'rgb(255,182,193)',
		marker: '\u2750', // 2750  25A1
		size: 20,
		name: 'Quadrat',
		deg: "90°"
	},
	'semi-square':{
		color: 'rgb(206,71,4)',
		marker: '\u2220',
		size: 20,
		name: 'Semi-Quadrat',
		deg: "45°"
	},
	conjunction: {
		color: 'rgb(1, 236, 125)',
		marker: '\u260C',
		size: 22,
		name: 'Konjunktion',
		deg: "0°"
	},
	opposition: {
		color: 'rgb(157, 56, 56)',
		marker: '\u260D',
		size: 22,
		name: 'Opposition',
		deg: '180°'
	},
	septile: {
		color: 'rgb(222, 236, 101)',
		marker: 'S',
		size: 24,
		name: 'Septil',
		deg: '51.5°'
	},
	sextile: {
		color: 'rgb(201, 236, 125)',
		marker: '\u26B9',
		size: 24,
		name: 'Sextil',
		deg: '60°'
	},
	quintile: {
		color: 'rgb(167, 238, 167)',
		marker: 'Q',
		size: 20,
		name: 'Quintil',
		deg: '72°'
	},
	'semi-sextile': {
		color: 'rgb(130, 253, 85)',
		marker: '\u26BA',
		size: 20,
		name: 'Semi-Sextil',
		deg: '30°'
	},
	quincunx: {
		color: 'rgb( 111, 87, 228)', // 'rgb(4, 125, 206)',
		marker: '\u26BB',
		size: 20,
		name: 'Quinkunx',
		deg: '150°'
	},
}

var houses_style_dict = {	//Aspects for Houses
	1: { name: 'Haus 1', planet: [], planet_text: [] },
	2: { name: 'Haus 2', planet: [], planet_text: [] },
	3: { name: 'Haus 3', planet: [], planet_text: [] },
	4: { name: 'Haus 4', planet: [], planet_text: [] },
	5: { name: 'Haus 5', planet: [], planet_text: [] },
	6: { name: 'Haus 6', planet: [], planet_text: [] },
	7: { name: 'Haus 7', planet: [], planet_text: [] },
	8: { name: 'Haus 8', planet: [], planet_text: [] },
	9: { name: 'Haus 9', planet: [], planet_text: [] },
	10: { name: 'Haus 10', planet: [], planet_text: [] },
	11: { name: 'Haus 11', planet: [], planet_text: [] },
	12: { name: 'Haus 12', planet: [], planet_text: [] },
};

var house_system_dict = {
	placidus: 'Placidus',
	koch: 'Koch',
	campanus: 'Campanus',
	'whole-sign': 'Tierkreiszeichen',
	'equal-house': 'Gleiche Häuser',
	regiomontanus: 'Regiomontanus',
	topocentric: 'Topozentrisch'
}

module.exports = { planets_style_dict, signs_style_dict, aspects_style_dict, houses_style_dict, house_system_dict };