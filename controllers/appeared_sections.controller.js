async function getAllSections(req, res) {
    try{
        const { getAllSections } = require("../models/appeared_sections.model");
        await res.json({
            msg: "Get All Sections Process Has Been Successfully !!",
            error: false,
            data: await getAllSections(),
        });
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: [],
        });
    }
}

async function putSectionsStatus(req, res) {
    try{
        const sectionsStatus = req.body.sectionsStatus;
        const { updateSectionsStatus } = require("../models/appeared_sections.model");
        await updateSectionsStatus(sectionsStatus);
        await res.json({
            msg: "Change Sections Status Has Been Successfuly !!",
            error: false,
            data: {},
        });
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: [],
        });
    }
}

module.exports = {
    putSectionsStatus,
    getAllSections,
}