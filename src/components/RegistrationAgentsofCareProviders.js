import React, { useState } from "react";
import axios from "axios";
import image11 from '../assets/new_home_images/pexels-binyaminmellish-1396122.jpg';
import { baseUrl } from "../const/url.const";
import { useNavigate } from "react-router-dom";

const  RegistrationAgentsofCareProviders = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyType: "",
    password: "",
    yearsInBusiness: "",
    numberOfEmployees: "",
    totalManagedCareProviders: "",
    careProviderEmail: [],
  });
  const [emailError, setEmailError] = useState("");
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 const [currentEmail, setCurrentEmail] = useState("");

  const handleAddEmail = () => {
    if (currentEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(currentEmail)) {
        setEmailError("Please enter a valid email address");
      } else {
        setFormData((prevData) => ({
          ...prevData,
          careProviderEmail: [...prevData.careProviderEmail, currentEmail],
        }));
        setCurrentEmail(""); // Clear the input
        setEmailError(""); // Clear any previous errors
      }
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
   
    if (emailError) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
  
   
  
    try {
      // Step 1: Send basic care provider data to `/auth/register`
      await axios.post(`${baseUrl}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: "agentcareprovider",  
      });
  
      await axios.post(`${baseUrl}/auth/register-agent-care-provider`, {
        name: formData.name,
        email: formData.email,
        companyAddress: formData.companyAddress,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        companyType: formData.companyType,
        yearsInBusiness: parseInt(formData.yearsInBusiness, 10), // Parsing number
        numberOfEmployees: parseInt(formData.numberOfEmployees, 10), // Parsing number
        totalManagedCareProviders: parseInt(formData.totalManagedCareProviders, 10), // Parsing number
        careProviderEmails: formData.careProviderEmail.map((email) => ({ careProviderEmail: email })),  // Mapping care provider emails
      
      });
  
      // Step 3: Display success message and redirect
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
        <img src={image11} alt="Welcome" className="rounded-lg shadow-lg w-3/4 lg:w-1/2 mb-4 registerSectionImg" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 mt-10">Agent for Care Provider Registeration</h1>
        <p className="text-white text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-12">
        For agents sourcing housing for care providers, PropertyConnectHub streamlines your search process by connecting you to trusted landlords and compliant properties tailored to the care sector. Save time, access reliable listings, and focus on meeting the unique needs of your clients.
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
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  >
                    <option value="">Select Company Type</option>
                    <option value="Sourcing Company">Sourcing Company</option>
                    <option value="Care Provider with a Separate Sourcing Team">Care Provider with a Separate Sourcing Team</option>
                  </select>
                  <input
                    type="number"
                    name="yearsInBusiness"
                    placeholder="Years in Business"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  <input
                    type="number"
                    name="numberOfEmployees"
                    placeholder="Number of Employees"
                    value={formData.numberOfEmployees}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  <input
                    type="number"
                    name="totalManagedCareProviders"
                    placeholder="Total Managed Care Providers"
                    value={formData.totalManagedCareProviders}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                </div>

                
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



export default RegistrationAgentsofCareProviders;
