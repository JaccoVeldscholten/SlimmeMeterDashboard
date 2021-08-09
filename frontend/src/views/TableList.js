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
        const response =await fetch("https://meter-api.veldscholten.tech/measurements/all");

        const resData = await response.json();


        if (!response.ok) {
          throw new Error(resData.message || "Fetching the measurements failed.");
        }

        setLoadedMeasurements(resData.measurements);
      } catch (err) {
        setError(
          err.message ||
            "Fetching measurements failed - the server responsed with an error."
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
