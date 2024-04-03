// Import  Order Model Object

const { storeModel } = require("../models/all.models");

async function getAllStoresInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Stores Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await storeModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ creatingOrderDate: -1 }),
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

async function getStoreDetails(storeId) {
    try {
        const store = await storeModel.findById(storeId);
        if (store) {
            return {
                msg: `Get Details For Store: ${storeId} Process Has Been Successfully !!`,
                error: false,
                data: store,
            }
        }
        return {
            msg: "Sorry, This Store Is Not Found !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function createNewStore(storeDetails) {
    try{
        const store = await storeModel.findOne({ email: storeDetails.ownerEmail });
        if (store) {
            return {
                msg: "Sorry, This Email Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        const newStore = new storeModel(storeDetails);
        await newStore.save();
        return {
            msg: "Creating New Store Process Has Been Successfully !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateStoreInfo(storeId, newStoreDetails) {
    try {
        const store = await storeModel.findById(storeId);
        if (store) {
            await storeModel.updateOne({ _id: storeId }, { ...newStoreDetails });
            return {
                msg: `Update Details For Store That : ( Id: ${ storeId }) Process Has Been Successfully !!`,
                error: false,
                data: {},
            };
        }
        return {
            msg: "Sorry, This Store Is Not Found !!",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function deleteStore(storeId){
    try{
        const store = await storeModel.deleteOne({ _id: storeId });
        if (store) {
            return {
                msg: "Deleting This Store Has Been Successfuly !!",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Store Is Not Found !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    getAllStoresInsideThePage,
    getStoresCount,
    getStoreDetails,
    createNewStore,
    updateStoreInfo,
    deleteStore,
}