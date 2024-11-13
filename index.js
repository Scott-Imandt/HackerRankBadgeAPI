import 'dotenv/config';
import express from 'express'
import cors from 'cors'

import { scrape } from './scrape.js';

const port = process.env.PORT || 4000;
const app = express();

//register view engine
app.set('view engine', 'ejs');

app.listen(port);


const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


//Middle Ware
app.use(cors(corsOptions))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use("/public", express.static('public'));


app.get('/public/python.svg', (req, res) => {
    res.setHeader('content-type', 'image/svg+xml')
    res.sendFile(path.join(__dirname, 'public', 'python.svg'))
})

app.get('/', async (req, res) => {
    res.setHeader('content-type', 'image/svg+xml')
    //console.log(scrape("Python"))

    console.log(req.query)

    if (req.query.username != null && req.query.badge != null) {
        try {
            // Wait for the scrape function to complete

            let username = req.query.username.replace(/'/g, "");
            let badge = req.query.badge.replace(/'/g, "");

            const svgData = await scrape(username, badge);

            // Send the scraped SVG data as the response
            console.log(svgData)
            if (svgData == null) {
                res.render('index', { title: "Error", badgeGradient: null, starCount: 0, badgeLink: null });
            }

            if(svgData.badgeTitle == "Python"){
                svgData.badgehref = "https://www.hackerrankapi.scottimandt.com/public/python.svg"
            }
            res.render('index', { title: svgData.badgeTitle, badgeGradient: svgData.badgeGradient, starCount: svgData.badgeStarCount, badgeLink: svgData.badgehref });

        } catch (error) {
            // Handle any errors during scraping
            console.error('Error during scraping:', error);
            res.status(500).send('An error occurred while scraping the data.');
        }

    }
    else {
        res.render('index', { title: "Error", badgeGradient: null, starCount: 0, badgeLink: null });
    }


})

app.use((req, res) => {
    res.status(404).send("Incorrect URL")
})


