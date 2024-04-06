const { getResponseObject } = require("../global/functions");

const appearedSectionsOPerationsManagmentFunctions = require("../models/appeared_sections.model");

async function getAllSections(req, res) {
    try{
        res.json(await appearedSectionsOPerationsManagmentFunctions.getAllSections());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putSectionsStatus(req, res) {
    try{
        const sectionsStatus = req.body.sectionsStatus;
        res.json(await appearedSectionsOPerationsManagmentFunctions.updateSectionsStatus(sectionsStatus));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putSectionsStatus,
    getAllSections,
}