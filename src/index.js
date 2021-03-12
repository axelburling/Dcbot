require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
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

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }

  if (msg.content.startsWith("!help") || msg.content.startsWith("!commands")) {
    msg.channel.send({
      embed: {
        color: Math.floor(Math.random() * 16777215),
        title: "List of commands",
        fields: [
          {
            name: "Command",
            value: "!Q\n!stonks symbol\n!hitler\n!dark",
            inline: true,
          },
          {
            name: "description",
            value:
              "Get a random quote\nGet a stocks opening and closing value\nGet a random Hitler quote\nGet a random dark joke",
            inline: true,
          },
        ],
      },
    });
  }

  if (msg.content.startsWith("!Q")) {
    getQuote()
      .then((quote) => {
        msg.channel.send(quote);
      })
      .catch((err) =>
        msg.reply("Server is not working at the moment, Please try in a minute")
      );
  } else {
    return;
  }

  if (msg.content.startsWith("!stonks")) {
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
  } else {
    return;
  }

  if (msg.content.startsWith("!hitler")) {
    const length = HQuotes.length;

    const random = HQuotes[Math.ceil(Math.random() * length - 1)];

    msg.channel.send(`${random} - Adolf Hitler`);
  } else {
    return;
  }

  if (msg.content.startsWith("!dark")) {
    const length = darkHumor.length;

    const random = darkHumor[Math.ceil(Math.random() * length)];

    msg.channel.send(random);
  } else {
    return;
  }
});

client.login(process.env.TOKEN);
