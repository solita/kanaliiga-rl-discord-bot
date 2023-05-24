
# Discord bot - Kanaliiga Rocket League

Bot's purpose is to fully automate uploading `.replay` -files into Ballchasing.com after a forum post has been created and files attached in to, either the post itself or as a message in the thread. 


## Tech Stack


**Bot-server:** Node `18`

**Environment:** Docker `20`

## Features

- Parses and finds correct division from a forum post title 
- Download and upload .replay -files automatically to correct division
- File uploads only permitted with captain role
- Report file processing for its success or failure into its discord post
- Suggests for division names in case of misspelling or with /divisionhelp -command
- Report bot and ballchasing API health with /health -commmand
- Season change? No worries, set a new parent group with /setparent -command
- Robust and easy to use




## Commands

|cmd| Parameter | Type     | Description                       | Restricted |
|:---| :-------- | :------- | :-------------------------------- | :-----|
|/health|      |  |  Bot and api health | no |
|/divisionhelp|       |  | Subgroups (divisions) from parent | no |
|/setparent| `id`      | `string` | **Required**. Id of the new parent group | yes |

Ballchasing parent group id can be found from, for e.g. from groups home page url. 
https://ballchasing.com/group/xxxxxxxxxxx
## Usage

#### Rocket League Captains

Users with captain role are the only ones who are able to use /setparent -command and give attachments for the bot.

- Create a new post with a title following the naming convention (.... ... ..., division,......)
- Either drag and drop .replay -attachmenst in to the starter message or
- Drag and drop attachment files to a new message in the post


## Documentation

Bot works by sniffing thread posts and messages sent to them. 

A new post in the forum has to follow a certain naming convention. Post titles are expected to have 2 commas ",", and a division name in between them. Division name is important for the bot to know to which group files are being uploaded to. Use full group name whether it be Runkosarja Masters, Playoffs Masters etc.

It is **case-sensitive.** 
 - Team 1 vs Team 2, **Division name**, DD.MM.YYYY

Bot notifies you, if you mispelled the name, with the names it found from ballchasing. It will only search groups under a pre-defined parent group (see commands for more information). 

Attachments can be added directly into the new post, or as messages after. They may be in the same message or added separately. 
- Filenames do not matter. 
- Only `.replay` -files are accepted. 

Bot replies with emojies, first succesful upload sends ✅1️⃣ and consecutive ones after that 2️⃣,3️⃣ ... 
In case of a failure, 🚫 is sent. Each attachment is handled separetly, therefore one failed upload does not automatically affect the others. Except if theres incorrect file-type. \
Along with emojies, bot replies with a link to the replay in the ballchasing.com



### Admins

The following steps helps you to configure the bot into your discord channel. 

- Log in to [Discord Developer Portal](https://discord.com/developers/applications) with your discord credentials
- Create a new application
- Note the *APPLICATION ID*, this is the env `CLIENT_ID`
- Navigate to Bot -tab, give your bot a username if needed
- Click *Reset Token* and take note of it, this is the env `TOKEN`
- Scroll down and toggle on slider *MESSAGE CONTENT INTENT* 
- Navigate into *OAuth0 -> URL Generator*
- Generate an invite URL with the scopes:
**Scopes** `bot`\
**Bot Permissions** `Read Messages/View Channels`, `Send Messages`, `Add Reactions`
- Copy and paste the URL into your browser, select server from the dropdown and accept the invitation. The bot has now joined into your server. 



### Bot server setup

- Clone the project `git clone`
- Step into the dir `cd kanaliiga-rl-discrod-bot`
- Create `.env` -file from `.env.example`
- run the deploy bash script `sh deploy.sh`

## Environment Variables

Bot is configurable with environment variables. Environment variables can be set into environment itsel, or by placing a `.env` -file into the root of the project. Please see `.env.example` for more information. 

`TOKEN`<br>
`CLIENT_ID`<br>
`BALL_CHASING_API_KEY`<br>
`CAPTAIN_ROLE`<br>
`ADMIN_ROLE`<br>
`CLEAR_CACHE_INTERVAL`

## Running Tests

To run tests

```bash
  git clone
  npm install
  npm run test
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

