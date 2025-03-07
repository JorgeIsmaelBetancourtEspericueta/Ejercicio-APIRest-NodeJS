// services/publicationService.js
const { pubCollection } = require("../models/publicacion");

// Obtener todas las publicaciones
exports.getPublications = async () => {
  try {
    const snapshot = await pubCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener publicaciones: ${error.message}`);
  }
};

// Obtener una publicación específica por ID
exports.getPublicationById = async (id) => {
  try {
    const pubRef = pubCollection.doc(id);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      return null; // No lanzar error, solo devolver null
    }
    return { id: pubSnapshot.id, ...pubSnapshot.data() };
  } catch (error) {
    throw new Error(`Error al obtener la publicación`);
  }
};

// Agregar una nueva publicación
exports.addPublication = async (author, title, content) => {
  console.log("Añadiendo publicación:", { author, title, content });

  const datePub = new Date().toISOString();
  const newPub = await pubCollection.add({
    author,
    title,
    content,
    datePub,
    comentarios: [],
    popularidad: 0,
  });

  return {
    id: newPub.id,
    author,
    title,
    content,
    datePub,
    comentarios: [],
    popularidad: 0,
  };
};

// Eliminar una publicación por ID
exports.deletePublication = async (id) => {
  try {
    const pubRef = pubCollection.doc(id);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      return { success: false, message: "Publicación no encontrada" };
    }

    await pubRef.delete();
    return { success: true, message: "Publicación eliminada correctamente" };
  } catch (error) {
    return {
      success: false,
      message: `Error al eliminar la publicación: ${error.message}`,
    };
  }
};

// Actualizar una publicación por ID (solo título y contenido, manteniendo comentarios)
exports.updatePublication = async (id, { title, content }) => {
  try {
    const pubRef = pubCollection.doc(id);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      return {
        error: true,
        statusCode: 404,
        message: `Publicación con ID ${id} no encontrada.`,
      };
    }

    // Obtener los valores actuales de la publicación
    const pubData = pubSnapshot.data();

    // Actualizar solo el título y el contenido
    await pubRef.update({ title, content });

    return {
      id,
      comentarios: pubData.comentarios ?? [],
      author: pubData.author,
      title,
      content,
      datePub: pubData.datePub,
      popularidad: pubData.popularidad ?? 0,
    };
  } catch (error) {
    console.error(`Error en updatePublication: ${error.message}`);
    return {
      error: true,
      statusCode: 500,
      message: `Error al actualizar la publicación: ${error.message}`,
    };
  }
};

//Consultar los comentarios de una publicacion
exports.getCommentsByPublication = async (pubId) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    let pubData = pubSnapshot.data();
    let comentarios = pubData.comentarios || []; // Si no hay comentarios, retorna un array vacío

    return comentarios;
  } catch (error) {
    throw new Error(`Error al obtener los comentarios: ${error.message}`);
  }
};

// Agregar un comentario a una publicación
exports.addCommentToPublication = async (pubId, comment) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    const pubData = pubSnapshot.data();
    const comentarios = pubData.comentarios || []; // Obtener comentarios existentes o inicializar vacío

    // Determinar el ID autoincrementable
    const newCommentId =
      comentarios.length > 0
        ? Math.max(...comentarios.map((c) => c.id)) + 1
        : 1;

    // Crear nuevo comentario con la estructura requerida
    const newComment = {
      id: newCommentId, // Asignar ID autoincrementable
      usuario: comment.usuario,
      contenido: comment.contenido,
      fechaComentario: new Date().toISOString(),
      likes: 0,
    };

    // Agregar el comentario a la lista
    comentarios.push(newComment);

    // Guardar los comentarios actualizados en la publicación
    await pubRef.update({ comentarios });

    return newComment;
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    throw error;
  }
};

// Eliminar un comentario de una publicación
exports.deleteCommentFromPublication = async (pubId, commentIndex) => {
  try {
    console.log("Buscando publicación con ID:", pubId);

    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      return {
        error: true,
        statusCode: 404,
        message: "Publicación no encontrada",
      };
    }

    let pubData = pubSnapshot.data();
    let comentarios = pubData.comentarios || [];

    const index = parseInt(commentIndex, 10);

    const newComments = comentarios.filter(
      (comment) => parseInt(comment.id, 10) !== index
    );

    if (newComments.length === comentarios.length) {
      return {
        error: true,
        statusCode: 404,
        message: "Comentario no encontrado",
      };
    }

    await pubRef.update({ comentarios: newComments });

    return { id: pubId, comentarios: newComments };
  } catch (error) {
    console.error(`Error en deleteCommentFromPublication: ${error.message}`);
    return {
      error: true,
      statusCode: 500,
      message: `Error al eliminar comentario: ${error.message}`,
    };
  }
};

// Actualizar un comentario en una publicación
exports.updateCommentInPublication = async (pubId, commentId, newContent) => {
  try {
    // Convertir commentId a número
    const parsedCommentId = parseInt(commentId, 10);
    if (isNaN(parsedCommentId)) {
      throw new Error("ID de comentario inválido");
    }
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();
    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }
    const pubData = pubSnapshot.data();
    const comentarios = pubData.comentarios || [];
    // Buscar el comentario por ID numérico
    const commentIndex = comentarios.findIndex(
      (comment) => comment.id === parsedCommentId
    );
    if (commentIndex === -1) {
      throw new Error("Comentario no encontrado");
    }
    // Crear copia actualizada del comentario
    const updatedComment = {
      ...comentarios[commentIndex],
      contenido: newContent,
      fechaModificacion: new Date().toISOString(),
    };
    // Actualizar el array de comentarios
    comentarios[commentIndex] = updatedComment;
    // Guardar cambios en Firestore
    await pubRef.update({ comentarios });
    return { 
      id: pubId,
      comentarioActualizado: updatedComment,
      comentarios // Opcional: devolver lista completa actualizada
    };
  } catch (error) {
    throw new Error(`Error al actualizar comentario: ${error.message}`);
  }
};

// Actualizar los likes de un comentario en una publicación
exports.updateLikeComment = async (pubId, userId, fechaComentario, increment = true) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    let pubData = pubSnapshot.data();
    let comments = pubData.comentarios || [];
    // Buscar el comentario por usuario y fechaComentario
    const commentIndex = comments.findIndex(
      (c) => c.usuario === userId && c.fechaComentario === fechaComentario
    );
    if (commentIndex === -1) {
      throw new Error("Comentario no encontrado");
    }
    // Actualizar los likes (sin permitir valores negativos)
    comments[commentIndex].likes = Math.max(
      0,
      (comments[commentIndex].likes || 0) + (increment ? 1 : -1)
    );
    // Guardar los cambios en la base de datos
    await pubRef.update({ comentarios: comments });

    return { success: true, comentarios: comments };
  } catch (error) {
    console.error("Error en updateLikeComment:", error);
    throw new Error(`Error al actualizar likes del comentario: ${error.message}`);
  }
};


// Obtener las 5 publicaciones más populares
// Obtener las 5 publicaciones más populares
exports.getTrend = async () => {
  try {
    const snapshot = await pubCollection
      .orderBy("popularidad", "desc")
      .limit(5)
      .get();

    // Verifica si hay publicaciones
    if (snapshot.empty) {
      throw new Error("No se encontraron publicaciones populares");
    }

    // Transforma el snapshot en un array de publicaciones
    const publicaciones = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }; // Agrega el id de la publicación al objeto
    });

    return publicaciones; // Devuelve el array de publicaciones
  } catch (error) {
    throw new Error(
      error.message || "Error al obtener publicaciones más populares"
    );
  }
};
