const Discord = require("discord.js");

exports.run = (client, message) => {
  const user = message.mentions.users.first() || message.author; // If no user is mentioned, the bot checks the message author instead.
  if (user.presence.game !== null && user.presence.game.type === 2 && user.presence.game.name === "Spotify") { // Checks if user's presence isn't null and if not, "Listening to Spotify"

    const trackIMG = user.presence.game.assets.largeImageURL; // Gets the image of the Spotify track.
    const trackURL = `https://open.spotify.com/track/${user.presence.game.syncID}`; // Creates a link to listen to the Spotify track.
    const trackName = user.presence.game.details; // Gets the name of the Spotify track.
    const trackAuthor = user.presence.game.state; // Gets the author of the Spotify track.
    const trackAlbum = user.presence.game.assets.largeText; // Gets the album the Spotify track is in.

    const embed = new Discord.RichEmbed() // Creates an embed and inserts all the above info.
      .setAuthor("Spotify Track Info", "https://cdn.discordapp.com/emojis/408668371039682560.png")
      .setColor("#1ED760")
      .setThumbnail(trackIMG)
      .addField("Song Name", trackName)
      .addField("Album", trackAlbum, true)
      .addField("Author", trackAuthor)
      .addField("Listen to Track:", `[\`${trackURL}\`](trackURL)`);

    message.channel.send(embed);

  } else { // Sends message if the user isn't listening to Spotify.
    message.channel.send("**This user isn't listening to Spotify!**");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "spotify",
  category: "Miscelaneous",
  usage: "spotify [user]"
};
