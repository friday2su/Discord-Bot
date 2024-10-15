const { Events, PermissionsBitField } = require('discord.js');
const Ticket = require('../database/models/ticket'); // Import your Ticket model
const Suggestion = require('../database/models/suggestion'); // Import your Suggestion model

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Handle slash commands
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            // Check for command permissions
            if (command.permissions) {
                const missingPermissions = command.permissions.filter(permission => 
                    !interaction.guild.me.permissions.has(permission)
                );
                if (missingPermissions.length > 0) {
                    return await interaction.reply({ 
                        content: `⚠️ | I am missing the following permissions to execute this command: \`${missingPermissions.join(', ')}\`.`, 
                        ephemeral: true 
                    });
                }
            }

            // Additional checks for specific commands
            if (command.name === 'mute' || command.name === 'unmute') {
                const member = interaction.options.getMember('user');
                if (!member.voice.channel) {
                    return await interaction.reply({ 
                        content: `🚫 | The user must be in a voice channel to be ${command.name === 'mute' ? 'muted' : 'unmuted'}.`, 
                        ephemeral: true 
                    });
                }
            }

            try {
                await command.execute(interaction, client); // Pass the client
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '💀 | You met a rare bot error.', ephemeral: true });
            }
        }

        // Handle button interactions
        if (interaction.isButton()) {
            const { customId } = interaction; // Scope customId within button interaction handling
            const ticketData = await Ticket.findOne({ channelId: interaction.channel.id });

            // Ticket interactions
            if (ticketData) {
                switch (customId) {
                    case 'create_ticket':
                        await createTicket(interaction, ticketData);
                        break;
                    case 'ticket_claim':
                        await claimTicket(interaction); // Implement claimTicket function
                        break;
                    case 'ticket_delete':
                        await deleteTicket(interaction); // Implement deleteTicket function
                        break;
                    case 'ticket_transcript':
                        await getTranscript(interaction); // Implement getTranscript function
                        break;
                    default:
                        break;
                }
            }
        }
    },
};

async function createTicket(interaction, ticketData) {
    const userTickets = await Ticket.countDocuments({ userId: interaction.user.id, guildId: interaction.guild.id });
    const ticketNumber = userTickets + 1; // Add 1 to get the next ticket number
    const channelName = `ticket-${interaction.user.username}-${ticketNumber}`;

    const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: 0, // 'GUILD_TEXT' is now deprecated, use type 0 for text channels
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: ticketData.staffRoleId,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
    });

    // Mention the staff role and notify the user
    await ticketChannel.send({
        content: `Hello ${interaction.user}, your ticket has been created! <@&${ticketData.staffRoleId}> staff, please assist.`,
    });

    // Reply to the interaction
    await interaction.reply({ content: `✅ | Ticket created: ${ticketChannel}`, ephemeral: true });

    // Save ticket data to your database with required fields
    const newTicket = new Ticket({
        userId: interaction.user.id,
        channelId: ticketChannel.id,
        guildId: interaction.guild.id,
        ticketNumber: ticketNumber, // Store the ticket number for future reference
        description: "New ticket created", // Provide a default description or customize it
        title: `Ticket #${ticketNumber}`, // Provide a default title
        transcriptChannelId: ticketData.transcriptChannelId, // Assuming this is predefined in ticketData
        logsChannelId: ticketData.logsChannelId, // Assuming this is predefined in ticketData
        staffRoleId: ticketData.staffRoleId // Assuming this is predefined in ticketData
    });
  
    await newTicket.save();
}
