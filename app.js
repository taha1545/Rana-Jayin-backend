require('dotenv').config();
//
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db/models');
const ErrorHandler = require('./app/Middlewares/Handle');
const routes = require('./Routes');
const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
}));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(
    "/public",
    express.static(path.join(__dirname, "public"), {
        setHeaders: (res, filePath) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        },
    })
);

// 
app.use('/api/v1', routes);
app.get('/', (req, res) => { res.json({ message: 'Welcome to Rana Jayin Backend' }); });
app.use((req, res) => { res.status(404).json({ message: 'No endpoint found for this request', }); });
app.use(ErrorHandler);

//   
const PORT = process.env.APP_PORT || 80;
db.sequelize
    .sync()
    .then(() => {
        console.log(' Database connected ');
        app.listen(PORT, () => {
            console.log(` Server is running `);
        });
    })
    .catch((err) => {
        console.error(' err to DB:', err);
    });
