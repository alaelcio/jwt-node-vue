/**
 * Arquivo: src/controllers/user.controller.js
 * Descrição: arquivo responsável pelo CRUD da classe: 'User'
 * Data: 01/01/2020
 * Author Glaucia Lemos <Twitter: @glaucia_lemos86>
 */

const User = require('../models/user.model');

// ==> Usando conceito de Async e Await

// ==> Método responsável por Criar um novo 'User':
exports.registerNewUser = async (req, res) => {
  try {
    // => Antes vamos fazer uma verificação se o usuário já possui algum e-mail já cadastrado:
    let isUser = await User.find({ email: req.body.email });
    console.log(isUser);
    if (isUser.length >= 1) {
      return res.status(409).json({ message: 'Atenção!  Este e-mail já possui registro na Base de Dados!' });
    }

    const newUser = new User(req.body);
    const user = await newUser.save();
    const token = await newUser.generateAuthToken(); // ==> Aqui chamaremos o método que criamos no model
    res.status(201).json({ message: 'Usuário(a) criado(a) com sucesso!', user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

// ==> Método responsável por realizar um novo login 'User':
exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Erro ao Logar! Verifique as suas credenciais de autenticação!' });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ message: 'Usuário(a) logado com sucesso!', user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.returnUserProfile = async (req, res) => {
  await res.json(req.userData);
};
