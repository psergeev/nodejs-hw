import { PERMISSIONS } from '../constants/permissions';

const models = require('../models');
const { Op } = require('sequelize');

const GroupModel = models.group;

export class GroupService {
  static async delete(id) {
    return await GroupModel.destroy({
      where: { id: id },
    });
  }

  static async get(id) {
    return await GroupModel.findByPk(id);
  }

  static async list(limit) {
    let options = {};

    if (limit) {
      options.limit = limit;
    }

    return await GroupModel.findAll(options);
  }

  static async create(name, permissions) {
    if (!GroupService._is_permissions_valid(permissions)) {
      throw new Error('wrong permissions');
    }

    if (await GroupModel.findOne({ where: { name: name } })) {
      throw new Error('group already exists');
    }

    return await GroupModel.create({
      name: name,
      permissions: permissions,
    });
  }

  static async update(id, name, permissions) {
    if (!GroupService._is_permissions_valid(permissions)) {
      throw new Error('wrong permissions');
    }

    if (
      await GroupModel.findOne({
        where: {
          [Op.and]: [{ name: name }, { id: { [Op.ne]: id } }],
        },
      })
    ) {
      throw new Error('group with same name exists');
    }

    return await GroupModel.update(
      {
        name: name,
        permissions: permissions,
      },
      {
        where: {
          id: id,
        },
        returning: true,
      },
    );
  }

  static async addToUsers(groupId, userIds) {
    if (!(await GroupModel.findByPk(groupId))) {
      throw new Error('group not found');
    }

    const transaction = await models.sequelize.transaction();

    try {
      for (let userId of userIds) {
        await models.userGroup.create(
          {
            user_id: userId,
            group_id: groupId,
          },
          {
            transaction: transaction,
          },
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  static _is_permissions_valid(permissions) {
    return permissions.every(item => PERMISSIONS.includes(item));
  }
}
