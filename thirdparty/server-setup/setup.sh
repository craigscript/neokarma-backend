#!/bin/bash

echo -e "# \033[33m NEOKARMA SETUP / DEPLOY SCRIPT RUNNING! \033[37m ";
echo -e "# \033[36m # Installing -\033[32m NGINX\033[37m ";

echo -e "# \033[31m DISABLING SELINUX\033[37m"
sudo setenforce 0

# Install NGINX
sudo yum -y install epel-release
sudo yum -y install nginx

# Add NGINX to boot
sudo systemctl enable nginx

# Print Network Details
echo -e "# \033[36m Server IP Address -\033[31m FIREWALL-CMD \033[37m ";

serverip=$(ip -f inet -o addr show eth0|cut -d\  -f 7 | cut -d/ -f 1)
echo -e "# \033[36m IP Addresses: \n----\033[37m\n\033[32m$serverip\n\033[36m---- \033[37m";

# Forward / Open Ports
echo -e "# \033[36m Ensuring firewall-cmd install / running \033[37m"
sudo yum install firewalld
sudo systemctl enable firewalld
sudo service firewalld restart

echo -e "# \033[36m Firewall-CMD (Allowing HTTP/HTTPS) \033[37m"
sudo firewall-cmd --permanent --zone=public --add-service=http 
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

# Restart NGINX
echo -e "# \033[36m Restarting NGINX \033[37m"
service nginx restart

# Deploy config files

echo -e "# \033[36m Deploying Configuration files NGINX \033[37m"

mkdir -p /etc/nginx/sites-enabled/
mkdir -p /etc/nginx/sites-avaiable/
mkdir -p /etc/nginx/certs/

# Copy NGINX configs
/bin/cp -rf ./configs/nginx.conf /etc/nginx/


echo -e "# \033[36m Creating Neokarma User \033[37m"

sudo adduser neokarma

# Include neokarma.apps in NGINX
/bin/cp -rf ./configs/neokarma.com /etc/nginx/sites-enabled/

mkdir -p /home/neokarma/nginx-apps/
/bin/cp -rf ./configs/api.neokarma.com /home/neokarma/nginx-apps/

echo -e "# \033[36m Done \033[37m"

echo -e "# \033[36m Installing Node.JS \033[37m"
sudo yum -y install node
sudo yum -y install npm
sudo yum -y install git
echo -e "# \033[36m NODE/NPM VERSION: \033[37m"
node --version
npm --version

npm install pm2