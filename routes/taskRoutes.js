const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  getTaskById,
} = require("../models/task"); // Asegúrate de incluir getTaskById

// Obtener todas las tareas
router.get("/", async (req, res) => {
  try {
    const tasks = await getTasks(); // Llama a la función para obtener las tareas
    res.json(tasks); // Devuelve las tareas en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Manejo de errores
  }
});

// Obtener una tarea específica por ID
router.get("/:id", async (req, res) => {
  try {
    const taskId = req.params.id; // Obtiene el ID de la tarea desde los parámetros
    const task = await getTaskById(taskId); // Llama a la función para obtener la tarea por ID

    if (task) {
      res.status(200).json(task); // Devuelve la tarea encontrada
    } else {
      res.status(404).json({ error: "Tarea no encontrada" }); // Manejo de caso donde la tarea no existe
    }
  } catch (error) {
    console.error("❌ Error al obtener la tarea:", error);
    res.status(500).json({ error: error.message }); // Manejo de errores
  }
});

// Agregar una nueva tarea
router.post("/", async (req, res) => {
  try {
    const { title } = req.body; // Obtiene el título del cuerpo de la solicitud
    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" }); // Verifica que el título esté presente
    }

    const newTask = await addTask(title); // Llama a la función para agregar la tarea
    res.status(201).json(newTask); // Devuelve la nueva tarea creada
  } catch (error) {
    res.status(500).json({ error: error.message }); // Manejo de errores
  }
});

// Eliminar una tarea específica
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id; // Obtiene el ID de la tarea desde los parámetros
    await deleteTask(taskId); // Llama a la función para eliminar la tarea

    res.status(200).json({ message: "Tarea eliminada correctamente" }); // Respuesta de éxito
  } catch (error) {
    console.error("❌ Error al eliminar la tarea:", error);
    res.status(500).json({ error: error.message }); // Manejo de errores
  }
});

// Actualizar una tarea específica
router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id; // Obtiene el ID de la tarea desde los parámetros
    const { title } = req.body; // Obtiene el nuevo título del cuerpo de la solicitud

    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" }); // Verifica que el título esté presente
    }

    const result = await updateTask(taskId, title); // Llama a la función para actualizar la tarea

    // result contendrá la tarea actualizada, así que puedes devolverla directamente
    if (result) {
      res.status(200).json(result); // Respuesta con la tarea actualizada
    } else {
      res.status(404).json({ error: "Tarea no encontrada" }); // Manejo de caso donde la tarea no existe
    }
  } catch (error) {
    console.error("❌ Error al actualizar la tarea:", error);
    res.status(500).json({ error: error.message }); // Manejo de errores
  }
});

module.exports = router; // Exporta el router
