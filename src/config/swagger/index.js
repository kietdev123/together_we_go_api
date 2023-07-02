const basicInfo = require('./basicInfo');
const servers = require('./servers');
const tags = require('./tags');
const todo = require('./todo');

module.exports = {
    ...basicInfo,
    ...servers,
    ...tags,
    ...todo,
    // ...users,
    securityDefinitions: {
      api_key: {
        type: "apiKey",
        name: "api_key",
        in:"header"
      }
    }
};
