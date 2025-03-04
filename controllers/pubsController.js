const {
  getPublications,
  getPublicationById,
  addPublication,
  deletePublication,
  updatePublication,
  addCommentToPublication,
  deleteCommentFromPublication,
  updateCommentInPublication,
  getTrend,
  updateCommentLikes,
  likeComment,
  unlikeComment,
} = require("../models/pub");

// Obtener todas las publicaciones
exports.getAllPublications = async (req, res) => {
  try {
    const pub = await getPublications();
    if (pub) {
      res.status(200).json(pub);
    } else {
      res.status(404).json({ message: "No hay publicaciones encontradas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
};

// Obtener una publicación por ID
exports.getPublicationById = async (req, res) => {
  try {
    const pub = await getPublicationById(req.params.id);
    if (pub) {
      res.status(200).json(pub);
    } else {
      res.status(404).json({ message: "Publicacion no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la publicación", error });
  }
};

// Crear una nueva publicación
exports.createPublication = async (req, res) => {
  const newPub = await addPublication(
    req.body.author,
    req.body.title,
    req.body.content
  );
  res.json(newPub);
};

// Actualizar una publicación existente
exports.updatePublication = async (req, res) => {
  try {
    const pub = await updatePublication(
      req.params.id,
      { title: req.body.title },
      { content: req.body.content }
    );
    res.status(201).json(pub);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar publicación", error });
  }
};

// Eliminar una publicación
exports.deletePublication = async (req, res) => {
  try {
    const delpub = await deletePublication(req.params.id);
    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar publicación", error });
  }
};

// Agregar un comentario a una publicación
exports.addCommentToPublication = async (req, res) => {
  try {
    const comment = await addCommentToPublication(
      req.params.pubId,
      req.body.comment
    );
    if (comment) {
      res.status(201).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al agregar comentario", error });
  }
};

// Agregar un comentario a una publicación
exports.deleteComment = async (req, res) => {
  try {
    const comment = await deleteCommentFromPublication(
      req.params.idpub,
      req.params.idcom
    );
    if (comment) {
      res.status(201).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al borrar comentario", error });
  }
};
