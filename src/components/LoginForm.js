import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/authSlice';
import bg from '../assets/img/house21.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };
  // Accessing authentication state
  const { loading, error, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Logging in...");
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((result) => {
        const token = result.token;
        const userType = result.user.type;
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Login successful!");
        console.log('Token:', token);

        // Navigate based on user type
        if (userType === 'landlord') {
          navigate('/LandlordDashboard');
        } else if (userType === 'careprovider') {
          navigate('/careproviderdashboard');
        } else if (userType === 'agentlandlord') {
          navigate('/agentdashboard');
        } else if (userType === 'agentcareprovider') {
          navigate('/agent-careprovider-dashboard');
        }
         else {
          toast.error('Unknown user type');
        }
      })
      .catch((err) => {
        toast.dismiss(); // Dismiss the loading toast
        toast.error(`Login failed: ${err}`);
        console.error('Login failed:', err);
      });
  };  
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div
      className="relative flex justify-center items-center h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 1,
      }}
    >
      <div className="absolute inset-0 bg-gray-800 opacity-40"></div>

      {/* Login Form */}
      <div className="relative w-full max-w-sm bg-white shadow-md rounded-lg p-8 z-10">
        <h2 className="text-2xl font-semibold text-center text-[#2E86AB] mb-6">Login</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative w-full">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1762A9]"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-[#1762A9] mt-[25px]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

          <button
            type="submit"
            className="w-full text-white font-semibold py-2 px-4 rounded-lg focus:outline-none mt-[30px]"
            style={{ backgroundColor: '#C64C7B' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
      Don't have an account?{' '}
      <button 
        onClick={toggleDropdown} 
        className="text-[#154D7C] hover:underline focus:outline-none"
      >
        Register
      </button>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute mt-8 bg-white border border-[#154D7C] rounded-lg shadow-lg z-10 w-48" style={{marginLeft:'40%'}}>
          <Link to="/register-care-provider">
            <button className="w-full text-left px-4 py-2 text-sm text-[#154D7C] hover:bg-[#C64C7B] hover:text-white">
              Register as Care Provider
            </button>
          </Link>
          <Link to="/register-agents-care-provider">
            <button className="w-full text-left px-4 py-2 text-sm text-[#154D7C] hover:bg-[#C64C7B] hover:text-white">
              Register as Agent for CP
            </button>
          </Link>
          <Link to="/register-landlord">
            <button className="w-full text-left px-4 py-2 text-sm text-[#154D7C] hover:bg-[#C64C7B] hover:text-white">
              Register as Landlord
            </button>
          </Link>
          <Link to="/register-agent">
            <button className="w-full text-left px-4 py-2 text-sm text-[#154D7C] hover:bg-[#C64C7B] hover:text-white">
              Register as Landlord Agent
            </button>
          </Link>
        </div>
      )}
    </p>
      </div>
    </div>
  );
};

export default LoginForm;
