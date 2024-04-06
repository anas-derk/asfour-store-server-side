const { getResponseObject } = require("../global/functions");

async function getAllSections(req, res) {
    try{
        const { getAllSections } = require("../models/appeared_sections.model");
        res.json(await getAllSections());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putSectionsStatus(req, res) {
    try{
        const sectionsStatus = req.body.sectionsStatus;
        const { updateSectionsStatus } = require("../models/appeared_sections.model");
        res.json(await updateSectionsStatus(sectionsStatus));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putSectionsStatus,
    getAllSections,
}