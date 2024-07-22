const {Router} = require('express');
const bodyParser = require( "body-parser" );
const express = require( "express" );
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const Strategy = require("passport-local");

const router = Router();

// Use Cors Options
const corsOptions = {
	origin: ["http://localhost:3030/", "https://horoskop.vedaversum.com/"],
	optionsSuccessStatus: 200,
};
// router.use( cors(corsOptions) );

// Use Body Parsers
router.use( bodyParser.json({ limit: '5000kb' }));
router.use( bodyParser.urlencoded({ extended: true }));

// Use Static Dicts
router.use( express.static( 'public' )); 
const svgDirectory = path.join( __dirname, 'assets', 'components', 'svg' );
router.use( 'svg', express.static( svgDirectory )); 

// Use Sessions
router.use( session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
}))
router.use(passport.initialize());
router.use(passport.session());

module.exports = router;
