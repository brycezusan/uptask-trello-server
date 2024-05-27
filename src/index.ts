import server from "./server";
import colors from "colors";

const PORT = process.env.PORT ?? 5000;

server.listen(PORT, () => {
  console.log(colors.bgBlue.bold(`Servidor corriendo en el puerto ${PORT}`));
});
