var named = require('mname');
const isPortReachable = require('is-port-reachable');
var dns = require('native-dns');
var util = require('util');
var propertiesReader = require('properties-reader');

const server = named.createServer();
var port;
var redirectToIP;
var redirectToPort;
var dnsSeverIP;
var dnsSeverPort;
var customForward;
var customRedirectToIP;

var ttlTime;
var requestTimeout;

function init(){
		let properties = propertiesReader('config.properties');
		port = properties.get('listenPort');
		dnsSeverIP = properties.get('dnsSeverIP');
		dnsSeverPort = properties.get('dnsSeverPort');
		redirectToIP = properties.get('redirectToIP').split(',');
		redirectToPort = properties.get('redirectToPort').split(',');
		customForward = properties.get('customForward').split(',');
		customRedirectToIP= properties.get('customRedirectToIP');
		
		ttlTime = properties.get('ttlTime');
		requestTimeout = properties.get('requestTimeout');
		
		if(!port){
			console.log('Please fill listenPort on config.properties');
			process.exit(1);
		}		
		if(!dnsSeverIP){
			console.log('Please fill dnsSeverIP on config.properties');
			process.exit(1);
		}
		if(!dnsSeverPort){
			console.log('Please fill dnsSeverPort on config.properties');
			process.exit(1);
		}
		if(!redirectToIP){
			console.log('Please fill redirectToIP on config.properties');
			process.exit(1);
		}
		if(!redirectToPort){
			console.log('Please fill redirectToPort on config.properties');
			process.exit(1);
		}

		if((customForward?.length > 1)&& !customRedirectToIP){
			console.log('Please fill customRedirectToIP on config.properties');
			process.exit(1);
		}
}

init();

// Listen on TCP
server.listenTcp({ 'port': port, 'address': '::' });

// Listen on UDP
server.listen(port, '::', function() {  
  console.log('DNS server started on TCP/UDP port ' + port);
});

server.on('query', function(query, done) {  
  var name = query.name(), ttl = (ttlTime ? ttlTime : 60);
  console.log('[DNS] %s IN %s ', query.name(), query.type());
  
	for(var i=0;i<customForward.length;i++){
	    if (query.type() === 'A' && name.toLowerCase().endsWith(customForward[i])) {
			query.addAnswer(name, new named.ARecord(customRedirectToIP), ttl);
			server.send(query);
		}
	}
  
  var question = dns.Question({
	  name: query.name(),
	  type: query.type(),
  });
  
  var req = dns.Request({
	question: question,
	server: { address: dnsSeverIP, port: dnsSeverPort, type: 'udp' },
	timeout: (requestTimeout ? requestTimeout : 4000)
  });


  var start = Date.now();

  isPortReachable(dnsSeverPort, {host: dnsSeverIP}).then(resultado => {
	    console.log('DNS testing ');
         if(!resultado){		
			if(redirectToIP[0] && redirectToPort[0]){	 
				req = dns.Request({
					  question: question,
					  server: { address: redirectToIP[0], port: redirectToPort[0], type: 'udp' },
					  timeout: (requestTimeout ? requestTimeout : 4000),
					});
			  }
			}
    }).catch(erro => {
			if(redirectToIP[1] && redirectToPort[1]){
			   req = dns.Request({
				  question: question,
				  server: { address: redirectToIP[1], port: redirectToPort[1], type: 'udp' },
				  timeout: (requestTimeout ? requestTimeout : 4000),
				});
			}
			console.error(erro);
    });
	
	req.send();
	
	req.on('timeout', function () {
	  console.log('Timeout on making request');
	});

	req.on('message', function (err, answer) {  
	  if(answer?.answer){		   
		  answer.answer.forEach(function (a) {			
			if(a.address != null){
				console.log('DNS response: ', a.address);
				query.addAnswer(name, new named.ARecord(a.address), ttl);
				server.send(query);
				return;
			}		
		 });
	  }
	});

	req.on('end', function () {
	  var delta = (Date.now()) - start;
	  console.log('Finished processing request: ' + delta.toString() + 'ms');
	});

});
