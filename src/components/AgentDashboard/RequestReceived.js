import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { baseUrl } from '../../const/url.const';

import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/authSlice';
function RequestReceived({onViewDetailsRequest}) {
 const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const agentLandlord = useSelector((state) => state.agentLandlord); 
  const landlord = useSelector((state) => state.landlord); // Access user details from Redux store
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortStatusDropdown, setSortStatusDropdown] = useState(false);
  const [sortPropertyDropdown, setSortPropertyDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState({ propertyReference: 'asc', status: '' });
 const [token, setToken] = useState(null);
 const [leaseStartDate, setLeaseStartDate] = useState(null);
 const [leaseEndDate, setLeaseEndDate] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [property, setProperty] = useState(null);
 useEffect(() => {
  const landlordToken = localStorage.getItem('authToken');
  const agentLandlordToken = localStorage.getItem('authTokenAgentLandlord');
  
  // Check for tokens and set userId accordingly
  if (landlordToken) {
    setToken(landlordToken); // Set token
    setUserId(landlord.id); // Set userId for landlord
  } else if (agentLandlordToken) {
    setToken(agentLandlordToken); // Set token
    setUserId(agentLandlord.id); // Set userId for agentLandlord
  }
}, [landlord, agentLandlord]);

    
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/properties/requests`);
        const data = await response.json();
    
        
        // Filter requests based on userId matching the logged-in user's id
        const filteredData = data.filter((request) => request.property.userId === userId);
    
        setRequests(filteredData);
        setFilteredRequests(filteredData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
  
  useEffect(() => {
    fetchData();
  }, [landlord, agentLandlord, userId]);

 
   // Handle Logout
   const handleLogout = () => {
     dispatch(logout());    
    
   };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      const filtered = requests.filter((request) => 
        request.property.id.toString().includes(searchTerm) ||
        request.id.toString().includes(searchTerm) ||
        new Date(request.availableDate).toLocaleDateString().includes(searchTerm)
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  };
  

  const handleSortStatus = () => {
    setSortStatusDropdown((prev) => !prev);
    setSortPropertyDropdown(false); // Close other dropdown
  };

  const handleSortProperty = () => {
    setSortPropertyDropdown((prev) => !prev);
    setSortStatusDropdown(false); // Close other dropdown
  };

  const handleSortChange = (type, order) => {
    setSortOrder((prev) => ({
      ...prev,
      [type]: order,
    }));

    let sortedRequests;
    if (type === 'status') {
      sortedRequests = requests.filter((request) =>
        order ? request.status.includes(order) : true
      );
      setFilteredRequests(sortedRequests);
    } else if (type === 'propertyReference') {
      sortedRequests = [...requests].sort((a, b) => {
        return order === 'asc' ? a.id - b.id : b.id - a.id;
      });
      setFilteredRequests(sortedRequests);
    }

    // Close the dropdown after selecting
    if (type === 'status') setSortStatusDropdown(false);
    if (type === 'propertyReference') setSortPropertyDropdown(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }


  const handleViewDetails = (id) => {
    onViewDetailsRequest(id);
  };
  const handleRespond = async (requestId, property) => {
    try {
      // Ensure token exists
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }
  
      // Determine the agentDetails source
      const agentDetails =
        agentLandlord && token === localStorage.getItem("authTokenAgentLandlord")
          ? {
              id: agentLandlord.id,
              email: agentLandlord.email,
              phoneNumber: agentLandlord.phoneNumber,
              companyName: agentLandlord.companyName,
              companyAddress: agentLandlord.companyAddress,
            }
          : landlord && token === localStorage.getItem("authToken")
          ? {
              id: landlord.id,
              email: landlord.email,
              phoneNumber: landlord.phoneNumber,
              companyName: landlord.companyName,
              companyAddress: landlord.companyName,
            }
          : null;
  
      // Ensure agentDetails exists
      if (!agentDetails) {
        toast.error("Agent or landlord details not found in the store.");
        return;
      }
  
      // First API Call: Update Status (for request)
      const statusPayload = {
        status: "Resolved", // Or any other status you need
        requestId, // Add requestId
        agentDetails, // Add agentDetails
      };
  
      // Send the PUT request for status update
      const statusResponse = await fetch(`${baseUrl}/auth/status-update/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusPayload),
      });
  
      if (!statusResponse.ok) {
        if (statusResponse.status === 401) {
          toast.dismiss();
          toast.error(`Your session has expired. Please log in again.`);
          handleLogout();
          return;
        }
        throw new Error("Failed to update request status.");
      }
  
      const statusData = await statusResponse.json();
      console.log("Status update response:", statusData);
  
      // Second API Call: Update Property Details
      const formData = new FormData();
  
      // Append leaseStartDate and leaseEndDate from useState to formData
      formData.append("leaseStartDate", leaseStartDate || "");
      formData.append("leaseEndDate", leaseEndDate || "");
  
      // Spread the property details into FormData, but set the status to 'Let'
      Object.entries(property).forEach(([key, value]) => {
        if (key === "status") {
          // Override status field with 'Let'
          formData.append(key, "Let");
        } else if (Array.isArray(value)) {
          // Handle arrays
          value.forEach((item) => {
            if (item instanceof File) {
              formData.append(key, item); // Append file arrays (e.g., photos, floorPlans)
            } else {
              formData.append(key, item); // Append other array items
            }
          });
        } else if (typeof value === "boolean") {
          // Convert booleans to strings
          formData.append(key, value.toString());
        } else if (value instanceof File) {
          // Handle file uploads
          formData.append(key, value);
        } else {
          // Append other key-value pairs
          formData.append(key, value || "");
        }
      });
  
      // Make PUT request with FormData
      const propertyResponse = await fetch(`${baseUrl}/properties/${property.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!propertyResponse.ok) {
        if (propertyResponse.status === 401) {
          toast.dismiss();
          toast.error(`Your session has expired. Please log in again.`);
          handleLogout();
          return;
        }
        throw new Error("Failed to update property.");
      }
  
      const propertyData = await propertyResponse.json();
      toast.success("Responded successfully!");
      console.log("Property update response:", propertyData);
      fetchData();
  
    } catch (error) {
      console.error("Error updating status or property:", error);
      toast.error("Failed to update. Please try again.");
    }
  };
  


  // Open the modal and set requestId and property
  const handleOpenModal = (id, prop) => {
    setRequestId(id);
    setProperty(prop);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (leaseStartDate && leaseEndDate) {
      handleRespond(requestId, property);
      handleCloseModal();
      setLeaseEndDate(null);
      setLeaseStartDate(null);
    
    } else {
      alert("Please fill in both lease start and end dates.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold font-montserrat text-center pb-4 px-8 text-[#154D7C] mb-6">
        Requests Received
      </h2>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{zIndex:'999'}}>
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Enter Lease Dates</h2>

            {/* Lease Start Date */}
            <div className="mb-4">
              <label htmlFor="leaseStartDate" className="block text-sm font-medium mb-2">
                Lease Start Date
              </label>
              <input
                type="date"
                id="leaseStartDate"
                value={leaseStartDate || ""}
                onChange={(e) => setLeaseStartDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Lease End Date */}
            <div className="mb-4">
              <label htmlFor="leaseEndDate" className="block text-sm font-medium mb-2">
                Lease End Date
              </label>
              <input
                type="date"
                id="leaseEndDate"
                value={leaseEndDate || ""}
                onChange={(e) => setLeaseEndDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 px-4 py-2 rounded-full text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center space-y-6 mb-8">
        {/* Search Section */}
        <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg pb-4">
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for Requests"
            type="search"
            className="border border-[#C64C7B] rounded-full px-4 py-2 w-full focus:outline-none"
          />
          <button
            onClick={handleSearchClick}
            className="absolute inset-y-0 right-4 flex items-center justify-center text-[#C64C7B] hover:text-pink-500"
            style={{ top: '50%', right: '16px', transform: 'translateY(-70%)', background:'#fff' }}
          >
            <FiSearch size={24} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center font-montserrat space-y-4 sm:space-y-4 md:space-y-4 lg:space-y-0 lg:space-x-4 py-6">
        <div className="relative inline-block">
          <button
            onClick={handleSortStatus}
            className="bg-[#9FC8DA] text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#7BAAC8] transition"
          >
            Sort by Status
            <span className="absolute top-0 right-0 w-5 h-5 bg-white -translate-y-[55%] translate-x-[5%] rotate-45"></span>
          </button>
          {sortStatusDropdown && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-[#C64C7B]">
              <button
                onClick={() => handleSortChange('status', 'Open')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Open
              </button>
              <button
                onClick={() => handleSortChange('status', 'Pending')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Pending
              </button>
              <button
                onClick={() => handleSortChange('status', 'Resolved')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Resolved
              </button>
            </div>
          )}
        </div>

        <div className="relative inline-block">
          <button
            onClick={handleSortProperty}
            className="bg-[#9FC8DA] text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-[#7BAAC8] transition"
          >
            Sort by Property Reference
            <span className="absolute top-0 right-0 w-5 h-5 bg-white -translate-y-[55%] translate-x-[5%] rotate-45"></span>
          </button>
          {sortPropertyDropdown && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-[#C64C7B]">
              <button
                onClick={() => handleSortChange('propertyReference', 'asc')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Sort Ascending
              </button>
              <button
                onClick={() => handleSortChange('propertyReference', 'desc')}
                className="block px-4 py-2 text-left text-black hover:bg-[#C64C7B] hover:text-white"
              >
                Sort Descending
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      <div className="block lg:hidden overflow-x-auto px-4 pb-24">
  {/* Check if filteredRequests is an array and not empty */}
  {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
    filteredRequests.map((request, index) => (
      <div key={request.id} className="border border-[#154D7C] rounded-xl mb-4 bg-white shadow-sm p-4">
        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000]">Landlord Name:</div>
        <div className="text-sm md:text-lg text-black">{request.userId}</div>

        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Request Date:</div>
        <div className="text-sm md:text-lg text-black">{new Date(request.createdAt).toLocaleDateString()}</div>

        <div className="text-sm md:text-xl font-bold font-montserrat text-[#000000] mt-2">Property Reference:</div>
        <div className="text-sm md:text-lg text-black">{request.property.id}</div>

        <div className="text-sm md:md:text-xl font-bold font-montserrat text-[#000000] mt-2">Status:</div>
        <div className="text-sm md:text-lg text-black">{request.status.join(', ')}</div>

        <div className="mt-4 md:pt-4  md:space-x-6 flex justify-center space-x-2">
          <button className='requestedProperties requestedPropertiesViewbtn'>
            View Request
          </button>
          <button className='requestedProperties requestedPropertiesRespondBtn'
        onClick={() => handleOpenModal(request.id, request.property)}
      >
        Respond
      </button>
        </div>
      </div>
    ))
  ) : (
    <p>No requests found.</p>  // Show a message if no requests are available
  )}
</div>

<div className="hidden lg:block justify-center overflow-x-auto pb-24">
  <div className="w-full max-w-5xl">
    <table className="w-full border-collapse border border-[#154D7C] mx-auto">
      <thead>
        <tr className="bg-[#F0F4F8] font-montserrat">
          <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">Request ID</th>
          <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">Property Reference</th>
          <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">Request Date</th>
          <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">Status</th>
          <th className="px-6 py-3 text-left text-md font-bold text-[#000000] border border-[#154D7C]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <tr key={request.id} className="bg-white">
              <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">{request.id}</td>
              <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">{request.property.id}</td>
              <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                {new Date(request.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                {request.status.join(', ')}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700 border border-[#2E86AB]">
                <div className="flex flex-col space-y-2 lg:flex-col">
                  <button  className='requestedProperties requestedPropertiesViewbtn'
                    onClick={() => handleViewDetails(request)}
                  >
                    View Request
                  </button>
                  <button
        onClick={() => handleOpenModal(request.id, request.property)}
         className='requestedProperties requestedPropertiesRespondBtn'
      >
        Respond
      </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">No requests found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}

export default RequestReceived;
