const express = require("express");
const router = express.Router();
const {
  getPublications,
  getPublicationById,
  addPublication,
  updateTask,
  getTaskById,
} = require("../models/pub"); // Asegúrate de incluir getTaskById

// Obtener todas las publicaciones
router.get("/", async (req, res) => {
  try {
    const pubs = await getPublications();
    res.json(pubs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
});

// Obtener una publicación específica por ID
router.get("/:id", async (req, res) => {
  try {
    const pubId = req.params.id;
    const pub = await getPublicationById(pubId);

    if (!pub) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.json(pub);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la publicación", error });
  }
});

// Agregar una nueva publicación con validaciones
router.post("/", async (req, res) => {
  try {
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const newPub = await addPublication(author, title, content);
    res.status(201).json(newPub);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la publicación", error });
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
