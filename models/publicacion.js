// models/publicationModel.js
const { db } = require("../firebaseConfig.js");

// Definición de la colección "publications" en Firebase
const pubCollection = db.collection("publications");

module.exports = { pubCollection };
