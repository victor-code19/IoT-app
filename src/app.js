const express = require('express');
const path = require('path');
const hbs = require('hbs');
const Gpio = require('pigpio').Gpio;
const sql = require('mssql');
const connectionString = '';

// RASPBERRY PI CODE

const MICROSECONDS_PER_CM = 1e6 / 34321;

const trigger = new Gpio(23, { mode: Gpio.OUTPUT });
const echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });
const RED_LED = new Gpio(4, { mode: Gpio.OUTPUT });
const GREEN_LED = new Gpio(5, { mode: Gpio.OUTPUT });
const YELLOW_LED = new Gpio(6, { mode: Gpio.OUTPUT });

trigger.digitalWrite(0);

let distInCm = 0;
let redLedState = '';
let greenLedState = '';

const watchHCSR04 = () => {
  let startTick;

  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0);
      distInCm = diff / 2 / MICROSECONDS_PER_CM;

      console.log(`${Math.round(distInCm * 10) / 10} cm.`);

      if (distInCm <= 7) {
        RED_LED.digitalWrite(1);
        GREEN_LED.digitalWrite(0);
      } else {
        RED_LED.digitalWrite(0);
        GREEN_LED.digitalWrite(1);
      }
    }
  });
};

watchHCSR04();

setInterval(() => {
  trigger.trigger(10, 1);
}, 1000);

const blinkYellowLED = () => {
  if (YELLOW_LED.digitalRead() === 0) {
    YELLOW_LED.digitalWrite(1);
  } else {
    YELLOW_LED.digitalWrite(0);
  }
};

const endBlink = () => {
  clearInterval(blinkInterval);
  YELLOW_LED.digitalWrite(0);
};

// SERVER CODE

const app = express();

const publicFileDirectory = path.join(__dirname, '/../public');
const viewsPath = path.join(__dirname, '../templates/views');

app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.use(express.static(publicFileDirectory));
app.use(express.json());

app.get('', (req, res) => {
  res.render('index');
});

app.get('/getDataFromSensor', (req, res) => {
  if (RED_LED.digitalRead() === 1 && GREEN_LED.digitalRead() === 0) {
    redLedState = 'on';
    greenLedState = 'off';
  } else {
    redLedState = 'off';
    greenLedState = 'on';
  }
  res.send({
    distance: Math.round(distInCm * 10) / 10,
    redLedState,
    greenLedState,
  });
});

app.post('/saveDataToDb', async (req, res) => {
  const { distance, redLedState, greenLedState } = req.body;
  try {
    await sql.connect(connectionString);
    await sql.query(
      `INSERT INTO RpiData (Distance, RedLEDState, GreenLEDState) VALUES (${distance}, '${redLedState}', '${greenLedState}')`
    );
    setInterval(blinkYellowLED, 200);
    setTimeout(endBlink, 2000);
  } catch (err) {
    console.log(err);
  }
});

app.get('/getDataFromDb', async (req, res) => {
  try {
    await sql.connect(connectionString);
    const result = await sql.query(
      'SELECT Distance, RedLEDState, GreenLEDState, CreatedAt FROM RpiData'
    );
    res.send(result.recordset);
  } catch (err) {
    console.log('Unable to fetch data');
  }
});

app.delete('/deleteDataFromDb', async (req, res) => {
  try {
    await sql.connect(connectionString);
    await sql.query('DELETE FROM RpiData');
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log('Server is up and running on port 3000...');
});
