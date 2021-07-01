import React, { useState, useEffect } from "react";

import Measurements from "../layouts/Measurements";

const TableList = () => {
  const [loadedMeasurements, setLoadedMeasurements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost/measurements/all");

        const resData = await response.json();

        console.log(resData.measurements);

        if (!response.ok) {
          throw new Error(resData.message || "Fetching the goals failed.");
        }

        setLoadedMeasurements(resData.measurements);
      } catch (err) {
        setError(
          err.message ||
            "Fetching goals failed - the server responsed with an error."
        );
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div>
      {error && <ErrorAlert errorText={error} />}
      {!isLoading && <Measurements measurements={loadedMeasurements} />}
    </div>
  );
};
export default TableList;
