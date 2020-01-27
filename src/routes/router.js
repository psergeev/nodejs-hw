import { UserService } from '../services/userService';

const express = require('express');
let router = express.Router();

const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});

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

router.get('/', async (req, res) => {
  const users = await UserService.list(req.query.loginSubstring, parseInt(req.query.limit));

  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await UserService.get(parseInt(req.params.id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post('/', validator.body(bodySchema), async (req, res) => {
  try {
    const user = await UserService.create(req.body.login, req.body.password, req.body.age);

    res.json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/:id', validator.body(bodySchema), async (req, res) => {
  try {
    const result = await UserService.update(parseInt(req.params.id), req.body.login, req.body.password, req.body.age);

    if (result[0] > 0) {
      res.json(result[1][0]);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/:id', async (req, res) => {
  const result = await UserService.delete(parseInt(req.params.id));

  if (result[0] > 0) {
    res.json(result[1][0]);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
