#!/bin/bash

INTRO="[REC2S Lease-Manager]"
NODE_VERSION='v0.6.0'
NPM_VERSION='1.0.105'
LM_IP='192.168.1.158'
LM_PORT='9000'
LMAPI_IP='192.168.1.158'
LM_API_PORT='8000'

NODE=`node -v`
NPM=`npm -v`

if [ $NODE = $NODE_VERSION ]  ; then
	echo "$INTRO Node $NODE_VERSION found!"	
else
	echo "$INTRO Node $NODE_VERSION not found! ... installing it"
	apt-get -y install make ssh gcc g++ curl libssl-dev apache2-utils openssl
	wget http://nodejs.org/dist/v0.6.0/node-v0.6.0.tar.gz
	tar -xf node-v0.6.0.tar.gz
	cd node-v0.6.0
	./configure
	make
	make install
	cd ..
fi

echo "$INTRO Checking for NPM"
apt-get -y install curl
curl http://npmjs.org/install.sh | sh

echo "$INTRO Installing dependencies"
npm install

echo "$INTRO Modifying parameters"
echo "exports.create=function(){return{'leaseManagerIp':'$LM_IP','leaseManagerPort':$LM_PORT,'leaseManagerApiIp':'$LMAPI_IP','leaseManagerApiPor':$LMAPI_PORT};};" > lease-constants.js

echo "$INTRO Done!"



