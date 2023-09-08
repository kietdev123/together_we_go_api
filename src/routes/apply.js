const express = require("express");
const router = express.Router();
const applyController = require("../controllers/apply");

router.patch("/:id", applyController.update);
router.get("/:id", applyController.getOne);
router.get("/", applyController.getList);
router.post("/", applyController.create);

module.exports = router;
