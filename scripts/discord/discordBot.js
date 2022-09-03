const { Client, GatewayIntentBits } = require('discord.js');
const secretManager = require('../secretManager');
const registerCommands = require('./registerCommands');
const sleuther = require('./sleuther');
const searcher = require('./searcher');
let client;

async function handleSearch(interaction) {

	const target = interaction.options.getString('target');
	const results = await searcher.search(target, interaction.guildId, 1);

	const channels = client.guilds.cache.get(interaction.guildId).channels.cache;

	const messages = results.map(
		async result => await channels.get(result.channelId).messages.fetch(result.messageId));

	const fetched = await Promise.all(messages);
	for (m of fetched) {
		console.log(await m);
	}
	await interaction.reply(`Found answers for ${target}: "${fetched}"...`);
}

async function handleSleuth(interaction) {
	sleuthingInitiated = await sleuther.initiateSleuthing(client, interaction.guildId, () => {
		console.log("done sleuthing");
	});

	if (sleuthingInitiated) {
		await interaction.reply(`Sleuthing initiated...`);
	} else {
		await interaction.reply(`I'm already sleuthing here, buddy!`); // TODO: could provide some progress metrics perhaps
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
