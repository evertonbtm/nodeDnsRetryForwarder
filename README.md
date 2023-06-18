nodeDnsRetryForwarder
Simple DNS server to retry/forwarder

start
npm install

fill config.properties

 	################################################
 	listenPort=		53  # **normally**
 	dnsSeverIP= 	**#YOUR DNS SERVER ON NETWORK**
 	dnsSeverPort=	**#YOUR DNS PORT ON NETWORK**
 	redirectToIP=	**#only 2  supported EX: [8.8.8.8,8.8.8.4.4]**
 	redirectToPort= **#only  2 supported  EX: [53,54]**
 	customForward=   # EX: google.com,twitter.com  **optionally**
 	customRedirectToIP=  #EX: 10.0.0.1 **optionally**

 	ttlTime=60  **# default**
 	requestTimeout=4000  **# default**
 	################################################
node server.js

console log
