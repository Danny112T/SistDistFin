const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const usuarios = await User.find().skip(skip).limit(limit);

    if (!usuarios) {
      res.status(404).json({
        estado: 0,
        mensaje: "Usuarios no encontrados",
        data: [],
      });
    }
    const totalDePaginas = Math.ceil(total / limit);

    res.status(200).json({
      estado: 1,
      mensaje: "Usuarios obtenidos correctamente",
      data: [usuarios],
      totalDePaginas: totalDePaginas,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ estado: 0, mensaje: "Ocurrio un error desconocido", data: [] });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    if (email == undefined) {
      return res.status(400).json({
        estado: 0,
        mensaje: "Falta el email",
        data: [],
      });
    } else {
      const usuario = await User.findOne({ email: email }).exec();
      if (!usuario) {
        res.status(404).json({
          estado: 0,
          mensaje: "Usuario no encontrado",
          data: [],
        });
      } else {
        res.status(200).json({
          estado: 1,
          mensaje: "Usuario obtenido correctamente",
          data: [usuario],
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error desconocido",
      data: [],
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, lastname, user, email, svpassword } = req.body;
    if (
      name == undefined
    ) {
      res.status(400).json({
        estado: 0,
        mensaje: "Faltan el nombre",
        data: [],
      });
    } else if (lastname == undefined) {
        res.status(400).json({
          estado: 0,
          mensaje: "Faltan el apellido",
          data: [],
        });
      } else if ( user == undefined ) {
        res.status(400).json({
          estado: 0,
          mensaje: "Falta el nombre de usuario",
          data: [],
        });
      } else if ( email == undefined) {
        res.status(400).json({
          estado: 0,
          mensaje: "Falta el email",
          data: [],
        });
      } else if ( svpassword == undefined) {
        res.status(400).json({
          estado: 0,
          mensaje: "Falta la contraseña",
          data: [],
        });
      } else {
      const existingUser = await User.findOne({
        $or: [{ user: user }, { email: email }],
      });
      if (existingUser) {
        res.status(400).json({
          estado: 0,
          mensaje: "Usuario o correo ya existente",
          data: [],
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(svpassword, salt);
        const newUser = await User.create({
          name,
          lastname,
          user,
          email,
          password,
        });
        if (newUser) {
          res.status(201).json({
            estado: 1,
            mensaje: "Usuario creado correctamente",
            data: [newUser],
          });
        } else {
          res.status(500).json({
            estado: 0,
            mensaje: "Error al crear el usuario",
            data: [],
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      estado: 0,
      mensaje: "Ocurrio un error desconocido",
      data: [],
    });
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  const { email } = req.params;
  const { name, lastname, user, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({
        estado: 0,
        mensaje: "No se encontró un usuario con ese correo electrónico",
        data: [],
      });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingUser.password = hashedPassword;
    }

    existingUser.name = name || existingUser.name;
    existingUser.lastname = lastname || existingUser.lastname;
    existingUser.user = user || existingUser.user;

    const updatedUser = await existingUser.save();

    res.status(200).json({
      estado: 1,
      mensaje: "Usuario actualizado correctamente",
      data: [updatedUser],
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ estado: 0, mensaje: "Ocurrió un error desconocido", data: [] });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    if (email == undefined) {
      res.status(400).json({
        estado: 0,
        mensaje: "Falta el email",
        data: [],
      });
    } else {
      const usuario = await User.findOne({ email: email }).exec();
      if (!usuario) {
        res.status(404).json({
          estado: 0,
          mensaje: "Usuario no encontrado",
          data: [],
        });
      } else {
        User.findOneAndDelete({ email: email }).exec();
        res.status(200).json({
          estado: 1,
          mensaje: "Usuario eliminado correctamente",
          data: [usuario],
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error desconocido",
      data: [],
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == undefined || password == undefined) {
      res.status(400).json({ mensaje: "Faltan parametros" });
    } else {
      const usuario = await User.findOne({ email });
      if (usuario) {
        const passwordDB = usuario.password;
        if (passwordDB) {
          const passwordCorrect = await bcrypt.compare(password, passwordDB);
          const payload = {
            userId: usuario._id,
            userName: usuario.name,
            userLastname: usuario.lastname,
            userEmail: usuario.email,
            userUser: usuario.user,
          };
          const token = jwt.sign(payload, secretKey, { algorithm: "HS256" });
          if (passwordCorrect) {
            res
              .status(200)
              .json({ estado: 1, mensaje: "Login Successful", token: token });
          } else {
            res.status(401).json({ estado: 0, mensaje: "Correo o contraseña incorrectas" });
          }
        } else {
          res
            .status(400)
            .json({ estado: 0, mensaje: "Password not found in database" });
        }
      } else {
        res.status(404).json({ estado: 0, mensaje: "Usuario no enontrado" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ estado: 0, mensaje: "Error Desconocido" });
  }
};
