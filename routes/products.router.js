const productsRouter = require("express").Router();

const productsController = require("../controllers/products.controller");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/products");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_")}`);
    },
});

productsRouter.post("/add-new-product", multer({ storage }).fields([
    { name: "productImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
]), productsController.postNewProduct);

productsRouter.post("/adding-new-images-to-product-gallery/:productId", multer({ storage }).array("productGalleryImage", 10), productsController.postNewImagesToProductGallery);

productsRouter.get("/product-info/:productId", productsController.getProductInfo);

productsRouter.get("/all-products", productsController.getAllProducts);

productsRouter.delete("/:productId", productsController.deleteProduct);

productsRouter.delete("/gallery-images/:productId", productsController.deleteImageFromProductGallery);

productsRouter.put("/:productId", productsController.putProduct);

productsRouter.put("/update-product-gallery-image/:productId", multer({ storage }).single("productGalleryImage") , productsController.putProductGalleryImage);

productsRouter.put("/update-product-image/:productId", multer({ storage }).single("productImage") , productsController.putProductImage);

module.exports = productsRouter;