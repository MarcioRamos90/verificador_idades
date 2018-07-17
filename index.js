const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

const validationCheckmiddleware = (req, res, next) => {
  const { nome, dataNascimento } = req.body;

  if (!nome || !dataNascimento) {
    return res.redirect('/');
  }
  return next();
};

app.get('/', (req, res) => {
  res.render('main');
});


app.post('/check', validationCheckmiddleware, (req, res) => {
  const { nome, dataNascimento } = req.body;

  const idade = moment().diff(moment(dataNascimento,
    'YYYY/MM/DD'), 'years');

  if (idade >= 18) {
    res.redirect(`/major?nome=${nome}`);
  } else {
    res.redirect(`/minor?nome=${nome}`);
  }
});

const validationNamemiddleware = (req, res, next) => {
  const { nome } = req.query;

  if (!nome) {
    return res.redirect('/');
  }
  return next();
};

app.get('/major', validationNamemiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('major', { nome });
});

app.get('/minor', validationNamemiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('minor', { nome });
});

app.listen(3000);
