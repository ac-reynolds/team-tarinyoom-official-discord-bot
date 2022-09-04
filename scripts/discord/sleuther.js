const { debug } = require('request');
const cohere = require('../cohereClient');
const pinecone = require('../podManager');
const sleuthingStatus = new Map();

let sleuthingFetchCallsInLastPeriod = 0;
const runQ = [];

// 5 calls every quarter second keeps us well below api abuse threshold (50 / second)
const max_num_sleuthing_fetch_calls_per_period = 5;
const period = 250;

/*
sleuthingStatus::
{
	MAP guildId: 
		MAP channelId:
			{
				"earliestMessage": string,
				"earliestMessageTime": int,
				"finished": bool,
				"numSleuthed": num
			}
}
*/

function dispatchQueue() {
	console.log(`Dispatching run queue of length ${runQ.length}. Operating at ${sleuthingFetchCallsInLastPeriod / period} jobs per second.`);
	while (sleuthingFetchCallsInLastPeriod < max_num_sleuthing_fetch_calls_per_period) {
		if (runQ.length > 0) {
			runQ.shift()();
			sleuthingFetchCallsInLastPeriod++;
			setTimeout(() => {
				sleuthingFetchCallsInLastPeriod--;
			}, period);
		} else {
			break;
		}
	}
}

/**
 * Enqueues fetch call in runqueue
 * @param {*} channel 
 * @param {*} params 
 * @returns 
 */
function fetchSafely(channel, params, callback) {
	runQ.push(async () => {
		const messages = await channel.messages.fetch(params);
		callback(messages);
	})
	dispatchQueue();
}

/**
 * Updates Sleuthing status based on this passed array. Assumes 
 * all messages are new. 
 * @param {[Message]} messages An array of messages to be processed
 */
function updateStats(messages, channel) {
	const channelStats = sleuthingStatus.get(channel.guildId).get(channel.id);
	if (messages.length == 0) {
		channelStats.finished = true;
		console.log(`Finished sleuthing channel: ${channel.name}`);
	}

	for (m in messages) {
		channelStats.numSleuthed++;
		if (m.createdTimestamp < channelStats.earliestMessageTimestamp) {
			channelStats.earliestMessageTimestamp = m.createdTimestamp;
			channelStats.earliestMessage = m.id;
		}
	}
}

function continuousSleuth(channel) {
	if (sleuthingStatus.get(channel.guildId).get(channel.id).finished) {
		return;
	}
	console.log(`Fetching from ${channel.name}. Channel stats: ${JSON.stringify(sleuthingStatus.get(channel.guildId).get(channel.id))}`)
	fetchSafely(channel, { 
		/* Don't make this too big or our packet will be too large
		 * Each message is encoded as 4096 4-byte floats, which is 16kB for
		 * just the data. Experimentally, the failure threshold seems to be
		 * between 60 and 70 messages per CRUD. 
		 */
		limit: 40,
		before: sleuthingStatus.get(channel.guildId).get(channel.id).earliestMessage
	}, 
	async channelMessages => {
		const messageArray = Array.from(channelMessages.values()).filter(m => m.content.length > 0);
		const embeddings = await cohere.getEmbeddings(messageArray.map(m => m.content))
			.catch(console.error);
		
		if (embeddings != undefined) {
			const messageData = embeddings.map((val, i) => {
				return {
					"id": messageArray[i].id,
					"embedding": val
				};
			});
		
			pinecone.recordMessages(channel.guildId, channel.id, messageData);	
		}

		updateStats(messageArray, channel);
		continuousSleuth(channel);
	});
};

function initiateChannelSleuthing(channel) {
	fetchSafely(channel, {
		limit: 1
	}, async channelMessages => {
		const messageArray = Array.from(channelMessages.values());
		const embedding = await cohere.getEmbedding(messageArray[0].content)
			.catch(console.error);
		
		if (embedding != undefined) {

			const messageData = [{
				"id": messageArray[0].id,
				"embedding": embedding
			}];
		
			pinecone.recordMessages(channel.guildId, channel.id, messageData);	
		}
		sleuthingStatus.get(channel.guildId).set(channel.id, {
			"earliestMessage": messageArray[0].id,
			"earliestMessageTimestamp": messageArray[0].createdTimestamp,
			"finished": false,
			"numSleuthed": 0
		})
		updateStats(messageArray, channel);
		continuousSleuth(channel);
	})
}

async function initiateSleuthing(client, guildId, callbackSuccess) {
	sleuthingStatus.set(guildId, new Map());
	const channelManager = client.guilds.cache.get(guildId).channels;
	const targetChannels = Array.from(channelManager.cache.values())
								.filter(channel => channel.type == 0);


	const initialize = await Promise.all(targetChannels.map(async channel => await initiateChannelSleuthing(channel)));
	
	return true;
}

/**
 * 
 * @param {string} msg 
 */
async function record(msg) {

	const embedding = await cohere.getEmbedding(msg.content); 

	pinecone.recordMessages(msg.guildId,
							msg.channelId,
							[{
								"id": msg.id,
								"embedding": embedding 
							}]);
}

module.exports = { initiateSleuthing, record };
