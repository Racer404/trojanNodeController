# trojanNodeController
A tool to auto-update trojan config, control trojan service remotely, coding with Node.js

To install this controller, you need to 
1. install Trojan https://github.com/trojan-gfw/trojan, and make sure the configure of Trojan named with "server.json"
2. create a service to bind Trojan (Template file "trojan.service", you need to edit the ExecStart line), make sure file name is trojan.service and put it in to/lib/systemd/system/, test the service with "systemctl start trojan" and "service trojan start".
3. download the nodeServer.js to the same folder with Trojan, then create a json file "userJson.json".

To use this controller, you need to
1. start trojan service with "service trojan start"
2. start nodeServer.js with "node nodeServer.js"

ADD USER:
To add user with http-request, enter "http://yourtrojanserveripordomain:3000/addUser?password=123&duration=30" on explorer or with requests
Pathname = addUser
params = password(englishornumber), duration(number, days of lease, password will automatically expired when lease ends)
