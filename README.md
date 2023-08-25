
## Raspberry Pi Distance Measurement with HC-SR04 sensor

Simple project that utilizes a Raspberry Pi to measure distances using an ultrasonic sensor (HC-SR04) and control LEDs based on the measured distance. It also provides a web interface to interact with the sensor readings and manage LED states.

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Endpoints](#endpoints)
* [Demo](#demo)

## Features
* Measures distances using an ultrasonic sensor (HC-SR04).
* Controls three LEDs (Red, Green, Yellow) based on distance thresholds.
* Provides a web interface to view real-time distance data and LED states.
* Saves distance and LED state data to a database.
* Fetches historical data from the database.
* Supports data deletion from the database.

## Prerequisites
* Raspberry Pi with GPIO pins enabled.
* Node.js and npm installed on the Raspberry Pi.
* Access to a SQL Server for data storage (connection string required).


## Installation
Clone the repository: 
        
    git clone https://github.com/victor-code19/IoT-app.git

The pigpio C library is a prerequisite for the pigpio Node.js module used in this project. If the pigpio C library is not installed or if the installed version is too old, the latest version can be installed with the following commands:
    
    sudo apt-get update
    sudo apt-get install pigpio

Navigate to the project directory and install the dependencies: 

    npm install


## Usage

Add the SQL Server connection string in the index.js file.

Run the server:

    node app.js

Access the web interface by navigating to http://localhost:3000/ in your browser.

## Endpoints

* /getDataFromSensor: Fetches real-time distance and LED states from the Raspberry Pi.
* /saveDataToDb: Saves distance and LED state data to the connected database.
* /getDataFromDb: Fetches historical data from the database.
* /deleteDataFromDb: Deletes all data from the database.

## Demo 

    https://www.youtube.com/watch?v=o8vkBtTGQjQ&ab_channel=purge


