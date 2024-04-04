// Import Mongoose

const { mongoose } = require("../server");

// Create Admin Schema

const adminSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false,
    },
    isMerchant: {
        type: Boolean,
        default: false,
    },
    storeId: {
        type: String,
        required: true,
    },
    permissions: [
        {
            name: {
                type: String,
                required: true,
                enum: [
                    "Add New Brand",
                    "Update Brand Info",
                    "Delete Brand",
                    "Update Order Info",
                    "Delete Order",
                    "Update Order Info",
                    "Update Order Product Info",
                    "Delete Order Product",
                    "Add New Category",
                    "Update Category Info",
                    "Delete Category",
                    "Add New Product",
                    "Update Product Info",
                    "Delete Product",
                    "Show And Hide Sections",
                    "Change Bussiness Email Password",
                ],
            },
            value: {
                type: Boolean,
                required: true,
            }
        },
    ],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: String,
    creatingDate: {
        type: Date,
        default: Date.now(),
    },
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Store Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create Store Schema

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    ownerFirstName: {
        type: String,
        required: true,
    },
    ownerLastName: {
        type: String,
        required: true,
    },
    ownerEmail: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    productsType: {
        type: String,
        required: true,
    },
    productsDescription: {
        type: String,
        required: true,
    },
    creatingOrderDate: {
        type: Date,
        default: Date.now(),
    },
    approveDate: Date,
    rejectionDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

// Create Product Schema

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
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
    imagePath: {
        type: String,
        required: true,
    },
    galleryImagesPaths: Array,
    startDiscountPeriod: Date,
    endDiscountPeriod: Date,
    storeId: {
        type: String,
        required: true,
    }
});

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

// Create User Schema

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    provider: {
        type: String,
        default: "same-site",
    },
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
    wallet_products_list: {
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
            default: "Kuwait",
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
            type: String,
            default: "0096560048235",
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
            default: "Kuwait",
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
            type: String,
            default: "0096560048235",
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
    name: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    }
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("category", categorySchema);

// Create Order Schema

const orderSchema = mongoose.Schema({
    customerId: {
        type: String,
        default: "",
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
            type: String,
            default: "",
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
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
    },
    order_products: [{
        productId: {
            type: String,
            required: true,
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
        discount: {
            type: Number,
            default: 0,
        },
        total_amount: {
            type: Number,
            default: 0,
        },
        image_path: {
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
    isDeleted: {
        default: false,
        type: Boolean,
    },
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

// Create Brand Schema

const brandSchema = mongoose.Schema({
    imagePath: String,
    title: String,
});

// Create Brand Model From Brand Schema

const brandModel = mongoose.model("brand", brandSchema);

// Create Appeared Sections Schema

const appearedSectionsSchema = mongoose.Schema({
    sectionName: String,
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// Create Appeared Sections Model From Appeared Sections Schema

const appearedSectionsModel = mongoose.model("appeared_sections", appearedSectionsSchema);

// Create Global Password Schema

const globalPasswordSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

// Create Subscription Schema

const subscriptionShema = mongoose.Schema({
    email: String,
    subscriptionDate: {
        type: Date,
        default: Date.now(),
    }
});

// Create Subscription Model From Subscription Schema

const subscriptionModel = mongoose.model("subscription", subscriptionShema);

// Create Referal Schema

const referalShema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    referalDate: {
        type: Date,
        default: Date.now(),
    },
    isAppeared: {
        type: Boolean,
        default: true,
    }
});

// Create Referal Model From Referal Schema

const referalModel = mongoose.model("referal", referalShema);

module.exports = {
    mongoose,
    adminModel,
    storeModel,
    productModel,
    userModel,
    categoryModel,
    orderModel,
    brandModel,
    appearedSectionsModel,
    globalPasswordModel,
    subscriptionModel,
    referalModel,
}