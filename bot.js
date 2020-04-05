const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = process.env.prefix;
const token = process.env.token;
const ownerId = process.env.ownerId;


//Database
var mysql = require('mysql');
var connection = mysql.createConnection({
  	host     : 'v12018035925062710.yourpserver.net',
  	user     : 'db_schulprj_user',
  	password : '20fj%iQ7',
  	database : 'DB_SchulPrj'
});

connection.connect(function(err) {
  	if (err) {
    	console.error('error connecting to db: ' + err.stack);
    	return;
  	}

  	console.log('connected to db as id ' + connection.threadId);
});
//Database



client.once('ready', () => {
	client.user.setPresence({ game: { name: prefix+'help' }, status: 'online' });

	console.log('Ready!');
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	if (message.content.toLowerCase().startsWith(`${prefix}ping`)) {
		message.channel.send('Pong!');
		return;
	} else if (message.content.toLowerCase().startsWith(`${prefix}list`)) {
		listUsers(message, connection);
		return;
	} else if (message.content.toLowerCase().startsWith(`${prefix}help`)) {
		help(message, connection);
		return;
	} else {
		message.channel.send('You need to enter a valid command!')
	}
});

function help(message, connection) {
	var embed = new Discord.MessageEmbed()
		.setColor('#00c600')
		.setTitle('Help')
		.setAuthor('Eligored', client.user.avatarURL)
		.setDescription('Some description here')
		.addFields(
			{ name: `Help`, value: 'List of all bot commands' },
			{ name: '\u200B', value: '\u200B' },
			{ name: `${prefix}help`, value: 'List all commands', inline: true },
			{ name: `${prefix}list`, value: 'List all registered users', inline: true },
		)
		.setTimestamp()
		.setFooter(`${client.users.get(message.author.id).username}`, message.author.displayAvatarURL);

	message.channel.send(embed);
}

function listUsers(message, connection) {
	var string = "Userlist: ";

	connection.query('SELECT * FROM `Favo_Eligored_users`', function (error, results, fields) {
		results.forEach(user => {
			string += "\n"+user.name+" - "+user.email;
		});
		message.channel.send(string);
	});
}

client.login(token);
