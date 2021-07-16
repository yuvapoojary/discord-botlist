require('dotenv').config();

const config = {
  
  domain: 'https://bot-list-default.herokuapp.com',
  
  port: 5001,

  secret: 'some string',

  mongoURL: '',

  bot_token: '',

  bot_prefix: '.',

  bot_clientId: '',

  bot_clientSecret: '',

  bot_callbackURL: '',

  bot_presence: {
    name: 'discord bots',
    type: 3
  },

  guildId: '',

  perms: {
    owners: ['572327928646598667'],
    approvers: []
  },

  roles: {

  }

};

const mergeConfig = (data) => {
  const newConfig = {};
  const keys = Object.keys(data);
  for (const key of keys) {
    const value = process.env[key];
    newConfig[key] = value || data[key];
  };
  return newConfig;
};

module.exports = mergeConfig(config);