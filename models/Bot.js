const mongoose = require('mongoose');
const randomstring = require('randomstring');

const Bot = new mongoose.Schema({
  
  id: {
    type: String,
    unique: true
  },
  
  name: String,
  
  discriminator: String,
  
  avatar: String,
  
  prefix: String,
  
  invite: String,
  
  short_desc: String,
  
  long_desc: String,
  
  support_server: String,
  
  library: String,
  
  tags: {
    type: Array,
    default: []
  },
  
  github: String,
  
  website: String,
  
  owner: String,
  
  owners: {
    type: Array,
    default: [] 
  },
  
  approved: {
    type: Boolean,
    default: false
  },
  
  certified: {
    type: Boolean,
    default: false
  },
  
  blacklist: {
    type: Boolean,
    default: false
  },
  
  shards: {
    type: Boolean,
    default: 0
  },
  
  server_count: {
    type: Number,
    default: 0
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  votes: {
    type: Number,
    default: 0
  },
  
  token: {
    type: String,
    default: () => randomstring.generate(30),
    select: false,
  }
  
});

mongoose.model('Bot', Bot);