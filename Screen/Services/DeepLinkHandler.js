// import { useEffect, useContext } from 'react';
// import appsFlyer from 'react-native-appsflyer';
// import { AppContext } from '../Context/AppContext';
// import { navigationRef } from '../../App';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AppState } from 'react-native';
// // 
// const DeepLinkHandler = () => {
//   const { setGlobalState } = useContext(AppContext);

//   // ✅ 1️⃣ Init AppsFlyer (ONLY ONCE)
//   useEffect(() => {
//     appsFlyer.initSdk(
//       {
//         devKey: 'z9iokP3YwU3z6uxEkKgJfn',
//         isDebug: true,
//         onDeepLinkListener: true,
//       },
//       res => console.log('AF init success', res),
//       err => console.log('AF init error', err)
//     );
//   }, []);

//   // ✅ 2️⃣ App Resume Listener (NOT nested)
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', state => {
//       if (state === 'active') {
//         console.log("App resumed");
//       }
//     });

//     return () => subscription.remove();
//   }, []);

//   // ✅ 3️⃣ Deep Link Listener
//   useEffect(() => {
//     const deepLinkListener = appsFlyer.onDeepLink(res => {
//       console.log("🔥 UDL RAW:", JSON.stringify(res));

//       if (res?.deepLinkStatus === 'FOUND') {
//         const deepLinkValue = res?.data?.deep_link_value;
//         const propertyId =
//           res?.data?.deep_link_sub1 ||
//           res?.data?.af_sub2 ||
//           res?.data?.af_sub1;

//         console.log("Parsed:", deepLinkValue, propertyId);

//         if (deepLinkValue === 'property' || 'property_share') {
//           handleNavigation(propertyId);
//         }
//         if(deepLinkValue === 'payment_link'){
//             handlePayNav(propertyId);
//         }
//         if(deepLinkValue === 'wallet_section'){
//           handleWalletNav();
//         }
//       }
//     });

//     // ✅ Cold start / first install
//     const conversionListener =
//       appsFlyer.onInstallConversionData(res => {
//         console.log('🔥 InstallConversion:', res);

//         if (res?.data?.deep_link_value === 'property_share' || 'property') {
//           const propertyId =
//             res?.data?.deep_link_sub1 ||
//             res?.data?.af_sub2 ||
//             res?.data?.af_sub1;
            

//           if (propertyId) {
//             handleNavigation(propertyId);
//           }
//           if(res?.data?.deep_link_value === 'wallet_section'){
//             handleWalletNav();
//           }
//         }
//       });

//     return () => {
//       deepLinkListener?.();
//       conversionListener?.();
//     };
//   }, []);

//   // ✅ 4️⃣ Navigation Handler
//   const handleNavigation = async (propertyId) => {
//     const isLoggedIn = await AsyncStorage.getItem('mytoken');

//     const tryNavigate = () => {
//       if (!navigationRef.isReady()) {
//         setTimeout(tryNavigate, 500);
//         return;
//       }

//       setGlobalState(prev => ({
//         ...prev,
//         pendingDeepLinkType: 'property',
//         pendingDeepLinkId: propertyId,
//       }));

//       if (isLoggedIn) {
//         navigationRef.navigate('Property', { Id: propertyId });
//       } else {
//         navigationRef.navigate('NewLogin');
//       }
//     };

//     tryNavigate();
//   };

//   const handlePayNav = async (propertyId) => {
//     const isLoggedIn = await AsyncStorage.getItem('mytoken');

//     const tryNavigate = () => {
//       if (!navigationRef.isReady()) {
//         setTimeout(tryNavigate, 500);
//         return;
//       }

//       setGlobalState(prev => ({
//         ...prev,
//         pendingDeepLinkType: 'payment_link',
//         pendingDeepLinkId: propertyId,
//       }));

//       if (isLoggedIn) {
//         navigationRef.navigate('Book', { Id: propertyId });
//       } else {
//         navigationRef.navigate('NewLogin');
//       }
//     };

//     tryNavigate();
//   };  

//   const handleWalletNav = async() => {
//     const isLoggedIn = await AsyncStorage.getItem('mytoken');
//     // console.log("Redy to navi to wallet: ");
//     const tryNavigate = () =>{
//       if (!navigationRef.isReady()) {
//         setTimeout(tryNavigate, 500);
//         return;
//       }
//       setGlobalState(prev => ({
//         ...prev,
//         pendingDeepLinkType: 'wallet_section'
//       }))
//       if(isLoggedIn){
//         navigationRef.navigate('WalletAmount');
//       }else{
//         navigationRef.navigate('NewLogin');
//       }
//     }
//     tryNavigate();
//   }

//   return null;
// };

// export default DeepLinkHandler;


import { useEffect, useContext } from 'react';
import appsFlyer from 'react-native-appsflyer';
import { AppContext } from '../Context/AppContext';
import { navigationRef } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const DeepLinkHandler = () => {
  const { setGlobalState } = useContext(AppContext);

  // ✅ 1️⃣ Init SDK
  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: 'z9iokP3YwU3z6uxEkKgJfn',
        isDebug: true,
        onDeepLinkListener: true,
      },
      res => console.log('AF init success', res),
      err => console.log('AF init error', err)
    );
  }, []);

  // ✅ 2️⃣ App Resume
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        console.log('App resumed');
      }
    });

    return () => subscription.remove();
  }, []);

  // ✅ 3️⃣ Deep Link Listener (Foreground + Background)
  useEffect(() => {
    const deepLinkListener = appsFlyer.onDeepLink(res => {
      console.log('🔥 UDL RAW:', JSON.stringify(res));

      if (res?.deepLinkStatus !== 'FOUND') return;

      handleDeepLink(res?.data);
    });

    // ✅ Cold start (First install)
    const conversionListener = appsFlyer.onInstallConversionData(res => {
      console.log('🔥 InstallConversion:', res);

      const data = res?.data;

      if (data?.is_first_launch === 'true') {
        handleDeepLink(data);
      }
    });

    return () => {
      deepLinkListener?.();
      conversionListener?.();
    };
  }, []);

  // 🔥 UNIVERSAL HANDLER
  const handleDeepLink = (data) => {
    if (!data) return;

    const deepLinkValue = data?.deep_link_value;

    const propertyId =
      data?.deep_link_sub1 ||
      data?.af_sub2 ||
      data?.af_sub1;

    console.log('Parsed:', deepLinkValue, propertyId);

    switch (deepLinkValue) {

      case 'property':
      case 'property_share':
        if (propertyId) {
          handlePropertyNav(propertyId);
        }
        break;

      case 'payment_link':
        if (propertyId) {
          handlePayNav(propertyId);
        }
        break;

      case 'wallet_section':
        handleWalletNav();
        break;

      case 'escape_section':
        handleEscapeNav();
        break;

      default:
        console.log('No matching deep link case');
        break;
    }
  };

  // ✅ PROPERTY NAVIGATION
  const handlePropertyNav = async (propertyId) => {
    const isLoggedIn = await AsyncStorage.getItem('mytoken');

    const tryNavigate = () => {
      if (!navigationRef.isReady()) {
        setTimeout(tryNavigate, 400);
        return;
      }

      setGlobalState(prev => ({
        ...prev,
        pendingDeepLinkType: 'property',
        pendingDeepLinkId: propertyId,
      }));

      if (isLoggedIn) {
        navigationRef.navigate('Property', { Id: propertyId });
      } else {
        navigationRef.navigate('NewLogin');
      }
    };

    tryNavigate();
  };

  // ✅ PAYMENT NAVIGATION
  const handlePayNav = async (propertyId) => {
    const isLoggedIn = await AsyncStorage.getItem('mytoken');

    const tryNavigate = () => {
      if (!navigationRef.isReady()) {
        setTimeout(tryNavigate, 400);
        return;
      }

      setGlobalState(prev => ({
        ...prev,
        pendingDeepLinkType: 'payment_link',
        pendingDeepLinkId: propertyId,
      }));

      if (isLoggedIn) {
        navigationRef.navigate('Book', { Id: propertyId });
      } else {
        navigationRef.navigate('NewLogin');
      }
    };

    tryNavigate();
  };

  // ✅ WALLET NAVIGATION
  const handleWalletNav = async () => {
    const isLoggedIn = await AsyncStorage.getItem('mytoken');

    const tryNavigate = () => {
      if (!navigationRef.isReady()) {
        setTimeout(tryNavigate, 400);
        return;
      }

      setGlobalState(prev => ({
        ...prev,
        pendingDeepLinkType: 'wallet_section',
      }));

      if (isLoggedIn) {
        navigationRef.navigate('WalletAmount');
      } else {
        navigationRef.navigate('NewLogin');
      }
    };

    tryNavigate();
  };

  const handleEscapeNav = async () => {
    const isLoggedIn = await AsyncStorage.getItem('mytoken');
    const tryNavigate = () => {
      if(!navigationRef.isReady()){
        setTimeout(tryNavigate, 400);
        return;
      }

      setGlobalState(prev => ({
        ...prev,
        pendingDeepLinkType: 'escape_section',
      }))

      if(isLoggedIn){
        navigationRef.navigate('MembershipHome');
      }else{
        navigationRef.navigate('NewLogin');
      }
    };

    tryNavigate();
  }

  return null;
};

export default DeepLinkHandler;
