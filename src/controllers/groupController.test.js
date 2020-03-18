import { GroupController } from './groupController';
import { GroupService } from '../services/groupService';

jest.mock('../services/groupService');
jest.mock('../decorators/logger');

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
  GroupService.mockReset();
  res.status.mockClear();
  res.json.mockClear();
});

describe('GroupController', () => {
  describe('GroupController.listGroups', () => {
    const req = {
      query: {
        limit: '10',
      },
    };

    it('expect GroupService.list(params) is called', async () => {
      await GroupController.listGroups(req, res);

      expect(GroupService.list).toHaveBeenNthCalledWith(1, parseInt(req.query.limit));
    });

    it('expect response with empty array when no groups found', async () => {
      const emptyResponse = [];
      GroupService.list = jest.fn().mockReturnValue(emptyResponse);

      await GroupController.listGroups(req, res);

      expect(res.json).toHaveBeenCalledWith(emptyResponse);
    });
  });

  describe('GroupController.getGroup', () => {
    const req = {
      params: {
        id: '10',
      },
    };

    it('expect GroupService.get(params) is called', async () => {
      await GroupController.getGroup(req, res);

      expect(GroupService.get).toHaveBeenNthCalledWith(1, parseInt(req.params.id));
    });

    it('expect 404 response when no group found', async () => {
      GroupService.get = jest.fn();

      await GroupController.getGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('expect response with group when group found', async () => {
      const group = 'Group';
      GroupService.get = jest.fn().mockReturnValue(group);

      await GroupController.getGroup(req, res);

      expect(res.json).toHaveBeenCalledWith(group);
    });
  });

  describe('GroupController.createGroup', () => {
    const req = {
      body: {
        name: 'name',
        permissions: 'permissions',
      },
    };

    it('expect GroupService.create(params) is called', async () => {
      await GroupController.createGroup(req, res);

      expect(GroupService.create).toHaveBeenNthCalledWith(1, req.body.name, req.body.permissions);
    });

    it('expect 400 response when error during group creation', async () => {
      GroupService.create = jest.fn().mockRejectedValue(new Error('error'));

      await GroupController.createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('expect message when error during group creation', async () => {
      const errorMessage = 'error';
      GroupService.create = jest.fn().mockRejectedValue(new Error(errorMessage));

      await GroupController.createGroup(req, res);

      expect(res.status().send).toHaveBeenCalledWith(errorMessage);
    });

    it('expect response with group when group created', async () => {
      const group = 'Group';
      GroupService.create = jest.fn().mockReturnValue(group);

      await GroupController.createGroup(req, res);

      expect(res.json).toHaveBeenCalledWith(group);
    });
  });

  describe('GroupController.updateGroup', () => {
    const req = {
      params: {
        id: '10',
      },
      body: {
        name: 'name',
        permissions: 'permissions',
      },
    };

    it('expect GroupService.update(params) is called', async () => {
      await GroupController.updateGroup(req, res);

      expect(GroupService.update).toHaveBeenNthCalledWith(
        1,
        parseInt(req.params.id),
        req.body.name,
        req.body.permissions,
      );
    });

    it('expect 400 response when error during group update', async () => {
      GroupService.update = jest.fn().mockRejectedValue(new Error('error'));

      await GroupController.updateGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('expect 404 response when no group to update found', async () => {
      GroupService.update = jest.fn().mockReturnValue([0]);

      await GroupController.updateGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('expect message when error during group update', async () => {
      const errorMessage = 'error';
      GroupService.update = jest.fn().mockRejectedValue(new Error(errorMessage));

      await GroupController.updateGroup(req, res);

      expect(res.status().send).toHaveBeenCalledWith(errorMessage);
    });

    it('expect response with group when group updated', async () => {
      const result = [1, ['Group']];
      GroupService.update = jest.fn().mockReturnValue(result);

      await GroupController.updateGroup(req, res);

      expect(res.json).toHaveBeenCalledWith(result[1][0]);
    });
  });

  describe('GroupController.deleteGroup', () => {
    const req = {
      params: {
        id: '10',
      },
    };

    it('expect GroupService.delete(params) is called', async () => {
      await GroupController.deleteGroup(req, res);

      expect(GroupService.delete).toHaveBeenNthCalledWith(1, parseInt(req.params.id));
    });

    it('expect 404 response when no group to delete found', async () => {
      await GroupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('expect 200 response when group delete', async () => {
      GroupService.delete = jest.fn().mockReturnValue('Group');

      await GroupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GroupController.addUsersToGroup', () => {
    const req = {
      body: {
        groupId: '10',
        userIds: [1],
      },
    };

    it('expect GroupService.addToUsers(params) is called', async () => {
      await GroupController.addUsersToGroup(req, res);

      expect(GroupService.addToUsers).toHaveBeenNthCalledWith(1, req.body.groupId, req.body.userIds);
    });

    it('expect 200 response when group added to users', async () => {
      await GroupController.addUsersToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('expect 400 response when error on adding group to users', async () => {
      GroupService.addToUsers = jest.fn().mockRejectedValue(new Error('error'));
      await GroupController.addUsersToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('expect message when error on adding group to users', async () => {
      const errorMessage = 'error';
      GroupService.addToUsers = jest.fn().mockRejectedValue(new Error(errorMessage));
      await GroupController.addUsersToGroup(req, res);

      expect(res.status().send).toHaveBeenCalledWith(errorMessage);
    });
  });
});
