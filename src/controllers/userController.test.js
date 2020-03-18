import { UserController } from './userController';
import { UserService } from '../services/userService';
import * as JWTService from '../services/JWTService';

jest.mock('../services/userService');
jest.mock('../decorators/logger');
jest.mock('../services/JWTService');

const mockResponse = () => {
  const res = {
    end: jest.fn(),
    send: jest.fn(),
  };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

const res = mockResponse();

beforeEach(() => {
  UserService.mockReset();
  res.status.mockClear();
  res.json.mockClear();
});

describe('UserController', () => {
  describe('UserController.listUsers', () => {
    const req = {
      query: {
        loginSubstring: 'login',
        limit: '10',
      },
    };

    it('expect UserService.list(params) is called', async () => {
      await UserController.listUsers(req, res);

      expect(UserService.list).toHaveBeenNthCalledWith(1, req.query.loginSubstring, parseInt(req.query.limit));
    });

    it('expect response with empty array when no users found', async () => {
      const emptyResponse = [];
      UserService.list = jest.fn().mockReturnValue(emptyResponse);

      await UserController.listUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(emptyResponse);
    });
  });

  describe('UserController.getUser', () => {
    const req = {
      params: {
        id: '10',
      },
    };

    it('expect UserService.get(params) is called', async () => {
      await UserController.getUser(req, res);

      expect(UserService.get).toHaveBeenNthCalledWith(1, parseInt(req.params.id));
    });

    it('expect 404 response when no user found', async () => {
      UserService.get = jest.fn();

      await UserController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('expect response with user when user found', async () => {
      const user = 'User';
      UserService.get = jest.fn().mockReturnValue(user);

      await UserController.getUser(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('UserController.createUser', () => {
    const req = {
      body: {
        login: 'login',
        password: 'password',
        age: 'age',
      },
    };

    it('expect UserService.create(params) is called', async () => {
      await UserController.createUser(req, res);

      expect(UserService.create).toHaveBeenNthCalledWith(1, req.body.login, req.body.password, req.body.age);
    });

    it('expect 400 response when error during user creation', async () => {
      UserService.create = jest.fn().mockRejectedValue(new Error('error'));

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('expect message when error during user creation', async () => {
      const errorMessage = 'error';
      UserService.create = jest.fn().mockRejectedValue(new Error(errorMessage));

      await UserController.createUser(req, res);

      expect(res.status().send).toHaveBeenCalledWith(errorMessage);
    });

    it('expect response with user when user created', async () => {
      const user = 'User';
      UserService.create = jest.fn().mockReturnValue(user);

      await UserController.createUser(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('UserController.updateUser', () => {
    const req = {
      params: {
        id: '10',
      },
      body: {
        login: 'login',
        age: 'age',
        password: 'password',
      },
    };

    it('expect UserService.update(params) is called', async () => {
      await UserController.updateUser(req, res);

      expect(UserService.update).toHaveBeenNthCalledWith(
        1,
        parseInt(req.params.id),
        req.body.login,
        req.body.password,
        req.body.age,
      );
    });

    it('expect 400 response when error during user update', async () => {
      UserService.update = jest.fn().mockRejectedValue(new Error('error'));

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('expect 404 response when no user to update found', async () => {
      UserService.update = jest.fn().mockReturnValue([0]);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('expect message when error during user update', async () => {
      const errorMessage = 'error';
      UserService.update = jest.fn().mockRejectedValue(new Error(errorMessage));

      await UserController.updateUser(req, res);

      expect(res.status().send).toHaveBeenCalledWith(errorMessage);
    });

    it('expect response with user when user updated', async () => {
      const result = [1, ['User']];
      UserService.update = jest.fn().mockReturnValue(result);

      await UserController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(result[1][0]);
    });
  });

  describe('UserController.deleteUser', () => {
    const req = {
      params: {
        id: '10',
      },
    };

    it('expect UserService.delete(params) is called', async () => {
      UserService.delete = jest.fn().mockReturnValue([0]);

      await UserController.deleteUser(req, res);

      expect(UserService.delete).toHaveBeenNthCalledWith(1, parseInt(req.params.id));
    });

    it('expect response with user when user delete', async () => {
      const result = [1, ['User']];
      UserService.delete = jest.fn().mockReturnValue(result);

      await UserController.deleteUser(req, res);

      expect(res.json).toHaveBeenCalledWith(result[1][0]);
    });

    it('expect 404 response when no user to delete found', async () => {
      const result = [0];
      UserService.delete = jest.fn().mockReturnValue(result);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('UserController.loginUser', () => {
    const req = {
      body: {
        login: 'login',
        password: 'password',
      },
    };

    it('expect UserService.authorize(params) is called', async () => {
      await UserController.loginUser(req, res);

      expect(UserService.authorize).toHaveBeenNthCalledWith(1, req.body.login, req.body.password);
    });

    it('expect 403 response when wrong login/password', async () => {
      await UserController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('expect token on successful authorization', async () => {
      const token = 'Token';
      UserService.authorize = jest.fn().mockReturnValue('User');
      JWTService.createToken = jest.fn().mockReturnValue(token);

      await UserController.loginUser(req, res);

      expect(res.send).toHaveBeenCalledWith(token);
    });
  });
});
