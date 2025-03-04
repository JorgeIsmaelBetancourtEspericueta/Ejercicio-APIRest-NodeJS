const { db } = require("../firebaseConfig"); // Importa la configuración de Firestore
const { tasks } = require("../models/task"); // Mantén tu lógica existente

exports.getAllTasks = (req, res) => {
  res.status(200).json(tasks);
};

exports.getTaskById = (req, res) => {
  const id = req.params.id; // Cambiar a string ya que Firestore usa strings para IDs
  const task = tasks.find((item) => item.id === id);
  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

exports.createTask = (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const id = req.params.id; // Cambiar a string para la búsqueda
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.title = req.body.title;
    res.status(200).json(task);
  } else {
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

// 🔥 Nueva función para eliminar una tarea específica
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id; // Obtener el ID desde los parámetros

  try {
    const taskRef = db.collection("tasks").doc(taskId); // Referencia al documento en Firestore
    const taskSnapshot = await taskRef.get(); // Obtener el documento

    if (!taskSnapshot.exists) {
      return res.status(404).json({ message: "Tarea no encontrada" }); // Si no existe
    }

    await taskRef.delete(); // Eliminar el documento
    res.status(200).json({ message: "Tarea eliminada correctamente" }); // Respuesta de éxito
  } catch (error) {
    console.error("Error al eliminar la tarea:", error); // Log de error
    res.status(500).json({ error: error.message }); // Respuesta de error
  }
};
