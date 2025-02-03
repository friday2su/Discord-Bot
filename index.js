require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const figlet = require('figlet'); // Retaining figlet for cool ASCII art
const automodLogic = require('./automodLogic');

// Initialize Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, // Voice states for music functionality
    GatewayIntentBits.GuildMessageReactions // For message reactions
  ]
});

// Cool ASCII banner for startup
figlet('Bot Started!', (err, data) => {
  if (err) {
    console.log('Đã xảy ra lỗi với figle...');
    console.dir(err);
    return;
  }
  console.log(data);
});

// Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(category => {
  const commandFiles = fs.readdirSync(`${commandsPath}/${category}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${commandsPath}/${category}/${file}`);
    client.commands.set(command.data.name, command);
  }
});

// Event Handler
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  const event = require(`${eventsPath}/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
});

client.on('messageCreate', automodLogic);

// MongoDB connection with a modern console message
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('🚀 MongoDB Connection: SUCCESS');
  console.log('🔗 Connected to MongoDB Database');
}).catch(err => console.error('❌ MongoDB Connection: FAILED\n', err));

// Deploy-commands logic combined with index.js
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const deployCommands = async () => {
  try {
    console.log('🌀 Đã bắt đầu làm mới APP (/) commands.');

    const commands = [];
    fs.readdirSync(commandsPath).forEach(category => {
      const commandFiles = fs.readdirSync(`${commandsPath}/${category}`).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`${commandsPath}/${category}/${file}`);
        commands.push(command.data.toJSON());
      }
    });

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Đã Tải APP Thành Công (/) commands.');
  } catch (error) {
    console.error('❌ Đã xảy ra lỗi khi tải APP (/) commands:', error);
  }
};

// Initialize the bot and deploy commands
client.once('ready', () => {
  console.log(`✅ Đăng Nhập Như ${client.user.tag}`);
  deployCommands();
});

// Bot Login
client.login(process.env.TOKEN);
