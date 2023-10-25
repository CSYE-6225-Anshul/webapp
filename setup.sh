#!/bin/bash

echo "================================================================="
echo "Updating packages"
echo "================================================================="
sudo apt-get update -y
sudo apt-get install zip unzip -y

echo "================================================================="
echo "Adding user and group"
echo "================================================================="
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

# echo "================================================================="
# echo "Installing and Setting up mysql"
# echo "================================================================="
# sudo apt-get install mariadb-server -y
# sudo mysql -uroot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'anshul';FLUSH PRIVILEGES;CREATE DATABASE cloud_local;"

echo "================================================================="
echo "Install Node and npm"
echo "================================================================="
sudo apt-get install nodejs -y
sudo apt-get install -y npm

echo "================================================================="
echo "Installing application dependenciess"
echo "================================================================="
# mkdir /opt/csye6225/webapp

sudo unzip /tmp/webapp.zip -d /opt/csye6225/
(cd /opt/csye6225/ && sudo npm ci)
sudo chown -R csye6225:csye6225 /opt/csye6225/

echo "================================================================="
echo "Starting systemd service"
echo "================================================================="
# Move systemd service unit file to the correct location
sudo mv /opt/csye6225/cloud.service /etc/systemd/system/cloud.service

# Enable and start the systemd service
sudo systemctl daemon-reload
sudo systemctl enable cloud.service
sudo systemctl start cloud.service

echo "=======================ALL DONE==================================="
