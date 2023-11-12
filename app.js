const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const admin = require("./rootes/admin");
const path = require("path");

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

/**     Public              */
app.use(express.static(path.join(__dirname, "public")));

/**     Rotas               */
app.get("/", (req, res) => {
  res.send("Página Inicial ");
});
app.use("/admin", admin);

/**     Servidor            */
const porta = 8081;
app.listen(porta, () => {
  console.log("Servidor rodando na porta http://127.0.0.1:8081/");
});
