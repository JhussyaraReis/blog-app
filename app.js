const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const admin = require("./rootes/admin");
const path = require("path");
const mongoose = require("mongoose");

/**     Config
 *       Template Engine     */
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,

      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

/**     Body Parser         */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**     Mongoose            */
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/blog")
  .then(() => {
    console.log("Conectado ao banco blog");
  })
  .catch((err) => {
    console.log("Ocorreu um erro ao conectar ao banco Blog" + err);
  });

/**     Public              */
app.use(express.static(path.join(__dirname, "public")));

/**     Rotas               */

app.use("/admin", admin);

/**     Servidor            */
const porta = 8081;
app.listen(porta, () => {
  console.log("Servidor rodando na porta http://127.0.0.1:8081/");
});
