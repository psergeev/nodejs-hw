export class UserService {
  static instance() {
    if (!this._instance) {
      this._instance = new UserService();
    }

    return this._instance;
  }

  constructor() {
    this._repository = Repository.instance();
  }

  delete(id) {
    return this._repository.deleteUserById(id);
  }

  get(id) {
    return this._repository.getUserById(id);
  }

  list(loginSubstring, limit) {
    let users = this._repository.listUsers(loginSubstring, limit);

    return users.sort((a, b) => a.login.localeCompare(b.login));
  }

  create(login, password, age) {
    if (this._repository.data.find(user => user.login === login)) {
      throw new Error('user already exists');
    }

    return this._repository.addUser(login, password, age);
  }

  update(id, login, password, age) {
    if (this._repository.data.find(user => user.login === login && user.id !== id)) {
      throw new Error('user already exists');
    }

    return this._repository.updateUserById(id, login, password, age);
  }
}

export class Repository {
  static instance() {
    if (!this._instance) {
      this._instance = new Repository();
    }

    return this._instance;
  }

  constructor() {
    this.data = [];
    this._autoIncrementedUserId = 1;
  }

  getUserById(id) {
    return this.data.find(user => user.id === id);
  }

  addUser(login, password, age) {
    const user = new User(this._autoIncrementedUserId, login, password, age);
    this._autoIncrementedUserId += 1;
    this.data.push(user);

    return user.export();
  }

  updateUserById(id, login, password, age) {
    let user = this.getUserById(id);

    if (user) {
      Object.assign(user, {
        login: login,
        password: password,
        age: age,
      });

      return user.export();
    }
  }

  deleteUserById(id) {
    let user = this.getUserById(id);

    if (user) {
      user.isDeleted = true;
    }

    return user.export();
  }

  listUsers(loginSubstring, limit) {
    let filteredUsers = [];

    if (!loginSubstring) {
      if (limit) {
        filteredUsers = this.data.slice(0, limit);
      } else {
        filteredUsers = this.data;
      }
    } else {
      for (let user of this.data) {
        if (user.login.includes(loginSubstring)) {
          filteredUsers.push(user);
        }

        if (limit && filteredUsers.length === limit) {
          break;
        }
      }
    }

    return filteredUsers.map(user => user.export());
  }
}

class User {
  constructor(id, login, password, age) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
  }

  export() {
    return {
      id: this.id,
      login: this.login,
      password: this.password,
      age: this.age,
      isDeleted: this.isDeleted,
    };
  }
}
