async function postNewBrand(req, res) {
    try{
        const newBrandImagePath = req.file.path;
        const newBrandTitle = req.body.title;
        const { addNewBrand } = require("../models/brands.model");
        await res.json(await addNewBrand({ imagePath: newBrandImagePath, title: newBrandTitle }));
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function getAllBrands(req, res) {
    try{
        const { getAllBrands } = require("../models/brands.model");
        await res.json(await getAllBrands());
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function deleteBrand(req, res) {
    try{
        const brandId = req.params.brandId;
        if (!brandId) await res.status(400).json("Sorry, Please Send Brand Id !!");
        else {
            const { deleteBrand } = require("../models/brands.model");
            const result = await deleteBrand(brandId);
            if (!result.isError) {
                const { unlinkSync } = require("fs");
                unlinkSync(result.deletedBrandPath);
            }
            await res.json(result);
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function putBrandInfo(req, res) {
    try{
        const brandId = req.params.brandId;
        const newBrandTitle = req.body.newBrandTitle;
        if (!brandId || !newBrandTitle) await res.status(400).json("Sorry, Please Send Brand Id, New Brand Name !!");
        else {
            const { updateBrandInfo } = require("../models/brands.model");
            const result = await updateBrandInfo(brandId, newBrandTitle);
            await res.json(result);
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function putBrandImage(req, res) {
    try {
        const brandId = req.params.brandId,
            newBrandImagePath = req.file.path;
        if (!brandId || !newBrandImagePath) await res.status(400).json("Sorry, Please Send Brand Id And New Image !!");
        else {
            const { updateBrandImage } = require("../models/brands.model");
            const oldImagePath = await updateBrandImage(brandId, newBrandImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(oldImagePath);
            await res.json(newBrandImagePath);
        }
    }
    catch (err) {
        console.log(err)
        await res.status(500).json(err);
    }
}

module.exports = {
    postNewBrand,
    getAllBrands,
    deleteBrand,
    putBrandInfo,
    putBrandImage,
}