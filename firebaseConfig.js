const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json"); // Asegúrate de que este archivo existe

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Inicializa Firestore

module.exports = { db };
