const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const admin = require("./rootes/admin");
const usuario = require("./rootes/usuario");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
require("./config/auth")(passport);

/**     Config
 *        Session     */
app.use(
  session({
    secret: "secretDaSession",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*       Middleware     */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

/*       Template Engine     */
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

app.get("/", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagem) => {
      res.render("index", { postagem: postagem });
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao listar as postagens");
      res.redirect("/404");
    });
});

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug })
    .then((postagem) => {
      res.render("postagem/index", { postagem: postagem });
    })
    .catch(() => {
      req.flash("error_msg", "Ocorreu um erro ao localizar a postagem");
      res.redirect("index");
    });
});

app.get("/categorias", (req, res) => {
  Categoria.find()
    .then((categorias) => {
      res.render("categorias/index", { categorias: categorias });
    })
    .catch(() => {
      req.flash("error_msg", "Ocorreu um erro ao listar categorias");
      res.redirect("index");
    });
});

app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({ slug: req.params.slug })
    .then((categoria) => {
      if (categoria) {
        Postagem.find({ categoria: categoria._id })
          .then((postagem) => {
            res.render("categorias/postagens", {
              categoria: categoria,
              postagem: postagem,
            });
          })
          .catch(() => {
            req.flash("error_msg", "Ocorreu um erro ao listar Postagens");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "Essa categoria não existe");
        res.redirect("/");
      }
    })
    .catch(() => {
      req.flash(
        "error_msg",
        "Ocorreu um erro interno ao carregar a página de categorias"
      );
      res.redirect("/");
    });
});

app.get("/404", (req, res) => {
  res.send("Erro Interno.. A aplicação não está funcionando corretamente");
});

app.use("/usuario", usuario);

app.use("/admin", admin);

/**     Servidor            */
const porta = 8081;
app.listen(porta, () => {
  console.log("Servidor rodando na porta http://127.0.0.1:8081/");
});
