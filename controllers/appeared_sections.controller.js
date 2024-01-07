async function getAllSections(req, res) {
    try{
        const { getAllSections } = require("../models/appeared_sections.model");
        await res.json(await getAllSections());
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function putSectionsStatus(req, res) {
    try{
        const sectionsStatus = req.body.sectionsStatus;
        const { updateSectionsStatus } = require("../models/appeared_sections.model");
        await updateSectionsStatus(sectionsStatus);
        await res.json("Change Sections Status Has Been Successfuly !!");
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

module.exports = {
    putSectionsStatus,
    getAllSections,
}