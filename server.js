/* Start Import And Create Express App */

const express = require("express");

const app = express();

/* End Import And Create Express App */

/* Start Config The Server */

const cors = require("cors"),
    bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());

require("dotenv").config();

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
    
    try{
        await mongoose.connect(process.env.DB_URL);
    }
    catch(err) {
        console.log(err);
    }

    /* Start Handle The Routes */

    app.use("/admins", require("./routes/admins.router"));

    app.use("/products", require("./routes/products.router"));

    app.use("/users", require("./routes/users.router"));

    app.use("/categories", require("./routes/categories.router"));

    app.use("/orders", require("./routes/orders.router"));

    app.use("/brands", require("./routes/brands.router"));

    app.use("/appeared-sections", require("./routes/appeared_sections.router"));

    app.use("/global-passwords", require("./routes/global_passwords.router"));

    app.use("/subscriptions", require("./routes/subscriptions.router"));

    app.use("/referals", require("./routes/referals.router"));

    app.use("/stores", require("./routes/stores.router"));

    /* End Handle The Routes */
});

/* End Running The Server */

/* Start Handling Events */

mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("disconnected", () => console.log("disconnected"));
mongoose.connection.on("reconnected", () => console.log("reconnected"));
mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
mongoose.connection.on("close", () => console.log("close"));

process.on("SIGINT", async () => {
    await mongoose.connection.close();
});

/* End Handling Events */

module.exports = {
    mongoose,
}