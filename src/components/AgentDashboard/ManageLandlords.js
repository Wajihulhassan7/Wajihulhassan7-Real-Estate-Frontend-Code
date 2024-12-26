import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

function ManageLandlords() {
  const careProvider = useSelector((state) => state.agentLandlord); 
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered landlords based on search query
  const filteredLandlords = careProvider.landlordEmails.filter((landlord) => {
    const name = landlord.landlordDetails ? `${landlord.landlordDetails.firstName} ${landlord.landlordDetails.lastName}`.toLowerCase() : '';
    return name.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    // Fetch properties from API
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://172.25.0.226:3032/properties");
        if (response.data && response.data.properties) {
          setProperties(response.data.properties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    console.log("Search icon clicked");
  };

  // Filter properties by landlord's userId and their status
  const getPropertiesByLandlordId = (landlordId) => {
    const activeProperties = properties.filter(
      (property) => property.userId === landlordId && property.status === "Active"
    );
    const inactiveProperties = properties.filter(
      (property) => property.userId === landlordId && property.status === "Inactive"
    );
    return { activeProperties, inactiveProperties };
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-montserrat text-center text-[#154D7C] pb-6 mb-8">Manage Landlords</h2>

      {/* Search Section */}
      <div className="flex flex-col items-center space-y-6 mb-8 px-4">
        <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
          <input
            placeholder="Search for Landlords"
            type="search"
            className="border border-[#C64C7B] rounded-full px-4 py-2 w-full focus:outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            onClick={handleSearchClick}
            className="absolute inset-y-0 right-4 flex items-center justify-center text-[#C64C7B] hover:text-pink-500"
            style={{ top: '50%', right: '16px', transform: 'translateY(-70%)' }}
          >
            <FiSearch size={24} />
          </button>
        </div>
      </div>

      {/* Cards View for Mobile and Medium Screens */}
      <div className="block lg:hidden overflow-x-auto px-4 pb-24">
        {filteredLandlords.map((landlord, index) => {
          const { activeProperties, inactiveProperties } = getPropertiesByLandlordId(landlord.landlordDetails.id);
          return (
            <div key={index} className="border border-[#154D7C] rounded-xl mb-4 bg-white shadow-sm p-4">
              <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000]">Landlord Name:</div>
              <div className="text-sm md:text-lg text-black">
                {landlord.landlordDetails ? `${landlord.landlordDetails.firstName} ${landlord.landlordDetails.lastName}` : "N/A"}
              </div>

              <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Contact Info:</div>
              <div className="text-sm md:text-lg text-black">{landlord.landlordEmail}</div>
              <div className="text-sm md:text-lg text-black">{landlord.landlordDetails ? landlord.landlordDetails.phoneNumber : "N/A"}</div>

              <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Number of Active Listings:</div>
              <div className="text-sm md:text-lg text-black">{activeProperties.length}</div>

              <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Number of Inactive Listings:</div>
              <div className="text-sm md:text-lg text-black">{inactiveProperties.length}</div>

              <div className="mt-4 md:pt-4 md:space-x-6 flex justify-center space-x-2">
                <button className="bg-[#C64C7B] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl">
                  View Details
                </button>
                <button className="bg-[#154D7C] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl">
                  Contact Landlord
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table View for Larger Screens */}
      <div className="hidden lg:block justify-center overflow-x-auto pb-24">
        <div className="w-full max-w-5xl">
          <table className="w-full border-collapse border border-[#154D7C] mx-auto">
            <thead>
              <tr className="bg-[#F0F4F8] font-montserrat">
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">Landlord Name</th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">Contact Info</th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">Active Listings</th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">Inactive Listings</th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLandlords.map((landlord, index) => {
                const { activeProperties, inactiveProperties } = getPropertiesByLandlordId(landlord.landlordDetails.id);
                return (
                  <tr key={index} className="bg-white hover:bg-gray-100 transition">
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">
                      {landlord.landlordDetails ? `${landlord.landlordDetails.firstName} ${landlord.landlordDetails.lastName}` : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">{landlord.landlordEmail}</td>
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">{activeProperties.length}</td>
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">{inactiveProperties.length}</td>
                    <td className="px-4 py-2 border border-[#154D7C]">
                      <div className="flex gap-2">
                        <button className="bg-[#154D7C] text-white px-4 py-1 rounded-full text-sm">
                          View Details
                        </button>
                        <button className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm">
                          Contact Landlord
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageLandlords;
