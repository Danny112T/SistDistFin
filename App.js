const express = require("express");
const routerUser = require("./src/routes/users.routes");
const routerTask = require("./src/routes/tasks.routes");
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", routerUser);
app.use("/tasks", routerTask);

app.listen(port, () => {
    console.log(`Server is running on: ${host}:${port}`);
});
