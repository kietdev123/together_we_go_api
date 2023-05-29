const { Router } = require("express");
const userController = require("../controllers/user");
const router = Router();

router.post("/edit_avatar/:userId", userController.editAvatar);
router.get("/get_user/:userId", userController.getUser);
router.patch("/update_user/:userId", userController.updateUser);
router.patch(
  "/update_user_location/:userId",
  userController.updateUserLocation
);

module.exports = router;
