const mongoose = require("mongoose");
require("dotenv").config();

const uriLocal = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const uriRemota = process.env.DB_URI;

mongoose.connect(uriLocal || uriRemota, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log("Conexión exitosa a la base de datos :D")).catch((err)=>console.log("Error: " + err));
const db = mongoose.connection;

db.on(
    "error",
    console.error.bind(console, "Error de conexión a la base de datos:")
);
db.once("open", () => {
    console.log("Conexión exitosa a la base de datos");
});

module.exports = mongoose;
