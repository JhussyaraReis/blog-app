const express = require("express");
const router = express.Router();

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
    //
  }
});

module.exports = router;
