const appearedSectionsRouter = require("express").Router();

const appearedSectionsController = require("../controllers/appeared_sections.controller");

appearedSectionsRouter.put("/:sectionId", appearedSectionsController.putSectionStatus);

module.exports = appearedSectionsRouter;