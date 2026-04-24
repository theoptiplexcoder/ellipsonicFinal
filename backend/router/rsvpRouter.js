const express = require("express");
const router = express.Router();
const {createRSVPController, getRSVPStatusController, cancelRSVPController} = require("../controller/rsvpController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createRSVPController);
router.get("/status", authMiddleware, getRSVPStatusController);
router.delete("/cancel/:rsvpId", authMiddleware, cancelRSVPController);

module.exports = router;
