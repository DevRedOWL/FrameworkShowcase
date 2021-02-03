# RedFramework 2.0

## Usage
### Tips
* Do not forget to create `.env` file based on `example.env` with all needed configuration  
* Migrations can be performed by calling string, given in .env as `NODE_SEQUELIZE_MIGRATION_STRING` or as Model syncronization `User.sync({ alter: true })`
* Be careful with `NODE_SEQUELIZE_ALLOW_ALTER_SYNC` and do not use `NODE_SEQUELIZE_ALLOW_FORCE_SYNC` in production, otherwise it can damage your database!
* When `NODE_ENVIRONMENT` set to `DEV` - SSL is unavailable 
* Init scripts that should be called only can be created by using `options.state.isMasterThread` property
### How-to
* Creating instance in DB
```es6
    // If we need to do something with model
    const User = require('./Models/User');
    let someUser = User.build({ "firstName": 'foo', "email": "bar@example.com" });
    await user.save();
    // If just needed to create and directly add to DB
    const User = require('./Models/User');
    let someUser = await User.create({ "firstName": 'foo', "email": "bar@example.com" });
```
### Installation
> In progress
### Development
> In progress

## Features
- [x] Middleware functions  
- [x] Easy SSL management be replacing them in folder  
- [x] Encapsulated .env and another settings through options.js  
- [x] Auto loading routes   
- [x] Static routing from /assets and / for build
- [x] Request amount limiter for api and another endpoints
- [x] Models, compatible with Sequelize ORM  
- [x] Authentication system with passport.js 
- [x] Graceful shutdown support
- [x] Automatic safe migrations on launch
- [x] Ability to chain init scripts
- [x] Subdomains management
- [ ] Logging subsystem  
- [ ] Crash logging and error reports
- [ ] Localization subsystem
- [ ] Utility that speed ups development  

## Middlewares
- [x] Express and redis session middlewares for passport
- [x] Request data validation middleware
- [x] Request amount limiter middlewares
- [x] Is authenticated check middleware
- [x] Passport setup middleware 
- [x] Graceful shutdown middleware
- [x] Subdomain middleware
- [ ] Localization middleware

## Utility features
- [ ] Show routes  
- [ ] Create a route  
- [ ] Create a controller  
- [ ] Create a middlewre function  

## Ideas
- [ ] Add init script, divided frop options.js
- [ ] Better routes requiring by one loader
- [ ] Use rate-limit-redis

## Structure
```md
├───.vscode  
│   └─── launch.json - `Visual Studio Code startup config`  
├───Assets  
│   └─── ...`Some static files`  
├───Controllers  
│   └─── ...`Controllers with useful methods`  
├───Locales  
│   └─── ...`Language packs for localization system`  
├───Middlewares  
│   ├───Session  
│   │   └─── ...`Session middlewares, that should be used for passport.js session system`
│   └─── ...`Middleware functions, that can be utilized with app.use()`  
├───Models  
│   └─── ...`Data models`  
├───Modules  
│   └─── ...`Utilities for proper work of framework`  
├───node_modules  
│   └─── ...`Seriously?`  
├───Routes  
│   ├───api  
│   │   ├─── index.routes.js - `Provides all "/api/" routes and error pages to express`  
│   │   └─── ...`Routes of host/api/* endpoints`  
│   ├───auth  
│   │   ├─── index.routes.js - `Provides all "/auth/" routes and error pages to express`  
│   │   └─── ...`Routes of host/auth/* endpoints`  
│   └───client  
│       ├─── index.routes.js - `Provides all "/" routes and error pages to express`  
│       └─── ...`Routes of host/* endpoints`  
├───Run  
│   └─── ...`Startup files for different OS-s`  
├───SSL  
│   ├─── example.crt - `Example of certificate + certificate-chain (CA)`
│   ├─── example.key - `Example of RSA private key`
│   └─── ...`Files that needed for SSL work`  
├───Views  
│   └─── ...`Views than can be rendered or just sent`  
├─── .gitignore - `To keep git clean`  
├─── enums.js - `File with enums`  
├─── example.env - `Example environment file`  
├─── index.js - `Main app file`  
├─── jsconfig.js - `VSCode Intellisense Config`  
├─── options.js - `Env encapsulation, DB config, etc...`  
├─── package.json - `Npm config`  
└─── README.md - `This file with no useful information`  
```

## Requirements
### Dependencies
Library | Version | Description
------- | ------- | -----------
express | ^4.15.2 | Web-Framework
### Software
App | Optional | Description
--- | -------- | -----------
redis | Recommended | Persistent session storage
nginx | Optional | Reverse-proxy

## Useful links
[Sequelize model basics](https://sequelize.org/master/manual/model-basics.html)  
[Express performance guidlines](http://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)  