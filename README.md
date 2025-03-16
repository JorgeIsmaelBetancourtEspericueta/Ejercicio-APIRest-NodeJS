# Desarrollo de Servicios Web

Equipo:

Betancourt Espericueta Jorge Ismael - 21400655
Natividad Aguilera Andrick Joksan -21400736
Sánchez Leal Britney Bellanay - 21400778
Vargas Partida Jorge Luis - 21400786
Martinez Velazquez Pedro - 19400615

Contenido
En esta actividad, se desarrollaron y probaron APIs utilizando API REST y Firebase, usando Insomnia para pruebas.

Endpoints
GET /api/publication
Recupera todas las publicaciones almacenadas.

GET /api/publication/{id}
Obtiene los detalles de una publicación específica por su ID.

POST /api/publication
Crea una nueva publicación con autor, título y contenido.

PUT /api/publication/{id}
Actualiza el título y contenido de una publicación existente.

DELETE /api/publication/{id}
Elimina una publicación por su ID.

POST /api/publication/{idPub}/comment
Agrega un comentario a una publicación específica.

DELETE /api/publication/{idPub}/comment/{idComment}
Elimina un comentario de una publicación.

GET /api/publication/trends/popular
Obtiene las publicaciones más populares.

GET /api/publication/{idPub}/comments
Recupera todos los comentarios de una publicación.

PUT /api/publication/{idPub}/comment/{idComment}
Actualiza el contenido de un comentario específico.

PATCH /api/publication/{idPub}/comment/{idComment}/like
Incrementa o decrementa los likes de un comentario.
