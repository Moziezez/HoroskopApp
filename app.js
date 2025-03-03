import { userInput } from "./assets/func.js";
import { plotXyStyle, circles } from "./assets/components/plotStyle.js";
import { signs_style_dict, houses_style_dict, planets_style_dict, house_system_dict } from "./assets/components/planetStyles.js";
import { plotStyle } from "./assets/components/plotStyle.js";
import path from "path";
import express from "express";
import fs from "fs";
// global.ReadableStream = require('web-streams-polyfill').ReadableStream;
import { JSDOM } from "jsdom";
import env from 'dotenv';
env.config();
import { router } from './app-use.js';
import { userDataConst } from './userData.js';
import puppeteer from 'puppeteer';
// import axios from 'axios';
// import * as cheerio from 'cheerio';

//require("dotenv").config();
// const pg = require("pg");
// const dbEntry = require( "./assets/dbEntry.js" );

const app = express();
app.set("view engine", "ejs");
app.use(router);



// async function fetchHTML(url) {
// 	try {
// 		const { data: html } = await axios.get(url); // Fetch the page's HTML
// 		const $ = cheerio.load(html); // Load the HTML into cheerio

// 		// Example: Extract the page title
// 		const title = $('title').text();
// 		console.log('Page Title:', title);

// 		// Example: Extract all links
// 		const links = [];
// 		$('a').each((i, elem) => {
// 			links.push($(elem).attr('href'));
// 		});
// 		console.log('Links:', links);

// 		return $; // Returning cheerio instance for further manipulation
// 	} catch (error) {
// 		console.error('Error fetching HTML:', error);
// 	}
// }

// app.post("/products/id", (req, res) => {
// 	fetchHTML("https://vedara.de/produkt/talisman-aquarius/?via=7");
// })

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
		path.join('wp-horoskop-plugin', 'plugin_index.html')
	);
})

app.get("/assets/plotFunc", (req, res) => {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join('assets', 'plotFunc.js') //  
	);
})

app.get("/form", (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	// console.log("LOGGED", process.env.HOST);
	if (process.env.HOST == "http://localhost:3030") {
		var user_data = userDataConst;
		res.render("form", { userData: user_data });
	} else {
		res.render("form", {
			userData: {
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
			}
		});

	}

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
	var get_uri = process.env.HOST;

	res.render("index", { geo_key, get_uri });
});
app.get("/api/environment", (req, res) => {
	const geo_key = process.env.GEO_KEY;
	res.json({ geo_key });
});

app.get("/create-plot", function (req, res) {

	var { user, traces, aspects, symbols } = userInput(req.query);

	var config = plotStyle.config;
	var layout = plotStyle.layout;
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
		var { user, traces, aspects, symbols } = userInput(req.query);
		// dbEntry.createEntry( user );
		console.log(user);
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

		var loca_string = `${user.city !== undefined ? user.city : ''} (${user.lat}°N, ${user.lon}°O)`;
		var pUserInfoString = 'Geboren am ' + date_string + ' um ' + time_string + ' in ' + loca_string;
		// console.log("ASPECTS?:", aspects)

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

app.post("/download/part-pdf", async (req, res) => {

	const { input_html } = req.body;
	const htmlContent = `
		<!DOCTYPE html>
		<html lang="de">
		<head>
			<meta name="viewport" content="width=device-width" charset="UTF-8">
			<script src="https://cdn.plot.ly/plotly-2.16.1.min.js"></script><style id="plotly.js-style-global"></style>
			<base href='http://localhost:3030/'>
		</head>

		<body class="horo" style="">
			${input_html}
		</body>
		</html>
	`;

	if (!htmlContent) {
		return res.status(400).send('HTML content is required');
	}

	try {
		// console.log("Received HTML Content:", htmlContent.slice(0, 500));

		const browser = await puppeteer.launch({ headless: "true" });
		const page = await browser.newPage();

		// Set page content from the request
		await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

		await page.addStyleTag({ url: 'http://localhost:3030/public/css/formStyles.css' });
		await page.addStyleTag({ url: 'http://localhost:3030/public/css/plotStyles.css' });
		await page.addStyleTag({ url: 'http://localhost:3030/public/css/styles.css' });

		// Generate PDF
		const pdfBuffer = await page.pdf({ path: 'pdf1.pdf', format: 'A4', printBackground: true }); // 


		await browser.close();

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="pdf1.pdf"', // 'inline' to open in tab
		});
		res.send(pdfBuffer);
		console.log("PDF downloaded in app folder.")
	} catch (error) {
		console.error('Error generating PDF1:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.post("/download/full-pdf", async (req, res) => {
	// const svgFilePath = "assets/undefined.svg";
	// const pdfFilePath = "assets/converted-image.pdf";
	const { htmlContent } = req.body;

	if (!htmlContent) {
		return res.status(400).send('HTML content is required');
	}

	try {
		// console.log("Received HTML Content:", htmlContent.slice(0, 500));

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		// Set page content from the request
		await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

		await page.addStyleTag({ url: 'http://localhost:3030/public/css/formStyles.css' });
		await page.addStyleTag({ url: 'http://localhost:3030/public/css/plotStyles.css' });
		await page.addStyleTag({ url: 'http://localhost:3030/public/css/styles.css' });


		// Generate PDF
		const pdfBuffer = await page.pdf({ path: 'output_test.pdf', format: 'A4', printBackground: true });
		//res.send(pdfBuffer);

		const renderedHtml = await page.content();
		await browser.close();
		// res.send(renderedHtml);

		const responseData = {
			pdf: pdfBuffer,
			html: renderedHtml
		}

		res.json(responseData);

		// await new Promise(resolve => setTimeout(resolve, 2000));

		// Send the PDF as a response
		// res.set({
		// 	'Content-Type': 'application/pdf',
		// 	'Content-Disposition': 'inline; filename="output.pdf"', //attachment  <- this when creating pdf, 'inline' elsewise
		// });


	} catch (error) {
		console.error('Error generating PDF:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.get("/favicon.ico", function (req, res) {
	res.type("image/x-icon");
	res.sendFile(path.join(process.cwd(), "favicon.ico")); //  
});

app.get("/assets/components/svg/:filename", function (req, res) {
	const filename = req.params.filename;
	const filePath = path.join(process.cwd(), "assets", "components", "svg", filename); //  
	res.setHeader("content-type", "image/svg+xml; charset=utf-8");
	res.sendFile(filePath, function (err) {
		if (err) {
			console.error("File not found:", err);
			res.status(404).send("SVG file not found");
		}
	});
});

app.get("/assets/datetimepicker-master/jquery.js", function (req, res) {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join(process.cwd(), "assets", "datetimepicker-master", "jquery.js")
	);
});

app.get("/assets/plotFunc.js", function (req, res) {
	res.setHeader("content-type", "text/javascript; charset=utf-8");
	res.sendFile(
		path.join(process.cwd(), "assets", "plotFunc.js")
	);
});
app.get(
	"/assets/datetimepicker-master/build/jquery.datetimepicker.full.min.js",
	function (req, res) {
		res.setHeader("content-type", "text/javascript; charset=utf-8");
		res.sendFile(
			path.join(
				process.cwd(),
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
				process.cwd(),
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
				process.cwd(),
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
		path.join(process.cwd(), "assets", "jsPDF-master", "dist", "jspdf.umd.js")
	);
});
app.get("/public/css/jquery.datetimepicker.min.css", function (req, res) {
	res.setHeader("content-type", "text/css; charset=utf-8");
	res.sendFile(
		path.join(process.cwd(), "public", "css", "jquery.datetimepicker.min.css")
	);
});
app.get("/public/css/styles.css", function (req, res) {
	res.setHeader("content-type", "text/css");
	res.sendFile(path.join(process.cwd(), "public", "css", "styles.css"));
});
app.get("/public/css/plotStyles.css", function (req, res) {
	res.setHeader("content-type", "text/css");
	res.sendFile(path.join(process.cwd(), "public", "css", "plotStyles.css"));
});
app.get("/public/css/formStyles.css", function (req, res) {
	res.setHeader("content-type", "text/css");
	res.sendFile(path.join(process.cwd(), "public", "css", "formStyles.css"));
});

app.post("/svg-background", (req, res) => {
	var { ident_key, svgtag, file_name } = req.body;
	var viewport = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="725" height="700">`;
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
	var xCenter = 386;
	var yCenter = 367; // xy-center position of planets in svg dl
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
	var xCenter = 381;
	var yCenter = 364; // xy-center position signs in svg dl
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
app.listen(process.env.PORT || port, function () {
	console.log(`Server is running on port ${port}.`);
});
