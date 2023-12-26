# task-manager-tool

### Project Setup (Run in terminal after cloning the project)
` mv .env.example .env `
[Uploading Task-manager-tool.postman_collection.json…]()

`yarn install`

## To start servers just run

`docker-compose up`

## To start testings

- I advise to use [Postman](https://www.postman.com/)
- Start by login the tech and manager default test users with -> POST http://localhost:3000/api/v1/users/login (body must have email and password check in src/db/seeds/01-users.js) and retrieve the auth tokens to use as "Authorization" headers for the rest of the tasks requests (check src/api/tasks.js)
- If you are interested send me email to hmbg1998@gmail.com and I can share with you a postman collection with examples.
