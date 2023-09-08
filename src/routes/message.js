const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");

router.patch("/:id", messageController.update);
router.post("/", messageController.create);
router.get("/", messageController.getList);

module.exports = router;