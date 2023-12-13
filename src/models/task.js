const Model = require('./model');

class Task extends Model {
  static tableName = 'tasks';

  static async create (data) {
    return super.insert({
      ...data
    });
  }
}

module.exports = Task;
