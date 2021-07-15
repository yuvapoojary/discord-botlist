require('dotenv').config();

const config = {
  
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
  const keys = Object.keys(data);
  for(const key in keys) {
    if(process.env[key]) data[key] = process.env[key];
  };
  return data;
};

module.exports = mergeConfig(config);