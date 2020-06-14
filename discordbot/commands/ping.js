
exports.run = (client, message) => {
    const description = `Latency: ${Math.ceil(client.ping)}ms`;
    message.channel.send(description);
};