# Team Tarinyoom Official Discord bot for Cohere AI hackathon.

Discord bot to provide enhanced search functionality based on semantic similarity

We use discord.js API to scrape messages from a discord server. We then use Cohere AI's "embed" tool to find corresponding embeddings, and store them, along with their corresponding message IDs, in our backend database, which is an s1 pinecone.io instance. When a discord user searches for a particular query string, that query string's embedding is compared to database entries by cosine similarity, and relevant result(s) are returned. 

This feature ameliorates Discord's poor search index functionality by allowing users to search past messages without finding an exact match.

However, it is not very scalable as a separate discord bot due to size constraints (learning every message from every server), and would be better suited as a native Discord feature instead.

[We tied for 3rd place!](https://github.com/tarinyoom/team-tarinyoom-official-discord-bot/files/10189014/Adam.Chiu.Reynolds.pdf)
