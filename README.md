## Routes
Signup : https://web-backend-3bsv.onrender.com/create/user

Login: https://web-backend-3bsv.onrender.com/login/user

getUsers: https://web-backend-3bsv.onrender.com/get/user

google signin : https://web-backend-3bsv.onrender.com/auth/google

github signin : https://web-backend-3bsv.onrender.com/auth/github

## copying the .env.example file to .env file

cp .env.example .env
#open .env and modify the variables according to your needs


## Table of Contents

- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Logging](#logging)


## Project Structure

```
src\
 |--api\              # Contains the API folders
     |--controllers\  # Route controllers (controllers layer)
     |--docs\         # Contains the documentation
     |--helpers\      # Helper classes and functions
     |--middlewares\  # Custom express middlewares
     |--models\       # Mongoose models (data layer)
     |--routes\       # Routes
     |--services\     # Business logic (service layer)
     |--validations\  # Request data validation schemas
 |--config\           # Envoriment variables and configuration related things
 |--app.js            # Express app
 |--index.js          # App entry point


 
## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require("<path to src>/config/logger");

logger.error("message"); // level 0
logger.warn("message"); // level 1
logger.info("message"); // level 2
logger.http("message"); // level 3
logger.verbose("message"); // level 4
logger.debug("message"); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).
