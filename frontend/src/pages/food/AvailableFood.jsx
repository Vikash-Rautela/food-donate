import React, { useEffect, useState } from "react";
import Card from "../../components/foodDetails/Card";
import { Helmet } from "react-helmet";
import Lottie from "react-lottie";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axiosInstance from "../../utils/axiosInstance";
import animationData from "../../assets/lottie/Animation - 1715537156636.json";
import noavailable from "../../assets/lottie/navailable1.json";
import Swal from "sweetalert2";

function AvailableFood() {
    const [foods, setFoods] = useState([]);
    const [loader, setLoader] = useState(true);
    const [search, setSearch] = useState([]);
    const [available, setAvailable] = useState(false);
    const [dateOptions, setDateOptions] = useState([]);
    const [foodTypeOptions, setFoodTypeOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [filters, setFilters] = useState({
        date: 'all',
        foodType: 'all',
        location: 'all',
        search: ''
    });

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const defaultAvailability = {
        loop: true,
        autoplay: true,
        animationData: noavailable,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const extractOptions = (data) => {
        if (!Array.isArray(data)) return;

        const foodTypeSet = new Set();
        const locationSet = new Set();

        data.forEach(item => {
            foodTypeSet.add(item.foodType.trim().toLowerCase());
            locationSet.add(item.pickupLocation.trim().toLowerCase());
        });

        setFoodTypeOptions([
            { value: "all", label: "All Food Types" },
            ...Array.from(foodTypeSet).map(type => ({ value: type, label: capitalizeFirstLetter(type) }))
        ]);

        setLocationOptions([
            { value: "all", label: "All Locations" },
            ...Array.from(locationSet).map(location => ({ value: location, label: capitalizeFirstLetter(location) }))
        ]);

        setDateOptions([
            { value: "ascend", label: "Oldest to Latest" },
            { value: "descend", label: "Latest to Oldest" },
            { value: "all", label: "All Dates" }
        ]);
    };

    const applyFiltersAndSort = (data) => {
        if (!Array.isArray(data)) return [];

        let filteredData = [...data];

        if (filters.search) {
            filteredData = filteredData.filter(item => item.foodName.toLowerCase().includes(filters.search.toLowerCase()));
        }

        if (filters.foodType !== 'all') {
            filteredData = filteredData.filter(item => item.foodType.toLowerCase() === filters.foodType.toLowerCase());
        }

        if (filters.location !== 'all') {
            filteredData = filteredData.filter(item => item.pickupLocation.toLowerCase().includes(filters.location.toLowerCase()));
        }

        if (filters.date === 'ascend') {
            filteredData.sort((a, b) => new Date(a.donatedDate) - new Date(b.donatedDate));
        } else if (filters.date === 'descend') {
            filteredData.sort((a, b) => new Date(b.donatedDate) - new Date(a.donatedDate));
        }

        return filteredData;
    };

    const handleFilterChange = (type) => (filter) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [type]: filter.value
        }));
    };

    const handleSearch = (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            search: e.target.value
        }));
    };

    const fetchFood = async () => {
        try {
            const res = await axiosInstance.get("/food/allfoods");
            console.log(res)
            if (res.data.success) {
                const fetchedFoods = res.data.foods;
                setFoods(fetchedFoods);
                setSearch(applyFiltersAndSort(fetchedFoods));
                setAvailable(fetchedFoods.length > 0);
                extractOptions(fetchedFoods);
            } else {
                setAvailable(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.data.msg,
                    color: "red",
                    confirmButtonColor: 'red',
                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch food data. Please try again later.',
                color: "red",
                confirmButtonColor: 'red',
            });
            setAvailable(false);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchFood();
    }, []);

    useEffect(() => {
        setSearch(applyFiltersAndSort(foods));
    }, [filters, foods]);

    if (loader) {
        return <Lottie options={defaultOptions} height={400} width={400} />;
    }

    return (
        <div className="pb-20 pt-16 bg-[#F5F5F5] overflow-hidden">
            <Helmet>
                <html lang="en" />
                <title>Available Foods</title>
                <meta name="description" content="Available food items" />
            </Helmet>
            <div className="space-y-3 mb-10 ">
                <h5 className="text-xl text-center font-mono mt-12">
                    Let's Take Care of Each Other
                </h5>
                <h1 className="text-5xl font-medium text-center py-1">
                    Enjoy & Eat <span className="text-[#ABD700]">Together</span>
                </h1>
            </div>
            <div className="flex justify-center">
                <div className="md:w-96 w-72">
                    <label className="flex items-center gap-2">
                        <input
                            type="search"
                            name="search"
                            className="grow rounded-md"
                            placeholder="Search..."
                            onChange={handleSearch}
                        />
                    </label>
                </div>
            </div>
            <div className="text-center flex flex-col items-center ">
                <div className="grid md:grid-cols-3 grid-cols-1 w-10/12 py-8">
                    <Dropdown
                        options={dateOptions}
                        onChange={handleFilterChange('date')}
                        placeholder="Sort By Date"
                        className="rounded-md m-1 mb-8 flex flex-row items-center shadow-lg"
                        controlClassName="bg-blue-500 font-semibold py-2 px-4 w-full rounded-md"
                    />
                    <Dropdown
                        options={foodTypeOptions}
                        onChange={handleFilterChange('foodType')}
                        placeholder="Food Type"
                        className="rounded-md m-1 mb-8 flex flex-row items-center shadow-lg"
                        controlClassName="bg-blue-500 font-semibold py-2 px-4 w-full rounded-md"
                    />
                    <Dropdown
                        options={locationOptions}
                        onChange={handleFilterChange('location')}
                        placeholder="Location"
                        className="rounded-md m-1 mb-8 flex flex-row items-center shadow-lg"
                        controlClassName="bg-blue-500 font-semibold py-2 px-4 w-full rounded-md"
                    />
                </div>
            </div>
            {search.length > 0 ? (
                <div>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-y-40 lg:gap-x-40 gap-x-32 w-11/12 mx-auto place-items-center">
                        {search.map((foodItem) => (
                            <Card key={foodItem._id} item={foodItem} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center">
                    <Lottie options={defaultAvailability} height={400} width={400} />
                    <div className="text-2xl font-medium text-center">
                        Sorry, No available food !!
                    </div>
                </div>
            )}
        </div>
    );
}

export default AvailableFood;
