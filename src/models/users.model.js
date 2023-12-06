const mongoose = require("../config/db");
const { Schema } = mongoose;

// Estructura de la colección de Usuarios
const userSchema = new Schema({
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    user: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
});

// Correspondencia de la colección en la base de datos
const User = mongoose.model("User", userSchema);

module.exports = User;
