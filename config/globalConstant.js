'use strict';
const environment = process.env.NODE_ENV;
let mongoMainHost,
  mongoMainDB,
  mongoMainUser,
  mongoMainPass,
  gmail,
  gmailPass,
  gmailPort,
  gmailHost,
  redisHOST,
  redisPORT,
  redisUserName,
  redisPassword,
  redisDBNumber,
  ytApiKey1;

if (environment === 'production') {
  gmail = process.env.GMAIL_PROD;
  gmailPass = process.env.GMAIL_PASSWORD_PROD;
} else if (environment === 'development') {
  mongoMainHost = process.env.DEV_MONGO_MAIN_HOST;
  mongoMainDB = process.env.DEV_MONGO_MAIN_DB;
  mongoMainUser = process.env.DEV_MONGO_USERNAME;
  mongoMainPass = process.env.DEV_MONGO_PASSWORD;
  redisHOST = process.env.redisHOST;
  redisPORT = process.env.redisPORT;
  redisUserName = process.env.redisUserName;
  redisPassword = process.env.redisPassword;
  redisDBNumber = process.env.redisDBNumber;
}

global.ENVIRONMENT = environment;

// db variables
global.mongoMainHost = mongoMainHost;
global.mongoMainDB = mongoMainDB;
global.mongoMainUser = mongoMainUser;
global.mongoMainPass = mongoMainPass;

// JWT settings
global.JWT_SECRET = process.env.JWT_SECRET;
global.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
global.JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN;

// Mail variables
global.gmail = gmail;
global.gmailPass = gmailPass;
global.gmailPort = gmailPort;
global.gmailHost = gmailHost;

// Youtube API Keys
// global.YT_API_KEY1 = ytApiKey1;

// redis
global.redisHOST = redisHOST;
global.redisPORT = redisPORT;
global.redisPassword = redisPassword;
global.redisUserName = redisUserName;
global.redisDBNumber = redisDBNumber;

// ytAPIKey

// let apiKeysArr = apiKeys.ApiKeys;
// global.API_KEYS_ARR = apiKeysArr;

// global.YT_API_KEY = apiKeysArr.pop();

/** API endpoints  */
global.ELASTIC_API = process.env.elasticAPI;
global.TESSERACT_URL = process.env.TESSERACT_URL;
