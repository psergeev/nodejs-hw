import { logger } from '../decorators/logger';
import { UserService } from '../services/userService';
import { GroupService } from '../services/groupService';

export class GroupController {
  @logger
  static async listGroups(req, res) {
    const groups = await GroupService.list(parseInt(req.query.limit));
    res.json(groups);
  }

  @logger
  static async getGroup(req, res) {
    const group = await GroupService.get(parseInt(req.params.id));

    if (group) {
      res.json(group);
    } else {
      res.status(404).end();
    }
  }

  @logger
  static async createGroup(req, res) {
    try {
      const group = await GroupService.create(req.body.name, req.body.permissions);

      res.json(group);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }

  @logger
  static async updateGroup(req, res) {
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
  }

  @logger
  static async deleteGroup(req, res) {
    const result = await GroupService.delete(parseInt(req.params.id));

    if (result) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  }

  @logger
  static async addUsersToGroup(req, res) {
    try {
      await GroupService.addToUsers(req.body.groupId, req.body.userIds);

      res.status(200).end();
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
}
