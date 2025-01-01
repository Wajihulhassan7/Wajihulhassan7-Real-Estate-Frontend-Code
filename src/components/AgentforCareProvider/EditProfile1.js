import React, { useEffect, useState } from "react";
import "../../assets/css/dashboardEditProfile/dashboardEditProfile.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAgentCareProvider } from "../../Redux/agentCareProviderSlice"; 
import { baseUrl } from "../../const/url.const";

const EditProfile1 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agentCareProvider = useSelector((state) => state.agentCareProvider); 
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    fullName: agentCareProvider.fullName,
    phoneNumber: agentCareProvider.phoneNumber,
    email: agentCareProvider.email,
    companyName: agentCareProvider.companyName,
    companyType: agentCareProvider.companyType,
    yearsInBusiness: agentCareProvider.yearsInBusiness,
    numberOfEmployees: agentCareProvider.numberOfEmployees,
    totalManagedCareProviders: agentCareProvider.totalManagedCareProviders,
    careProviderEmails: agentCareProvider.careProviderEmails?.map((provider) => ({
      careProviderEmail: provider.careProviderEmail || '',
      careProviderDetails: provider.careProviderDetails || {},
    })) || [],
  });

  useEffect(() => {
    const careProviderToken = localStorage.getItem('authTokenAgentCareProvider');

    if (careProviderToken) {
      setToken(careProviderToken);
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCareProviderEmailChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedCareProviderEmails = [...prevData.careProviderEmails];
      updatedCareProviderEmails[index] = {
        ...updatedCareProviderEmails[index],
        careProviderEmail: value, // Update only the email
      };
      return { ...prevData, careProviderEmails: updatedCareProviderEmails };
    });
  };

  const addCareProviderEmail = () => {
    setFormData((prevData) => ({
      ...prevData,
      careProviderEmails: [
        ...prevData.careProviderEmails,
        { careProviderEmail: "", careProviderDetails: {} },
      ],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setIsEditing(false);
  
    if (!token) {
      toast.dismiss();
      toast.error("You are not authenticated. Please log in again.");
      return;
    }
  
    // Show loading toast
    const loadingToast = toast.loading("Updating details...");
  
    try {
      // Step 1: Update basic user details (full name, email, and phone)
      const userData = {
        name: formData.fullName,
        email: formData.email,
      
      };
  
      const userResponse = await axios.put(
        `${baseUrl}/auth/users/${agentCareProvider.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      
  
      // Step 2: Update agent care provider-specific details
      const agentCareProviderData = {
        companyName: formData.companyName,
        companyType: formData.companyType,
        phoneNumber: formData.phoneNumber,
        totalManagedCareProviders: parseInt(formData.totalManagedCareProviders, 10),
        yearsInBusiness: formData.yearsInBusiness,
        numberOfEmployees: formData.numberOfEmployees,
        careProviderEmails: formData.careProviderEmails.map((provider) => ({
          careProviderEmail: provider.careProviderEmail,
          careProviderDetails: provider.careProviderDetails || {}, // Including care provider details
        })),
      };
  
      const agentCareProviderResponse = await axios.put(
        `${baseUrl}/auth/agent-care-provider/${agentCareProvider.agentCareProviderId}`,
        agentCareProviderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
       // Step 3: Fetch updated agent care provider details
      const updatedAgentCareProviderResponse = await axios.get(
        `${baseUrl}/auth/users/${agentCareProvider.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedAgentCareProviderData = updatedAgentCareProviderResponse.data;
      dispatch(setAgentCareProvider(updatedAgentCareProviderData));
  
      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success("Details updated successfully.");
    } catch (error) {
      toast.dismiss(loadingToast);
  
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
  };
  

  return (
    <div className="editProfile">
        <div className="editProfileTopBar">
            <h1>Edit Profile</h1>
            <button className="editProfileBtn" onClick={handleEditClick}>
                Edit Details
            </button>
        </div>
        <form className="editProfileForm" onSubmit={handleSave}>
            <div className="flexRow">
                <div className="formField">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={isEditing ? formData.fullName : agentCareProvider.fullName}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.fullName : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
                <div className="formField">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={isEditing ? formData.phoneNumber : agentCareProvider.phoneNumber}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.phoneNumber : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
            </div>
            <div className="flexRow">
                <div className="formField">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={isEditing ? formData.email : agentCareProvider.email}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.email : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
                <div className="formField">
                    <label htmlFor="companyName">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        value={isEditing ? formData.companyName : agentCareProvider.companyName}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.companyName : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
            </div>
            <div className="flexRow">
                <div className="formField">
                    <label htmlFor="companyType">Company Type</label>
                    <input
                        type="text"
                        name="companyType"
                        id="companyType"
                        value={isEditing ? formData.companyType : agentCareProvider.companyType}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.companyType : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
                <div className="formField">
                    <label htmlFor="yearsInBusiness">Years in Business</label>
                    <input
                        type="number"
                        name="yearsInBusiness"
                        id="yearsInBusiness"
                        value={isEditing ? formData.yearsInBusiness : agentCareProvider.yearsInBusiness}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.yearsInBusiness : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
            </div>
            <div className="flexRow">
                <div className="formField">
                    <label htmlFor="numberOfEmployees">Number of Employees</label>
                    <input
                        type="number"
                        name="numberOfEmployees"
                        id="numberOfEmployees"
                        value={isEditing ? formData.numberOfEmployees : agentCareProvider.numberOfEmployees}
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.numberOfEmployees : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
                <div className="formField">
                    <label htmlFor="totalManagedCareProviders">
                        Total Managed Care Providers
                    </label>
                    <input
                        type="number"
                        name="totalManagedCareProviders"
                        id="totalManagedCareProviders"
                        value={
                            isEditing
                                ? formData.totalManagedCareProviders
                                : agentCareProvider.totalManagedCareProviders
                        }
                        disabled={!isEditing}
                        onChange={handleChange}
                        placeholder={!isEditing ? agentCareProvider.totalManagedCareProviders : ""}
                        className={isEditing ? "editable" : ""}
                    />
                </div>
            </div>
            
<div className="editProfileTopBar" style={{marginBottom:'25px'}}>
<h1 
  style={{
    fontSize: '19px',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)' // Light shadow effect
  }}
>
  Care Provider Details
</h1>
</div>
            {formData.careProviderEmails?.map((provider, index) => (
                <div className="flexRow" key={index}>
                    <div className="formField">
                        <label htmlFor={`careProviderEmail-${index}`}>Care Provider Email</label>
                        <input
                            type="email"
                            name={`careProviderEmail-${index}`}
                            id={`careProviderEmail-${index}`}
                            value={isEditing ? provider.careProviderEmail : provider.careProviderEmail}
                            disabled={!isEditing}
                            onChange={(e) => handleCareProviderEmailChange(e, index)}
                            placeholder={!isEditing ? provider.careProviderEmail : ""}
                            className={isEditing ? "editable" : ""}
                        />
                    </div>
                    {provider.careProviderDetails?.address && (
                        <div className="formField">
                            <label htmlFor={`careProviderAddress-${index}`}>Care Provider Address (Read only)</label>
                            <input
                                type="text"
                                name={`careProviderAddress-${index}`}
                                id={`careProviderAddress-${index}`}
                                value={provider.careProviderDetails.address}
                                disabled
                                placeholder={provider.careProviderDetails.address}
                                className="disabled"
                            />
                        </div>
                    )}
                </div>
            ))}
            {isEditing && (
                <button
                    type="button"
                    onClick={addCareProviderEmail}
                    className="smallButton"
                >
                    Add Another Care Provider
                </button>
            )}
            {isEditing && <button type="submit" className="saveButton">Save</button>}
        </form>
    </div>
);
};

export default EditProfile1;
