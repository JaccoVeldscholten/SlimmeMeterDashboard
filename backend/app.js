const fs = require('fs');
const path = require('path');
const cors = require('cors')

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Measurement = require('./models/measurement');

// Import functions that are required for fetching specified data
const prepareData = require('./functions/preparedata.js')
const fetchsevendays = require('./functions/fetch7days.js')
const fetchmonth = require('./functions/fetchmonth.js')
const fetchyear = require('./functions/fetchyear.js')

const app = express();

app.use(cors())
app.set('port', process.env.PORT || 3010);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// All docs from past 7 days
app.get('/measurements/7days', async (req, res) => {
  console.log('TRYING TO FETCH 7 DAYS OF MEASUREMENTS');
  const measurements = await prepareData.prepare(fetchsevendays.getMeasurementsFromLast7Days());
  res.send(measurements);
});

// All docs from past moth
app.get('/measurements/month', async (req, res) => {
  console.log('TRYING TO FETCH MONTH OF MEASUREMENTS');
  const measurements = await prepareData.prepare(fetchmonth.getMeasurementsFromLastMonth());
  res.send(measurements);
});

// All docs from past year
app.get('/measurements/year', async (req, res) => {
  console.log('TRYING TO FETCH MONTH OF MEASUREMENTS');
  const measurements = await prepareData.prepare(fetchyear.getMeasurementsFromCurrentYear());
  res.send(measurements);
});


// All docs limited by 100
app.get('/measurements/all', async (req, res) => {
  console.log('TRYING TO FETCH LATEST MEASUREMENTS LIMITED BY 100');

  try {
    const measurement = await Measurement.find().limit(100).sort({logTimeStamp : -1});
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
    const measurement = await Measurement.find().sort({ logTimeStamp: -1 }).select('electricConsumptionCurrent logTimeStamp').limit(1);
    res.status(200).json(measurement[0].electricConsumptionCurrent);
    console.log('FETCHED ELECTRIC CURRENT CONSUMPTION');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT CONSUMPTION');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting current energy usage
app.get('/measurements/electric/currentyield', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC CURRENT YIELD');
  try {
    const measurement = await Measurement.find().sort({ logTimeStamp: -1 }).select('electricyYieldCurrent logTimeStamp').limit(1);
    res.status(200).json(measurement[0].electricyYieldCurrent);
    console.log('FETCHED ELECTRIC CURRENT YIELD');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT YIELD');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});


/***********************************************************************************/
/*                          Single Value API Requests                              */
/*                  Useable for data information (ex; current data)                */
/***********************************************************************************/

// Getting Low & High Consumption of the past 24 Hours
app.get('/measurements/electric/lowhigh/consumption', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC LOW HIGH');
  try {
    const measurement = await Measurement
      .find(
        {
          "logTimeStamp":
          {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      )
      .select("electricConsumptionLow electricConsumptionHigh")

    totalpast = (measurement[0].electricConsumptionLow +
      measurement[0].electricConsumptionHigh);

    totalnew = (measurement[measurement.length - 1].electricConsumptionLow +
      measurement[measurement.length - 1].electricConsumptionHigh);

    total = parseInt(totalnew) - parseInt(totalpast);

    // Debug
    console.log("24 Hour ago Low: " + measurement[0].electricConsumptionLow);
    console.log("24 Hour ago Low: " + measurement[0].electricConsumptionHigh);
    console.log("Current Low: " + measurement[measurement.length - 1].electricConsumptionLow);
    console.log("Current High: " + measurement[measurement.length - 1].electricConsumptionHigh);
    console.log("Total Past: " + totalpast);
    console.log("Total new: " + totalnew);
    console.log("Total usage of the past 24 Hours: " + Math.round(total) + " kWh");

    res.status(200).json(Math.round(total));
    console.log('FETCHED ELECTRIC CURRENT LOW HIGH');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT LOW HIGH');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Low & High Yield Consumption of the past 24 Hours
app.get('/measurements/electric/lowhigh/yield', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC YIELD LOW HIGH');
  try {
    const measurement = await Measurement
      .find(
        {
          "logTimeStamp":
          {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      )
      .select("electricYieldLow electricYieldHigh")

    totalpast = (measurement[0].electricYieldLow +
      measurement[0].electricYieldHigh);

    totalnew = (measurement[measurement.length - 1].electricYieldLow +
      measurement[measurement.length - 1].electricYieldHigh);

    total = parseInt(totalnew) - parseInt(totalpast);

    // Debug
    console.log("24 Hour ago Yield Low: " + measurement[0].electricYieldLow);
    console.log("24 Hour ago Yield Low: " + measurement[0].electricYieldHigh);
    console.log("Current Yield Low: " + measurement[measurement.length - 1].electricYieldLow);
    console.log("Current Yield High: " + measurement[measurement.length - 1].electricYieldHigh);
    console.log("Total Yield Past: " + totalpast);
    console.log("Total Yield new: " + totalnew);
    console.log("Total Yield of the past 24 Hours: " + Math.round(total) + " kWh");

    res.status(200).json(Math.round(total));
    console.log('FETCHED ELECTRIC YIELD LOW HIGH');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC YIELD LOW HIGH');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Gas Consumption past 24 hours
app.get('/measurements/gas', async (req, res) => {
  console.log('TRYING TO FETCH GAS USAGE PAST 24 HOURS');
  try {
    const measurement = await Measurement
      .find(
        {
          "logTimeStamp":
          {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      )
      .select("gasConsumption")

    totalpast = (measurement[0].gasConsumption);

    totalnew = (measurement[measurement.length - 1].gasConsumption);

    total = parseInt(totalnew) - parseInt(totalpast);

    // Debug
    console.log("24 Hour ago Gas : " + measurement[0].gasConsumption);
    console.log("Current Gas : " + measurement[measurement.length - 1].gasConsumption);
    console.log("Total Gas of the past 24 Hours: " + Math.round(total) + " m3");

    res.status(200).json(Math.round(total));
    console.log('FETCHED GAS');
  } catch (err) {
    console.error('ERROR FETCHING GAS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

/***********************************************************************************/
/*                          Multi Value API Requests                               */
/*                  Useable for data information (ex; current tables)              */
/***********************************************************************************/

// Getting Low & High Consumption of the past 24 Hours All documents
app.get('/measurements/electric/all/consumption', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC LOW HIGH');
  try {
    const measurement = await Measurement
      .find(
        {
          "logTimeStamp":
          {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      )
      .select("electricConsumptionLow electricConsumptionHigh logTimeStamp")

    res.status(200).json(measurement);
    console.log('FETCHED ELECTRIC CURRENT');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC CURRENT');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Low & High Yield Consumption of the past 24 Hours All documents
app.get('/measurements/electric/all/yield', async (req, res) => {
  console.log('TRYING TO FETCH ELECTRIC YIELD ');
  try {
    const measurement = await Measurement
      .find(
        {
          "logTimeStamp":
          {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      )
      .select("electricYieldLow electricYieldHigh logTimeStamp")


    res.status(200).json(measurement);
    console.log('FETCHED ELECTRIC YIELD ');
  } catch (err) {
    console.error('ERROR FETCHING ELECTRIC YIELD');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

// Getting Gas Consumption past 24 hours All documents
app.get('/measurements/gas/all', async (req, res) => {
  console.log('TRYING TO FETCH GAS USAGE PAST 24 HOURS');
  try {
    const measurement = await Measurement
      .find(
        {
          "logTimeStamp":
          {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      )
      .select("gasConsumption logTimeStamp")


    res.status(200).json(measurement);
    console.log('FETCHED GAS');
  } catch (err) {
    console.error('ERROR FETCHING GAS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load measurment.' });
  }
});

/***********************************************************************************/
/*                          Editing Value API Requests                             */
/*                   For editing ID specified elements of database                 */
/***********************************************************************************/

// Getting Last update Time
app.get('/measurements/time', async (req, res) => {
  console.log('TRYING TO FETCH UPDATE TIME');
  try {
    const logTimeStamp = await Measurement.find().sort({ logTimeStamp: -1 }).select('logTimeStamp').limit(1);
    res.status(200).json(logTimeStamp);
    console.log('FETCHED UPDATE TIME');
  } catch (err) {
    console.error('ERROR FETCHING UPDATE TIME');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load time.' });
  }
});


// Getting Last update Time
app.get('/', async (req, res) => {
  console.log('USER REQUESTED API BASE');
  try {
    res.status(200).json("Hello Friend");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Hello Friend' });
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

// Create new Measuremente
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

  console.log(Date.now())

  try {
    await measurement.save();
    res
      .status(201)
      .json({ message: 'Measurement saved + ', measurementSummary: { id: measurement.id, meterName: meterName, time: measurement.logTimeStamp } });
    console.log('STORED NEW MEASUREMENT');
  } catch (err) {
    console.error('ERROR FETCHING MEASUREMENT');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save measurement.' });
  }
});

/***********************************************************************************/
/*                          Connection of MongoDB                                  */
/***********************************************************************************/
// Access to MongoDB
console.log(process.env.MONGODB_USERNAME);
mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@meter.et2j9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
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

app.listen(process.env.PORT || 3010, () => {
  console.log('Listening on given port')
})