import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setLandlord } from './landlordSlice';
import { jwtDecode } from 'jwt-decode'; 
import { setCareProvider } from './careProviderSlice';
import { baseUrl } from '../const/url.const';
import { setAgentLandlord } from './agentLandlordSlice';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const token = data.token;
    const user = data.user;

    if (user.type === 'landlord') {
      dispatch(setLandlord(user));
    } else if (user.type === 'careprovider') {
      dispatch(setCareProvider(user));
    } else if (user.type === 'agentlandlord') {
      dispatch(setAgentLandlord(user));
    }

    return {
      token,
      user,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
const initialState = {
  isAuthenticatedLandlord: !!localStorage.getItem('authToken'),
  isAuthenticatedCareProvider: !!localStorage.getItem('authTokenCareProvider'),
  isAuthenticatedAgentLandlord: !!localStorage.getItem('authTokenAgentLandlord'),
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticatedLandlord = false;
      state.isAuthenticatedCareProvider = false;
      state.isAuthenticatedAgentLandlord = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenCareProvider');
      localStorage.removeItem('authTokenAgentLandlord');
    },
    setUserFromToken: (state, action) => {
      state.user = action.payload.user;
      if (action.payload.user.type === 'landlord') {
        state.isAuthenticatedLandlord = true;
      } else if (action.payload.user.type === 'careprovider') {
        state.isAuthenticatedCareProvider = true;
      } else if (action.payload.user.type === 'agentlandlord') {
        state.isAuthenticatedAgentLandlord = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const { token, user } = action.payload;

        // Store token in local storage and update state based on user type
        if (user.type === 'landlord') {
          localStorage.setItem('authToken', token);
          state.isAuthenticatedLandlord = true;
        } else if (user.type === 'careprovider') {
          localStorage.setItem('authTokenCareProvider', token);
          state.isAuthenticatedCareProvider = true;
        } else if (user.type === 'agentlandlord') {
          localStorage.setItem('authTokenAgentLandlord', token);
          state.isAuthenticatedAgentLandlord = true;
        }

        state.user = user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Add a check for token on page load and populate the state
export const checkUserToken = () => (dispatch) => {
  const landlordToken = localStorage.getItem('authToken');
  const careProviderToken = localStorage.getItem('authTokenCareProvider');
  const agentLandlordToken = localStorage.getItem('authTokenAgentLandlord');

  if (landlordToken) {
    try {
      const decodedToken = jwtDecode(landlordToken);
      dispatch(setLandlord(decodedToken));
      dispatch(setUserFromToken({
        user: {
          ...decodedToken,
          landlordDetails: decodedToken.landlordDetails,
        },
      }));
    } catch (error) {
      console.error('Landlord token decoding failed:', error);
    }
  } else if (careProviderToken) {
    try {
      const decodedToken = jwtDecode(careProviderToken);

      if (decodedToken.careProviderDetails) {
        dispatch(setCareProvider(decodedToken));
        dispatch(setUserFromToken({
          user: {
            ...decodedToken,
            careProviderDetails: decodedToken.careProviderDetails,
          },
        }));
      } else {
        console.error('CareProviderDetails not found in token');
      }
    } catch (error) {
      console.error('Care Provider token decoding failed:', error);
    }
  } else if (agentLandlordToken) {
    try {
      const decodedToken = jwtDecode(agentLandlordToken);

      if (decodedToken.agentLandlordDetails) {
        dispatch(setAgentLandlord(decodedToken));
        dispatch(setUserFromToken({
          user: {
            ...decodedToken,
            agentLandlordDetails: decodedToken.agentLandlordDetails,
          },
        }));
      } else {
        console.error('AgentLandlordDetails not found in token');
      }
    } catch (error) {
      console.error('Agent Landlord token decoding failed:', error);
    }
  }
};

export const { logout, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
