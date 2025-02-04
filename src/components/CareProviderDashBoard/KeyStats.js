import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { baseUrl } from "../../const/url.const";

function KeyStatsCareProvider({activeRequestsClick, matchedPropertiesClick, onNewListingsClick}) {
  const careProvider = useSelector((state) => state.careProvider);
  console.log(careProvider);
  const [activeRequests, setActiveRequests] = useState(0);
  const [matchedProperties, setMatchedProperties] = useState(0);
  const [newListings, setNewListings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active requests
        const requestsResponse = await fetch(`${baseUrl}/properties/requests`);
        const requestsData = await requestsResponse.json();
  
        const filteredRequests = requestsData.filter(
          (request) =>
            request.userId === careProvider.id &&
            !request.status.includes("Leased") &&
            !request.status.includes("Let")
        );
        setActiveRequests(filteredRequests.length);
  
        // Fetch properties from /properties
        const propertiesResponse = await fetch(`${baseUrl}/properties`);
        const propertiesData = await propertiesResponse.json();
  
        // Calculate new listings (created today)
        const today = new Date().toISOString().split("T")[0]; // Get today's date in ISO format
        const newProperties = propertiesData.properties.filter(
          (property) => property.createdAt.split("T")[0] === today
        );
        setNewListings(newProperties.length);
  
        // Calculate matched properties based on postal code
        const matchedProperties = propertiesData.properties.filter((property) =>
          filteredRequests.some(
            (request) =>  
            property.postalCode === request.postalCode
          )
        );
        setMatchedProperties(matchedProperties.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (careProvider.id) {
      fetchData();
    }
  }, [careProvider.id]);
  
  return (
    <div
      className="flex flex-col items-center justify-center space-y-8 p-4"
      style={{ width: "100%", maxWidth: "1200px" }}
    >
      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full max-w-full pt-8 justify-center">
        {/* Active Requests Card */}
        <div className="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.05)] rounded-2xl p-6 text-center flex flex-col items-center transition transform hover:scale-103 hover:shadow-2xl">
          <h2 className="text-md font-bold font-montserrat text-[#000000]">
            Active Requests
          </h2>
          <p className="text-5xl font-inria font-light text-[#000000] my-4">
            {activeRequests}
          </p>
          <button className="bg-[#C64C7B] text-white px-6 text-sm py-2 rounded-full hover:bg-[#9e3f60] transition duration-300" onClick={activeRequestsClick}>
            View All
          </button>
        </div>

        {/* Matched Properties Card */}
        <div className="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.05)] rounded-2xl p-6 text-center flex flex-col items-center transition transform hover:scale-103 hover:shadow-2xl">
          <h2 className="text-md font-bold font-montserrat text-[#000000]">
            Matched Properties
          </h2>
          <p className="text-5xl font-inria font-light text-[#000000] my-4">
            {matchedProperties}
          </p>
          <button className="bg-[#C64C7B] text-white px-6 text-sm py-2 rounded-full hover:bg-[#9e3f60] transition duration-300" onClick={matchedPropertiesClick}>
            View All
          </button>
        </div>

        {/* New Listings Card */}
        <div className="bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.05)] rounded-2xl p-6 text-center flex flex-col items-center transition transform hover:scale-103 hover:shadow-2xl">
          <h2 className="text-md font-bold font-montserrat text-[#000000]">
            New Listings
          </h2>
          <p className="text-5xl font-inria font-light text-[#000000] my-4">
            {newListings}
          </p>
          <button className="bg-[#C64C7B] text-white px-6 text-sm py-2 rounded-full hover:bg-[#9e3f60] transition duration-300" onClick={onNewListingsClick}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyStatsCareProvider;
