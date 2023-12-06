const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.get("/", usersController.getAllUsers);
router.get("/:email", usersController.getUserByEmail);
router.post("/", usersController.addUser);
router.put("/:email", usersController.updateUser);
router.delete("/:email", usersController.deleteUser);
router.post("/login", usersController.login);

module.exports = router;
