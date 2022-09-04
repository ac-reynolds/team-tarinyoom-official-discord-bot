const cohere = require('../cohereClient');
const pinecone = require('../podManager');

async function search(query, guildId, numResults) {
	const embedding = await cohere.getEmbedding(query);
	const results = await pinecone.search(embedding, guildId, numResults);
	return results.map(val => {
		return {
			"score": val.score,
			"messageId": val.id,
			"channelId": val.metadata.channelId
		};
	});
}

module.exports = { search }
