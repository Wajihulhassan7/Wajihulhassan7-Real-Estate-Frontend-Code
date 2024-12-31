import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../../const/url.const";
import { logout } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';
function ManageLandlords({ handleViewDetails }) {
  const careProvider = useSelector((state) => state.agentLandlord);
  const [propertiesByLandlord, setPropertiesByLandlord] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);
 const navigate = useNavigate();
  const dispatch = useDispatch();
  // Filter landlords based on search query
  const filteredLandlords = careProvider.landlordEmails.filter((landlord) => {
    const email = landlord.landlordDetails ? landlord.landlordDetails.email.toLowerCase() : "";
    const phoneNumber = landlord.landlordDetails
      ? landlord.landlordDetails.phoneNumber.toLowerCase()
      : "";
    const searchLower = searchQuery.toLowerCase();

    return email.includes(searchLower) || phoneNumber.includes(searchLower);
  });

  useEffect(() => {
    const landlordToken = localStorage.getItem("authToken");
    const agentLandlordToken = localStorage.getItem("authTokenAgentLandlord");

    if (landlordToken) {
      setToken(landlordToken);
    } else if (agentLandlordToken) {
      setToken(agentLandlordToken);
    }
  }, []);

// Handle Logout
const handleLogout = () => {
  dispatch(logout());    
  navigate('/login');
};

  useEffect(() => {
    const fetchPropertiesForAllLandlords = async () => {
      const landlordData = {};

      for (const landlord of careProvider.landlordEmails) {
        const landlordEmail = landlord.landlordDetails?.email;

        if (landlordEmail) {
          try {
            // Fetch landlord details
            const userResponse = await axios.get(`${baseUrl}/users/${landlordEmail}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const landlordId = userResponse.data.id;

            // Fetch properties and filter by landlord ID
            const propertyResponse = await axios.get(`${baseUrl}/properties`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const properties = propertyResponse.data.properties || [];
            const active = properties.filter(
              (property) => property.userId === landlordId && property.status === "Active"
            );
            const inactive = properties.filter(
              (property) => property.userId === landlordId && property.status === "Inactive"
            );

            landlordData[landlordEmail] = { active, inactive };
          } catch (error) {
            toast.dismiss();
        
            if (error.response) {
              // Server responded with a status code outside the 2xx range
              const { status, data } = error.response;
        
              console.error(`Error: ${status} - ${data?.message || 'Unknown error'}`);
        
              if (status === 401) {
                // Handle unauthorized error
                toast.error("Your session has expired. Please log in again.");
                handleLogout();
                return;
              }
        
              toast.error(data?.message || "Failed to update details. Please try again.");
            } else if (error.request) {
              // No response was received
              console.error("Error: No response received from the server");
              toast.error("Server is not responding. Please try again later.");
            } else {
              // An error occurred during request setup
              console.error(`Error: ${error.message}`);
              toast.error("An error occurred. Please try again.");
            }
          }
        
        }
      }

      setPropertiesByLandlord(landlordData);
    };

    fetchPropertiesForAllLandlords();
  }, [careProvider.landlordEmails, token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    console.log("Search icon clicked");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-montserrat text-center text-[#154D7C] pb-6 mb-8">
        Manage Landlords
      </h2>

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
            style={{ top: "50%", right: "16px", transform: "translateY(-70%)" }}
          >
            <FiSearch size={24} />
          </button>
        </div>
      </div>
{/* Mobile and Small Device Cards View */}
<div className="block lg:hidden overflow-x-auto px-4 pb-24">
  {filteredLandlords.map((landlord, index) => {
    const landlordEmail = landlord.landlordDetails?.email;
    const { active = [], inactive = [] } = propertiesByLandlord[landlordEmail] || {};

    return (
      <div key={index} className="border border-[#154D7C] rounded-xl mb-4 bg-white shadow-sm p-4">
        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000]">Landlord Email:</div>
        <div className="text-sm md:text-lg text-black">
          {landlordEmail || "N/A"}
        </div>

        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Contact Info:</div>
        <div className="text-sm md:text-lg text-black">{landlord.landlordDetails?.phoneNumber || "N/A"}</div>

        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Number of Active Listings:</div>
        <div className="text-sm md:text-lg text-black">{active.length}</div>

        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Number of Inactive Listings:</div>
        <div className="text-sm md:text-lg text-black">{inactive.length}</div>

        <div className="mt-4 md:pt-4 md:space-x-6 flex justify-center space-x-2">
          <button
            className="bg-[#C64C7B] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl"
            onClick={() => handleViewDetails(landlordEmail)}
          >
            View Details
          </button>
          <a
            href={`mailto:${landlordEmail}`}
            className="bg-[#154D7C] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl"
          >
            Contact Landlord
          </a>
        </div>
      </div>
    );
  })}
</div>

      {/* Table View */}
      <div className="hidden lg:block justify-center overflow-x-auto pb-24">
        <div className="w-full max-w-5xl">
          <table className="w-full border-collapse border border-[#154D7C] mx-auto">
            <thead>
              <tr className="bg-[#F0F4F8] font-montserrat">
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">
                  Landlord Email
                </th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">
                  Contact Info
                </th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">
                  Active Listings
                </th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">
                  Inactive Listings
                </th>
                <th className="px-4 py-2 text-left font-bold text-[#000000] border border-[#154D7C]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLandlords.map((landlord, index) => {
                const landlordEmail = landlord.landlordDetails?.email;
                const { active = [], inactive = [] } =
                  propertiesByLandlord[landlordEmail] || {};

                return (
                  <tr key={index} className="bg-white hover:bg-gray-100 transition">
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">
                      {landlordEmail || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">
                      {landlord.landlordDetails?.phoneNumber || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">
                      {active.length}
                    </td>
                    <td className="px-4 py-2 text-[#000] border border-[#154D7C]">
                      {inactive.length}
                    </td>
                    <td className="px-4 py-2 border border-[#154D7C]">
                      <div className="flex gap-2">
                        <button
                          className="bg-[#154D7C] text-white px-4 py-1 rounded-full text-sm"
                          onClick={() => handleViewDetails(landlordEmail)}
                        >
                          View Details
                        </button>
                        <a
                          href={`mailto:${landlordEmail}`}
                          className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm flex items-center justify-center"
                        >
                          Contact Landlord
                        </a>
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
