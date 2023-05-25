
# Discord bot - Kanaliiga Rocket League

Bot's purpose is to fully automate uploading `.replay` -files into Ballchasing.com after a forum post has been created and files attached in to, either the post itself or as a message in the thread. 


## Tech Stack


**Bot-server:** Node `18`

**Environment:** Docker `20`

## Features

- Parses and finds correct division from a forum post title 
- Download and upload .replay -files automatically to correct division
- Add all the attachments in the same message, or one by one
- File uploads only permitted with captain role
- Report file processing for its success or failure into its discord post
- Suggests for division names in case of misspelling or with /rl_divisionhelp -command
- Report bot and ballchasing API health with /rl_health -commmand
- Season change? No worries, set a new parent group with /rl_setparent -command
- Handle posts made when the bot was offline with /rl_check -command





## Commands

|cmd| Parameter | Type     | Description                       | Restricted |
|:---| :-------- | :------- | :-------------------------------- | :-----|
|/rl_health|      |  |  Bot and api health | no |
|/rl_divisionhelp|       |  | Subgroups (divisions) from parent | no |
|/rl_setparent| `id`      | `string` | **Required**. Id of the new parent group | `ADMIN_ROLE` |
|/rl_check|       |  | Process posts made when bot was offline | `ADMIN_ROLE` |

Ballchasing parent group id can be found, for e.g. from group home page url. 
https://ballchasing.com/group/xxxxxxxxxxx
## Usage

#### Rocket League Captains

New posts can be made by anyone, but file attachments and uploads are permitted only for those with `CAPTAIN_ROLE`

- Create a new post with a title following the naming convention (.... ... ..., division,......)

e.g. 
ABC vs DEF, Runkosarja Masters, 6.3.2023


- Either drag and drop .replay -attachments in to the starter message or
- Send a new message to the post with the attachments after.

You may add additional information about the played rounds, e.g. if any issues were encountered. Messages without attachments are not affected by the bot. 
## Documentation

Bot works by sniffing thread posts and messages sent to them. 

A new post in the forum has to follow a certain naming convention. Post titles are expected to have 2 commas ",", and a division name in between them. Division name is important for the bot to know to which group files are being uploaded to. Use full group name whether it be Runkosarja Masters, Playoffs Masters etc.

It is **case-sensitive.** 
 - Team 1 vs Team 2, **Division name**, DD.MM.YYYY

Bot notifies you, if you mispelled the name, with the names it found from ballchasing. It will only search groups under a pre-defined parent group (see commands for more information). 

Attachments can be added directly into the new post, or as messages after. They may be in the same message or added one by one. 
- Filenames do not matter. 
- Only `.replay` -files are accepted. 

Bot replies with emojies, first succesful sends ✅1️⃣ and consecutive ones after that 2️⃣,3️⃣ ... 
In case of a failure, the bot tells you about it. Each attachment is handled separetly, therefore one failed upload does not automatically affect the others. Except if theres incorrect file-type. \
Along with emojies, bot replies with a link for the replay in the ballchasing.com



### Admins

`ADMIN_ROLE` has two commmands in their toolbox to use. 

**/rl_setparent** Sets a new parent group (season) where subgroups (divisions) are located.

**/rl_check** The bot is unable to upload and handle new posts while it is offline. In case of such event, this command tells the bot to check all the posts, messages and their attachments in the channel and process them. The bot will not re-process posts it has already marked with ✅, only new posts are considered. Each post processed this way will also receive emoji-reactions once they are done. 


#### Bot setup
The following steps helps you to configure the bot into your discord channel. 

- Log in to Discord Developer Portal with your discord credentials
- Create a new application
- Note the *APPLICATION ID*, this is the env `CLIENT_ID`
- Navigate to Bot -tab, give your bot a username if needed
- Click *Reset Token* and take note of it, this is the env `TOKEN`
- Toggle off *PUBLIC BOT* from Authorization Flow settings
- Scroll down and toggle on slider *MESSAGE CONTENT INTENT* 
- Navigate into *OAuth0 -> General* and make sure there are no redicrect links set and *AUTHORIZATION METHOD* is set to **None**
- Navigate into *OAuth0 -> URL Generator*
- Generate an invite URL with:
*Scopes* `bot`\
*Bot Permissions* `Read Messages/View Channels`, `Send Messages`, `Add Reactions`
- Copy and paste the URL into your browser, select server from the dropdown and accept the invitation. The bot has now joined into your server. 





- Clone the project `git clone`
- Step into the dir `cd kanaliiga-rl-discrod-bot`
- Create `.env` -file from `.env.example` and fill it accordingly
- - `ADMIN_ROLE` and `CAPTAIN_ROLE` are case-sensitive names of the role names used in the discord channel.
- run the deploy bash script `sh deploy.sh`

## Environment Variables

Bot is configurable with environment variables. Environment variables can be set into environment itsel, or by placing a `.env` -file into the root of the project. Please see `.env.example` for more information. 

`TOKEN`
`CLIENT_ID`
`BALL_CHASING_API_KEY`
`CAPTAIN_ROLE`
`ADMIN_ROLE`
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

