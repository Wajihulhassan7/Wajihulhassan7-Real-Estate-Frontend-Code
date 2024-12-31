import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl } from "../../const/url.const";

function ManageClients({ handleViewDetails }) {
  const agentCareProvider = useSelector((state) => state.agentCareProvider);
  const [activeRequests, setActiveRequests] = useState([]);
  const [matchedProperties, setMatchedProperties] = useState([]);

  // Function to fetch active requests and filter them based on userId
  const fetchActiveRequests = async () => {
    try {
      const requestsResponse = await axios.get(`${baseUrl}/properties/requests`);
      const requests = requestsResponse.data;

      // Fetch user details for each care provider email and get userId
      const userIds = await Promise.all(
        agentCareProvider.careProviderEmails.map(async (provider) => {
          try {
            const userResponse = await axios.get(`${baseUrl}/users/${provider.careProviderEmail}`);
            return userResponse.data.id; // Return the id of the user
          } catch (error) {
            console.error("Error fetching user by email:", provider.careProviderEmail, error);
            return null;
          }
        })
      );

      // Filter active requests based on matching userId
      const userRequests = requests.filter((request) =>
        userIds.includes(request.userId)
      );

      setActiveRequests(userRequests);

      // Now, fetch the properties matching those requests
      fetchMatchedProperties(userRequests);
    } catch (error) {
      toast.error("Error fetching active requests.");
      console.error(error);
    }
  };

  // Function to fetch matched properties based on active requests
  const fetchMatchedProperties = async (userRequests) => {
    try {
      const propertiesResponse = await axios.get(`${baseUrl}/properties`);
      const properties = propertiesResponse.data.properties;

      const matched = userRequests.map((request) => {
        return properties.filter((property) => {
          // Match properties based on city, property type, and number of bedrooms
          return (
            property.city === request.city &&
            property.propertyType === request.propertyType &&
            property.numberOfBedrooms === request.numberOfBedrooms
          );
        });
      });

      setMatchedProperties(matched);
    } catch (error) {
      toast.error("Error fetching matched properties.");
      console.error(error);
    }
  };

  // Fetch active requests when component mounts
  useEffect(() => {
    if (agentCareProvider.careProviderEmails.length > 0) {
      fetchActiveRequests();
    }
  }, [agentCareProvider.careProviderEmails]);

  return (
    <div>
      <h2 className="text-2xl font-bold font-montserrat text-center text-[#154D7C] pb-6 mb-8">Manage Clients</h2>

      {/* Display Client Information */}
      <div className="block lg:hidden overflow-x-auto px-4 pb-24">
        {agentCareProvider.careProviderEmails.map((provider, index) => (
          <div key={index} className="border border-[#154D7C] rounded-xl mb-4 bg-white shadow-sm p-4">
            <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000]">Client Name:</div>
            <div className="text-sm md:text-lg text-black">{provider.careProviderDetails.contactName}</div>

            <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Active Requests:</div>
            <div className="text-sm md:text-lg text-black">{activeRequests.length}</div>

            <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Matched Properties:</div>
            <div className="text-sm md:text-lg text-black">{matchedProperties[index]?.length || 0}</div>

            <div className="mt-4 md:pt-4  md:space-x-6 flex  justify-center space-x-2">
              <button className="bg-[#C64C7B] text-white px-4 py-1 md:px-8 md:py-2 rounded-full text-sm md:text-xl">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table View for Larger Screens */}
      <div className="hidden lg:block justify-center overflow-x-auto pb-24">
        <div className="w-full max-w-5xl">
          <table className="w-full border-collapse border border-[#154D7C] mx-auto">
            <thead>
              <tr className="bg-[#F0F4F8] font-montserrat">
                <th className="px-6 py-3 text-left font-bold text-[#000000] border border-[#154D7C]">Client Name</th>
                <th className="px-6 py-3 text-left font-bold text-[#000000] border border-[#154D7C]">Active Requests</th>
                <th className="px-6 py-3 text-left font-bold text-[#000000] border border-[#154D7C]">Matched Properties</th>
                <th className="px-6 py-3 text-left font-bold text-[#000000] border border-[#154D7C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agentCareProvider.careProviderEmails.map((provider, index) => (
                <tr key={index} className="bg-white hover:bg-gray-100 transition">
                  <td className="px-6 py-3 text-[#000] border border-[#154D7C]">{provider.careProviderDetails.contactName}</td>
                  <td className="px-6 py-3 text-[#000] border border-[#154D7C]">{activeRequests.length}</td>
                  <td className="px-6 py-3 text-[#000] border border-[#154D7C]">{matchedProperties[index]?.length || 0}</td>
                  <td className="px-6 py-3 border border-[#154D7C]">
                    <div className="flex gap-2">
                      <button className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm"  onClick={() => handleViewDetails(provider.careProviderDetails.email)}>
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageClients;
