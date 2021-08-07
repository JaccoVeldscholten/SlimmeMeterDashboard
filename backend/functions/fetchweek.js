const Measurement = require("../models/measurement.js");

/*!
getMeasurementsFromLastWeek() Retreives 7 days of data and returns it in JSON	
*/

const getMeasurementsFromLastWeek = async () => {
  const aboutAWeekAgoWeekAgo = new Date();
  aboutAWeekAgoWeekAgo.setDate(aboutAWeekAgoWeekAgo.getDate() - 7);
  const measurements = await Measurement.find({
    logTimeStamp: { $gte: aboutAWeekAgoWeekAgo },
  }).sort({ logTimeStamp: -1 });

  const filteredMeasurements = [];

  for (let i = 0; i < 7; i++) {
    const daysAgo = new Date();
    daysAgo.setHours(0, 0, 0, 0);
    daysAgo.setDate(daysAgo.getDate() - i);
    const daysAgoPlus1 = new Date();
    daysAgoPlus1.setHours(0, 0, 0, 0);
    daysAgoPlus1.setDate(daysAgoPlus1.getDate() - i + 1);

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
      console.log(firstRecord.logTimeStamp.toString());
      console.log(secondRecord.logTimeStamp.toString());
    }

    if (todaysMeasurements.length > 1) {
      firstAndLastMeasurement.push(firstRecord);
      firstAndLastMeasurement.push(secondRecord);
      filteredMeasurements.push(firstAndLastMeasurement);
    }
  }

  return filteredMeasurements;
};

module.exports = {
  getMeasurementsFromLastWeek,
};
