// Import Mongoose And Admin Model Object

const { mongoose, appearedSectionsModel } = require("../models/all.models");

async function getAllSections() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const allSections = await appearedSectionsModel.find({});
        await mongoose.disconnect();
        return allSections;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateSectionsStatus(sectionsStatus) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        for (let i = 0; i < 3; i++) {
            await appearedSectionsModel.updateOne({ _id: sectionsStatus[i]._id }, { isAppeared: sectionsStatus[i].isAppeared });
        }
        await mongoose.disconnect();
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    updateSectionsStatus,
    getAllSections,
}