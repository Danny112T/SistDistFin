const Task = require("../models/tasks.model");
const User = require("../models/users.model");

exports.getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Task.countDocuments();
        const tasks = await Task.find({ userId: req.user.userId }).skip(skip).limit(limit);

        if (!tasks) {
            res.status(404).json({
                estado: 0,
                mensaje: "Tareas no encontradas",
                data: [],
            });
        }
        const totalDePaginas = Math.ceil(total / limit);

        res.status(200).json({
            estado: 1,
            mensaje: "Tareas obtenidas correctamente",
            data: [tasks],
            userData: [req.user],
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

exports.getTaskByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        if (title == undefined) {
            return res.status(400).json({
                estado: 0,
                mensaje: "Falta el titulo de la tarea",
                data: [],
            });
        } else {
            const task = await Task.findOne({ title }, {userId: req.user.id } ).exec();
            if (!task) {
                res.status(404).json({
                    estado: 0,
                    mensaje: "Tarea no encontrada",
                    data: [],
                });
            } else {
                res.status(200).json({
                    estado: 1,
                    mensaje: "Tarea obtenida correctamente",
                    data: [task],
                });
            }
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ estado: 0, mensaje: "Ocurrio un error desconocido", data: [] });
    }
};

exports.addTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!req.user) {
      return res.status(401).json({
        estado: 0,
        mensaje: "Usuario no autenticado",
        data: [],
      });
    }
    if (title == undefined) {
      return res.status(400).json({
        estado: 0,
        mensaje: "Falta el Titulo, Description de la tarea",
        data: [],
      });
    }
    const newTask = new Task({ title, description, userId: req.user.userId });
    const taskSaved = await newTask.save();

    res.status(201).json({
      estado: 1,
      mensaje: "Tarea creada correctamente",
      data: [taskSaved],
    });
  } catch (error) {
    console.log(error);
    console.log(req.user);
    res.status(500).json({
      estado: 0,
      mensaje: "Error desconocido",
      data: [req.user]
    });
  }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const existingTask = await Task.findOne({ _id: id })
        if(!existingTask){
            res.status(404).json({
                estado: 0,
                mensaje: "No se encontró la tarea",
                data: []
            });
        }

        existingTask.title = title || existingTask.title;
        existingTask.description = description || existingTask.description;
        existingTask.status = status || existingTask.status;

        const updatedTask = await existingTask.save()

        res.status(200).json({
            estado:1,
            mensaje: "Tarea actualizada correctamete",
            data: [updatedTask]
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ estado: 0, mensaje: "Ocurrio un error desconocido", data: [] });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try{
        if (id == undefined) {
            return res.status(400).json({
                estado: 0,
                mensaje: "Falta el titulo de la tarea",
                data: [],
            });
        } else {
            const task = await Task.findOneAndDelete({ _id:id }, {userId: req.user.id } ).exec();
            if (!task) {
                res.status(404).json({
                    estado: 0,
                    mensaje: "Tarea no encontrada",
                    data: [],
                });
            } else {
                res.status(200).json({
                    estado: 1,
                    mensaje: "Tarea eliminada correctamente",
                    data: [task],
                });
            }
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ estado: 0, mensaje: "Ocurrio un error desconocido", data: [] });
    }
};

exports.updateStatusTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: id })
        if(!task){
            res.status(404).json({
                estado: 0,
                mensaje: "No se encontró la tarea",
                data: []
            });
        }
        task.status = !task.status;
        const taskUpdated = await task.save()

        res.status(200).json({
            estado:1,
            mensaje: "Tarea actualizada correctamete",
            data: [taskUpdated]
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ estado: 0, mensaje: "Ocurrio un error desconocido", data: [] });
    }
}
