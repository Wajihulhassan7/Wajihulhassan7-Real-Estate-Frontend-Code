import { createSlice } from '@reduxjs/toolkit';

const agentCareProviderSlice = createSlice({
  name: 'agentCareProvider',
  initialState: {
    id: null,
    agentCareProviderId: null,
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companyType: '',
    yearsInBusiness: null,
    numberOfEmployees: null,
    totalManagedCareProviders: null,
    careProviderEmails: [], // Array to store care provider emails with details
    savedProperties: [],
  },
  reducers: {
    setAgentCareProvider: (state, action) => {
      const {
        id,
        name: fullName,
        email,
        agentCareproviderDetails: {
          id: agentCareProviderId,
          phoneNumber,
          companyName,
          companyType,
          yearsInBusiness,
          numberOfEmployees,
          totalManagedCareProviders,
          careProviderEmails,
          savedProperties,
        },
      } = action.payload;

      return {
        ...state,
        id,
        agentCareProviderId,
        fullName,
        email,
        phoneNumber,
        companyName,
        companyType,
        yearsInBusiness,
        numberOfEmployees,
        totalManagedCareProviders,
        savedProperties,
        careProviderEmails: careProviderEmails.map(({ careProviderEmail, careProviderDetails }) => ({
          careProviderEmail,
          careProviderDetails: careProviderDetails
            ? {
                id: careProviderDetails.id,
                email: careProviderDetails.email,
                address: careProviderDetails.address,
                contactName: careProviderDetails.contactName,
                typeOfProvider: careProviderDetails.typeOfProvider,
              }
            : null,
        })),
      };
    },
    clearAgentCareProvider: () => ({
      id: null,
      agentCareProviderId: null,
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      companyType: '',
      yearsInBusiness: null,
      numberOfEmployees: null,
      totalManagedCareProviders: null,
      careProviderEmails: [], // Reset to an empty array
      savedProperties: [],
    }),
  },
});

export const { setAgentCareProvider, clearAgentCareProvider } = agentCareProviderSlice.actions;
export default agentCareProviderSlice.reducer;
