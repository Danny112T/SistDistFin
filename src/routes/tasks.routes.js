const express = require("express");
const router = express.Router();
const taskController = require("../controllers/tasks.controller");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (token == null) {
        return res.status(401).json({
            estado: 0,
            mensaje: "Token no encontrado",
            data: [],
        });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({
                estado: 0,
                mensaje: "Token no valido",
                data: [secretKey, token],
            });
        }
        req.user = user;
        next();
    });
}

router.get("/", authenticateToken, taskController.getAllTasks);
router.get("/:id", authenticateToken ,taskController.getTaskById);
router.post("/", authenticateToken, taskController.addTask);
router.put("/:id", authenticateToken, taskController.updateTask)
router.delete("/:id", authenticateToken, taskController.deleteTask)
router.put("/:id/status", authenticateToken, taskController.updateStatusTask);

module.exports = router;
