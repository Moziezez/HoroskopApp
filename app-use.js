import { Router } from 'express';
import bodyParser from 'body-parser';
import express from 'express';
import * as path from 'path';
import cors from 'cors';
const router = Router();
// import session from "express-session";
// import passport from "passport";
// import Strategy from "passport-local";
// import env from "dotenv";


// Use Cors Options
const corsOptions = {
	origin: [process.env.HOST, process.env.CLI1, process.env.CLI2, process.env.CLI3, process.env.CLI4, process.env.CLI5],
	optionsSuccessStatus: 200,
};
router.use(cors(corsOptions));

// Use Body Parsers
router.use(bodyParser.json({ limit: '5000kb' }));
router.use(bodyParser.urlencoded({ extended: true }));

// Use Static Dicts
router.use(express.static('public'));
const svgDirectory = path.join('assets', 'components', 'svg'); //__dirname
router.use('svg', express.static(svgDirectory));

// Use Sessions
// router.use( session({
//     secret: "TOPSECRETWORD",
//     resave: false,
//     saveUninitialized: true,
// }))
// router.use( passport.initialize() );
// router.use( passport.session() );

export { router };
