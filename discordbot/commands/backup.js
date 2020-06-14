
module.exports.run = async(client,message,args) => {
if(client. config.roles. owner. includes (message.author.id)) {
  let id = args[0];
  if(!id) { return message.channel.send("> Provide a id");}
  const doc1 = await client.db.collection("bots").doc(id).get().then(q => q);
  const doc2 = await client.db.collection("backup").doc(id).get().then(q => q);
  if(!doc1.data()) { return message.channel.send("Sorry ,there is no related to that id.");};
  if(doc1.data()) {
    client.db.collection("backup").doc(doc1.data().id).set(doc1.data()).then(() => {
      message.channel.send(`> Successfully backuped data of \` ${doc1.data().name}\` `)
    });
  }

}
}
