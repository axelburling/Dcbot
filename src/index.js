require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const { MessageAttachment } = require("discord.js");
const client = new Discord.Client();
const { HQuotes, darkHumor } = require("./HQuotes");
const app = require("express")();

const port = process.env.PORT;

app.listen(port);
const getQuote = async () => {
  const res = await fetch("https://zenquotes.io/api/random");
  const data = await res.json();
  console.log(data[0]["q"]);
  //   return data[0]["q"] + " - " + data[0]["a"];
  return data[0]["q"] + " - " + data[0]["a"];
};

const stonks = async (symbol) => {
  const res = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey==YUSVXWALWOHX4663`
  );
  const data = await res.json();
  console.log(data);
  const key = Object.keys(data)[1];
  const val = data[key];

  const timeKey = Object.keys(val)[0];
  const idk = val[timeKey];
  const open = idk["1. open"];
  const close = idk["5. adjusted close"];
  return `${symbol}, opened at: ${open} and closed at: ${close}`;
};

const memes = async () => {
  const res = await fetch("https://meme-api.herokuapp.com/gimme/dankmemes/1");
  const data = await res.json();
  return data.memes[0].url;
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  } else if (
    msg.content.startsWith("!help") ||
    msg.content.startsWith("!commands")
  ) {
    msg.channel.send({
      embed: {
        color: Math.floor(Math.random() * 16777215),
        title: "List of commands",
        fields: [
          {
            name: "Command",
            value:
              "!Q\n!stonks symbol\n!hitler\n!dark\n!random number/coin\n!meme",
            inline: true,
          },
          {
            name: "description",
            value:
              "Get a random quote\nGet a stocks opening and closing value\nGet a random Hitler quote\nGet a random dark joke\nGet a random number, coin is for coin toss\nRandom meme from r/dankmemes",
            inline: true,
          },
        ],
      },
    });
  } else if (msg.content.startsWith("!Q")) {
    getQuote()
      .then((quote) => {
        msg.channel.send(quote);
      })
      .catch((err) =>
        msg.reply("Server is not working at the moment, Please try in a minute")
      );
  } else if (msg.content.startsWith("!stonks")) {
    const symbol = msg.content.split("!stonks ")[1];
    if (symbol == undefined || symbol.length === 0) {
      stonks("AAPL")
        .then((stonk) => {
          msg.channel.send(stonk);
        })
        .catch((err) =>
          msg.reply(
            "Server is not working at the moment, Please try in a minute"
          )
        );
    } else if (symbol == "help") {
      msg.channel.send(
        "Here is a list of stock symbols - https://gretlcycu.files.wordpress.com/2013/08/quick-ticker-symbol-list.pdf"
      );
    } else {
      stonks(symbol.toString())
        .then((stonk) => {
          msg.channel.send(stonk);
        })
        .catch((err) =>
          msg.reply(
            "Server is not working at the moment, Please try in a minute"
          )
        );
    }
  } else if (msg.content.startsWith("!hitler")) {
    const length = HQuotes.length;

    const random = HQuotes[Math.ceil(Math.random() * length - 1)];

    msg.channel.send(`${random} - Adolf Hitler`);
  } else if (msg.content.startsWith("!dark")) {
    const length = darkHumor.length;

    const random = darkHumor[Math.ceil(Math.random() * length)];

    msg.channel.send(random);
  } else if (msg.content.startsWith("!random")) {
    const length = msg.content.split("!random ")[1];
    if (length == undefined) {
      msg.reply(Math.floor(Math.random() * 100));
    } else if (length == "coin") {
      const coin = Math.random() * 1;
      if (coin > 0.5) {
        msg.reply("Heads");
      } else {
        msg.reply("Tails");
      }
    } else {
      msg.reply(Math.floor(Math.random() * parseInt(length)));
    }
  } else if (msg.content.startsWith("!meme")) {
    memes().then((meme) => {
      const img = new MessageAttachment(meme);
      msg.reply("Random meme from reddit", img);
    });
  } else {
    return;
  }
});

if (process.env.NODE_ENV == "production") {
  client.login(process.env.TOKEN);
} else {
  client.login(process.env.TOKEN_DEV);
}
