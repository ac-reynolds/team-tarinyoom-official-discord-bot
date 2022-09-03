const cohereClient = require('./cohereClient');

async function runCohereTest(){

	function verifyResponse(response) {
		switch (response.statusCode) {
			case 200:
				break;
			case 401:
				console.error(`Cohere rejected authentication. Check your cohere ai token.`);
				return false;
			default:
				console.error(`Error connecting to cohere backend.`);
				return false;
		}
	
		try {
			response.body.embeddings.forEach(l => {
				if (l.length != 4096) {
					console.error(`Expected embeddings of length 4096, but found an embedding of length ${l.length}.`);
					return false;
				}
			})
		} catch (error) {
			console.error(`Error reading message body: ${error}`);
			return false;
		}
	
		return true;
	}

	const testResponses = await Promise.all([
		cohereClient.getEmbedding("single test message"),
		cohereClient.getEmbeddings(["test message 1", "another test message"])
	]);

	const numSuccesses = testResponses.reduce(
		(agg, v) => verifyResponse(v) ? agg + 1 : agg, 0);
	
	console.log(`Passed ${numSuccesses}/${testResponses.length} test cases.`);

	return numSuccesses == testResponses.length;
}

async function runTests() {
	const testResults = await Promise.all([runCohereTest()]);
	return testResults.reduce(
		(agg, v) => agg && v, true
	);
}

module.exports = { runTests };
