// Import Mongoose

const mongoose = require("mongoose");

// Create Admin Schema

const adminSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create Admin Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create Product Schema

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    discount: {
        type: Number,
        default: 0,
    },
    numberOfOrders: {
        type: Number,
        default: 0,
    },
    postOfDate: {
        type: Date,
        default: Date.now(),
    },
    imagePath: String,
    galleryImagesPaths: Array,
    startDiscountPeriod: Date,
    endDiscountPeriod: Date,
});

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

// Create User Schema

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    first_name: {
        type: String,
        default: "",
    },
    last_name: {
        type: String,
        default: "",
    },
    preview_name: {
        type: String,
        default: "",
    },
    favorite_products_list: {
        type: Array,
        default: [],
    },
    billing_address: {
        first_name: {
            type: String,
            default: "",
        },
        last_name: {
            type: String,
            default: "",
        },
        company_name: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
        street_address: {
            type: String,
            default: "",
        },
        apartment_number: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "",
        },
        postal_code: {
            type: Number,
            default: 1,
        },
        phone_number: {
            type: Number,
            default: 1,
        },
        email: {
            type: String,
            default: "",
        },
    },
    shipping_address: {
        first_name: {
            type: String,
            default: "",
        },
        last_name: {
            type: String,
            default: "",
        },
        company_name: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
        street_address: {
            type: String,
            default: "",
        },
        apartment_number: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "",
        },
        postal_code: {
            type: Number,
            default: 1,
        },
        phone_number: {
            type: Number,
            default: 1,
        },
        email: {
            type: String,
            default: "",
        },
    },
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

// Create Category Schema

const categorySchema = mongoose.Schema({
    name: String,
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("category", categorySchema);

// Create Order Schema

const orderSchema = mongoose.Schema({
    paymentReference: {
        type: String,
        default: "none",
    },
    order_amount: {
        type: Number,
        default: 0,
    },
    checkout_status: {
        type: String,
        default: "checkout_incomplete",
    },
    status: {
        type: String,
        default: "pending",
    },
    billing_address: {
        first_name: {
            type: String,
            default: "none",
        },
        last_name: {
            type: String,
            default: "none",
        },
        company_name: {
            type: String,
            default: "none",
        },
        country: {
            type: String,
            default: "none",
        },
        street_address: {
            type: String,
            default: "none",
        },
        apartment_number: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postal_code: {
            type: Number,
            default: 0,
        },
        phone: {
            type: Number,
            default: 0,
        },
        email: {
            type: String,
            default: "none",
        },
    },
    shipping_address: {
        first_name: {
            type: String,
            default: "none",
        },
        last_name: {
            type: String,
            default: "none",
        },
        company_name: {
            type: String,
            default: "none",
        },
        country: {
            type: String,
            default: "none",
        },
        street_address: {
            type: String,
            default: "none",
        },
        apartment_number: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postal_code: {
            type: Number,
            default: 0,
        },
        phone: {
            type: Number,
            default: 0,
        },
        email: {
            type: String,
            default: "none",
        },
    },
    order_products: [{
        reference: {
            type: String,
            default: "none",
        },
        quantity: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            default: "none",
        },
        unit_price: {
            type: Number,
            default: 0,
        },
        total_amount: {
            type: Number,
            default: 0,
        },
        image_url: {
            type: String,
            default: "none",
        },
    }],
    added_date: {
        type: Date,
        default: Date.now(),
    },
    orderNumber: Number,
    requestNotes: {
        type: String,
        default: "",
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

module.exports = {
    mongoose,
    adminModel,
    productModel,
    userModel,
    categoryModel,
    orderModel,
}