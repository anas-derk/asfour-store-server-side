// Import  Order Model Object

const { storeModel } = require("../models/all.models");

async function getAllStoresInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Stores Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await storeModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ orderNumber: -1 }),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getStoresCount(filters) {
    try {
        return {
            msg: "Get Stores Count Process Has Been Successfully !!",
            error: false,
            data: await storeModel.countDocuments(filters),
        }
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getAllStoresInsideThePage,
    getStoresCount,
}