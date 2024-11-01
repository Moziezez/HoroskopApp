require("dotenv").config();
const funcs = require("./assets/func.js");
const { plotXyStyle, circles } = require("./assets/components/plotStyle.js");
const { signs_style_dict, houses_style_dict, planets_style_dict, house_system_dict } = require("./assets/components/planetStyles.js");
var { plotStyle } = require("./assets/components/plotStyle.js");
const path = require("path");
const express = require("express");
const fs = require("fs");
// const pg = require("pg");
// const PDFDocument = require("pdfkit");
// const SVGtoPDF = require("svg-to-pdfkit");
const { JSDOM } = require("jsdom");
const env = require("dotenv");
env.config();

// function convertSVGtoPDF(svgFilePath, pdfFilePath) {
//   const doc = new PDFDocument();
//   const svg = fs.readFileSync(svgFilePath, 'utf8');

//   SVGtoPDF(doc, svg, 0, 0);
//   doc.pipe(fs.createWriteStream(pdfFilePath));
//   doc.end();
// }

// const dbEntry = require( "./assets/dbEntry.js" );
// const corsOptions = {
// 	origin: [process.env.HOST, process.env.CLI1],
// 	optionsSuccessStatus: 200,
// };
const app = express();
app.set("view engine", "ejs");
app.use(require('./app-use'));

app.get("/authenticated", (req, res) => {
	if (req.isAuthenticated()) {
		res.send("hello");
	} else {
		res.redirect("/");
	}
})

app.get("/plugin", (req, res) => {
	res.setHeader("content-type", "text/html; charset=utf-8");
	res.sendFile(
		path.join(__dirname, 'wp-horoskop-plugin', 'plugin_index.html')
	);
})

app.get("/assets/plotFunc", (req, res) => {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join(__dirname, 'assets', 'plotFunc.js')
	);
})

app.get("/form", (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	var user_data = {
		name: '',
		date: '',
		hour: '',
		minu: '',
		longi: '',
		lati: '',
		house: 'placidus',
		city: '',
		country: '',
		zodi: 'true',
		check: 'false',
		aspectChecks: [
			'1', '1', '1', '1',
			'1', '1', '1', '1',
			'1', '1'
		]
	};
	res.render("form", { userData: user_data });
})

app.get("/", async (req, res) => {
	// const db = new pg.Client({
	// 	user: "postgres",
	// 	host: "localhost",
	// 	database: "horoscope",
	// 	password: "12345",
	// 	port: 5432,
	// });
	// db.connect();
	// const user_db = await db.query("SELECT * FROM users");
	// let user_names = [];
	// user_db.rows.forEach((user) => {
	// 	user_names.push(user.name);
	// });
	// console.log(user_names);
	// try {
	// 	db.query(
	// 		`
	// 		INSERT INTO users
	// 		( name, day, month, year, minute, hour, longitude, latitude, housesysteme, sunsign, moonsign, ascendant, location )
	// 		VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 );
	// 		`,
	// 		[ 'Anders', 3, 11, 1995, 14, 15, 23, 23, 'placidus', 'aries', 'cancer', 'virgo', 'Hildesheim' ]
	// 	);
	// } catch (error) {
	// 	console.log("ERROR ON INSERTING VALUES", error);
	// }
	// db.end();

	var geo_key = process.env.GEO_KEY;
	var get_uri = process.env.HOST; // XXX
	var user_data = {
		name: 'Random',
		date: '25.06.1997',
		hour: '12',
		minu: '25',
		longi: '33',
		lati: '22',
		house: 'placidus',
		city: 'Hildesheim',
		country: 'Deutschland',
		zodi: 'true',
		check: 'false',
		aspectChecks: [
			'1', '1', '1', '1',
			'1', '1', '1', '1',
			'1', '1'
		]
	};
	var user_data = {
		name: '',
		date: '',
		hour: '',
		minu: '',
		longi: '',
		lati: '',
		house: 'placidus',
		city: '',
		country: '',
		zodi: 'true',
		check: 'false',
		aspectChecks: [
			'1', '1', '1', '1',
			'1', '1', '1', '1',
			'1', '1'
		]
	};
	res.render("index", { geo_key, get_uri, user_data });
});
app.get("/api/environment", (req, res) => {
	const geo_key = process.env.GEO_KEY;
	res.json({ geo_key });
});

app.get("/create-plot", function (req, res) {

	var { user, traces, aspects, symbols } = funcs.userInput(req.query);

	var config = plotStyle.config;
	var layout = plotStyle.layout;
	var planet_styles = planets_style_dict;
	var signs_styles = signs_style_dict;
	var system_name = house_system_dict[user.house];

	var data = circles.concat(traces);


	var loca_string = `${user.city} (${user.lat}°N, ${user.lon}°O)`;
	var house_string = `Häusersystem: ${system_name}.`;
	var layoutXy = plotXyStyle.layout;
	var configXy = plotXyStyle.config;

	res.json({
		loca_string,
		house_string,
		user,
		layout,
		config,
		data,
		layoutXy,
		configXy,
		aspects,
	});
});

app.get("/get-html", function (req, res) {
	var plot_style = plotStyle;

	try {
		var { user, traces, aspects, symbols } = funcs.userInput(req.query);
		// dbEntry.createEntry( user );
		// console.log( user );
		var sun_utf8 = signs_style_dict[user.sunsign].utf8;
		var sun_name = signs_style_dict[user.sunsign].text;
		var sun_sign = sun_utf8 + " " + sun_name;
		var moon_utf8 = signs_style_dict[user.moonsign].utf8;
		var moon_name = signs_style_dict[user.moonsign].text;
		var moon_sign = moon_utf8 + " " + moon_name;

		var asc_name = signs_style_dict[user.asc.Sign.key].text;
		var asc_utf8 = signs_style_dict[user.asc.Sign.key].utf8;
		var asc = asc_utf8 + " " + asc_name;
		var isChecked = req.body.Check;

		var date_string = `${user.day}.${user.month}.${user.year}`;
		var time_string = `${user.hour}:${user.minute} Uhr`;

		var loca_string = `${user.city} (${user.lat}°N, ${user.lon}°O)`;
		var pUserInfoString = 'Geboren am ' + date_string + ' um ' + time_string + ' in ' + loca_string;

		res.render("plot.ejs", {
			checked: isChecked,
			userData: user,
			plotConfig: plot_style.config,
			plotLayout: plot_style.layout,
			plotCircles: circles,
			plotPlanets: traces,
			sunSign: sun_sign,
			ascendant: asc,
			moonSign: moon_sign,
			system_name: house_system_dict[user.house],
			houses: houses_style_dict,
			planets: planets_style_dict,
			signs: signs_style_dict,
			xyConfig: plotXyStyle.config,
			xyLayout: plotXyStyle.layout,
			xyAspects: aspects,
			symbols: symbols,
			get_uri: process.env.HOST,
			reqQuery: req.query,
			pUserInfoString: pUserInfoString
		});
	} catch (err) {
		console.error(err);
	}
});

app.get("/render-pdf", async (req, res) => {
	const svgFilePath = "assets/undefined.svg";
	const pdfFilePath = "assets/converted-image.pdf";
	convertSVGtoPDF(svgFilePath, pdfFilePath);
});

app.get("/favicon.ico", function (req, res) {
	res.type("image/x-icon");
	res.sendFile(path.join(__dirname, "favicon.ico"));
});

app.get("/assets/components/svg/:filename", function (req, res) {
	const filename = req.params.filename
	res.setHeader("content-type", "image/svg+xml; charset=utf-8");
	res.sendFile(
		path.join(__dirname, req.url)
	);
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get("/assets/datetimepicker-master/jquery.js", function (req, res) {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join(__dirname, "assets", "datetimepicker-master", "jquery.js")
	);
});

app.get("/assets/plotFunc.js", function (req, res) {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join(__dirname, "assets", "plotFunc.js")
	);
});
app.get(
	"/assets/datetimepicker-master/build/jquery.datetimepicker.full.min.js",
	function (req, res) {
		res.setHeader("content-type", "text/javascript; charset=utf-8");
		res.sendFile(
			path.join(
				__dirname,
				"assets",
				"datetimepicker-master",
				"build",
				"jquery.datetimepicker.full.min.js"
			)
		);
	}
);
app.get(
	"/assets/html2pdf.js-master/dist/html2pdf.bundle.min.js",
	function (req, res) {
		res.setHeader("content-type", "text/javascript; charset=utf-8");
		res.sendFile(
			path.join(
				__dirname,
				"assets",
				"html2pdf.js-master",
				"dist",
				"html2pdf.bundle.min.js"
			)
		);
	}
);
app.get(
	"/assets/html2pdf.js-master/dist/html2pdf.bundle.min.js.map",
	function (req, res) {
		res.setHeader("content-type", "text/javascript; charset=utf-8");
		res.sendFile(
			path.join(
				__dirname,
				"assets",
				"html2pdf.js-master",
				"dist",
				"html2pdf.bundle.min.js.map"
			)
		);
	}
);
app.get("/assets/jsPDF-master/dist/jspdf.umd.js", function (req, res) {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join(__dirname, "assets", "jsPDF-master", "dist", "jspdf.umd.js")
	);
});
app.get("/public/css/jquery.datetimepicker.min.css", function (req, res) {
	res.setHeader("content-type", "text/css; charset=utf-8");
	res.sendFile(
		path.join(__dirname, "public", "css", "jquery.datetimepicker.min.css")
	);
});
app.get("/public/css/styles.css", function (req, res) {
	res.setHeader("content-type", "text/css");
	res.sendFile(path.join(__dirname, "public", "css", "styles.css"));
});
app.get("/public/css/plotStyles.css", function (req, res) {
	res.setHeader("content-type", "text/css");
	res.sendFile(path.join(__dirname, "public", "css", "plotStyles.css"));
});
app.get("/public/css/formStyles.css", function (req, res) {
	res.setHeader("content-type", "text/css");
	res.sendFile(path.join(__dirname, "public", "css", "formStyles.css"));
});

app.post("/svg-background", (req, res) => {
	var { ident_key, svgtag, file_name } = req.body;
	var viewport = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="655" height="600">`;
	var svgContent2 = viewport + svgtag + `</svg>`;
	const combinedSvgContent = `${svgContent2}`;
	const combinedSvgFilePath = "assets/" + file_name + "Background.svg";
	fs.writeFileSync(combinedSvgFilePath, combinedSvgContent, "utf-8"); // create background
	const svgBackground = fs.readFileSync(combinedSvgFilePath, "utf-8"); // background filename
	var dom = new JSDOM(
		`<!DOCTYPE html><html><body>${svgBackground}</body></html>`
	);
	const domDocument = dom.window.document;
	var svgHtml = ""; // init string for svg elements
	var xCenter = 322;
	var yCenter = 306; // xy-center position of planets in svg dl
	var svgIconsPath = "assets/components/svg/";
	Object.keys(planets_style_dict)
		.filter((planet_element) => planet_element !== "sirius")
		.forEach((planet_element) => {
			var svgFilePath = svgIconsPath + planet_element + ".svg";
			var xSymbol = xCenter + planets_style_dict[planet_element].svgx;
			var ySymbol = yCenter + planets_style_dict[planet_element].svgy;
			try {
				const svgContent = fs.readFileSync(svgFilePath, "utf-8");
				const svgDom = new JSDOM(svgContent);
				const svgDocument = svgDom.window.document;
				var svgElement = svgDocument.querySelector("svg").innerHTML;
				svgElement =
					`<g transform="matrix(0.16,0,0,0.16,${xSymbol},${ySymbol})">` +
					svgElement +
					`</g>`;
				svgHtml += svgElement;
				//console.log(svgElement) //svg ohne farbe nd position
				//document.body.appendChild(svgElement);
			} catch (error) {
				// console.log(error);
			}
		});
	var xCenter = 318;
	var yCenter = 303; // xy-center position signs in svg dl
	Object.keys(signs_style_dict).forEach((signs_element) => {
		var svgFilePath = svgIconsPath + signs_element + ".svg";
		var xSymbol = xCenter + signs_style_dict[signs_element].svgx;
		var ySymbol = yCenter + signs_style_dict[signs_element].svgy;
		try {
			const svgContent = fs.readFileSync(svgFilePath, "utf-8");
			const svgDom = new JSDOM(svgContent);
			const svgDocument = svgDom.window.document;
			var svgElement = svgDocument.querySelector("svg").innerHTML;
			svgElement =
				`<g transform="matrix(0.88,0,0,0.88,${xSymbol},${ySymbol})">` +
				svgElement +
				`</g>`;
			svgHtml += svgElement;
		} catch (error) {
			console.log(error);
		}
	});
	var node = domDocument.createElement("g");
	node.innerHTML = svgHtml;
	const wholeSvg = domDocument.body.querySelector("svg").appendChild(node);
	domDocument.body.querySelector("svg").innerHtml = wholeSvg;
	const printSvg = domDocument.body.outerHTML;
	fs.writeFileSync("assets/" + file_name + ".svg", printSvg, "utf-8");
	console.log("SVG files combined successfully!");
});

const port = 3030;
app.listen(process.env.PORT || port, "0.0.0.0", function () {
	console.log(`Server is running on port ${port}.`);
});
