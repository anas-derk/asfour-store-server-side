// Import Admin Model Object

const { appearedSectionsModel } = require("../models/all.models");

async function getAllSections() {
    try {
        const allSections = await appearedSectionsModel.find({});
        return {
            msg: "Get All Sections Process Has Been Successfully !!",
            error: false,
            data: allSections,
        }
    } catch (err) {
        throw Error(err);
    }
}

async function updateSectionsStatus(sectionsStatus) {
    try {
        for (let i = 0; i < 3; i++) {
            await appearedSectionsModel.updateOne({ _id: sectionsStatus[i]._id }, { isAppeared: sectionsStatus[i].isAppeared });
        }
        return {
            msg: "Updating Section Status Has Been Successfully !!",
            error: false,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    updateSectionsStatus,
    getAllSections,
}