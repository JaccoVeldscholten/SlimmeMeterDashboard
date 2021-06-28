const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Measurement = require('./models/measurement');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Get all user info
app.get('/measurements/all', async (req, res) => {
  console.log('TRYING TO FETCH MEASUREMENTS');
  try {
    const measurement = await Measurement.find();
    res.status(200).json({
      measurements: measurement.map((measurement) => ({
        id: measurement.id,
        meterName: measurement.meterName,
        electricConsumptionLow: measurement.electricConsumptionLow,
        electricConsumptionHigh: measurement.electricConsumptionHigh,
        electricYieldLow:measurement.electricYieldLow,
        electricYieldHigh : measurement.electricYieldHigh,
        lowHighTariff : measurement.lowHighTariff,
        electricConsumptionCurrent : measurement.electricConsumptionCurrent,
        electricyYieldCurrent : measurement.electricyYieldCurrent,
        gasConsumption : measurement.gasConsumption,
        logTimeStamp: measurement.logTimeStamp
      })),
    });
    console.log('FETCHED MEASUREMENTS');
  } catch (err) {
    console.error('ERROR FETCHING MEASUREMENT');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting current energy usage
app.get('/measurements/electric/current', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC CURRENT CONSUMPTION');
  try {
    const measurement = await Measurement.find().sort({logTimeStamp: -1}).select('electricConsumptionCurrent logTimeStamp').limit(1);
    res.status(200).json(measurement[0].electricConsumptionCurrent);
    console.log('FETCHED ELECTRIC CURRENT CONSUMPTION');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT CONSUMPTION');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Low & High Consumption
app.get('/measurements/electric/lowhigh', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC LOW HIGH');
  try {
    const measurement = await Measurement.find().sort({logTimeStamp: -1}).select('electricConsumptionLow electricConsumptionHigh logTimeStamp').limit(1);
    res.status(200).json(measurement);
    console.log('FETCHED ELECTRIC CURRENT LOW HIGH');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT LOW HIGH');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Low & High Yield
app.get('/measurements/electric/yield', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC YIELD LOW HIGH');
  try {
    const measurement = await Measurement.find().sort({logTimeStamp: -1}).select('electricYieldLow electricYieldHigh logTimeStamp').limit(1);
    res.status(200).json(measurement);
    console.log('FETCHED ELECTRIC CURRENT YIELD LOW HIGH');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT YIELD LOW HIGH');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Gas Usage for today
app.get('/measurements/gas', async (req, res) => {
  console.log('TRYING TO FETCH GAS CONSUMPTION');
  try {
    const measurement = await Measurement.find().sort({logTimeStamp: -1}).select('gasConsumption logTimeStamp').limit(1);
    res.status(200).json(measurement);
    console.log('FETCHED GAS CONSUMPTION');
  } catch (err) {
    console.error('ERROR FETCHING GAS CONSUMPTION');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Delete by specified ID
app.delete('/measurements/:id', async (req, res) => {
  console.log('TRYING TO DELETE MEASUREMENT');
  try {
    await Measurement.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted measurement!' });
    console.log('DELETED MEASUREMENT');
  } catch (err) {
    console.error('ERROR FETCHING MEASUREMENT');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete measurement.' });
  }
});

app.post('/measurements', async (req, res) => {
  console.log('TRYING TO STORE MEASUREMENT');
  const meterName = req.body.meter_name;
  const electricConsumptionLow = req.body.electric_consumption_low;
  const electricConsumptionHigh = req.body.electric_consumption_high;
  const electricYieldLow = req.body.electric_yield_low;
  const electricYieldHigh = req.body.electric_yield_high;
  const lowHighTariff = req.body.tariff;
  const electricConsumptionCurrent = req.body.electric_consumption_current;
  const electricyYieldCurrent = req.body.electric_yield_current;
  const gasConsumption = req.body.gas_consumption;

  if (!meterName || meterName.trim().length === 0) {
    console.log('INVALID INPUT - NO METER DEFINED');
    console.log(req.body);
    return res.status(422).json({ message: 'ERROR NO METER IN JSON.' });
  }

  const measurement = new Measurement({
    meterName: meterName,
    electricConsumptionLow: electricConsumptionLow,
    electricConsumptionHigh: electricConsumptionHigh,
    electricYieldLow: electricYieldLow,
    electricYieldHigh: electricYieldHigh,
    lowHighTariff: lowHighTariff,
    electricConsumptionCurrent: electricConsumptionCurrent,
    electricyYieldCurrent: electricyYieldCurrent,
    gasConsumption: gasConsumption,
    logTimeStamp: Date.now()
  });

  try {
    await measurement.save();
    res
      .status(201)
      .json({ message: 'Measurement saved + ', measurementSummary: { id: measurement.id, meterName: meterName , time: measurement.logTimeStamp } });
    console.log('STORED NEW MEASUREMENT');
  } catch (err) {
    console.error('ERROR FETCHING MEASUREMENT');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save measurement.' });
  }
});

mongoose.connect(
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/slimmemeter?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB!!');
      app.listen(80);
    }
  }
);
