#!/bin/bash

# File       : install_dependencies.sh
# Date       : Feb 4, 2025 
# Programmer : Erik Holmes 
# Description: This file is used to install all the dependencies required for the server program. 


#update package list
sudo apt-get update -y || sudo yum update -y


#install Node.js 
if command -v node > /dev/null; then
    echo "Node.js is already installed"
else
    echo "Node.js is not installed"
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs || sudo yum install -y nodejs
fi

#install python 
if command -v python3 > /dev/null; then
    echo "Python is already installed"
else
    echo "Python is not installed"
    sudo apt-get install -y python3 || sudo yum install -y python3-pip
fi


echo "Node version" 
node -v 
python3 --version

echo "All dependencies are installed successfully"

