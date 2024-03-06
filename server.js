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

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`The Server Is Running On: http://localhost:${PORT}`);
    mongoose.connect(process.env.DB_URL);
});

/* End Running The Server */

/* Start Handle The Routes */

const   adminRouter = require("./routes/admin.router"),
        productsRouter = require("./routes/products.router"),
        usersRouter = require("./routes/users.router"),
        categoriesRouter = require("./routes/categories.router"),
        ordersRouter = require("./routes/orders.router"),
        brandsRouter = require("./routes/brands.router"),
        appearedSectionsRouter = require("./routes/appeared_sections.router"),
        globalPasswordsRouter = require("./routes/global_passwords");

app.use("/admins", adminRouter);

app.use("/products", productsRouter);

app.use("/users", usersRouter);

app.use("/categories", categoriesRouter);

app.use("/orders", ordersRouter);

app.use("/brands", brandsRouter);

app.use("/appeared-sections", appearedSectionsRouter);

app.use("/global-passwords", globalPasswordsRouter);

/* End Handle The Routes */

/* Start Handling Events */

mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("disconnected", () => console.log("disconnected"));
mongoose.connection.on("reconnected", () => console.log("reconnected"));
mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
mongoose.connection.on("close", () => console.log("close"));

process.on("SIGINT", () => {
    mongoose.connection.close();
});

/* End Handling Events */

module.exports = {
    mongoose,
}