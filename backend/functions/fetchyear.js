const Measurement = require("../models/measurement.js");

/*!
const howManyDaysFromBegin() Retreives amount of days past this year
*/
function howManyDaysFromBegin() {
  const today = new Date();
  const beginOfYear = new Date(today.getFullYear(), 0, 1);
  const epoch = 1000 * 60 * 60 * 24; // One Day (epoch)
  const diff = Math.round((today.getTime() - beginOfYear.getTime()) / epoch);
  //console.log("Today: " + today);
  //console.log("beginOfYear: " + beginOfYear);
  //console.log("Diffrence: " + diff);
  return diff;
}

/*!
const getMeasurementsFromCurrentYear() Retreives 7 days of data and returns it in JSON	
*/

const getMeasurementsFromCurrentYear = async () => {
  const aboutAWeekAgoWeekAgo = new Date();
  aboutAWeekAgoWeekAgo.setDate(
    aboutAWeekAgoWeekAgo.getDate() - howManyDaysFromBegin()
  );
  const measurements = await Measurement.find({
    logTimeStamp: { $gte: aboutAWeekAgoWeekAgo },
  }).sort({ logTimeStamp: -1 });
  //console.log(measurements);
  const filteredMeasurements = [];

  for (let i = 0; i < howManyDaysFromBegin(); i++) {
    const daysAgo = new Date();
    //console.log(i);
    daysAgo.setHours(0, 0, 0, 0);
    daysAgo.setDate(daysAgo.getDate() - i);
    const daysAgoPlus1 = new Date();
    daysAgoPlus1.setHours(0, 0, 0, 0);
    daysAgoPlus1.setDate(daysAgoPlus1.getDate() - i + 1);
    //console.log(daysAgoPlus1)

    const todaysMeasurements = measurements.filter((measurement) => {
      if (i === 0) {
        return (
          measurement.logTimeStamp.getTime() +
            measurement.logTimeStamp.getTimezoneOffset() * 60 * 1000 >
          daysAgo.getTime()
        );
      }
      return (
        measurement.logTimeStamp.getTime() +
          measurement.logTimeStamp.getTimezoneOffset() * 60 * 1000 >
          daysAgo.getTime() &&
        measurement.logTimeStamp.getTime() +
          measurement.logTimeStamp.getTimezoneOffset() * 60 * 1000 <=
          daysAgoPlus1.getTime()
      );
    });

    console.log("Amount docs irritration: " + todaysMeasurements.length);

    if (todaysMeasurements.length == 0) {
      // Temp Memory Leak fix.
      // When reached 0 docs (because to less data) the function will be aborted
      return filteredMeasurements;
    }

    const firstAndLastMeasurement = [];

    let firstRecord = {};
    let secondRecord = {};

    if (todaysMeasurements.length > 1) {
      Object.assign(firstRecord, todaysMeasurements[0]._doc);
      Object.assign(
        secondRecord,
        todaysMeasurements[todaysMeasurements.length - 1]._doc
      );
      firstRecord.logTimeStamp =
        firstRecord.logTimeStamp.getTime() +
        firstRecord.logTimeStamp.getTimezoneOffset() * 60 * 1000;
      secondRecord.logTimeStamp =
        secondRecord.logTimeStamp.getTime() +
        secondRecord.logTimeStamp.getTimezoneOffset() * 60 * 1000;
      //console.log(firstRecord.logTimeStamp.toString())
      //console.log(secondRecord.logTimeStamp.toString())
    }

    if (todaysMeasurements.length > 1) {
      firstAndLastMeasurement.push(firstRecord);
      firstAndLastMeasurement.push(secondRecord);
      filteredMeasurements.push(firstAndLastMeasurement);
    }
  }

  return filteredMeasurements;
};

/*!
prepareDataForFront() Datastream builder for 7Days
*/

const prepareDataForFront = async (data) => {
  const fetchedDates = [];
  const preparedMeasurements = [];

  const dates = await data;

  dates.map(async (date) => {
    fetchedDates.push(date);
  });

  fetchedDates.map((today) => {
    // today[0] is latest, today[1] is earliest
    if (today[0] && today[1]) {
      const todayData = {
        electricityConsumed:
          today[0].electricConsumptionLow +
          today[0].electricConsumptionHigh -
          (today[1].electricConsumptionLow + today[1].electricConsumptionHigh),
        electricityProduced:
          today[0].electricYieldLow +
          today[0].electricYieldHigh -
          (today[1].electricYieldLow + today[1].electricYieldHigh),
        gasConsumed: today[0].gasConsumption - today[1].gasConsumption,
        meterName: today[0].meterName,
        logTimeStamp: today[1].logTimeStamp,
      };

      preparedMeasurements.push(todayData);
    }
  });

  return preparedMeasurements;
};

module.exports = {
  getMeasurementsFromCurrentYear,
};
