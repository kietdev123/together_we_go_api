const { Router } = require("express");
const userController = require("../controllers/user");
const router = Router();

router.get("/", userController.get);
router.patch("/", userController.update);

module.exports = router;

