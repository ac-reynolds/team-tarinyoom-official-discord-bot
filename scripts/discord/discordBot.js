const { Client, GatewayIntentBits } = require('discord.js');
const secrets = require('./secretManager')
let client;

function onReady() {
	console.log("ready!");
}

function onMessageCreate(msg) {
	console.log(`${msg} created`);
}

function runDiscordBot(){
	// Create a new client instance
	client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.once('ready', onReady);
	client.on('messageCreate', onMessageCreate); // why isn't this getting triggered ?

	client.login(secrets.getDiscordSecrets().botToken);
}

module.exports = { runDiscordBot };
