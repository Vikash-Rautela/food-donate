import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
function Card(props) {
  const item = props.userDetails;
  // console.log("item", item);
  const [foodName, setFoodName] = useState("");
  const [donarName, setDonarName] = useState("");
  const color = {
    failed: "#EB6B6B",
    confirmed: "#ABD700",
    requested: "#BA75DA",
  };
  const text = {
    confirmed: "Confirmed",
    requested: "Requested",
  }
  const handleFood = async () => {
    const foodId = await axiosInstance.get(`/food/detail/${item.foodId}`)
    // console.log(foodId)
    setFoodName(foodId.data.food.foodName)
    const donarId = foodId.data.food.userId
    const donarData = await axiosInstance.get(`/user/${donarId}`)
    setDonarName(donarData.data.user.name)
    // console.log(foodId)
  }
  useEffect(() => {
    handleFood()
  }, [])
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
          Requested date : <span>{item.timestamp.substr(0, 10)}</span>
        </div>
        <div>
          Donar Name : <span>{donarName}</span>
        </div>
      </div>
      <div
        className={`bg-[${color[item.action]
          }] px-4 py-2 rounded-md font-medium capitalize`}
      >
        {text[item.action]}
      </div>
    </motion.div>
  );
}

export default Card;
