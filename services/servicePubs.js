// services/publicationService.js
const { pubCollection } = require("../models/publicationModel");

// Obtener todas las publicaciones
exports.getPublications = async () => {
  try {
    const snapshot = await pubCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener publicaciones: ${error.message}`);
  }
}

// Obtener una publicación específica por ID
exports.getPublicationById = async (id) => {
  try {
    console.log("Buscando publicación con ID:", id);
    const pubRef = pubCollection.doc(id);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      console.error("No se encontró la publicación en la base de datos.");
      throw new Error("Publicación no encontrada");
    }
    return { id: pubSnapshot.id, ...pubSnapshot.data() };
  } catch (error) {
    console.error("Error en getPublicationById:", error);
    throw new Error(`Error al obtener la publicación: ${error.message}`);
  }
}

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
}

// Eliminar una publicación por ID
exports.deletePublication = async (id) => {
  try {
    const pubRef = pubCollection.doc(id);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    await pubRef.delete();
    return { success: true };
  } catch (error) {
    throw new Error(`Error al eliminar la publicación: ${error.message}`);
  }
}

// Actualizar una publicación por ID (solo título y contenido, manteniendo comentarios)
exports.updatePublication = async (id, title, content) => {
  try {
    const pubRef = pubCollection.doc(id);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error(`Publicación con ID ${id} no encontrada.`);
    }

    // Obtener los valores actuales de la publicación
    const pubData = pubSnapshot.data();

    // Solo actualizar título y contenido
    await pubRef.update({ title, content });

    return {
      id,
      comentarios: pubData.comentarios ?? [], // Se mantiene la lista de comentarios
      author: pubData.author, // Mantener el autor original
      title,
      content,
      datePub: pubData.datePub, // Mantener la fecha original
      popularidad: pubData.popularidad ?? 0, // Mantener la popularidad (asegurar que no sea undefined)
    };
  } catch (error) {
    console.error(`Error en updatePublication: ${error.message}`);
    throw new Error(`Error al actualizar la publicación: ${error.message}`);
  }
}

// Agregar un comentario a una publicación
exports.addCommentToPublication = async (pubId, comment) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    const pubData = pubSnapshot.data();

    // Crear nuevo comentario con la estructura requerida
    const newComment = {
      usuario: comment.usuario,
      contenido: comment.contenido,
      fechaComentario: new Date().toISOString(), // Agregar fecha actual
      likes: 0, // Inicializar en 0
    };

    // Actualizar lista de comentarios
    const updatedComments = [...(pubData.comentarios || []), newComment];

    await pubRef.update({ comentarios: updatedComments });

    return { id: pubId, comentarios: updatedComments };
  } catch (error) {
    throw new Error(`Error al agregar comentario: ${error.message}`);
  }
}

// Eliminar un comentario de una publicación
exports.deleteCommentFromPublication = async (pubId, commentIndex) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    let pubData = pubSnapshot.data();
    if (
      !pubData.comentarios ||
      commentIndex < 0 ||
      commentIndex >= pubData.comentarios.length
    ) {
      throw new Error("Comentario no encontrado");
    }

    pubData.comentarios.splice(commentIndex, 1);
    await pubRef.update({ comentarios: pubData.comentarios });

    return { id: pubId, comentarios: pubData.comentarios };
  } catch (error) {
    throw new Error(`Error al eliminar comentario: ${error.message}`);
  }
}

// Actualizar un comentario en una publicación
exports.updateCommentInPublication = async (pubId, commentIndex, newContent) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    let pubData = pubSnapshot.data();
    if (
      !pubData.comentarios ||
      commentIndex < 0 ||
      commentIndex >= pubData.comentarios.length
    ) {
      throw new Error("Comentario no encontrado");
    }

    pubData.comentarios[commentIndex].contenido = newContent;
    await pubRef.update({ comentarios: pubData.comentarios });

    return { id: pubId, comentarios: pubData.comentarios };
  } catch (error) {
    throw new Error(`Error al actualizar comentario: ${error.message}`);
  }
}

// Actualizar los likes de un comentario en una publicación
exports.updateCommentLikes = async (
  pubId,
  userId,
  commentDate,
  increment = true
) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();
    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }
    let pubData = pubSnapshot.data();
    const comments = pubData.comentarios || [];
    // Buscar el comentario específico por usuario y fecha
    const comment = comments.find(
      (c) => c.usuario === userId && c.fechaComentario === commentDate
    );
    if (!comment) {
      throw new Error("Comentario no encontrado");
    }
    // Incrementar o decrementar los likes
    if (increment) {
      comment.likes += 1;
    } else {
      // Asegurarse de que no se dejen likes negativos
      if (comment.likes > 0) {
        comment.likes -= 1;
      }
    }
    // Actualizar la lista de comentarios en la base de datos
    await pubRef.update({ comentarios: comments });
    return { id: pubId, comentarios: comments };
  } catch (error) {
    throw new Error(
      `Error al actualizar likes del comentario: ${error.message}`
    );
  }
}

// Obtener las 5 publicaciones más populares
exports.getTrend = async () => {
  try {
    const snapshot = await pubCollection.orderBy("popularidad", "desc").limit(5).get();
    return snapshot;
  } catch (error) {
    throw new Error(
      `Error al obtener publicaciones más populares: ${error.message}`
    );
  }
}

// Función para agregar un "like" a un comentario en una publicación
exports.likeComment = async (pubId, usuario, fechaComentario) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    let pubData = pubSnapshot.data();
    let comentarios = pubData.comentarios || [];

    // Buscar el comentario específico por usuario y fecha de comentario
    let updatedComments = comentarios.map((comment) => {
      if (
        comment.usuario === usuario &&
        comment.fechaComentario === fechaComentario
      ) {
        return { ...comment, likes: (comment.likes || 0) + 1 }; // Incrementar likes
      }
      return comment;
    });

    // Guardar los comentarios actualizados en Firebase
    await pubRef.update({ comentarios: updatedComments });

    return { id: pubId, comentarios: updatedComments };
  } catch (error) {
    throw new Error(`Error al dar like al comentario: ${error.message}`);
  }
}

// Función para quitar un "like" de un comentario en una publicación
exports.unlikeComment = async (pubId, usuario, fechaComentario) => {
  try {
    const pubRef = pubCollection.doc(pubId);
    const pubSnapshot = await pubRef.get();

    if (!pubSnapshot.exists) {
      throw new Error("Publicación no encontrada");
    }

    let pubData = pubSnapshot.data();
    let comentarios = pubData.comentarios || [];

    // Buscar el comentario específico por usuario y fecha de comentario
    let updatedComments = comentarios.map((comment) => {
      if (
        comment.usuario === usuario &&
        comment.fechaComentario === fechaComentario
      ) {
        return { ...comment, likes: Math.max((comment.likes || 0) - 1, 0) }; // Evitar valores negativos
      }
      return comment;
    });

    // Guardar los comentarios actualizados en Firebase
    await pubRef.update({ comentarios: updatedComments });

    return { id: pubId, comentarios: updatedComments };
  } catch (error) {
    throw new Error(`Error al quitar like al comentario: ${error.message}`);
  }
}