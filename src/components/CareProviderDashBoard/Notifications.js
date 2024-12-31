import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../const/url.const';
import { logout } from '../../Redux/authSlice';
const Notifications = () => {
    const careProvider = useSelector((state) => state.careProvider); // Ensure correct state mapping
    const [listings, setListings] = useState([]);
    const [visibleListings, setVisibleListings] = useState(5);
    const [statusUpdates, setStatusUpdates] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
   const [token, setToken] = useState(null);
   
       useEffect(() => {
        
         const authTokenCareProvider = localStorage.getItem('authTokenCareProvider');
        
         if (authTokenCareProvider) {
           setToken(authTokenCareProvider);
         }
       }, []);
    
       const fetchRequests = async () => {
        try {
          const response = await fetch(`${baseUrl}/properties/requests`);
          if (!response.ok) {
            throw new Error("Failed to fetch property requests.");
          }
          
          const data = await response.json();
    
         
          if (data.message && data.message === "Error fetching all requests") {
            throw new Error("Error fetching all property requests.");
          }
    
          // Filter listings by careProvider ID
          const filteredListings = data.filter((item) => 
            item.userId === careProvider.id && 
            (item.status.includes('Resolved') || item.status.includes('Leased'))
          );
            setListings(filteredListings);
        } catch (error) {
          console.error("Error fetching requests:", error);
         
        }
      };

      const fetchStatusUpdates = async () => {
        try {
          const response = await fetch(`${baseUrl}/auth/status-updates`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch status updates.");
          }
          const data = await response.json();
          setStatusUpdates(data.statusUpdates || []);
        } catch (error) {
          console.error("Error fetching status updates:", error);
        }
      };

       useEffect(() => {
        fetchStatusUpdates();
      fetchRequests();
    }, [careProvider.id]);
    
  

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());    
    navigate('/login');
  };
  
  const handleUpdateNotification = async (requestId) => {
    try {
     
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }
  
      // Construct the payload
      const payload = {
        notificationView: true,
      };
  
      // Send the PUT request
      const response = await fetch(`${baseUrl}/properties/request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
         if (response.status === 401) {
                  toast.dismiss();
                  toast.error(`Your session has expired. Please log in again.`);
                  handleLogout();
                  return;
        }

        throw new Error("Failed to update notification status.");
      }
  
      const data = await response.json();
      toast.success("Notification marked as read!");
      console.log("Response data:", data);
      fetchRequests();
  
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast.error("Failed to update notification. Please try again.");
    }
  };
  
  
    return (
      <div className="flex pt-8">
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold pb-8 text-center font-raleway text-[#154D7C] mb-6">
              My Notifications
            </h1>
  
            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-x-auto pb-24">
      <table className="w-full border-collapse border border-[#154D7C] min-w-[350px]">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
              Request Id
            </th>
            <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
              Request Status
            </th>
            <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
              Agent Id
            </th>
            <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
              Agent Email
            </th>
            <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
              Lease Term
            </th>
            <th className="px-6 py-3 text-left text-md font-raleway font-bold text-[#000000] border border-[#154D7C]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {listings.slice(0, visibleListings).map((listing) => {
            // Find the matching status update for the listing
            const statusUpdate = statusUpdates.find(
              (update) => update.requestId === listing.id
            );

            return (
              <tr key={listing.id} className="bg-white">
                <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                  {listing.id}
                </td>
                <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                  {statusUpdate ? statusUpdate.status : "N/A"}
                </td>
                <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                  {statusUpdate ? statusUpdate.agentDetails.id : "N/A"}
                </td>
                <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                  {statusUpdate ? statusUpdate.agentDetails.email : "N/A"}
                </td>
                <td className="px-6 py-3 text-sm text-[#000000] border border-[#154D7C]">
                  Start: &nbsp;{listing.property.leaseStartDate.split('T')[0]}  &nbsp;&nbsp;&nbsp; End: &nbsp;{  listing.property.leaseEndDate.split('T')[0]}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700 border border-[#154D7C]">
                  <div className="flex space-x-2">
                    {listing.notificationView ? (
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm cursor-not-allowed"
                        disabled
                      >
                        Read
                      </button>
                    ) : (
                      <button
                        className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm"
                        onClick={() => handleUpdateNotification(listing.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Card view for smaller screens (Notifications) */}
<div className="sm:hidden">
  {listings.slice(0, visibleListings).map((listing) => (
    <div
      key={listing.id}
      className="border border-[#154D7C] rounded-xl mb-2 bg-white shadow-sm p-4"
    >
      {/* Request Id */}
      <div className="text-sm font-bold text-[#000000]">Request Id:</div>
      <div className="text-sm text-black">{listing.id}</div>

      {/* Request Status */}
      <div className="text-sm font-bold text-[#000000] mt-2">Request Status:</div>
      <div className="text-sm text-black">
        {statusUpdates.find((update) => update.requestId === listing.id)?.status || "N/A"}
      </div>

      {/* Agent Id */}
      <div className="text-sm font-bold text-[#000000] mt-2">Agent Id:</div>
      <div className="text-sm text-black">
        {statusUpdates.find((update) => update.requestId === listing.id)?.agentDetails.id || "N/A"}
      </div>

      {/* Agent Email */}
      <div className="text-sm font-bold text-[#000000] mt-2">Agent Email:</div>
      <div className="text-sm text-black">
        {statusUpdates.find((update) => update.requestId === listing.id)?.agentDetails.email || "N/A"}
      </div>

      {/* Lease Term (Start & End Dates) */}
      <div className="text-sm font-bold text-[#000000] mt-2">Lease Term:</div>
      <div className="text-sm text-black">
        Start: {listing.property.leaseStartDate.split('T')[0]} &nbsp; End: {listing.property.leaseEndDate.split('T')[0]}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
                    {listing.notificationView ? (
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm cursor-not-allowed"
                        disabled
                      >
                        Read
                      </button>
                    ) : (
                      <button
                        className="bg-[#C64C7B] text-white px-4 py-1 rounded-full text-sm"
                        onClick={() => handleUpdateNotification(listing.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </div>
    );
  };
  

export default Notifications