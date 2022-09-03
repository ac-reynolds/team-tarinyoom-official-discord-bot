const cohere = require('cohere-ai');
const secrets = require('./secretManager');

/**
 * Takes in a string, returns the corresponding list of embeddings.
 * @param {string} input The string to be evaluated
 * @returns {[float]} The corresponding embeddings
 */
async function getEmbedding(input) {
	const embedding = await getEmbeddings([input]);
	return embedding[0];
}

/**
 * Takes in an array of strings, returns the corresponding lists of embeddings.
 * @param {[string]} inputs A list of strings to be evaluated
 * @returns {[[float]]} A list of corresponding embeddings
 */
async function getEmbeddings(inputs) {
	try {
		cohere.init(secrets.getCohereSecrets().apiKey);
		const response = await cohere.embed({
			texts: inputs
		})
		return response.body.embeddings;	
	} catch (error) {
		console.error(`Error communicating with Cohere backend. Response code: ${response.statusCode}`);
	}
}

module.exports = { getEmbedding, getEmbeddings };
