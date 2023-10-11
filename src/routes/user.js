const { Router } = require("express");
const userController = require("../controllers/user");
const router = Router();

router.get("/profile", userController.getInfo);
router.patch("/profile", userController.updateInfo);

// router.post("/", userController.create);

router.patch("/:id", userController.update);
router.get("/:id", userController.getOne);
router.get("/", userController.getList);
router.delete("/:id", userController.delete);

module.exports = router;

