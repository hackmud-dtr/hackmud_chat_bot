var proc=require('process');
var discord=require('discord.js');
var request=require('request');

var ready=false;

var config=readConfig();

var bot = new discord.Client({
	messageCacheMaxSize:   1,
	messageCacheLifetime: 30,
	messageSweepInterval: 60,
	disabledEvents:       ["TYPING_START","MESSAGE_UPDATE","MESSAGE_DELETE"]
});

bot.once('ready',onReady);
bot.on('message',onMessage);
proc.once('SIGINT',cleanup);
bot.login(config.user.bot_token);
//-----------------------------------------------------------------------------------

function onReady() {
	ready=true;
	bot.user.setStatus("online");
	bot.user.setActivity("Port Epoch Bridge",{type:"PLAYING"});
	console.log("Bot online!");
}
function cleanup() {
	if(ready)
		bot.user.setStatus("invisible").then(_=>proc.exit(0))
	else
		proc.exit(0)
}

function onMessage(msg) {
	if(msg.channel.guild.id!=config.system.server_id)return;
	if(msg.channel.id!=config.user.channel_id)return;
	if(msg.author.id!=config.system.risk_id)return;
	
	var decoded;
	try {
		decoded=JSON.parse(msg.cleanContent)
	}
	catch(e) {
		return;
	}
	
	var user=config.user.default_user;
	
	// handle !user! user select
	var prefix=decoded.message.match(/^!([a-z_][a-z0-9_]{0,24})!/);
	if(prefix) {
		user=prefix[1];
		decoded.message=decoded.message.substring(prefix[1].length+2).trimLeft();
	}
	
	decoded.message=decoded.message.replace(/<(:[^:]+:)[0-9]+>/g,'$1'); // clean up discord emoji
	
	if(config.user.color_map[user])
		decoded.message=colorize(decoded.message,config.user.color_map[user]);
	
	apiSend(decoded.channel, user, decoded.message)
		.then(_=>msg.react('\uD83C\uDD97'))
		.catch(_=>msg.react('\uD83D\uDED1')) // You might want to add logic for rate limit, etc
}






function colorize(s,c) {
	if(!c)return s
	return assemble_text(parse_colors(' '+s+' ',c))
}
function parse_colors(s,color) {
	var dat=[];
	var l=s.split("\n");
	for(var j=0;j<l.length;++j) {
		var s=l[j];
		for(var i=0;i<s.length;) {
			var ss=s.substring(i);
			if(s[i]=='`') {
				var reg=new RegExp("^`([^`]+)`");
				var x=ss.match(reg);
				if(x) {
					dat.push({
							 start:'`'+x[1][0],
							 end:'`',
							 str:x[1].substring(1)
							 })
					i+=x[0].length;
					continue;
				}
			}

			var z=ss.search(/`/,1);
			if(z==-1)z=ss.length;
			if(z==0)z=1;
			var str=ss.substring(0,z);
			dat.push({
					 start:color?'`'+color:"",
					 end:color?'`':"",
					 str:str
					 });
			i+=str.length;
		}
		if(j!=l.length-1) {
			dat.push({
					 start:"",
					 end:"",
					 str:"\n"
					 });
		}

	}

	return dat
}


function assemble_text(s) {
	var ret="";
	for(var i=0;i<s.length;++i)
		if(s[i].str.length)
			ret+=s[i].start+s[i].str+s[i].end;
	return ret;
}

function apiSend(channel,username,msg) {
	return new Promise( (resolve,reject) => {
		request(
			{
				method: 'POST',
				uri: 'https://www.hackmud.com/mobile/create_chat.json',
				json: {
					chat_token: config.user.api_token,
					username,
					channel,
					msg
				},
				rejectUnauthorized: false,
				timeout: 600000
			},
			(error,response,body) => {
				if(!error && response.statusCode == 200)
					resolve(body)
				else {
					reject({error:error,statusCode:response?response.statusCode:null,body:body})
				}
			}
		)
	})
}


function readConfig() {
	/* No reason to not do this synchronously, we need it before anything else can work */
	var config;
	try {
		config=require('fs').readFileSync('./config.json');
	}
	catch(e) {
		console.error("No config.json file found. Please copy config.example.json to config.json and edit appropriately");
		proc.exit(1);
	}
	try {
		config=JSON.parse(config+'')
	}
	catch(e) {
		console.error("Your config.json file is malformed.");
		proc.exit(1);
	}
	return config;
}
