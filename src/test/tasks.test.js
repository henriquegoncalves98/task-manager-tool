require('dotenv').config();
const request = require('supertest');
const app = require('../index');
const { addTaskData, updateTaskData } = require('../utils/task.test.data');

const techToken = 'GET YOUR TOKEN FROM [POST] /api/v1/users/login  - with tech email and password in body';
const managerToken = 'GET YOUR TOKEN FROM [POST] /api/v1/users/login  - with manager email and password in body';
let taskId = null;

describe('Checking authorization middleware', () => {
  it('should create a task', async () => {
    return request(app)
      .post('/api/v1/tasks')
      .send(addTaskData)
      .then((res) => {
        expect(res.statusCode).toBe(401);
      });
  });
});

describe('GET /api/v1/tasks', () => {
  it('should return tasks for tech', async () => {
    return request(app)
      .get('/api/v1/tasks')
      .set('Authorization', techToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  it('should return tasks for manager', async () => {
    return request(app)
      .get('/api/v1/tasks')
      .set('Authorization', managerToken)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe('POST /api/v1/tasks', () => {
  it('should create a task', async () => {
    return request(app)
      .post('/api/v1/tasks')
      .set('Authorization', techToken)
      .send(addTaskData)
      .then(({ res, body }) => {
        taskId = body.id;
        expect(res.statusCode).toBe(201);
      });
  });

  it('should get blocked when creating a task', async () => {
    return request(app)
      .post('/api/v1/tasks')
      .set('Authorization', managerToken)
      .send(addTaskData)
      .then((res) => {
        expect(res.statusCode).toBe(403);
      });
  });
});

describe('PUT /api/v1/tasks/:id', () => {
  it('should update a task', async () => {
    return request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', techToken)
      .send(updateTaskData)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  it('should get blocked when updating a task', async () => {
    return request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', managerToken)
      .send(updateTaskData)
      .then((res) => {
        expect(res.statusCode).toBe(403);
      });
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  it('should get blocked when deleting a task', async () => {
    return request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', techToken)
      .then((res) => {
        expect(res.statusCode).toBe(403);
      });
  });

  it('should delete a task', async () => {
    return request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', managerToken)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});
