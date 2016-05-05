# Globie Watcher

A Slack Bot to let others know when the Sync (BitTorrent Sync) folder has changed. (You could use it with your own FTP/file server, or even a Dropbox folder). Watches a specified folder using `chokidar` and uses a Slack Webhook with `botkit` to post formatted messages to channels. Assumes your main channel is called `#general`.

This bot also watches the folder `Projects/Active Work/` for subfolders that match channel names and attempts to post to them if possible. We have channels for each of our active projects and keep working files in the Sync, this bot tells others when those files have changed in the appropriate channel.

## Install

```
  npm install
  cp .env.example .env
```

Edit the .env

 - SYNC_DIR
 - SLACK_API
 - WEBHOOK_URL
 
```
  node index.js
```

We keep this running on our Pi using PM2

### Licence

MIT