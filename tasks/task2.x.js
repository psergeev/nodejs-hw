const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});
import { UserService } from '../lib/homework2';

const bodySchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(/[0-9]+/, 'numbers')
    .pattern(/[a-zA-Z]+/, 'strings')
    .required(),
  age: Joi.number()
    .min(4)
    .max(130)
    .required(),
});

app.use(express.json());

app.get('/', (req, res) => {
  const userService = UserService.instance();
  const users = userService.list(req.query.loginSubstring, parseInt(req.query.limit));

  res.json(users);
});

app.get('/:id', (req, res) => {
  const userService = UserService.instance();
  const user = userService.get(parseInt(req.params.id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

app.post('/', validator.body(bodySchema), (req, res) => {
  const userService = UserService.instance();

  try {
    const user = userService.create(req.body.login, req.body.password, req.body.age);

    res.json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.put('/:id', validator.body(bodySchema), (req, res) => {
  const userService = UserService.instance();

  try {
    const user = userService.update(parseInt(req.params.id), req.body.login, req.body.password, req.body.age);

    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.delete('/:id', (req, res) => {
  const userService = UserService.instance();
  const user = userService.delete(parseInt(req.params.id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

app.listen(3000);
