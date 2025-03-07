const pubServices = require("../services/servicePubs");

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
    res.status(500).json({ message: "Error al obtener publicaciones" });
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
    res.status(500).json({ message: "Error al obtener la publicación" });
  }
};

// Crear una nueva publicación
exports.createPublication = async (req, res) => {
  try {
    const newPub = await pubServices.addPublication(
      req.body.author,
      req.body.title,
      req.body.content
    );

    if (newPub) {
      res.status(201).json(newPub); // 201 indica que el recurso fue creado correctamente
    } else {
      res.status(400).json({ message: "No se pudo crear la publicación" }); // 400 si hay un error en la solicitud
    }
  } catch (error) {
    res.status(500).json({ message: "Error al crear la publicación" });
  }
};

// Actualizar una publicación existente
exports.updatePublication = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validar que se envíen los datos requeridos
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Título y contenido son requeridos" });
    }

    const updatedPub = await pubServices.updatePublication(req.params.id, {
      title,
      content,
    });

    if (!updatedPub) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    return res
      .status(200)
      .json({ message: "Publicación actualizada con éxito" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar publicación",
    });
  }
};

// Eliminar una publicación
exports.deletePublication = async (req, res) => {
  try {
    const delpub = await pubServices.deletePublication(req.params.id);

    if (delpub.success) {
      return res.status(200).json({ message: "Publicación borrada con éxito" });
    } else {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar publicación" });
  }
};

//Obtener los comentario de una publicacion
exports.getComments = async (req, res) => {
  try {
    const pubId = req.params.idPub;

    const comments = await pubServices.getCommentsByPublication(pubId);

    res.status(200).json({ comentarios: comments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los comentarios", error });
  }
};

// Agregar un comentario a una publicación
exports.addCommentToPublication = async (req, res) => {
  try {
    const content = {
      usuario: req.body.user,
      contenido: req.body.content,
    };
    const comment = await pubServices.addCommentToPublication(
      req.params.idPub,
      content
    );
    if (comment) {
      res.status(201).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al agregar comentario" });
  }
};

// Eliminar un comentario a una publicación
exports.deleteComment = async (req, res) => {
  try {
    console.log("ID de la publicación:", req.params.idPub);
    console.log("ID del comentario:", req.params.idComment);

    const comment = await pubServices.deleteCommentFromPublication(
      req.params.idPub,
      req.params.idComment
    );

    if (comment) {
      return res.status(200).json(comment);
    } else {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }
  } catch (error) {
    console.error("Error al borrar comentario:", error);
    return res
      .status(500)
      .json({ message: "Error al borrar comentario", error: error.message });
  }
};

//Editar un comentario de una publicacion
exports.updateComment = async (req, res) => {
  try {
    const idPub = req.params.idPub;
    const idComment = req.params.idComment;
    const newContent = req.body;
    const comment = await pubServices.updateCommentInPublication(
      idPub,
      idComment,
      newContent
    );
    if (comment) {
      res.status(201).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el comentario" });
  }
};

// Actualizar los likes de un comentario
exports.updateLikeComment = async (req, res) => {
  try {
    const increment = req.body.increment;
    if (typeof increment !== "boolean") 
      return res.status(400).json({ message: "El parámetro 'increment' debe ser booleano" });
    const likeComment = await pubServices.updateCommentLikes(
      req.params.idPub,
      Number(req.params.idComment),
      increment
    );
    res.status(200).json(likeComment);
  } catch (error) {
    res.status(500).json({ message: "No se pudo actualizar el like", error: error.message });
  }
};


exports.getMostTrend = async (res) => {
  try {
    const trend = await pubServices.getTrend();
    if (trend) {
      res.status(201).json(trend);
    } else {
      res.status(404).json({ message: "No hay publicaciones populares" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las publicaciones populares" });
  }
};
