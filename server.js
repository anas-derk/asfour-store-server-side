/* Start Import And Create Express App */

const express = require("express");

const app = express();

/* End Import And Create Express App */

/* Start Config The Server */

const cors = require("cors"),
    bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());

require('dotenv').config();

/* End Config The Server */

/* Start direct the browser to statics files path */

const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets")));

/* End direct the browser to statics files path */

/* Start Running The Server */

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => console.log(`The Server Is Running On: http://localhost:${PORT}`));

/* End Running The Server */

/* Start Handle The Routes */

const adminRouter = require("./routes/admin.router"),
        productsRouter = require("./routes/products.router");

app.use("/admin", adminRouter);

app.use("/products", productsRouter);

/* End Handle The Routes */