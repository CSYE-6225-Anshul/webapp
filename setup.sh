#!/bin/bash

echo "================================================================="
echo "Updating packages"
echo "================================================================="
sudo apt-get update -y
sudo apt-get install zip unzip -y

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
mkdir ~/webapp
unzip /tmp/webapp.zip -d ~/webapp/
(cd ~/webapp && npm ci)

echo "================================================================="
echo "Starting systemd service"
echo "================================================================="
# Move systemd service unit file to the correct location
sudo mv /home/admin/webapp/cloud.service /etc/systemd/system/

# Enable and start the systemd service
sudo systemctl enable cloud
sudo systemctl start cloud

echo "=======================ALL DONE==================================="
