import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Helmet } from "react-helmet";
import bgimage from "../../assets/background_img/bg_1.jpg";
import { AuthContext } from '../../context/AuthContext';
import Swal from "sweetalert2";
const DonateForm = () => {
  const { user, logout } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [minDate, setMinDate] = useState('');

  const initialFormState = {
    foodName: "",
    foodType: "veg",
    foodImage: "",
    quantity: 10,
    note: "",
    pickupLocation: "",
    expiryDate: "",
    phoneNo: "",
    pickupTime: "",
  };
  
  const [formData, setFormData] = useState(initialFormState);
 

  // for image pick
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setImage(file);
      setFormData((prev) => ({
        ...prev,
        foodImage: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // for date pick 
  const handleDate=() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFoodData = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/food/donate", formData);
      console.log("result", res);
      if(res){
        Swal.fire({
            title: "Congratulations!",
            text: "Added Successfully",
            icon: "success",
            color:"green",
            confirmButtonColor: 'green',
          });
      }
      setFormData(initialFormState);
      setImage(null);
    } catch (error) {
      console.log("error", error.response);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        alert("Please login again. Session has timed out.");
        await logout();
      }
      Swal.fire({
        title: `OOPS! Error(${error}) has occured `,
        text: "You can try again",
        icon: "error",
        color:"red",
        confirmButtonColor: 'red',
      });
    }
  };
  useEffect(()=>{
    handleDate();
  })
  return (
    <div
      className=" bg-[#F5F5F5]  flex  flex-col items-center pt-20 pb-16 overflow-hidden"style={{backgroundImage: 'url(https://media.istockphoto.com/id/515373062/vector/food-seamless-background.jpg?s=612x612&w=0&k=20&c=hexa_lBms2zsFxEHASUeYhNu17i8JfV3TGOoDark-tk=)'}}>
      <Helmet>
        <html lang="en" />
        <title>Donate</title>
        <meta name="description" content="Donate food form" />
      </Helmet>
      <div className="card bg-white bg-opacity-90 shadow-lg px-6 py-16 mb-5 mt-5 md:w-10/12 lg:w-9/12 w-11/12 flex flex-col items-center justify-center " >
       <div className=" md:text-4xl text-2xl text-center font-bold pb-10">Fill the form correctly !!</div>
        <form onSubmit={handleFoodData} className="flex flex-col w-11/12 items-center gap-y-10">
          <div className=" grid md:grid-cols-2 grid-cols-1 gap-y-10  gap-x-40 w-10/12 place-content-center place-items-stretch">
            <div className="md:gap-y-4 grid grid-cols-1 gap-y-4 place-items-start">
              <div>
                <label className="label">
                  <span className="label-text text-black font-bold text-lg">Food Name:</span>
                </label>
                <input
                  type="text"
                  name="foodName"
                  placeholder="Food Name"
                  className="input  rounded-md"
                  value={formData.foodName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-black font-bold text-lg">Pickup Location:</span>
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="Pickup location"
                  className="input rounded-md"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:flex items-center gap-x-4 grid grid-cols-1 gap-y-4">
                <div>
                  <label className="label">
                    <span className="label-text text-black font-bold text-lg">Quantity:</span>
                  </label>
                  <select
                    className="input border w-20 rounded-md"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  >
                    {[10, 20, 30, 40, 50, 60].map((qty) => (
                      <option key={qty} value={qty}>{qty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-black font-bold text-lg">Food Type:</span>
                  </label>
                  <select
                    className="input border w-32 rounded-md"
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                  >
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non Veg</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <div>
                {formData.foodImage ? (
                  <img
                    src={formData.foodImage}
                    alt="uploaded"
                    className="max-w-full max-h-full"
                    style={{
                      maxWidth: "160px",
                      maxHeight: "160px",
                      minHeight: "160px",
                      minWidth: "160px",
                    }}
                  />
                ) : (
                  <div className="bg-white border border-black w-40 h-40 text-center flex justify-center items-center">
                    No image uploaded
                  </div>
                )}
              </div>
              <div className="flex gap-x-2 md:flex-row flex-col">
                <label className="label">
                  <span className="label-text text-black font-bold text-lg">Food Image:</span>
                </label>
                <input type="file" onChange={handleImageChange} className="rounded-md" required/>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text text-black font-bold text-lg">Expiry Date:</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                className="input input-bordered rounded-md"
                value={formData.expiryDate}
                onChange={handleChange}
                min={minDate}
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-black text-lg font-bold">Preferrable Pickup Time:</span>
              </label>
              <input
                type="time"
                name="pickupTime"
                className="input input-bordered rounded-md"
                value={formData.pickupTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:flex items-center gap-8">
              <div className="w-full">
                <label className="label">
                  <span className="label-text text-black font-bold text-lg">Note:</span>
                </label>
                <input
                  type="text"
                  name="note"
                  placeholder="Note (if any)"
                  className="input rounded-md"
                  value={formData.note}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="md:flex items-center gap-8">
              <div className="w-full">
                <label className="label">
                  <span className="label-text font-bold text-black text-lg">Phone No:</span>
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  placeholder="10 digits"
                  className="input rounded-md"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <input
            type="submit"
            className="w-11/12 bg-[#ABD700] hover:text-white text-black font-semibold text-xl px-4 py-2 mb-2 rounded-xl hover:bg-black hover:scale-x-110 transition duration-300 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default DonateForm;
