# nodeDnsRetryForwarder

Simple DNS server to retry/forwarder only on fails.

# start

1) **npm install**
2) fill config.properties

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

3) **node server.js**

4) console log

![alt text](https://github.com/evertonbtm/nodeDnsRetryForwarder/blob/master/images/sample-console.png?raw=true)
