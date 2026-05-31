<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NestJS Core REST API Starter

A clean and scalable **NestJS REST API starter template** designed for building production-ready backend services.

This project provides a solid foundation including containerization, database integration, and automated testing.

---

## Features

- NestJS framework (modular architecture)
- RESTful API structure
- PostgreSQL database
- Docker & Docker Compose support
- Unit & e2e & integration testing
- Environment-based configuration
- Scalable project structure

---

## Tech Stack

- **Node.js**
- **NestJS**
- **PostgreSQL**
- **Docker / Docker Compose**
- **Jest** (testing)

---

## Installation

```bash
pnpm  install
```

## Environment Variables
Create a .env.dev file in the project root based on .env.sample

## Hasky

  For better comment message in git use hasky library with cz-customizable

```bash
# prepare

$  pnpm  run  prepare

# use

$ git commit
```

## Running the app

```bash

# development mode

$  pnpm  run  start:dev

# production mode

$  pnpm  run  start:build
$  pnpm  run  start:prod

# watch mode

$  pnpm  run  start:dev
```

## Running the app with Docker

```bash

# development mode

$  docker compose -f "docker/develop/docker-compose-develop.yml" up --build

# production mode

$  docker compose -f "docker/production/docker-compose-production.yml" up --build
```

## Test

```bash

# migrate database

$  pnpm  run  test:migrate

# prepare api client

$  pnpm  run  api

# e2e tests

$  pnpm  run  test:e2e
 
# test coverage

$  pnpm  run  test:cov
```

## Database
The project includes the following containers:

- app → NestJS application
- postgres → PostgreSQL database

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
