import React from "react";
import Carousel from "../components/home/carousel";
import WebsiteFeatures from "../components/home/features";
import Contact from "../components/home/contact";
import About from "../components/home/about";
import Delivery from "../components/home/delivery";
import { Helmet } from "react-helmet";
function Home() {
  const images = [
    "https://t4.ftcdn.net/jpg/03/81/88/83/360_F_381888369_ZTrVfffe65HXAZhuJjv99xo5l74CO6Mo.jpg",
    "https://www.narayanseva.org/wp-content/uploads/2023/10/Blog68.jpg",
    "https://wishesandblessings.net/public/images/food_all.jpg",
  ];
  return (
    <div className="bg-[#F5F5F5] pt-16 overflow-hidden">
      <Helmet>
        <html lang="en" />
        <title>Blessed Baskets</title>
        <meta name="description" content="Home page" />
      </Helmet>
      <Carousel images={images} />
      <WebsiteFeatures />
      <Delivery />
      <Contact />
      <About />
    </div>
  );
}

export default Home;
