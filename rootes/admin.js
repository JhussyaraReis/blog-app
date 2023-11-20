const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
const { eAdmin } = require("../helpers/eAdmin");

router.get("/", eAdmin, (req, res) => {
  res.render("admin/index");
});

router.get("/categorias", eAdmin, (req, res) => {
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

router.get("/categorias/add", eAdmin, (req, res) => {
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

router.get("/categorias/editar/:id", eAdmin, (req, res) => {
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

router.post("/categorias/editar", eAdmin, (req, res) => {
  Categoria.findOne({ _id: req.body.id }).then((categoria) => {
    /** Validar os campos */
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

router.post("/categorias/excluir", eAdmin, (req, res) => {
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

router.get("/postagens", eAdmin, (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ _id: "desc" })
    .then((postagem) => {
      res.render("admin/postagens", { postagem: postagem });
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao listar as postagens!");
      res.redirect("admin");
    });
});

router.get("/postagens/add", eAdmin, (req, res) => {
  Categoria.find()
    .then((categoria) => {
      res.render("admin/addPostagem", { categoria: categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao buscar as categorias");
      res.redirect("/admin");
    });
});

router.post("/postagens/nova", eAdmin, (req, res) => {
  const erros = [];

  if (req.body.categoria == "0") {
    erros.push({ texto: "Categoria Inválida" });
  }

  if (erros.length > 0) {
    res.render("admin/addPostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
    };
    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem adicionada com sucesso!");
        res.redirect("/admin/postagens");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Ocorreu um erro ao salvar a postagem, tentar novamente"
        );
        res.redirect("/admin/postagens");
      });
  }
});

router.get("/postagens/editar/:id", eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.params.id })
    .then((postagem) => {
      Categoria.find()
        .then((categoria) => {
          res.render("admin/editarPostagem", {
            categoria: categoria,
            postagem: postagem,
          });
        })
        .catch((err) => {
          req.flash("error_msg", "Ocorreu um erro ao listar as categorias");
          res.redirect("/admin/postagens");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao carregar o formulário");
      res.redirect("/admin/postagens");
    });
});

router.post("/postagens/editar", eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.body.id })
    .then((postagem) => {
      /** Validar os campos */
      postagem.titulo = req.body.titulo;
      postagem.descricao = req.body.descricao;
      postagem.slug = req.body.slug;
      postagem.conteudo = req.body.conteudo;
      postagem.categoria = req.body.categoria;

      postagem
        .save()
        .then(() => {
          req.flash("success_msg", "Postagem editada com sucesso!");
          res.redirect("/admin/postagens");
        })
        .catch((err) => {
          req.flash("error_msg", "Ocorreu um erro ao editar a postagem");
          res.redirect("/admin/postagens");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao editar a postagem");
      res.redirect("/admin/postagens");
    });
});

router.post("/postagens/excluir", eAdmin, (req, res) => {
  Postagem.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem exluída com sucesso!");
      res.redirect("/admin/postagens");
    })
    .catch((err) => {
      req.flash("error_msg", "Ocorreu um erro ao excluir a postagem!");
      res.redirect("/admin/postagens");
    });
});

module.exports = router;
