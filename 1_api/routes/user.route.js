const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.get);
router.post("/", UserController.create);
router.get("/:id", UserController.getDetailById);
router.delete("/:id", UserController.delete);
router.put("/:id", UserController.update);

module.exports = router;
