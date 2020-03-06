import { logger } from '../decorators/logger';
import { UserService } from '../services/userService';
import * as JWTService from '../services/JWTService';

export class UserController {
  @logger
  static async listUsers(req, res) {
    const users = await UserService.list(req.query.loginSubstring, parseInt(req.query.limit));
    res.json(users);
  }

  @logger
  static async getUser(req, res) {
    const user = await UserService.get(parseInt(req.params.id));

    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  }

  @logger
  static async createUser(req, res) {
    try {
      const user = await UserService.create(req.body.login, req.body.password, req.body.age);

      res.json(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }

  @logger
  static async updateUser(req, res) {
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
  }

  @logger
  static async deleteUser(req, res) {
    const result = await UserService.delete(parseInt(req.params.id));

    if (result[0] > 0) {
      res.json(result[1][0]);
    } else {
      res.status(404).end();
    }
  }

  @logger
  static async loginUser(req, res) {
    const user = await UserService.authorize(req.body.login, req.body.password);

    if (!user) {
      res.status(403).send('Bad username/password');
    } else {
      let token = JWTService.createToken({});
      res.send(token);
    }
  }
}
