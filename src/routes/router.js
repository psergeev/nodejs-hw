import { UserService } from '../services/userService';
import { GroupService } from '../services/groupService';

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

const bodySchemaGroup = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().required(),
});

router.get('/user/', async (req, res) => {
  const users = await UserService.list(req.query.loginSubstring, parseInt(req.query.limit));

  res.json(users);
});

router.get('/user/:id', async (req, res) => {
  const user = await UserService.get(parseInt(req.params.id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post('/user/', validator.body(bodySchema), async (req, res) => {
  try {
    const user = await UserService.create(req.body.login, req.body.password, req.body.age);

    res.json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/user/:id', validator.body(bodySchema), async (req, res) => {
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

router.delete('/user/:id', async (req, res) => {
  const result = await UserService.delete(parseInt(req.params.id));

  if (result[0] > 0) {
    res.json(result[1][0]);
  } else {
    res.status(404).end();
  }
});

router.get('/group/', async (req, res) => {
  const groups = await GroupService.list(parseInt(req.query.limit));

  res.json(groups);
});

router.get('/group/:id', async (req, res) => {
  const group = await GroupService.get(parseInt(req.params.id));

  if (group) {
    res.json(group);
  } else {
    res.status(404).end();
  }
});

router.post('/group/', validator.body(bodySchemaGroup), async (req, res) => {
  try {
    const group = await GroupService.create(req.body.name, req.body.permissions);

    res.json(group);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put('/group/:id', validator.body(bodySchemaGroup), async (req, res) => {
  try {
    const result = await GroupService.update(parseInt(req.params.id), req.body.name, req.body.permissions);

    if (result[0] > 0) {
      res.json(result[1][0]);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/group/:id', async (req, res) => {
  const result = await GroupService.delete(parseInt(req.params.id));

  if (result) {
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});

router.post('/add-users-to-group', async (req, res) => {
  try {
    await GroupService.addToUsers(req.body.groupId, req.body.userIds);

    res.status(200).end();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
