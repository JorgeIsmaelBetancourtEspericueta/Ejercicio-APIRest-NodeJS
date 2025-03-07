const express = require("express");
const router = express.Router();
const controllerPubs = require("../controllers/pubsController");

/**
 * @route GET /publication
 * @description Obtiene todas las publicaciones.
 * @returns {Array} 200 - Una lista de publicaciones
 * @returns {Object} 404 - Mensaje si no se encuentran publicaciones
 * @returns {Object} 500 - Mensaje de error
 */
router.get("/publication/", controllerPubs.getAllPublications); // Obtener todas las publicaciones

/**
 * @route GET /publication/:id
 * @description Obtiene una publicación por su ID.
 * @param {string} id - El ID de la publicación que se desea obtener.
 * @returns {Object} 200 - La publicación encontrada.
 * @returns {Object} 404 - Mensaje si no se encuentra la publicación.
 * @returns {Object} 500 - Mensaje de error.
 */
router.get("/publication/:id", controllerPubs.getPublicationById); // Obtener una publicación específica por ID

/**
 * @route POST /publication
 * @description Crea una nueva publicación con los datos proporcionados.
 * @body {Object} publication - Los datos de la nueva publicación.
 * @bodyParam {string} author - El autor de la publicación.
 * @bodyParam {string} title - El título de la publicación.
 * @bodyParam {string} content - El contenido de la publicación.
 * @returns {Object} 201 - La publicación creada exitosamente.
 * @returns {Object} 400 - Mensaje si los datos proporcionados son inválidos.
 * @returns {Object} 500 - Mensaje de error.
 */
router.post("/publication", controllerPubs.createPublication); //Agrega una nueva publicación

/**
 * @route DELETE /publication/:id
 * @description Elimina una publicación por su ID.
 * @param {string} id - El ID de la publicación que se desea eliminar.
 * @returns {Object} 200 - Mensaje confirmando que la publicación fue eliminada.
 * @returns {Object} 500 - Mensaje de error si ocurre un problema en la eliminación.
 */
router.delete("/publication/:id", controllerPubs.deletePublication); // Eliminar una publicación

/**
 * @route PUT /publication/:id
 * @description Actualiza una publicación existente por su ID.
 * @param {string} id - El ID de la publicación que se desea actualizar.
 * @param {Object} body - Los campos a actualizar de la publicación (title, content).
 * @returns {Object} 201 - Publicación actualizada exitosamente.
 * @returns {Object} 500 - Mensaje de error si ocurre un problema en la actualización.
 */
router.put("/publication/:id", controllerPubs.updatePublication);

//Consultar los comentarios de una publicacion
router.get('/publication/:idPub/comments', controllerPubs.getComments);


//Agregar un comentario a una publicacion
router.post(
  "/publication/:idPub/comment",
  controllerPubs.addCommentToPublication
);

//Eliminar un comentario de una publicacion
router.delete(
  "/publication/:idPub/comment/:idComment",
  controllerPubs.deleteComment
);

//Actualizar comentario de una publicacion
router.put("/publication/:idPub/comment/:idComment", controllerPubs.updateComment);

// Actualizar los likes de un comentario (agregar o quitar likes)
router.patch('/publication/:idPub/comment/:idComment/like', controllerPubs.updateLikeComment);

//Obtener las publicaciones mas populares
router.get('/publication/trends/popular', controllerPubs.getMostTrend);


module.exports = router; // Exporta el router
