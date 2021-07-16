const config = require('../config');
const axios = require('axios');
const { Permissions } = require('discord.js');

const getOauthUrl = () => {

  return `
  https://discord.com/api/oauth2/authorize?client_id=${config.bot_clientId}&redirect_uri=${config.domain}/callback&response_type=code&scope=identify&prompt=none
  `;

};

const getAccessToken = async (code) => {

  try {
    return (await axios({
      method: 'POST',
      url: 'https://discord.com/api/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        client_id: config.bot_clientId,
        client_secret: config.bot_clientSecret ,
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.domain + '/callback'
      }
    })).data;

  } catch (e) {
    throw new Error('Invalid code provided : ' + e.message);
  };

};



const getUserInfo = async (data) => {

  return (await axios({
    method: 'get',
    url: 'https://discord.com/api/users/@me',
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`
    }
  })).data;

};


const getUserGuilds = async (data) => {

  const guildsData = (await axios({
    method: 'get',
    url: 'https://discord.com/api/users/@me/guilds',
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`
    }
  })).data;

  const guilds = guildsData.filter((guild) => {

    const perm = new Permissions(guild.permissions);
    if (perm.has('MANAGE_GUILD')) return true;
    return false;
  });

  return guilds;

};


const getUserByCode = async(code) => {
  const data = await getAccessToken(code);
  return getUserInfo(data);
};

module.exports = { getOauthUrl, getUserInfo, getAccessToken, getUserGuilds, getUserByCode };