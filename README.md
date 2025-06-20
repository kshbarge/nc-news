# NC News Seeding

>The hosted version of this project can be found at https://nc-news-jmk7.onrender.com/api.

- NC news is a project showcasing a full stack of development technologies, by creating a news app with basic CRUD functionality. This repository contains the backend data of the site, handling the creation and manipulation of multiple tables in PSQL, and serving the various requests a user can make to the API.

## Setup information

- This repo can be cloned by making a fork of it and then using the command `git clone (your repo url)` in the location at which you wish to set up a local repository.

- This project uses dotenv, express and pg as dependencies, and husky, jest, pg-format and supertest as dev dependencies. To install these dependencies locally, navigate to the main folder of the repository and run `npm install`.

- In order to setup you local database for the first time, run `npm run setup-dbs`. To seed your local database for development, run `npm run seed`. Don't worry about seeding for testing, as this is done automatically by the testing environment before tests are executed. If you wish to seed the production database, run `npm run seed-prod`.

- Tests can be ran using `npm test (path to test file)`, or `npm test-seed` if you wish to specifically test the seeding files.

## .env configuration

- This repo requires the setup of two .env files locally in order to function.

- .env.development and .env.test files both have to be added to the main repo folder.

- They must contain the PGDATABASE= command set to the name of your local development and test databases, respectively. All necessary requires for these in the rest of the code have already been set up.

- If you wish to access the production environment, a third .env file of .env.production is needed. This will contain the DATABASE_URL= command set to the pooled URL of the hosted production database.

## Requirements

- This project requires, at minimum, version 23.11.0 of Node.js and version 17 of Postgres in order to run correctly.
