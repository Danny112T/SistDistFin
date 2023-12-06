const mongoose = require("../config/db");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    // nombre, descripcio, imagen portada, imagen completado, compleatado, fecha de creacion, fecha de actualizacion
    title: {
      type: String,
    },
    description: {
      type: String,
      nullable: true,
    },
    status: {
      type: Boolean,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;