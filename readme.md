#Team Tarinyoom Official Discord bot for Cohere AI hackathon: 

Presentation link: https://pro.panopto.com/Panopto/Pages/Viewer.aspx?tid=f8544ad3-4bcf-42cf-9eeb-af0601786967

Discord bot to provide enhanced search functionality based on semantic similarity

We use discord.js API to scrape messages from a discord server. We then use Cohere AI's "embed" tool to find corresponding embeddings, and store them, along with their corresponding message IDs, in our backend database, which is an s1 pinecone.io instance. When a discord user searches for a particular query string, that query string's embedding is compared to database entries by cosine similarity, and relevant result(s) are returned. 

This feature ameliorates Discord's poor search index functionality by allowing users to search past messages without finding an exact match.

However, it is not very scalable as a separate discord bot due to size constraints (learning every message from every server), and would be better suited as a native Discord feature instead.
