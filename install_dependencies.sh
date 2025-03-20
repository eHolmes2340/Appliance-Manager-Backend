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
echo "Node version" 
echo "All dependencies are installed successfully"

