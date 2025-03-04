const { db } = require("../firebaseConfig.js");

const tasksCollection = db.collection("tasks");

// Obtener todas las tareas
async function getTasks() {
  try {
    const snapshot = await tasksCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener tareas: ${error.message}`);
  }
}

// Obtener una tarea específica por ID
async function getTaskById(id) {
  try {
    const taskRef = tasksCollection.doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      throw new Error("Tarea no encontrada");
    }

    return { id: taskSnapshot.id, ...taskSnapshot.data() }; // Devuelve la tarea encontrada
  } catch (error) {
    throw new Error(`Error al obtener la tarea: ${error.message}`);
  }
}

// Agregar una nueva tarea
async function addTask(title) {
  try {
    const newTask = await tasksCollection.add({ title });
    return { id: newTask.id, title };
  } catch (error) {
    throw new Error(`Error al agregar la tarea: ${error.message}`);
  }
}

// Eliminar una tarea por ID
async function deleteTask(id) {
  try {
    const taskRef = tasksCollection.doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      throw new Error("Tarea no encontrada");
    }

    await taskRef.delete();
    return { success: true }; // Devuelve un objeto de éxito
  } catch (error) {
    throw new Error(`Error al eliminar la tarea: ${error.message}`);
  }
}

// Actualizar una tarea por ID
async function updateTask(id, title) {
  try {
    const taskRef = tasksCollection.doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      throw new Error("Tarea no encontrada");
    }

    await taskRef.update({ title });
    return { id, title }; // Devuelve la tarea actualizada
  } catch (error) {
    throw new Error(`Error al actualizar la tarea: ${error.message}`);
  }
}

module.exports = { getTasks, getTaskById, addTask, deleteTask, updateTask };
