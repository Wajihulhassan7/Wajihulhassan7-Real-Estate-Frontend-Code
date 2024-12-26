import React, { useState } from "react";
import axios from "axios";
import img from '../assets/img/houses/house11.png';
import { baseUrl } from "../const/url.const";
import { useNavigate } from "react-router-dom";

const RegistrationAgent = () => {
   const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyAddress: "",
    password: "",
    totalManagedLandlords: "",
    landlordEmail: [],
  });
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAddEmail = () => {
    if (currentEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(currentEmail)) {
        setEmailError("Please enter a valid email address");
      } else {
        setFormData((prevData) => ({
          ...prevData,
          landlordEmail: [...prevData.landlordEmail, currentEmail],
        }));
        setCurrentEmail(""); // Clear the input
        setEmailError(""); // Clear any previous errors
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "totalManagedLandlords" ? parseInt(value, 10) || 0 : value,
    }));
  
  };
  

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setProgress(100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  handleAddEmail();

  // Check for errors after attempting to add the email
  if (emailError) {
    alert("Please fix the errors in the form before submitting.");
    return;
  }

  console.log(formData);
  
    try {
      // Step 1: Send basic care provider data to `/auth/register`
      await axios.post(`${baseUrl}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: "agentlandlord",
      });
  
      await axios.post(`${baseUrl}/auth/register-agent-landlord`, {
        email: formData.email, 
        companyAddress: formData.companyAddress,
        phoneNumber: formData.phoneNumber,
        totalManagedLandlords: parseInt(formData.totalManagedLandlords, 10),
        companyName: formData.companyName,
        landlordEmails: formData.landlordEmail.map((email) => ({ landlordEmail: email })), 
        type: "agentlandlord",
      });
      

      setSuccessMessage("Registration Successful! Welcome to the CareConnect family.");
      setStep(0);
      setProgress(100);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to register care provider details. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen w-full bg-[#212727]">
      <div className="lg:flex-1 flex flex-col justify-center items-center bg-[#1762A9] p-6 lg:p-8 text-center">
        <img src={img} alt="Welcome" className="rounded-lg shadow-lg w-3/4 lg:w-1/2 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 mt-10">Agent Registeration</h1>
        <p className="text-white text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-12">
        For agents dedicated to sourcing housing for care providers, PropertyConnectHub is your partner in finding compliant, reliable options faster. Join our network to connect with landlords and listings tailored for the care sector, reducing time spent on searches and giving you direct access to trusted properties. 
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-white p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-lg mx-auto">
          <div className="mb-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-[#1762A9] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="text-[#212727] ml-4 text-xs sm:text-sm">{progress}% Completed</span>
            </div>

            {successMessage && (
              <div className="p-4 mb-6 bg-green-100 text-green-800 border border-green-300 rounded-md shadow-md">
                <h2 className="text-lg sm:text-2xl font-semibold">🎉 {successMessage} 🎉</h2>
                <p className="mt-2">You can now access and manage the best housing opportunities for your clients.</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <h2 className="text-lg sm:text-2xl font-semibold text-[#212727] mb-4 text-center">Basic Information</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-sm text-[#1762A9]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  
                </div>
                <button type="submit" className="mt-6 p-3 bg-[#1762A9] text-white font-bold rounded-md w-full">
                  Next
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg sm:text-2xl font-semibold text-[#212727] mb-4 text-center">Additional Information</h2>
                <div className="space-y-4">
                  
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Telephone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                
                <input
        type="text"
        id="companyName"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        required
        placeholder="Company Name"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
      />
      <input
        type="text"
        id="companyAddress"
        name="companyAddress"
        value={formData.companyAddress}
        onChange={handleChange}
        required
        placeholder="Company Registered Address"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
      />
    

<input
        type="number"
        id="totalManagedLandlords"
        name="totalManagedLandlords"
        value={formData.totalManagedLandlords}
        onChange={handleChange}
        required
        placeholder="Total Managed Landlords"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
      />


<div className="flex items-center space-x-2">
        <input
          type="email"
          id="landlordEmail"
          name="landlordEmail"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          placeholder="Landlord Email Address"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
        />
        <button
          type="button"
          onClick={handleAddEmail}
          className=" bg-[#1762A9] text-white rounded-md hover:bg-[#124e88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1762A9]"
          style={{width:'150px', height:'50px'}}
        >
          Add More
        </button>
      </div>
  
                   </div>
                <button type="submit" className="mt-6 p-3 bg-[#1762A9] text-white font-bold rounded-md w-full" onClick={handleAddEmail}>
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationAgent;
