async function getAllSections(req, res) {
    try{
        const { getAllSections } = require("../models/appeared_sections.model");
        await res.json(await getAllSections());
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function putSectionStatus(req, res) {
    try{
        const sectionId = req.params.sectionId;
        if (!sectionId) await res.status(400).json("Invalid Request, Please Send Section Id !!");
        else {
            const { changeSectionStatus } = require("../models/appeared_sections.model");
            await changeSectionStatus(sectionId);
            await res.json("Change Section Status Has Been Successfuly !!");
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

module.exports = {
    putSectionStatus,
    getAllSections,
}