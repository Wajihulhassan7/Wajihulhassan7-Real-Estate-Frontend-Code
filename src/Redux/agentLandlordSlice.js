import { createSlice } from '@reduxjs/toolkit';

const agentLandlordSlice = createSlice({
  name: 'agentLandlord',
  initialState: {
    id: null,
    agentId: null,
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companyAddress: '',
    totalManagedLandlords: '',
    landlordEmails: [], // Array to store landlord emails with details
  },
  reducers: {
    setAgentLandlord: (state, action) => {
      const {
        id,
        name: fullName,
        email,
        agentLandlordDetails: {
          id: agentId,
          phoneNumber,
          companyName,
          companyAddress,
          totalManagedLandlords,
          landlordEmails,
        },
      } = action.payload;

      return {
        ...state,
        id,
        agentId,
        fullName,
        email,
        phoneNumber,
        companyName,
        companyAddress,
        totalManagedLandlords,
        landlordEmails: landlordEmails.map(({ landlordEmail, landlordDetails }) => ({
          landlordEmail,
          landlordDetails: landlordDetails
            ? {
                id: landlordDetails.id,
                email: landlordDetails.email,
                phoneNumber: landlordDetails.phoneNumber,
                companyName: landlordDetails.companyName,
                totalPropertiesManaged: landlordDetails.totalPropertiesManaged,
                interestInSellingProperty: landlordDetails.interestInSellingProperty,
                optionToBuy: landlordDetails.optionToBuy,
              }
            : null,
        })),
      };
    },
    clearAgentLandlord: () => ({
      id: null,
      agentId: null,
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      companyAddress: '',
      totalManagedLandlords: '',
      landlordEmails: [], // Reset to empty array
    }),
  },
});

export const { setAgentLandlord, clearAgentLandlord } = agentLandlordSlice.actions;
export default agentLandlordSlice.reducer;
