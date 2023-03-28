const { Router } = require("express");
const userController = require("../controllers/user");
const router = Router();

router.post("/edit_avatar/:userId", userController.editAvatar);

module.exports = router;
