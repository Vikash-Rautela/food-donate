import React,{useContext,useState,useEffect} from "react";
import Lottie from "react-lottie";
import image from "../../assets/lottie/task.json";
import Card from "../../components/MyFoodRequest/Card"
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from '../../context/AuthContext';
import { Helmet } from "react-helmet";
function MyFoodRequest() {

  const { user} = useContext(AuthContext);
  const [history,setHistory]=useState([])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: image,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
 

  const handleData = async () => {
    const res = await axiosInstance.get(`/user/${user.id}`)
    setHistory(res.data.user.activities.filter(item => item.action === 'requested' || item.action === 'confirmed'));
  }
  useEffect(()=>{
    handleData();
  },[])
  return (
    <div className="bg-[#F5F5F5] pt-8 flex flex-col items-center gap-y-14 pb-20 overflow-hidden">
      <Helmet>
        <html lang="en" />
        <title>My Food Request</title>
        <meta name="description" content="My Food Request" />
      </Helmet>
      <Lottie options={defaultOptions} height={400} width={400} />
      <div className="font-semibold text-2xl -mt-20 -mb-4">Requested Food History</div>
      {history.map((item) => (
        <Card userDetails={item}/>
      ))}
    </div>
  );
}

export default MyFoodRequest;
