const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

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
        const token = req.headers.authorization;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "JWT", fieldValue: token, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
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