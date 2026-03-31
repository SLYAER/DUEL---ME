const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('./config.json');
const { cleanupQueue } = require('./systems/matchmaking');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
fs.readdirSync('./commands').forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
});

// MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

// Events
client.on('interactionCreate', require('./events/interactionCreate')(client));

// Queue cleanup
setInterval(() => {
  cleanupQueue();
}, 30000);

client.login(config.token);
