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

const PORT = process.env.PORT || 5200;

app.listen(PORT, () => console.log(`The Server Is Running On: http://localhost:${PORT}`));

/* End Running The Server */

/* Start Handle The Routes */

const   adminRouter = require("./routes/admin.router"),
        productsRouter = require("./routes/products.router"),
        usersRouter = require("./routes/users.router"),
        categoriesRouter = require("./routes/categories.router"),
        ordersRouter = require("./routes/orders.router"),
        brandsRouter = require("./routes/brands.router"),
        appearedSectionsRouter = require("./routes/appeared_sections.router");

app.use("/admins", adminRouter);

app.use("/products", productsRouter);

app.use("/users", usersRouter);

app.use("/categories", categoriesRouter);

app.use("/orders", ordersRouter);

app.use("/brands", brandsRouter);

app.use("/appeared-sections", appearedSectionsRouter);

/* End Handle The Routes */