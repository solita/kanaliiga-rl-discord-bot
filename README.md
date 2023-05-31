
# Discord bot - Kanaliiga Rocket League

Bot's purpose is to fully automate uploading `.replay` -files into Ballchasing.com after a forum post has been created and files attached in to, either the post itself or as a message in the thread. 

Bot works by sniffing thread posts and messages sent to them. 

A new post in the forum has to follow a certain naming convention. Post titles are expected to have 2 commas ",", and a division name in between them. Division name is important for the bot to know to which group files are being uploaded to. Use full group name whether it be Runkosarja Masters, Playoffs Masters etc.

It is **case-sensitive.** 
 - Team 1 vs Team 2, **Division name**, DD.MM.YYYY

Bot notifies you, if you mispelled the name, with the names it found from ballchasing. It will only search groups under a pre-defined parent group (see commands for more information). 


Bot replies with emojies, first succesful sends ✅1️⃣ and consecutive ones after that 2️⃣,3️⃣ ... 
In case of a failure, the bot tells you about it. Each attachment is handled separetly, therefore one failed upload does not automatically affect the others. Except if theres incorrect file-type. \
Along with emojies, bot replies with a link for the replay in the ballchasing.com

Bot keeps metadata of posts in memory for certain amount of time (`CLEAR_CACHE_INTERVAL`). This is for convienence reasons and does not affect bot usage. You can still add new messages and attachments to an old post even after the cache is cleared.
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

    1) Write titles in posts with the following syntax: 

    {HomeTeam} vs {GuestTeam}, {DivisionFullName}, {DD.MM.YYYY}

    e.g. ABC vs DEF, Runkosarja Masters, 6.3.2023

    3) Drag & Drop replay files into the post. This can be done afterwards as well.
    4) You may add additional information about the played rounds, e.g. if any issues were encountered.
    5) Close the post once youre ready and if theres nothing more to add
     by right clicking the post and choosing Close Post

#### Admins

`ADMIN_ROLE` has two commmands in their toolbox to use. 

**/rl_setparent** Sets a new parent group (season) where subgroups (divisions) are located.

**/rl_check** Checks all posts for unprocessed files.



## Bot setup


The following steps helps you to configure the bot into your discord channel. 

- Log in to Discord Developer Portal with your discord credentials
- Create a new application
- Note the *APPLICATION ID*, this is the env `CLIENT_ID`
- Fill the description of the bot. This will appear in the bots *about me* - section in discord
- Click *Reset Token* and take note of it, this is the env `TOKEN`
- Toggle off *PUBLIC BOT* from Authorization Flow settings
- Scroll down and toggle on slider *MESSAGE CONTENT INTENT* 
- Navigate into *OAuth0 -> General* and make sure there are no redicrect links set and *AUTHORIZATION METHOD* is set to **None**
- Navigate into *OAuth0 -> URL Generator*
- Generate an invite URL with:
*Scopes* `bot`\
*Bot Permissions* `Read Messages/View Channels`, `Send Messages`, `Add Reactions`
- Copy and paste the URL into your browser, select server from the dropdown and accept the invitation. The bot has now joined into your server. **Do not share the link with anyone**







## Local Deployment

To deploy this project

- Clone the project `git clone`
- Step into the dir `cd kanaliiga-rl-discrod-bot`
- Create `.env` -file from `.env.example` fill it accordingly
- run the deploy bash script `sh deploy.sh`
## Environment Variables

Bot is configurable with environment variables. Environment variables can be set into environment itsel, or by placing a `.env` -file into the root of the project. Please see [`.env.example`](/.env.example) for more information.



| Variable             | Default                     | Type    | Notes                    |
|----------------------|-----------------------------|---------|--------------------------|
| TOKEN                |                             | String  |                          |
| CLIENT_ID            |                             | Integer |                          |
| BALL_CHASING_API_KEY |                             | String  |                          |
| CAPTAIN_ROLE         |                             | String  | e.g. RL Captain          |
| ADMIN_ROLE           |                             | String  | e.g. RL Organizer        |
| TARGET_CHANNEL_NAME  |                             | String  |                          |
| CLEAR_CACHE_INTERVAL | 3                           | Integer | Number of days           |
| FILE_LIMIT        | 7                           | Integer |  Number of attachemnts in total for one post  |
| BOT_NAME             | Kanaliiga RL Bot            | String  | Max length 32 characters |
| BOT_ACTIVITY         | for RL replays to upload... | String  |                          |

## Running Tests

To run tests

```bash
  git clone
  npm install
  npm run test
```


## FAQ

#### I spelled the post title wrong, what do I do?

Edit the posts title and save. The bot will check the post again for you. 

#### I've exceeded my limit of attachments in my post, how to proceed?

Delete your message and add the attachments again and not go over the limit, or remove attachement inside the message and ask RL Organizer to run /rl_check for you


#### The bot did not do anything when I made a new post and placed files in it, why?

The bot might be offline. Don't worry though, you're post or files are not lost. Ask Admin to run /rl_check for you once the bot is back online.

## License

[MIT](https://choosealicense.com/licenses/mit/)

