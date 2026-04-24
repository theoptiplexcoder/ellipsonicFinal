
const express = require("express");
const router = express.Router();
const {viewAllEventsController,viewSingleEventController,updateEventController,deleteEventController,createEventController} = require("../controller/eventController");
const validate=require("../middleware/validateMiddleware");
const {} = require("../validators/authValidator");


router.get("/view-all-events",viewAllEventsController)
router.get("/view-single-event/:id",viewSingleEventController)
router.put("/update-event/:id",updateEventController)
router.delete("/delete-event/:id",deleteEventController)
router.post("/create-event",createEventController)

module.exports = router;