import { UserController } from '../controllers/userController';
import { GroupController } from '../controllers/groupController';
import * as JWTService from '../services/JWTService';

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

const bodySchemaUserLogin = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

const bodySchemaGroup = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().required(),
});

router.post('/login', validator.body(bodySchemaUserLogin), UserController.loginUser);

router.get('/user/', JWTService.verifyToken, UserController.listUsers);
router.get('/user/:id', JWTService.verifyToken, UserController.getUser);
router.post('/user/', validator.body(bodySchema), UserController.createUser);
router.put('/user/:id', JWTService.verifyToken, validator.body(bodySchema), UserController.updateUser);
router.delete('/user/:id', JWTService.verifyToken, UserController.deleteUser);

router.get('/group/', JWTService.verifyToken, GroupController.listGroups);
router.get('/group/:id', JWTService.verifyToken, GroupController.getGroup);
router.post('/group/', JWTService.verifyToken, validator.body(bodySchemaGroup), GroupController.createGroup);
router.put('/group/:id', JWTService.verifyToken, validator.body(bodySchemaGroup), GroupController.updateGroup);
router.delete('/group/:id', JWTService.verifyToken, GroupController.deleteGroup);
router.post('/add-users-to-group', JWTService.verifyToken, GroupController.addUsersToGroup);

module.exports = router;
