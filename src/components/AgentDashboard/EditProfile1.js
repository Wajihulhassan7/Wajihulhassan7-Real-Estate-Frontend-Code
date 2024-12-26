import React, { useEffect, useState } from "react";
import "../../assets/css/dashboardEditProfile/dashboardEditProfile.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAgentLandlord } from "../../Redux/agentLandlordSlice"; 
import { baseUrl } from "../../const/url.const";
const EditProfile1 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agentLandlord = useSelector((state) => state.agentLandlord); 
  const [isEditing, setIsEditing] = useState(false);
   const [token, setToken] = useState(null);
   const [formData, setFormData] = useState({
    fullName: agentLandlord.fullName,
    phoneNumber: agentLandlord.phoneNumber,
    email: agentLandlord.email,
    companyName: agentLandlord.companyName,
    companyAddress: agentLandlord.companyAddress,
    totalManagedLandlords: agentLandlord.totalManagedLandlords,
    landlordEmails: agentLandlord.landlordEmails?.map((landlord) => ({
      landlordEmail: landlord.landlordEmail || '',
      landlordDetails: landlord.landlordDetails || {},
    })) || [],
  });
  
  
    useEffect(() => {
     
      const landlordToken = localStorage.getItem('authToken');
      const agentLandlordToken = localStorage.getItem('authTokenAgentLandlord');
  
      if (landlordToken) {
        setToken(landlordToken);
      } else if (agentLandlordToken) {
        setToken(agentLandlordToken);
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

  const handleLandlordEmailChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedLandlordEmails = [...prevData.landlordEmails];
      updatedLandlordEmails[index] = {
        ...updatedLandlordEmails[index],
        landlordEmail: value, // Update only the email
      };
      return { ...prevData, landlordEmails: updatedLandlordEmails };
    });
  };
  console.log(formData);

  const addLandlordEmail = () => {
    setFormData((prevData) => ({
      ...prevData,
      landlordEmails: [
        ...prevData.landlordEmails,
        { landlordEmail: "", landlordDetails: {} }, 
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
      // Step 1: Update basic user details (name and email)
      const userData = {
        name: formData.fullName,
        email: formData.email,
      };
  
      const userResponse = await axios.put(
        `${baseUrl}/auth/users/${agentLandlord.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User details updated:", userResponse.data);
  
      // Step 2: Update agent landlord-specific details
      const agentLandlordData = {
        companyAddress: formData.companyAddress,
        phoneNumber: formData.phoneNumber, // Changed to phoneNumber from formData.phone
        totalManagedLandlords: parseInt(formData.totalManagedLandlords, 10),
        companyName: formData.companyName,
        landlordEmails: formData.landlordEmails.map((landlord) => ({
          landlordEmail: landlord.landlordEmail,
          landlordDetails: landlord.landlordDetails || {}, // Including landlord details
        })),
      };
      
  
      const agentLandlordResponse = await axios.put(
        `${baseUrl}/auth/agent-landlord/${agentLandlord.agentId}`,
        agentLandlordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Agent landlord details updated:", agentLandlordResponse.data);
  
      // Step 3: Fetch updated agent landlord details
      const updatedAgentLandlordResponse = await axios.get(
        `${baseUrl}/auth/users/${agentLandlord.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedAgentLandlordData = updatedAgentLandlordResponse.data;
      dispatch(setAgentLandlord(updatedAgentLandlordData));
  
      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success("Details updated successfully.");
    } catch (error) {
      console.error("Error updating agent landlord details:", error);
      toast.dismiss(loadingToast);
      toast.error("An error occurred while updating your details.");
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
            value={isEditing ? formData.fullName : agentLandlord.fullName}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder={!isEditing ? agentLandlord.fullName : ""}
            className={isEditing ? "editable" : ""}
          />
        </div>

        <div className="formField">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={isEditing ? formData.phoneNumber : agentLandlord.phoneNumber}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder={!isEditing ? agentLandlord.phoneNumber : ""}
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
            value={isEditing ? formData.email : agentLandlord.email}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder={!isEditing ? agentLandlord.email : ""}
            className={isEditing ? "editable" : ""}
          />
        </div>

        <div className="formField">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={isEditing ? formData.companyName : agentLandlord.companyName}
            disabled={!isEditing}
            onChange={handleChange}
            placeholder={!isEditing ? agentLandlord.companyName : ""}
            className={isEditing ? "editable" : ""}
          />
        </div>
</div>
<div className="flexRow">
        <div className="formField">
          <label htmlFor="companyAddress">Company Address</label>
          <input
            type="text"
            name="companyAddress"
            id="companyAddress"
            value={
              isEditing
                ? formData.companyAddress
                : agentLandlord.companyAddress
            }
            disabled={!isEditing}
            onChange={handleChange}
            placeholder={!isEditing ? agentLandlord.companyAddress : ""}
            className={isEditing ? "editable" : ""}
          />
        </div>

        <div className="formField">
          <label htmlFor="totalPropertiesManaged">
            Total Landlords Managed
          </label>
          <input
            type="text"
            name="totalManagedLandlords"
            id="totalManagedLandlords"
            value={
              isEditing
                ? formData.totalManagedLandlords
                : agentLandlord.totalManagedLandlords
            }
            disabled={!isEditing}
            onChange={handleChange}
            placeholder={
              !isEditing ? agentLandlord.totalManagedLandlords : ""
            }
            className={isEditing ? "editable" : ""}
          />
        </div>
</div>


      {/* Landlord Email Fields */}
      {formData.landlordEmails?.map((landlord, index) => (
        <div className="flexRow" key={index}>
          <div className="formField">
            <label htmlFor={`email-${index}`}>Landlord Email Address</label>
            <input
              type="email"
              name={`landlordEmail-${index}`}
              id={`email-${index}`}
              value={isEditing ? landlord.landlordEmail : landlord.landlordEmail}
              disabled={!isEditing}
              onChange={(e) => handleLandlordEmailChange(e, index)}
              placeholder={!isEditing ? landlord.landlordEmail : ""}
              className={isEditing ? "editable" : ""}
            />
          </div>
          
          {/* Only render the phone number if it's an existing landlord */}
          {landlord.landlordDetails?.phoneNumber && (
            <div className="formField">
              <label htmlFor={`phone-${index}`}>Landlord Phone Number</label>
              <input
                type="text"
                name={`landlordPhone-${index}`}
                id={`phone-${index}`}
                value={landlord.landlordDetails.phoneNumber}
                disabled
                placeholder={landlord.landlordDetails.phoneNumber}
                className="disabled"
              />
            </div>
          )}
        </div>
      ))}
      {/* Add Another Landlord Button */}
      {isEditing && (
        <button
          type="button"
          onClick={addLandlordEmail}
          className="smallButton"
        >
          Add Another Landlord
        </button>
      )}


        {isEditing && <button type="submit">Save</button>}
      </form>
    </div>
  );
};

export default EditProfile1;
