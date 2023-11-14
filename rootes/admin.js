const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Página de Posts");
});

router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ data: "desc" })
    .then((categorias) => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao listar as categorias!");
      res.redirect("admin");
    });
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addCategorias");
});

router.post("/categorias/nova", (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome Inválido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug Inválido" });
  }

  if (req.body.nome.length < 4) {
    erros.push({ texto: "O nome da categoria é muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addCategorias", { erros: erros });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };
    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "A categoria foi criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Ocorreu um erro ao tentar salvar a categoria, tente novamente"
        );
        res.redirect("/admin");
      });
  }
});

router.get("/categorias/editar/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .then((categoria) => {
      res.render("admin/editarCategoria", { categoria: categoria });
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "Ocorreu um erro ao localizar a categoria, tentar novamente"
      );
    });
});

router.post("/categorias/editar", (req, res) => {
  Categoria.findOne({ _id: req.body.id }).then((categoria) => {
    categoria.nome = req.body.nome;
    categoria.slug = req.body.slug;

    categoria
      .save()
      .then(() => {
        req.flash("success_msg", "A categoria foi alterada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Ocorreu um erro ao alterar a categoria, tente novamente!"
        );
        res.redirect("/admin/categorias");
      });
  });
});

router.post("/categorias/excluir", (req, res) => {
  Categoria.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "A categoria foi excluida com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao tentar excluir a categoria!");
      res.redirect("/admin/categorias");
    });
});

module.exports = router;
