#!/bin/bash

echo "================================================================="
echo "Updating packages"
echo "================================================================="
sudo apt-get update -y
sudo apt-get install zip unzip -y

echo "================================================================="
echo "Installing and Setting up mysql"
echo "================================================================="
sudo apt-get install mariadb-server -y
sudo mysql -uroot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'anshul';FLUSH PRIVILEGES;CREATE DATABASE cloud_local;"

echo "================================================================="
echo "Install Node and npm"
echo "================================================================="
sudo apt-get install nodejs -y
sudo apt-get install -y npm


echo "================================================================="
echo "Installing application dependenciess"
echo "================================================================="
mkdir ~/webapp
unzip /tmp/webapp.zip -d ~/webapp/
(cd ~/webapp && npm ci)


echo "=======================ALL DONE==================================="
