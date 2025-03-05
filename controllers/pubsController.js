const pubServices = require('../services/servicePubs');

// Obtener todas las publicaciones
exports.getAllPublications = async (req, res) => {
  try {
    const pub = await pubServices.getPublications();
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
    const pub = await pubServices.getPublicationById(req.params.id);
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
  const newPub = await pubServices.addPublication(
    req.body.author,
    req.body.title,
    req.body.content
  );
  res.json(newPub);
};

// Eliminar una publicación
exports.deletePublication = async (req, res) => {
  try {
    const delpub = await pubServices.deletePublication(req.params.id);
    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar publicación", error });
  }
};


// Actualizar una publicación existente
exports.updatePublication = async (req, res) => {
  try {
    const pub = await pubServices.updatePublication(
      req.params.id,
      { title: req.body.title },
      { content: req.body.content }
    );
    res.status(201).json(pub);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar publicación", error });
  }
};


// Agregar un comentario a una publicación
exports.addCommentToPublication = async (req, res) => {
  try {
    const comment = await pubServices.addCommentToPublication(
      req.params.idPub,
      req.body.comment
    );
    if (comment) {
      res.status(201).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al agregar comentario", error });
  }
};

// Eliminar un comentario a una publicación
exports.deleteComment = async (req, res) => {
  try {
    const comment = await pubServices.deleteCommentFromPublication(
      req.params.idPub,
      req.params.idComment
    );
    if (comment) {
      res.status(201).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al borrar comentario", error });
  }
};

//Editar un comentario de una publicacion
exports.updateComment = async (req, res) =>{
  try{
    const idPub = req.params.idPub;
    const idComment = req.params.idComment;
    const newContent = req.body;
    const comment = await pubServices.updateCommentInPublication(idPub, idComment, newContent);
    if(comment){
      res.status(201).json(comment);
    }
  }catch(error){
    res.status(500).json({message: "Error al borrar el comentario"});
  }
};

