const Measurement = require('../models/measurement.js');

/*!
prepare() Datastream builder for output
*/
  
const prepare = async (data) => {
    const fetchedDates = []
    const preparedMeasurements = []
  
    const dates = await data
  
    dates.map(async (date) => {
      fetchedDates.push(date)
    })
  
    fetchedDates.map((today) => {
      // today[0] is latest, today[1] is earliest
      if (today[0] && today[1]) {
        const todayData = {
          electricityConsumed: (today[0].electricConsumptionLow + today[0].electricConsumptionHigh) - (today[1].electricConsumptionLow + today[1].electricConsumptionHigh),
          electricityProduced: (today[0].electricYieldLow + today[0].electricYieldHigh) - (today[1].electricYieldLow + today[1].electricYieldHigh),
          gasConsumed: (today[0].gasConsumption) - (today[1].gasConsumption),
          meterName: today[0].meterName,
          logTimeStamp: today[1].logTimeStamp
        }
  
        preparedMeasurements.push(todayData)
      }
    })
  
    return preparedMeasurements
  }

module.exports = {
    prepare
}