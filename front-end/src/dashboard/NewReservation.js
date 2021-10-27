import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
import ReservationForm from "./ReservationForm";

export default function NewReservation() {
  let history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  // Must initialize this state after initialState declaration
  const [newReservation, setNewReservation] = useState(initialState);

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = newReservation;

  const changeHandler = ({ target }) => {
    setNewReservation({ ...newReservation, [target.name]: target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const reservation = {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people: Number(people),
    };

    axios
      .post(`${API_BASE_URL}/reservations`, { data: reservation })
      .then((response) =>
        response.status === 201
          ? history.push(`/dashboard?date=${reservation_date}`)
          : null
      )
      .catch((err) => {
        console.log(err.response.data.error);
        setReservationsError({ message: err.response.data.error });
      });
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className="container pt-5">
      <div
        className="container card bg-secondary p-0 pb-2"
        style={{ maxWidth: "600px", borderRadius: "10px", height: "100%" }}
      >
        <h1 className="card-header text-center text-light border-info p-0 pb-2">
          Create a Reservation
        </h1>
        <ReservationForm
          cancelHandler={cancelHandler}
          submitHandler={submitHandler}
          changeHandler={changeHandler}
          reservation={newReservation}
        />
        <ErrorAlert error={reservationsError} />
      </div>
    </div>
  );
}
