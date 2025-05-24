const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const routeManager = require('./route/route.manager.js')
const db = require("./models/index");
const cors = require('cors')
const swaggerDocs = require('./swagger.js')
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const helmet = require('helmet');
const xss = require('xss-clean');
const fs = require("fs");
const path = require("path");
const https = require("https");

// set security HTTP headers
app.use(helmet());
app.use(xss());

app.use(express.json())
app.use(express.urlencoded());

const corsOptions = {
  origin: '*', // your frontend domain
  credentials: true, // allow cookies/auth headers
  optionsSuccessStatus: 200
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));


db.sequelize.sync()
    .then(() => {
        console.log("sync db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use((req, res, next) => {
    console.log('\n', req.method, req.originalUrl, ' ===> ', '\n');
    console.table(req.body);
    next();
})

routeManager(app)
swaggerDocs(app, process.env.PORT)

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({
        status: 'fail',
        code  : 500,
        error : err.message,
        stack : err.stack,
    });
});

// 404 handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: 'fail',
        code  : 404,
        error : `Can't find ${req.originalUrl}`
    });
});

if (process.env.USE_SSL) {
    // Read SSL certificate and key files
    const options = {
        key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
    };
    // Create HTTPS server
    const server = https.createServer(options, app);
    server.listen(process.env.PORT, () => {
        console.log(`:::::::::::::::: SERVER RUNNING ON ${process.env.PORT}.`);
    });
} else {
    app.listen(process.env.PORT, () => {
        console.log(`:::::::::::::::: SERVER RUNNING ON ${process.env.PORT}.`);
    });
}

module.exports = app;


// git push github main
