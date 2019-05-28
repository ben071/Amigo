const Discord = require("discord.js")
const superagent = require("superagent");
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const maximumQuestions = 20; // This is the maximum amount of questions that can be asked before the quiz ends

function replaceCodes(string) {
    return entities.decode(string)
};

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send("I can't run this command if I can't create embeds").catch(err => {});
  try {
    let repeat = true;
    let score = 0
    let total = 0
    while (repeat && total < maximumQuestions) {
      try {
        let userGuesses = {}
        const difficulties = ["easy","medium","hard"]
        let url = "https://opentdb.com/api.php?amount=1&type=multiple"  
        if (args[0]) {
          if (difficulties.indexOf(args[0].toLowerCase()) != -1) { // Allow them to select a difficulty
            url = `https://opentdb.com/api.php?amount=1&difficulty=${args[0].toLowerCase()}&type=multiple`
          } 
        }
          const questionJSON = await superagent 
            .get(url) // get the answer json
          let possibleAnswers = []
          for (let i = 0; i < 3; i++) { // add three incorrect answers to array
                possibleAnswers.push(replaceCodes(JSON.stringify(JSON.parse(questionJSON.text).results[0].incorrect_answers[i])))
          } 
          const correctAnserFiltered = replaceCodes(JSON.stringify(JSON.parse(questionJSON.text).results[0].correct_answer).trim().substring(1 , JSON.stringify(JSON.parse(questionJSON.text).results[0].correct_answer).toLowerCase().trim().length-1))
          possibleAnswers.push(replaceCodes(JSON.stringify(JSON.parse(questionJSON.text).results[0].correct_answer))) // add correct answer to array
          const embed = new Discord.RichEmbed()
          const answer1 = possibleAnswers.splice(Math.round(Math.random() * 3),1)[0] // Select a random answer
          const answer2 = possibleAnswers.splice(Math.round(Math.random() * 2),1)[0] // Select a random answer
          const answer3 = possibleAnswers.splice(Math.round(Math.random()),1)[0]  // Select a random answer
          const answer4 = possibleAnswers[0]  // Select a random answer
          let correctNumber;
          if (replaceCodes(answer1.substring(1 , answer1.length - 1)) == correctAnserFiltered) correctNumber = 1; // find which answer nymber represents the correct answer
          if (replaceCodes(answer2.substring(1 , answer2.length - 1)) == correctAnserFiltered) correctNumber = 2;
          if (replaceCodes(answer3.substring(1 , answer3.length - 1)) == correctAnserFiltered) correctNumber = 3;
          if (replaceCodes(answer4.substring(1 , answer4.length - 1)) == correctAnserFiltered) correctNumber = 4;
          embed.setFooter("Trivia, Category: " + replaceCodes(JSON.stringify(JSON.parse(questionJSON.text).results[0].category)))
          embed.setTitle("Question: " + replaceCodes(JSON.stringify(JSON.parse(questionJSON.text).results[0].question)))
          embed.addField("Difficulty:",replaceCodes(JSON.stringify(JSON.parse(questionJSON.text).results[0].difficulty)));
          embed.addField("1) " , replaceCodes(answer1.substring(1 , answer1.length - 1)));
          embed.addField("2) " , replaceCodes(answer2.substring(1 , answer2.length - 1)));
          embed.addField("3) " , replaceCodes(answer3.substring(1 , answer3.length - 1)));
          embed.addField("4) " , replaceCodes(answer4.substring(1 , answer4.length - 1)));
          embed.addField("You have 30 seconds to answer this question", "If this time expires without any answer or you say cancel, the quiz will end and you will get your score",false)
          embed.setColor("RANDOM")
          const userReponse = await client.awaitReply(message, embed, 30000)
          if (!userReponse || userReponse.toLowerCase().trim() == "cancel") {
            repeat = false
            break;
          } else {
            total++
          }
          if (correctAnserFiltered.toLowerCase() == userReponse.toLowerCase().trim() || userReponse.toLowerCase().trim() == correctNumber || userReponse.toLowerCase().trim() == correctNumber+")" || userReponse.toLowerCase().trim() == correctNumber+" )"){
              score++
              message.channel.send(`<@${message.author.id}> guessed the correct answer of ${correctAnserFiltered}`)
          } else {
            message.channel.send("The correct answer was: `"+correctAnserFiltered+"`")
          }
        } catch (err) {
        client.logger.error(err);
      }
    }
    if (total == 0) return message.channel.send("You didn't answer any questions so I can't give you your score")
    const scoreEmbed =  new Discord.RichEmbed()
    .setTitle("Your scores")
    .addField("Total questions answered",total)
    .addField("Total questions you answered correctly",score)
    if (total == maximumQuestions) {
      scoreEmbed.addField("The quiz ended because you reached the maximum question limit",`${maximumQuestions} questions`)
    }
    scoreEmbed.addField("Percentage correct", Math.round(100*(score/total))+`%`)
    scoreEmbed.setColor("RANDOM")
    scoreEmbed.setFooter(message.author.username)
    scoreEmbed.setThumbnail(message.author.avatarURL)
    message.channel.send(scoreEmbed)
  } catch (err) {
    client.logger.error(err)
  }
  };
  exports.conf = {
    permission: "SEND_MESSAGES"
  };
  
  exports.help = {
    name: "trivia",
    category: "Fun",
    description: "Starts a quiz, which only you participate in - current channel only. If a difficulty is not supplied or it is not a valid difficulty, a random difficulty will be chosen",
    usage: "trivia [difficulty => easy/ medium / hard]",
    aliases: []
  };
  