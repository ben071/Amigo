const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  var JokeList=[
    "What do you call an elephant that doesn't matter? An irrelephant",
    "What is the tallest building in the world? The library – it’s got the most stories!",
    "Past, present, and future walked into a bar.... It was tense.",
    "A man walked in to a bar with some asphalt on his arm. He said “Two beers please, one for me and one for the road.",
    "What did the fish say when it swam into a wall? Damn!" ,
    "They laughed when I said I wanted to be a comedian – they’re not laughing now.",
    "Where did you learn to make ice cream? Sunday school.","What's blue and not very heavy? Light blue.",
    "Did you hear about the guy whose whole left side was cut off? He's all right now.",
    "How do the trees get on the internet? They log on.","Why don’t skeletons ever go trick or treating? Because they have nobody to go with.",
    "Why did the coffee file a police report? It got mugged.","What biscuit does a short person like? Shortbread.",
    "Milk is also the fastest liquid on earth – its pasteurized before you even see it",
    "I wish I could clean mirrors for a living. It's just something I can see myself doing.",
    "Why can't your nose be 12 inches long? Because then it'd be a foot!","I went to the zoo the other day, there was only one dog in it. It was a shitzu.",
    "Why is no one friends with Dracula? Because he's a pain in the neck.","I dreamed about drowning in an ocean made out of orange soda last night. It took me a while to work out it was just a Fanta sea.",
    "I’m on a whiskey diet. I’ve lost three days already.",
    "When you have a bladder infection, urine trouble.",
    "I used to work for a soft drink can crusher. It was soda pressing.",
    "Atheism is a non-prophet organisation.",
    "Did you know crocodiles could grow up to 15 feet? But most just have 4.",
    "Where do bees go to the bathroom? The BP station.","This morning I was wondering where the sun was, but then it dawned on me.",
    "Doctor you've got you help me, I'm addicted to twitter. Doctor: I don't follow you.","What did the grape do when he got stepped on? He let out a little wine.",
    "A man tried to sell me a coffin today. I told him that's the last thing I need.","I was so proud when I finished the puzzle in six months, when on the side it said three to four years.",
    "They're making a movie about clocks. It's about time","Why can’t you hear a pterodactyl go to the bathroom? The p is silent.",
    "I used to hate facial hair, but then it grew on me.",
    "Don't trust atoms. They make up everything.",
    "If the Silver Surfer and Iron Man team up, they’d be alloys.",
    "What do you do with a sick chemist?\nIf you can't helium, and you can't curium, then you might as well barium.",
    "What do you do with a dead chemist?\nBarium"
  ];

  const JokeNumber=Math.floor((Math.random() * (JokeList.length)));
  const sicon = message.guild.iconURL;
  const jokeEmbed = new Discord.RichEmbed()
    .setTitle(JokeList[JokeNumber])
    .setColor("#f4a742")
    .setThumbnail(sicon);
  message.channel.send(jokeEmbed);
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "joke",
  category: "Fun",
  description: "Tells a random joke\n**Warning: terrible jokes**",
  usage: "joke"
};
