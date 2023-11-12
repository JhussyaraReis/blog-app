const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

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

/**     Rotas               */

/**     Servidor            */
const porta = 8081;
app.listen(porta, () => {
  console.log("Servidor rodando na porta 8081");
});
