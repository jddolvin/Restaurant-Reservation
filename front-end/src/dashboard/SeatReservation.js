import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables } from "../utils/api";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState(0);
  const [tableError, setTableError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const loadTables = () => {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch((error) => console.error(error));

    return () => abortController.abort();
  };

  useEffect(loadTables, []);

  const changeHandler = (event) => setTableId(event.target.value);
  const cancelHandler = () => {
    history.goBack();
  };
  // const validateSeat = () => {
  //   if (!tableId) {
  //     foundErrors.push("Table does not exist.");
  //   }
  //   if (!reservation_id) {
  //     foundErrors.push("Reservation does not exist.");
  //   }
  //   if (tableId.reservation_id) {
  //     foundErrors.push("Table selected is occupied.");
  //   }
  //   if (tableId.capacity < reservation_id.people) {
  //     foundErrors.push("Table selected cannot seat number of people.");
  //   }

  //   if (foundErrors) {
  //     setErrors(new Error(foundErrors.toString()));
  //     return false;
  //   }
  //   return true;
  // };

  const submitHandler = (event) => {
    event.preventDefault();
    setTableError(null);

    if (reservation_id) {
      axios
        .put(`${API_BASE_URL}/tables/${tableId}/seat`, {
          data: { reservation_id: reservation_id },
        })
        .then((response) =>
          response.status === 200 ? history.push("/") : null
        )
        .catch((error) => {
          console.log(error.response.data.error);
          setTableError({ message: error.response.data.error });
        });
    }
  };

  return (
    <div className="container pt-5">
      <div
        className="card container text-center bg-secondary border-info p-0"
        style={{ maxWidth: "500px", height: "250px", borderRadius: "10px" }}
      >
        <div className="card-header text-light border-info">
          <h2>Reserve a Table</h2>
        </div>
        <form
          onSubmit={submitHandler}
          className="mt-4"
          style={{ height: "90px" }}
        >
          <div className="row justify-content-center">
            <select
              style={{ width: "50%" }}
              className="form-control"
              onChange={(event) => changeHandler(event)}
              name="table_id"
            >
              <option value="">Select A Table</option>
              {tables.map((table) => {
                return (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                );
              })}
            </select>
          </div>
          <br />
          <button type="submit" className="btn btn-info text-dark mt-2 mr-1">
            Submit
          </button>
          <button
            type="button"
            onClick={cancelHandler}
            className="btn btn-dark text-light mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
      <ErrorAlert error={tableError} />
    </div>
  );
}
