# Project documentation

## Table of Contents

I. [Building and running the app](#building-and-running-the-app)

1. [Prerequisites](#prerequisites)
2. [Setting the environment](#1-setting-the-environment)
3. [Building and running the images](#2-building-and-running-the-project)
4. [Accessing the application](#4-accessing-the-application)
5. [Cleaning up](#5-stopping-the-containers)
6. [Additional commands](#6-additional-commands)

II. [Interacting with the API](#api-documentation)

1. [Create a User](#1-create-a-user)
2. [Login](#2-login)
3. [Refresh](#3-refresh-access-token)
4. [Get user data](#4-get-user-data)
5. [Upload a file](#5-upload-a-file)
6. [Download a file](#6-get-a-file-by-name)
7. [Update a file](#7-update-a-file-using-its-name)
8. [Delete a file](#8-delete-a-file)

---

# Building and running the app

### Prerequisites

- **Docker** installed: [Docker installation guide](https://docs.docker.com/get-docker/)
- **Docker Compose** installed: [Docker Compose installation guide](https://docs.docker.com/compose/install/)

---

## 1. Setting the environment

Rename .env.example to .env to use the default configuration.
You can use the .env.example to make your own custom one.

## 2. Building and Running the Project

Now that you have the Dockerfile and `docker-compose.yml` file, you can use the following commands to build and run your project.

### 1. **Build the Docker Images**

To build the Docker image(s) for your project, run the following command in your project directory:

```bash
docker-compose build
```

This will build the Docker image(s) based on the configurations specified in the `docker-compose.yml` file and the `Dockerfile`.

### 2. **Run the Project**

Once the build is complete, start the containers using:

```bash
docker-compose up
```

This command will:

- Start the containers defined in your `docker-compose.yml` file.
- Expose the application on port 3000.
- Attach the logs from the containers to your terminal.

### 3. **Run in Detached Mode**

If you want to run the containers in the background (detached mode), use the `-d` flag:

```bash
docker-compose up -d
```

This will run the containers in the background, and you won’t see the logs in your terminal.

---

## 4. Accessing the Application

Once your containers are up and running, you should be able to access your application by navigating to:

```
http://localhost:3000
```

This is the public api that you can access.
The way to use it is listed [here](#api-documentation).

---

## 5. Stopping the App and Cleanup

### Stop the containers:

```bash
docker-compose down
```

This will stop and remove the containers. It won’t remove the images or volumes, so you can quickly start them again if needed.
To remove the volumes add `-v` flag.

### Remove unused containers, networks, and volumes:

    ```bash
    docker-compose down --volumes --rmi all
    ```

### Finally delete the files

---

## 6. Additional Commands

Here are a few more useful commands:

- **View logs of your containers:**

    ```bash
    docker-compose logs
    ```

- **Rebuild images:**

    ```bash
    docker-compose up --build
    ```

---

# API Documentation

This guide provides details on how to interact with the API using `curl` commands on Unix-based systems and `cmd` (Windows Command Prompt).

## Table of Contents

1. [Create a User](#1-create-a-user)
2. [Login](#2-login)
3. [Refresh](#3-refresh-access-token)
4. [Get user data](#4-get-user-data)
5. [Upload a file](#5-upload-a-file)
6. [Download a file](#6-get-a-file-by-name)
7. [Update a file](#7-update-a-file-using-its-name)
8. [Delete a file](#8-delete-a-file)

---

## 1. Create a User

To create a new user, send a POST request with the user's details.

### Unix (`bash`)

```bash
curl -X POST "http://localhost:3000/users" \
     -H "Content-Type: application/json" \
     -d '{
           "firstName": "new_user_firstname",
           "lastName": "new_user_lastname",
           "password": "password",
           "email": "newuser@example.com"
         }'
```

### Windows (`cmd`)

```cmd
curl -X POST "http://localhost:3000/users" ^
     -H "Content-Type: application/json" ^
     -d "{\"firstName\": \"new_user_firstname\", \"lastName\": \"new_user_lastname\", \"password\": \"password\", \"email\": \"newuser@example.com\"}"
```

## 2. Login

Log in as an existing user, send a POST request with your email and password.
You should receive an access token(lasts 5 minutes) and a refresh token (lasts 30 minutes):

### Unix (`bash`)

```bash
curl -X POST "http://localhost:3000/users/login" \
 -H "Content-Type: application/json" \
 -d '{
"email": "user@example.com",
"password": "password"
}'
```

### Windows (`cmd`)

```cmd
curl -X POST "http://localhost:3000/users/login" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\": \"user@example.com\", \"password\": \"password\"}"
```

## 3. Refresh Access Token

After the access token expires a new one can be received via the refresh token.

### Unix (`bash`)

```bash
curl -X POST "http://localhost:3000/users/refresh" \
 -H "Content-Type: application/json" \
 -d '{
"refreshToken": "your_refresh_token"
}'
```

### Windows (`cmd`)

```cmd
curl -X POST "http://localhost:3000/users/refresh" ^
     -H "Content-Type: application/json" ^
     -d "{\"refreshToken\": \"your_refresh_token\"}"
```

## 4. Get user data

### Unix (`bash`)

```bash
Use an access token to retrieve user data by id.
curl -X GET "http://localhost:3000/users/{id}" \
 -H "Authorization: Bearer YOUR_TOKEN"
```

### Windows (`cmd`)

```cmd
curl -X GET "http://localhost:3000/users/{id}" ^
     -H "Authorization: Bearer YOUR_TOKEN"
```

## 5. Upload a file

Use an access token in the POST request to upload a file.
Specify the path to the file.

### Unix (`bash`)

```bash
curl -X POST "http://localhost:3000/files" \
 -H "Authorization: Bearer YOUR_TOKEN" \
 -H "Content-Type: multipart/form-data" \
 -F "file=@/path/to/your/file"
```

### Windows (`cmd`)

```cmd
curl -X POST "http://localhost:3000/files" ^
     -H "Authorization: Bearer YOUR_TOKEN" ^
     -H "Content-Type: multipart/form-data" ^
     -F "file=@C:\path\to\your\file"
```

## 6. Get a file by name

Get a file using its name and an access token in the POST request.

### Unix (`bash`)

```bash
curl -X GET "http://localhost:3000/files/{id}" \
 -H "Authorization: Bearer YOUR_TOKEN"
```

### Windows (`cmd`)

```cmd
curl -X GET "http://localhost:3000/files/{id}" ^
     -H "Authorization: Bearer YOUR_TOKEN"
```

### Note

Add -o `FILE_NAME` or simply -O as curl flag to save the file to the given name.
--output-file for Windows CMD

## 7. Update a file using its name

Update the file using its name and an access token in the PUT request.

### Unix (`bash`)

```bash
curl -X PUT "http://localhost:3000/files/{id}" \
 -H "Authorization: Bearer YOUR_TOKEN" \
 -H "Content-Type: multipart/form-data" \
 -F "file=@/path/to/your/file"
```

### Windows (`cmd`)

```cmd
curl -X PUT "http://localhost:3000/files/{id}" ^
     -H "Authorization: Bearer YOUR_TOKEN" ^
     -H "Content-Type: multipart/form-data" ^
     -F "file=@C:\path\to\your\file"
```

## 8. Delete a file

To delete a file, use its name and your access token in a DELETE request.

### Unix (`bash`)

```bash
curl -X DELETE "http://localhost:3000/files/{id}" \
 -H "Authorization: Bearer YOUR_TOKEN"
```

### Windows (`cmd`)

```cmd
curl -X DELETE "http://localhost:3000/files/{id}" ^
     -H "Authorization: Bearer YOUR_TOKEN"
```

---

## NOTES

- Replace `{id}` with the user id or the file name in the case of the file api.
- Replace `YOUR_TOKEN` with a valid refresh or access token depending on the case.
- Replace `@/path/to/your/file` with a valid path to a file on your machine.

---

# Nestjs default

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
