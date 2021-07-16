
exports.run = (client, message) => {
    const description = `Latency: ${Math.ceil(client.ws.ping)}ms`;
    message.channel.send(description);
};