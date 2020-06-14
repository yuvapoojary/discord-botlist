const fetch= require('node-fetch');
const util = require('util');


exports.run = async function(client, message, args) {
  const db = client.db;
    if (client.config.roles.owner.includes(message.author.id)) {
      
      
    if (!args.join(' ')) return message.channel.send("\:x: Invalid Arguments.")
      
      
    try {
        let result = await eval(args.join(' '));
        if (typeof result !== 'string') result = util.inspect(result);
        result = result;
  
      for (let i = 0; i < result.length; i += 1000) {
        let toi = ""
     toi =
    result.substring(i, Math.min(result.length, i + 1000));
    
   message.channel.send({embed: {
                color: 3447003,
                fields: [{
                    name: "\:inbox_tray: INPUT",
                    value: "```js\n" + args.join(' ') + "\n```"
                },
                {
                    name: "\:outbox_tray: OUTPUT",
                    value: "```js\n" + toi + "\n```"
                }
                ]
            }
            })
      }
        
    } catch (e) {
        message.channel.send({embed: {
            color: 3447003,
            fields: [{
                name: "\:inbox_tray: INPUT",
                value: "```js\n" + args.join(' ') + "\n```"
            },
            {
                name: "\:outbox_tray: OUTPUT",
                value: "```js\n" + e + "\n```"
            }
            ]
        }
                              
        
        })
    
    }


}
};
