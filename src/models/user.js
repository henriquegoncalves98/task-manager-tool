const Model = require('./model');

const UserRole = Object.freeze({
  MANAGER: 'manager',
  TECH: 'tech'
});

const defaultUserData = {
  role: UserRole.TECH
};

class User extends Model {
  static tableName = 'users';

  static async create (data) {
    return super.insert({
      ...defaultUserData,
      ...data
    });
  }

  static async findByEmail (email) {
    return super.findBy({ email });
  }
}

module.exports = { User, UserRole };
