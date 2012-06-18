#!/bin/bash

echo "####################################################"
echo "#########Cleaning up directories and files!#########"
echo "####################################################"
rm -rf ca certs keys
rm client.p12

echo "#######################################"
echo "#########Generating key for CA#########"
echo "#######################################"
openssl genrsa -des3 -out ca.key 2048
openssl req -new -x509 -days 365 -key ca.key -out ca.crt
openssl x509 -in ca.crt -text -noout

echo "#############################################"
echo "#########Generating HTTPS SERVER key#########"
echo "#############################################"
openssl genrsa -out server.key 1024
openssl req -new -key server.key -out server.csr
openssl x509 -req -in server.csr -out server.crt -CA ca.crt -CAkey ca.key -CAcreateserial -days 365
openssl x509 -in server.crt -text -noout

echo "#############################################"
echo "#########Generating HTTPS CLIENT key#########"
echo "#############################################"
openssl genrsa -out userA.key 1024
openssl req -new -key userA.key -out userA.csr
openssl x509 -req -in userA.csr -out userA.crt -CA ca.crt -CAkey ca.key -CAcreateserial -days 365
openssl x509 -in userA.crt -text -noout

echo "##############################################"
echo "#########Creating directory structure#########"
echo "##############################################"
mkdir keys certs ca

echo "###########################################################"
echo "#########Moving certificates in proper directories#########"
echo "###########################################################"
rm *.csr
mv ca.* ca/
mv *.key keys/
mv *.crt certs/

echo "###################################################"
echo "#########Generating PKCS12 key for browser#########"
echo "###################################################"
openssl pkcs12 -export -in certs/userA.crt -inkey keys/userA.key -name "User A BusyWait test cert" -out userA.p12
open userA.p12



