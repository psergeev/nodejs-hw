import { UserController } from '../controllers/userController';
import { GroupController } from '../controllers/groupController';

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

router.get('/user/', UserController.listUsers);
router.get('/user/:id', UserController.getUser);
router.post('/user/', validator.body(bodySchema), UserController.createUser);
router.put('/user/:id', validator.body(bodySchema), UserController.updateUser);
router.delete('/user/:id', UserController.deleteUser);

router.get('/group/', GroupController.listGroups);
router.get('/group/:id', GroupController.getGroup);
router.post('/group/', validator.body(bodySchemaGroup), GroupController.createGroup);
router.put('/group/:id', validator.body(bodySchemaGroup), GroupController.updateGroup);
router.delete('/group/:id', GroupController.deleteGroup);
router.post('/add-users-to-group', GroupController.addUsersToGroup);

module.exports = router;
