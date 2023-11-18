const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = function (possport) {};
