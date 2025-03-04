const express = require("express");
const router = express.Router();
const {
  getPublications,
  getPublicationById,
  addPublication,
  deletePublication,
  updatePublication,
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
    const pubId = req.params.id; // Obtiene el ID de la tarea desde los parámetros
    await deletePublication(pubId); // Llama a la función para eliminar la tarea

    res.status(200).json({ message: "Publicación eliminada correctamente" }); // Respuesta de éxito
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    res.status(500).json({ error: error.message }); // Manejo de errores
  }
});

// Actualizar una tarea específica
router.put("/:id", async (req, res) => {
  try {
    const pubId = req.params.id; // ID de la publicación
    const { title, content } = req.body; // Datos del cuerpo de la solicitud

    // Validar que el título y contenido no estén vacíos
    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Título y contenido son obligatorios" });
    }

    // Llamar a la función para actualizar la publicación
    const updatedPub = await updatePublication(pubId, title, content);

    // Responder con el formato correcto
    res.json(updatedPub);
  } catch (error) {
    console.error(`Error en updatePublication: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Exporta el router
