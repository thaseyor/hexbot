'use strict'

import { Client, MessageEmbed } from 'discord.js'
import ytdl from 'ytdl-core'

import dotenv from 'dotenv'
dotenv.config()

const client = new Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	// console.log(client.channels)
})

const COMMAND_PREFIX = '$'

client.on('message', (msg) => {
	try {
		if (msg.content.split('')[0] === COMMAND_PREFIX) {
			const command = msg.content.split(' ')[0].substring(1)
			const action = commands[command]
			if (!action) throw new Error('Invalid command')
			action(msg)
		}
	} catch (e) {
		const embed = new MessageEmbed()
			.setTitle('Error')
			.setColor(0xff0000)
			.setDescription(e.message)
		msg.channel.send(embed)
	}
})

const commands = {
	ping(msg) {
		msg.reply('pong')
	},
	play(msg) {
		if (!msg.member.voice.channel)
			throw new Error('You should be connected to a channel')
		const videoUrl = msg.content.split(' ')[1]
		if (!videoUrl) throw new Error('No youtube link provided')

		msg.member.voice.channel.join().then((connection) => {
			const dispatcher = connection.play(
				ytdl(videoUrl, {
					quality: 'highestaudio'
				}),
				{ volume: 0.15 }
			)

			msg.channel.send('ok master')
		})
	}
}

client.login(process.env.TOKEN)
