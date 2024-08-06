import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
function Card(props) {

  const item = props.userDetails;
  const [foodName, setFoodName] = useState("");

  const color = {
    expired: "#EB6B6B",
    active: "#ABD700",
    delivered: "#F7BD2E",
  };
  const text = {
    expired: "Expired",
    active: "Available",
    delivered: "Delivered",
  };
  // Dialog box
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // Dialog box form
  const initialFormState = {
    getterEmail: "",
    phoneNumber: "",
    note: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const sendRequest = async () => {
    try {
      const response = await axiosInstance.post(`/food/confirm/${item.foodId}`, formData);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Confirm Request',
          text: 'The request is confirmed successfully!',
          color: "green",
          confirmButtonColor: 'green',
        });
        setFormData(initialFormState);
        handleClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Confirmation Failed',
          text: 'Failed to confirm request. Please try again.',
          color: "red",
          confirmButtonColor: 'red',
        });
        handleClose();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Confirmation Failed',
        text: 'Failed to confirm request. Please try again.',
        color: "red",
        confirmButtonColor: 'red',
      });
      handleClose();
    }
  };
  const handleFood = async () => {
    const foodId = await axiosInstance.get(`/food/detail/${item.foodId}`);
    console.log(foodId)
    setFoodName(foodId.data.food.foodName);
  };
  useEffect(() => {
    handleFood();
  }, []);
  return (
    <motion.div
      className="w-11/12 flex flex-row justify-between items-center bg-[#E5E5E5] rounded-md py-4 px-4"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div className="flex flex-col gap-y-8">
        <div className="font-bold text-xl  ">
          Food Name :{" "}
          <span className="font-semibold text-black capitalize">{foodName}</span>
        </div>
        <div>
          Donated date : <span>{item.timestamp.substr(0, 10)}</span>
        </div>
      </div>
      <div
        className={`bg-[${color[item.action]
          }] px-4 py-2 rounded-md font-medium capitalize ${item.action === 'active' ? 'cursor-pointer' : ''} `}
        onClick={handleClickOpen}
      >
        {text[item.action]}
      </div>
      {item.action === 'active' ? <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            sendRequest();
          },
        }}
      >
        <DialogTitle>Confirm Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Accept the food request and fill this details
          </DialogContentText>
          <input
            type="text"
            placeholder="Enter volunteer's email"
            className="w-full py-2 my-4"
            name="getterEmail"
            value={formData.getterEmail}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Your number to connect "
            className="w-full py-2 my-4"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Note "
            className="w-full py-2 my-4"
            name="note"
            value={formData.note}
            onChange={handleChange}

          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Send</Button>
        </DialogActions>
      </Dialog> : ''}
    </motion.div>
  );
}

export default Card;
