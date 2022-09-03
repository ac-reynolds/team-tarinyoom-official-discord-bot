const discordBot = require("./scripts/discordBot.js");
const tests = require("./scripts/tests");

console.log(tests.runTests() ? "All tests passed." : "Not all tests passed.");

discordBot.runDiscordBot();
