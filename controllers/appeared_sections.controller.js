const { getResponseObject } = require("../global/functions");

async function getAllSections(req, res) {
    try{
        const { getAllSections } = require("../models/appeared_sections.model");
        await res.json(await getAllSections());
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putSectionsStatus(req, res) {
    try{
        const sectionsStatus = req.body.sectionsStatus;
        const { updateSectionsStatus } = require("../models/appeared_sections.model");
        await res.json(await updateSectionsStatus(sectionsStatus));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

module.exports = {
    putSectionsStatus,
    getAllSections,
}