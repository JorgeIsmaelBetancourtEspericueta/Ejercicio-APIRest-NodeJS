const express = require("express");
const router = express.Router();
const {
  getPublications,
  getPublicationById,
  addPublication,
  updateTask,
  getTaskById,
} = require("../models/pub"); // Asegúrate de incluir getTaskById

// Obtener todas las tareas
router.get("/", async (req, res) => {
  const pubs = await getPublications(); // Llama a la función para obtener las tareas
  res.json(pubs); // Devuelve las tareas en formato JSON
});

// Obtener una tarea específica por ID
router.get("/:id", async (req, res) => {
  const pubId = req.params.id; // Obtiene el ID de la tarea desde los parámetros
  const pub = await getPublicationById(pubId); // Llama a la función para obtener la tarea por ID
  res.json(pub); // Devuelve la tarea encontrada
});

// Agregar una nueva tarea
router.post("/", async (req, res) => {
  const { author, title, content } = req.body;
  const newPub = await addPublication(author, title, content);
  res.json(newPub);

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
