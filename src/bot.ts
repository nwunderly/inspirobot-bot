import { verify } from './verify'
import { getInspiroBotData } from "./inspirobot";

import {
  APIApplicationCommandInteraction as Interaction,
  APIApplicationCommandInteractionData as InteractionData,
  APIInteractionResponse as InteractionResponse,
  APIEmbed as Embed,
  InteractionType,
  InteractionResponseType,
} from 'discord-api-types/v9'

import { APIPingInteraction } from 'discord-api-types/payloads/v9/_interactions/ping'


// Commands //

const commands = [
  { name: 'invite_test', func: invite },
  { name: 'inspireme_test', func: inspireMe },
  { name: 'invite', func: invite },
  { name: 'inspireme', func: inspireMe },
]

async function invite(_command: InteractionData) {
  return respond(
      '[Invite me to your server!](https://discord.com/api/oauth2/authorize' +
      '?client_id=897275931436138546&scope=applications.commands)'
  )
}

async function inspireMe(_command: InteractionData): Promise<Response> {
  let data = await getInspiroBotData()

  let desc = `**Buy Merch:**\n` +
      `[shirt](${data.zazzle.shirt}) | ` +
      `[poster](${data.zazzle.poster}) | ` +
      `[mug](${data.zazzle.mug}) | ` +
      `[sticker](${data.zazzle.sticker}) | ` +
      `[mask](${data.zazzle.mask})\n` +
      `(merch sold by the official [InspiroBot](https://inspirobot.me/) project)`

  let content = "Here's your new InspiroBot quote!"

  let embed: Embed = {
    description: desc,
    color: 0xffffff,
    image: {url: data.image},
  }

  return respondEmbed(content, embed)
}


// The actual bot //

export async function handleRequest(request: Request): Promise<Response> {
  if (!request.headers.get('X-Signature-Ed25519') || !request.headers.get('X-Signature-Timestamp'))
    return Response.redirect('https://github.com/nwunderly/inspirobot-bot')
  if (!await verify(request)) return new Response('', {status: 401})

  const interaction = await request.json() as APIPingInteraction | Interaction

  if (interaction.type === InteractionType.Ping) {
    return respondComplex({
      type: InteractionResponseType.Pong
    })
  } else if (interaction.type === InteractionType.ApplicationCommand) {
    return respondToCommand(interaction.data)
  } else {
    return respondEphemeral("Error: Unsupported interaction type.")
  }
}

async function respondToCommand(command: InteractionData) {
  for (let cmd of commands) {
    if (cmd.name === command.name) {
      return cmd.func(command)
    }
  }
  return respondEphemeral('Command not found: ' + command.name)
}


// Utility stuff //

async function respondEmbed(content: string, embed: Embed): Promise<Response> {
  return respondComplex({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: content,
      embeds: [embed]
    }
  })
}

async function respond(content: string): Promise<Response> {
  return respondComplex({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: content,
    }
  })
}

async function respondEphemeral(content: string): Promise<Response> {
  return respondComplex({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: content,
      flags: 1<<6,
    }
  })
}

async function respondComplex(response: InteractionResponse): Promise<Response> {
  return new Response(JSON.stringify(response), {headers: {'content-type': 'application/json'}})
}
