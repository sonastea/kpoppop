import { DiscordClientProvider, On, Once } from '@discord-nestjs/core';
import { pgListenerProvider } from '../database/pg-listener.service';
import { Injectable, Logger } from '@nestjs/common';
import { MemeService } from 'src/meme/meme.service';
import {
  Interaction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  TextChannel,
  ButtonStyle,
} from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    private readonly discordProvider: DiscordClientProvider,
    private readonly listener: pgListenerProvider,
    private readonly memeService: MemeService
  ) {
    this.listener.subscriber.notifications.on('new_meme', (payload) => {
      console.log(payload);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('APPROVE')
          .setLabel('APPROVE')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('DENY').setLabel('DENY').setStyle(ButtonStyle.Danger)
      );

      const embed = new EmbedBuilder()
        .setColor('#f45990')
        .setTitle(payload.title)
        .setImage(payload.url)
        .setURL(payload.url)
        .addFields(
          { name: 'authorId: ', value: payload.authorId.toString(), inline: true },
          { name: 'memeId: ', value: payload.id.toString(), inline: true }
        );

      (
        this.discordProvider
          ?.getClient()
          .channels.cache.get(process.env.DISCORD_CHANNEL_ID) as TextChannel
      ).send({
        embeds: [embed],
        components: [row],
      });
    });
  }

  @Once('ready')
  async onReady(): Promise<void> {
    this.logger.log(`KpoppopBot is now online as ${this.discordProvider.getClient().user.tag}!`);
  }

  @On('interactionCreate')
  async onButtonInteract(interaction: Interaction) {
    // Only listen to button interactions
    if (!interaction.isButton()) return;

    // Retrieve member that interacted with the button and
    // make sure they have the appropiate permissions
    const user = (interaction.channel as TextChannel).members.get(interaction.user.id);
    // Get meme id of current interaction
    const memeId = interaction.message.embeds[0].fields[1].value;

    // Check if user is authorized to approve or deny the approvals list.
    if (
      user &&
      user.roles.cache.some((role) => ['Administrator', 'Moderator'].includes(role.name))
    ) {
      this.logger.log(`[${user.displayName}:${user.id}] ${interaction.customId} memeId:${memeId}`);

      if (interaction.customId === 'APPROVE') {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('APPROVE')
            .setLabel('APPROVE')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('DENY')
            .setLabel('DENY')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false)
        );

        await this.memeService.updateMeme({
          where: { id: parseInt(memeId) },
          data: {
            active: true,
            flagged: false,
          },
        });

        await interaction.update({ components: [row] });
        await interaction.editReply(`${user.displayName} approved memeId: ${memeId}`);
      } else if (interaction.customId === 'DENY') {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('APPROVE')
            .setLabel('APPROVE')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId('DENY')
            .setLabel('DENY')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );

        await this.memeService.updateMeme({
          where: { id: parseInt(memeId) },
          data: {
            active: false,
            flagged: true,
          },
        });

        await interaction.update({ components: [row] });
        await interaction.editReply(`${user.displayName} denied memeId: ${memeId}`);
      }
    } else {
      await interaction.reply({ content: 'You do not have the required role!', ephemeral: true });
    }
  }
}
