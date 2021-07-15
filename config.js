const config = {
  
  port: 5001,
  
  secret: 'some string',
  
  mongoURL: '',
  
  bot: {
    token: '',
    prefix: '.',
    clientId: '',
    clientSecret: '',
    callbackURL: '',
    presence: {
      name: 'Bot list made by DEF4ULT',
      type: 3
    }
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