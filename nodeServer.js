var http=require('http');
var url=require('url');
var fs=require('fs');
var child_process=require('child_process');
var userJson;
var serverJson;

http.createServer(function(req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
	
	params=url.parse(req.url,true).query;
	path=url.parse(req.url,true).pathname;

	console.log(path+'');

	if(path=='/addUser'){
		currentDate=Math.trunc(Date.now()/86400000);
		userJsonString=fs.readFileSync('./userJson.json','utf-8');
		if(!userJsonString||userJsonString=='\n'){
			userJson=new Array();
			userJson[0]=new Object();
			userJson[0].expireDate=parseInt(params.duration)+parseInt(currentDate);
			userJson[0].password=params.password;
			console.log(userJson);
			fs.writeFileSync('./userJson.json',JSON.stringify(userJson));
			res.write('success');
			res.end();
		}
		else{
			userJson=JSON.parse(userJsonString);
			userJson[userJson.length]=new Object();
			userJson[userJson.length-1].expireDate=parseInt(params.duration)+parseInt(currentDate);
			userJson[userJson.length-1].password=params.password;
			console.log(userJson);
			fs.writeFileSync('./userJson.json',JSON.stringify(userJson));
			res.write('success');
			res.end();
		}
		trojanJsonString=fs.readFileSync('./server.json','utf-8');
		trojanJson=JSON.parse(trojanJsonString);
		trojanJson.password[trojanJson.password.length]=params.password;
		fs.writeFileSync('./server.json',JSON.stringify(trojanJson));
		child_process.execSync('service trojan restart');
	}

	else{
		res.write('WRONG PATHNAME');
		res.end();
	}
}).listen(3000);

updateUser();
setInterval(updateUser,3600000);
console.log('server is running');

function updateUser(){
	console.log("checkUpdate");
	currentDate=Math.trunc(Date.now()/86400000);
	usersString=fs.readFileSync('./userJson.json','utf-8');
	if(usersString!='\n'&&usersString){
		users=JSON.parse(usersString);
		for(i=0;i<users.length;i++){
			if(users[i].expireDate-currentDate<=0){
				trojanJson=JSON.parse(fs.readFileSync('./server.json','utf-8'));
				for(i2=0;i2<trojanJson.password.length;i2++){
					if(trojanJson.password[i2]==users[i].password){
						trojanJson.password.splice(i2,1);
						fs.writeFileSync('./server.json',JSON.stringify(trojanJson));
					}
				}
				console.log(users[i].password+" has been spliced");
				users.splice(i,1);
				i--;
				fs.writeFileSync('./userJson.json',JSON.stringify(users));
				child_process.execSync('service trojan restart');
			}
		}
	}
}
