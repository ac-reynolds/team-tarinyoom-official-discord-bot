const cohereClient = require('./cohereClient');
const podManager = require('./podManager');

async function runCohereTest(){

	function verifyEmbeddingFormat(embeddings) {
	
		try {
			embeddings.forEach(l => {
				if (l.length != 4096) {
					console.error(`Expected embeddings of length 4096, but found an embedding of length ${l.length}.`);
					return false;
				}
			})
		} catch (error) {
			console.error(`Error reading evaluating embeddings: ${error}`);
			return false;
		}
	
		return true;
	}

	const testResponses = await Promise.all([
		cohereClient.getEmbedding("single test message"),
		cohereClient.getEmbeddings(["test message 1", "another test message"])
	]);

	const numSuccesses = testResponses.reduce(
		(agg, v) => verifyEmbeddingFormat(v) ? agg + 1 : agg, 0);
	
	console.log(`Passed ${numSuccesses}/${testResponses.length} test cases.`);

	return numSuccesses == testResponses.length;
}

async function runPodTest(){
//id - discord messageId
//values - cohere embed array data
//namespace - discord guildId

}

async function runTests() {
	const testResults = await Promise.all([runCohereTest(), runPodTest()]);
	return testResults.reduce(
		(agg, v) => agg && v, true
	);
}

module.exports = { runTests };
