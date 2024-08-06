import React, { useContext, useEffect, useState } from "react";
import Lottie from "react-lottie";
import image from "../../assets/lottie/donation.json";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import Card from "../../components/MyFood/Card";
import { Helmet } from "react-helmet";
function MyFood() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: image,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleData = async () => {
    const res = await axiosInstance.get(`/user/${user.id}`);
    setHistory(
      res.data.user.activities.filter(
        (item) => item.action === "delivered" || item.action === "active"
      )
    );
  };
  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="bg-[#F5F5F5] pt-8 flex flex-col items-center gap-y-14 pb-20 overflow-hidden">
      <Helmet>
        <html lang="en" />
        <title>My Food</title>
        <meta name="description" content="My Food" />
      </Helmet>
      <Lottie options={defaultOptions}  height={350} width={350} />
      <div className="font-semibold text-2xl -mt-20 -mb-4">
        Donated Food History
      </div>
      {history.map((item) => (
        <Card userDetails={item} />
      ))}
    </div>
  );
}

export default MyFood;
