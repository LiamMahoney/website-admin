const express = require('express');
const winston = require('winston');
const https = require('https');
const path = require('path');

const logger = winston.createLogger({
    level: "info",
    transports: [new winston.transports.File({ filename: './logs/app.log' })],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
        res.status(200).json({});
    }
    next();
});

app.get('/stylesheet.css', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stylesheet.css"));
});

app.get('/admin.js', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/admin.js"));
});

app.get('/*', (req, res) => {
    if (!req.query.token) {
        // user needs to authenticate
        res.redirect(301, 'https://api.liammahoney.dev/authentication');
    } else {
        // // need to check that token is valid
        // let options = {
        //     host: 'api.liammahoney.dev',
        //     port: '443',
        //     path: `authCheck?${req.query.token}`,
        //     method: 'GET'
        // }

        // let apiRequest = https.request(options, (apiResponse) => {

        //     apiResponse.on("end", () => {
        //         if (apiResponse.statusCode === 200) {
        //             // serving admin page
        //             res.sendFile(path.join(__dirname, "/public/admin.html"));
        //         } else {
        //             // authentication failed.
        //             res.redirect(301, "https://liammahoney.dev/401.html");
        //         }
        //     });
        // });

        // apiRequest.on("error", (err) => {
        //     logger.error("error", { error: err });
        //     res.status(500);
        //     res.end("internal error");
        // });

        // apiRequest.end();

        let options = {
            host: 'api.liammahoney.dev',
            port: '443',
            path: '/',
            method: 'GET'
        }

        let apiRequest = https.request(options, (apiResponse) => {
            data = ""
            apiResponse.on('data', (chunk) => {
                data += chunk;
            });

            apiResponse.on('end', () => {
                console.log(`RESPONSE: ${data}`);
                res.sendFile(path.join(__dirname, "/public/admin.html"));
            });
        });

        apiRequest.on('error', (err) => {
            console.log(`ERROR: ${err}`);
        });

        apiRequest.end();
    }

});



app.listen(8001);
console.log("admin listening on 8001");
