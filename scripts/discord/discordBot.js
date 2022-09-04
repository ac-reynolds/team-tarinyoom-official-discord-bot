const { messageLink, time, Client, GatewayIntentBits, TimestampStyles } = require('discord.js');
const secretManager = require('../secretManager');
const registerCommands = require('./registerCommands');
const sleuther = require('./sleuther');
const searcher = require('./searcher');

const default_n = 3;
let client;

async function handleSearch(interaction) {

	// Retrieve message IDs with search
	const target = interaction.options.getString('target');
	let n = interaction.options.getInteger('n');
	if (n == null) {
		n = default_n;
	}
	
	const results = await searcher.search(target, interaction.guildId, n);

	// Get the actual messages
	const channels = client.guilds.cache.get(interaction.guildId).channels.cache;
	const messages = await Promise.all(results.map(
		async result => await channels.get(result.channelId).messages.fetch(result.messageId)));

	const zipped = messages.map((val, i) => {
		return {
			...val,
			score: results[i].score
		};
	})

	// Format messages for output to screen
	function formatMessage(m) {
		let output = "";
		output += `> ${m.content}\n`
		output += `from \`${m.author.username}#${m.author.discriminator}\` on ${time(Math.round(m.createdTimestamp / 1000), "F")}\n`;
		output += `with similarity score ${m.score}\n`;
		output += `<${messageLink(m.channelId, m.id, m.guildId)}>`
		return output;
	}

	const outputData = zipped
		.map(z => formatMessage(z))
		.join("\n\n");

	await interaction.reply({ content: `Search results for "${target}":\n\n${outputData}`, ephemeral: true });
}

async function handleSleuth(interaction) {
	sleuthingInitiated = await sleuther.initiateSleuthing(client, interaction.guildId, () => {
		console.log("done sleuthing");
	});

	if (sleuthingInitiated) {
		await interaction.reply(`Server-wide sleuthing initiated...`);
	} else {
		await interaction.reply(`I'm already sleuthing here, buddy!`); // TODO: could provide some progress metrics perhaps
	}
}

async function handleSleuthnt(interaction) {
	await interaction.reply({content: `Sleuthnt not yet implemented :monkaS:`, ephemeral: true});
}

async function handleStats(interaction) {
	await interaction.reply({content: `Sleuth stats: <stats>`, ephemeral: true});
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
			case 'tsleuthnt':
				try {
					await handleSleuthnt(interaction);
				} catch (error) {
					console.error(`Error when responding to sleuthn't command: ${error}`);
				}
				break;
			case 'tstats':
				try {
					await handleStats(interaction);
				} catch (error) {
					console.error(`Error when responding to stats command: ${error}`);
				}
		}
	};
};

function buildOnMessageCreate() {
	return (msg) => {
		sleuther.record(msg);
	}
}

function runDiscordBot(){

	client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]});

	const secrets = secretManager.getDiscordSecrets();

	client.once('ready', buildOnReady(secrets));
	client.on('interactionCreate', buildOnInteractionCreate());
	client.on('messageCreate', buildOnMessageCreate());

	client.login(secrets.botToken);
};

module.exports = { runDiscordBot };
