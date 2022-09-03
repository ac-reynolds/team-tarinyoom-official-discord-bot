const cohere = require('cohere-ai');
const secrets = require('./secretManager');

function runCohereTest(){
	cohere.init(secrets.getCohereApiKey());
	(async () => {
		const response = await cohere.embed({
		  texts: ["test", "goodbye"]
		});
		console.log("Session: %j", response);
	  })();
}

module.exports = { runCohereTest };
