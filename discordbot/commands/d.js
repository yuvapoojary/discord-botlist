const q = require ("querystring");
const fetch = require("node-fetch");
exports.run = async(client, message,args) => {
  try {
  let src = "stable";
  let arg = args.join(" ");
  
  let query = q.stringify({src:src,q:arg});
  
  const dio = await fetch(`https://djsdocs.sorta.moe/v2/embed?${query}`);
  const embed = await dio. json ();
   
    if(embed) {
    message.channel.send({embed});
    } else {
      message. channel. send ("> Couldn't find docs related to it");
    };
  
  } catch(r) {
    console.log(r)
    message.channel.send(r.message);
  };
  
};
