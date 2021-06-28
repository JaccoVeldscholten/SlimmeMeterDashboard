const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const measurementSchema = new Schema({
  meterName: String,
  electricConsumptionLow : Number,
  electricConsumptionHigh: Number,
  electricYieldLow: Number,
  electricYieldHigh: Number,
  lowHighTariff: String,
  electricConsumptionCurrent: Number,
  electricyYieldCurrent: Number,
  gasConsumption: Number,
  logTimeStamp: Date,
});

const MeasurementModel = mongoose.model('Measurement', measurementSchema);

module.exports = MeasurementModel;