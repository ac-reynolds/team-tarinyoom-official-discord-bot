const { Client, GatewayIntentBits } = require('discord.js');
const secretManager = require('../secretManager');
const registerCommands = require('./registerCommands');
const sleuther = require('./sleuther');
let client;

async function handleSearch(interaction) {
	const target = interaction.options.getString('target');
	await interaction.reply(`Searching for target: "${target}"...`);
}

async function handleSleuth(interaction) {
	sleuthingInitiated = await sleuther.initiateSleuthing(client, interaction.guildId, () => {
		console.log("done sleuthing");
	});

	if (sleuthingInitiated) {
		await interaction.reply(`Sleuthing...`);
	} else {
		await interaction.reply(`I'm already sleuthing here, buddy!`);
	}
}

function buildOnReady(secrets) {
	return () => {
		registerCommands.register(secrets);
		console.log("Bot ready!");
	};
};

function buildOnInteractionCreate() {
	return async interaction => {
		if (!interaction.isChatInputCommand()) return;

		const { commandName } = interaction;

		switch (commandName) {
			case 'tsleuth':
				try {
					await handleSleuth(interaction);
				} catch (error) {
					console.error(`Error when responding to sleuth command: ${error}`);
				}
				break;
			case 'tsearch':
				try {
					await handleSearch(interaction);
				} catch (error) {
					console.error(`Error when responding to search command: ${error}`);
				}
				break;
		}
	};
};

function runDiscordBot(){
	// Create a new client instance
	client = new Client({ intents: [GatewayIntentBits.Guilds] });
	const secrets = secretManager.getDiscordSecrets();

	client.once('ready', buildOnReady(secrets));
	client.on('interactionCreate', buildOnInteractionCreate());

	client.login(secrets.botToken);
};

module.exports = { runDiscordBot };
