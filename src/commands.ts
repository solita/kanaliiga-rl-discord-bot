import { Client, REST, Routes } from 'discord.js';
import { CLIENT_ID, TOKEN, APPLICATION_VERSION } from './config';
import { ContentController } from './ContentController';
import { pingBCApi } from './ballchasingAPI';
import { EmbedBuilder } from 'discord.js';

const commands = [
  {
    name: 'health',
    description: 'Replies with bot health and status'
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

export const getCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  } catch (error) {
    console.error(error);
  }
};


export const botHealth = async (controller: ContentController, client: Client): Promise<EmbedBuilder> => {

  const story:string[] = []
  const ballchasinStatus = await pingBCApi()
  const isBotHealthy = ballchasinStatus.status === 200

  story.push(`Bot is ${isBotHealthy ? 'healthy 🫶' : 'not healthy 😮‍💨'} `)
  story.push(`Uptime ${((client.uptime / 1000)/86400).toFixed(2)} days`)

  if (!isBotHealthy){
    story.push(`Connection to ballchasing seems to have a problem: \n${ballchasinStatus.url} - ${ballchasinStatus.status} - ${ballchasinStatus.statusText}`)
  }
  else{
    story.push(`Connection to Ballchasin.com is OK! - ${ballchasinStatus.status}`)
  }

  story.push(`Bot has ${controller.tasks.length} posts stored in memory`)
  
  controller.tasks.forEach(task => {
    story.push(` Post id ${task.thread.id} with ${task.queue.length} messages in queue`)
    task.queue.forEach(message => {
      message.attachments.forEach(r => {
        story.push(`   Attachment ${r.name}`)
      })
    })
  })

  const embedContainer = new EmbedBuilder()
  .setColor(isBotHealthy ? '#53b33b' : '#d12020')
  .setTitle(`Kanaliiga RL Discord Bot ${APPLICATION_VERSION}`)
  .setURL('https://github.com/solita/kanaliiga-rl-discord-bot')
  .setDescription(story.join('\n'))

  return embedContainer
}



