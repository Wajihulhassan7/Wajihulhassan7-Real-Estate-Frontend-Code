import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import landlordReducer from './landlordSlice';
import agentLandlordReducer from './agentLandlordSlice';
import careProviderReducer from './careProviderSlice';
import agentCareProviderReducer from './agentCareProviderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    landlord: landlordReducer,
    agentLandlord: agentLandlordReducer,
    careProvider: careProviderReducer,
    agentCareProvider: agentCareProviderReducer,
  },
});

export default store;
