const allowedEvents = ["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"];
const conversion = {
    "MESSAGE_REACTION_ADD": "messageReactionAdd",
    "MESSAGE_REACTION_REMOVE": "messageReactionRemove"
};

module.exports = async(client, packet) => {
    const name = packet.t;
    if (allowedEvents.indexOf(name) === -1) return;

    const user = client.users.get(packet.user_id);
    const channel = client.channels.get(packet.t.channel_id);
    
    if (!channel) return;
    if (!channel.guild) return;

    if (channel.messages.has(packet.message_id)) return; //Don't fire twice

    const msg = await channel.fetchMessage(packet.message_id);

    const emojiKey = (packet.emoji.id) ? `${packet.emoji.name}:${packet.emoji.id}` : packet.emoji.name;

    const reaction = msg.reactions.get(emojiKey);

    client.emit(conversion[name], reaction, user);
};