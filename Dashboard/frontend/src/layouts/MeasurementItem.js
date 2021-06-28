import React from "react";

const moment = require("moment");

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

const MeasurementItem = (props) => {
  const timestamp = Number(new Date(props.logTimeStamp));
  const readableTime = moment(timestamp).format("DD-mm-YYYY HH:mm");

  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.meterName} </td>
      <td>{props.electricConsumptionLow} Kwh</td>
      <td>{props.electricConsumptionHigh} Kwh</td>
      <td>{props.electricYieldLow} Kwh</td>
      <td>{props.electricYieldHigh} Kwh</td>
      <td>{props.lowHighTariff}</td>
      <td>{props.electricConsumptionCurrent} Kwh</td>
      <td>{props.electricyYieldCurrent} Kwh</td>
      <td>{props.gasConsumption} m3</td>
      <td>{readableTime}</td>
    </tr>
  );
};

export default MeasurementItem;
