
module.exports.run = async(client,message,args) => {
if(client. config.  roles. owner. includes (message.author.id)) {
  let id = args[0];
  if(!id) { return message.channel.send("> Provide a id");}
  const doc1 = await client.db.collection("backup").doc(id).get().then(q => q);
  const doc2 = await client.db.collection("bots").doc(id).get().then(q => q);
  if(doc2 && doc2.data()){ return message.channel.send("> This bot is exists in main database,no need to readd it");}
  if(!doc1.data()) { return message.channel.send("Sorry ,there is no backup");};
  if(doc1 && doc1.data()) {
    client.db.collection("bots").doc(doc1.data().id).set(doc1.data()).then(() => {
      message.channel.send(`> Successfully restored data of \` ${doc1.data().name}\` `)
    });
  }

}
}
