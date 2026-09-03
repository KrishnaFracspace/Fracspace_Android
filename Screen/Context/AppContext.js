import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    ProDetails: [],
    prior: '',
    LableProDetails: [],
    token: '',
    Login: false,
    activeFooterTab: 'home',
    LikeData: [],
    userDetails: [],
    userProfile: '',
    offer: [],
    userEvent: '',
    ConstructionFData: [],
    PropertyBuyAnsRent: [],
    currentLocation: [],
    ProprtyListingForm1: [],
    HotelUserDetails: {},
    AllProperty: [],
    altairaPromo: [],
    pendingDeepLinkType: "",
    pendingDeepLinkId: "",
    HotelDetails: [],
    location: [],
    ourStays: [],
    liveVersion: "",
    verificationAddress: "",
    verificationLatitude: null,
    verificationLongitude: null,
    verificationPincode: "",
    walletNote: false,
    noteMessage: "",
  });


  return (
    <AppContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </AppContext.Provider>
  );
};
export { AppContext, AppProvider };
