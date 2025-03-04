const express = require("express");
const app = express();
const taskRoutes = require("./routes/taskRoutes"); // 👈 Verifica que esta línea importe bien el archivo

app.use(express.json());
app.use("/apiV1/task", taskRoutes); // 👈 Aquí usa "taskRoutes", no un objeto

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
