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
    if (!pub) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }
    res.status(200).json(pub);
  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).json({ message: "Error al obtener la publicación" });
  }
};

exports.createPublication = async (req, res) => {
  try {
    // Validar que req.body tenga los datos correctos
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        message: "Formato de JSON inválido. Verifique los datos enviados.",
      });
    }

    const { author, title, content } = req.body;

    // Validar que los campos no estén vacíos
    if (!author || !title || !content) {
      return res.status(400).json({
        message: "Debe proporcionar author, title y content correctamente.",
      });
    }

    // Validar tipos de datos
    if (
      typeof author !== "string" ||
      typeof title !== "string" ||
      typeof content !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Los campos deben ser de tipo string." });
    }

    // Llamar al servicio para agregar la publicación
    const newPub = await pubServices.addPublication(author, title, content);
    res.status(201).json(newPub); // 201: Creado exitosamente
  } catch (error) {
    // Detectar errores de formato JSON
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        message: "Error en el formato del JSON. Verifique los datos enviados.",
      });
    }

    res.status(500).json({ message: "Error al crear la publicación" });
  }
};

// Controlador para actualizar una publicación existente
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

    // Manejo de errores específicos del servicio
    if (updatedPub.error) {
      return res
        .status(updatedPub.statusCode)
        .json({ message: updatedPub.message });
    }

    return res
      .status(200)
      .json({ message: "Publicación actualizada con éxito" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error inesperado al actualizar publicación" });
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

// Controlador para eliminar un comentario
exports.deleteComment = async (req, res) => {
  try {
    console.log("ID de la publicación:", req.params.idPub);
    console.log("ID del comentario:", req.params.idComment);

    const response = await pubServices.deleteCommentFromPublication(
      req.params.idPub,
      req.params.idComment
    );

    // Manejo de errores específicos del servicio
    if (response.error) {
      return res
        .status(response.statusCode)
        .json({ message: response.message });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error al borrar comentario:", error);
    return res
      .status(500)
      .json({ message: "Error inesperado al borrar comentario" });
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

<<<<<<< HEAD

exports.getMostTrend = async (res) => {
=======
// Obtener las 5 publicaciones más populares
exports.getMostTrend = async (req, res) => {
>>>>>>> f422fc6d45bb4eef32b5733731668ccc9daacabd
  try {
    const trend = await pubServices.getTrend();

    if (trend && trend.length > 0) {
      // Verifica que haya publicaciones
      res.status(200).json(trend); // Devuelve el array de publicaciones
    } else {
      res.status(404).json({ message: "No hay publicaciones populares" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las publicaciones populares",
      error: error.message,
    });
  }
};
