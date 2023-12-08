const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routerUser = require("./src/routes/users.routes");
const routerTask = require("./src/routes/tasks.routes");
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/users", routerUser);
app.use("/tasks", routerTask);

// Middleware de registro personalizado
app.use((req, res, next) => {
    const fechaActual = new Date().toISOString();
    const metodo = req.method;
    const url = req.url;
    const ipCliente = req.ip || req.connection.remoteAddress;

    console.log(`[${fechaActual}] ${metodo} ${url} - IP: ${ipCliente}`);
    next();
});

app.listen(port, () => {
    console.log(`Server is running on: ${host}:${port}`);
});
