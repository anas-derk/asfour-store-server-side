const appearedSectionsRouter = require("express").Router();

const appearedSectionsController = require("../controllers/appeared_sections.controller");

appearedSectionsRouter.get("/all-sections", appearedSectionsController.getAllSections);

appearedSectionsRouter.put("/:sectionId", appearedSectionsController.putSectionStatus);

module.exports = appearedSectionsRouter;