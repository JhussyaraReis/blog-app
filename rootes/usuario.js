const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { route } = require("./admin");

router.get("/registro", (req, res) => {
  res.render("usuario/registro");
});

router.post("/registro", (req, res) => {
  var erros = [];

  if (!req.body.nome || req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome Inválido" });
  }
  if (
    !req.body.email ||
    req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "E-mail Inválido" });
  }
  if (
    !req.body.senha ||
    req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha Inválido" });
  }

  if (req.body.senha.length < 4) {
    erros.push({ texto: "Senha muito pequena" });
  }
  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "As senhas são diferentes, tentar novamente" });
  }

  if (erros.length > 0) {
    res.render("usuario/registro", { erros: erros });
  } else {
    Usuario.findOne({ email: req.body.email })
      .then((usuario) => {
        if (usuario) {
          req.flash("success_msg", "E-mail já registrado");
          res.redirect("/usuario/registro");
        } else {
          const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
          });

          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
              if (erro) {
                req.flash("error_msg", "Ocorreu um erro ao salvar o usuário");
                res.redirect("/");
              }
              novoUsuario.senha = hash;
              novoUsuario
                .save()
                .then(() => {
                  req.flash("success_msg", "Usuário registrado com sucesso!");
                  res.redirect("/");
                })
                .catch(() => {
                  req.flash("error_msg", "Ocorreu um erro ao salvar o usuário");
                  res.redirect("/usuario/registro");
                });
            });
          });
        }
      })
      .catch(() => {
        req.flash("error_msg", "Ocorreu um erro interno");
        res.redirect("/");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("usuario/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuario/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    req.flash("success_msg", "LogOut concluído com sucesso!");
    res.redirect("/");
  });
});
module.exports = router;
