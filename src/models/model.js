const database = require('../db');

class Model {
  static tableName;

  static get table () {
    if (!this.tableName) {
      throw new Error('You must set a table name!');
    }
    return database(this.tableName);
  }

  static async all (select = '*') {
    return this.table.select(select);
  }

  static async insert (data) {
    const [result] = await this.table.insert(data);
    return result;
  }

  static async update (id, data) {
    const result = await this.table.where({ id }).update(data);
    return result;
  }

  static async delete (id) {
    return this.table.where({ id }).del();
  }

  static async find (id) {
    return this.table.where('id', id).first();
  }

  static async findBy (data) {
    return this.table.where(data).first();
  }

  static async where (data, select = '*') {
    return this.table.where(data).select(select);
  }
}

module.exports = Model;
