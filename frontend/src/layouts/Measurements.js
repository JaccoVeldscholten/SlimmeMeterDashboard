import React from "react";

import MeasurementItem from "./MeasurementItem";
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

const Measurements = (props) => {
  const hasNoGoals = !props.measurements || props.measurements.length === 0;

  return (
    <>
      <Container>
        <Row>
          <Col md="20">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Log Data</Card.Title>
                <p className="card-category">
                  All data from Database logged by max 100 latest logs
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Doc ID</th>
                      <th className="border-0">Meter Naam</th>
                      <th className="border-0">Electriciteit Verbruik Dal</th>
                      <th className="border-0">Electriciteit Verbruik Piek</th>
                      <th className="border-0">Electriciteit Teruggave Dal</th>
                      <th className="border-0">Electriciteit Teruggave Piek</th>
                      <th className="border-0">Electriciteit Piek of Dal</th>
                      <th className="border-0">
                        Electriciteit Huidige verbruik
                      </th>
                      <th className="border-0">
                        Electriciteit Huidige teruggave
                      </th>
                      <th className="border-0">Gas huidige verbruik</th>
                      <th className="border-0">Laatste melding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.measurements.map((measurement) => (
                      <MeasurementItem
                        key={measurement.id}
                        id={measurement.id}
                        meterName={measurement.meterName}
                        electricConsumptionLow={measurement.electricConsumptionLow }
                        electricConsumptionHigh={measurement.electricConsumptionHigh}
                        electricYieldLow={measurement.electricYieldLow}
                        electricYieldHigh={measurement.electricYieldHigh}
                        lowHighTariff = {measurement.lowHighTariff}
                        electricConsumptionCurrent={measurement.electricConsumptionCurrent}
                        electricyYieldCurrent={measurement.electricyYieldCurrent}
                        gasConsumption={measurement.gasConsumption}
                        logTimeStamp={measurement.logTimeStamp}
                        onDelete={measurement.onDeleteGoal}
                      />
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Measurements;
