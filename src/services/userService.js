import { UserModel } from '../models/userModel';
const { Op } = require('sequelize');

export class UserService {
  static async delete(id) {
    return await UserModel.update(
      {
        isDeleted: true,
      },
      {
        where: {
          id: id,
        },
        returning: true,
      },
    );
  }

  static async get(id) {
    return await UserModel.findByPk(id);
  }

  static async list(loginSubstring, limit) {
    let options = {};

    if (loginSubstring) {
      options.where = {
        login: { [Op.like]: `%${loginSubstring}%` },
      };
    }

    if (limit) {
      options.limit = limit;
    }

    return await UserModel.findAll(options);
  }

  static async create(login, password, age) {
    if (await UserModel.findOne({ where: { login: login } })) {
      throw new Error('user already exists');
    }

    return await UserModel.create({
      login: login,
      password: password,
      age: age,
    });
  }

  static async update(id, login, password, age) {
    if (
      await UserModel.findOne({
        where: {
          [Op.and]: [{ login: login }, { id: { [Op.ne]: id } }],
        },
      })
    ) {
      throw new Error('user already exists');
    }

    return await UserModel.update(
      {
        login: login,
        password: password,
        age: age,
      },
      {
        where: {
          id: id,
        },
        returning: true,
      },
    );
  }
}
