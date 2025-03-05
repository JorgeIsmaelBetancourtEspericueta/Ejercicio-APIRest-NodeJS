const express = require("express");
const router = express.Router();
const controllerPubs = require('../controllers/pubsController');

// Obtener todas las publicaciones
router.get('/publication/', controllerPubs.getAllPublications);

// Obtener una publicación específica por ID
router.get('/publication/:id',controllerPubs.getPublicationById)

// Agregar una nueva publicación con validaciones
router.post("publication/",controllerPubs.createPublication);

// Eliminar una puublicación
router.delete("publication/:id",controllerPubs.deletePublication);

// Actualizar una publicación
router.put("publication/:id", controllerPubs.updatePublication);

//Agregar un comentario a una publicacion
router.post('publication/:idPub/comment', controllerPubs.addCommentToPublication);

//Eliminar un comentario de una publicacion
router.delete('publication/:idPub/comment/:idComment', controllerPubs.deleteComment);

//Actualizar comentario de una publicacion
router.put('/publication/:idPub/comment/:idComment', controllerPubs.updateComment);

module.exports = router; // Exporta el router
