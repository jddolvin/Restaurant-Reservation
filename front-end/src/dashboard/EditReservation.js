import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

const EditReservation = () => {
  const [reservation, setReservation] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState(initialState);

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = formData;

  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const updatedReservation = {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people: Number(people),
    };

    axios
      .put(`http://localhost:5000/reservations/${reservation_id}`, {
        data: updatedReservation,
      })
      .then((response) =>
        response.status === 200
          ? history.push(`/dashboard?date=${reservation_date.slice(0, 10)}`)
          : null
      )
      .catch((err) => {
        console.log(err.response.data.error);
        setReservationsError({ message: err.response.data.error });
      });
  };

  const cancelHandler = () => {
    history.goBack();
  };

  useEffect(() => {
    const getReservation = async () => {
      const response = await fetch(
        `http://localhost:5000/reservations/${reservation_id}`
      );
      const infoFromAPI = await response.json();
      setReservation(infoFromAPI);

      const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
      } = infoFromAPI.data;

      setFormData({
        first_name: first_name,
        last_name: last_name,
        mobile_number: mobile_number,
        reservation_date: reservation_date,
        reservation_time: reservation_time,
        people: Number(people),
      });
    };
    getReservation();
  }, [API_BASE_URL, reservation_id]);

  return (
    <div className="container pt-5">
      <div
        className="card container bg-secondary p-0 pb-2"
        style={{ maxWidth: "600px", height: "100%", borderRadius: "10px" }}
      >
        <h1 className="card-header text-center text-light border-info">
          Edit Reservation
        </h1>
        {reservation.data && (
          <ReservationForm
            cancelHandler={cancelHandler}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            reservation={reservation.data}
          />
        )}
        <ErrorAlert error={reservationsError} />
      </div>
    </div>
  );
};

export default EditReservation;
