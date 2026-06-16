// import { View, Text, Alert } from 'react-native';
// import React, { useState } from 'react';
// import { WebView } from 'react-native-webview';
// import { useNavigation } from '@react-navigation/native';
// import { PayUPaymentVerify } from '../Services/UserApi';
// import { CoOwnerBookingverification } from './Services/UserApi';
// export default function PaymentPage(props) {
//   //console.log(props?.route?.params?.TxnID);
//   const navigation = useNavigation();
//   const [pageUrl, setPageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
//   const [Property,setProperty]=useState(props?.route?.params?.property);



//   const HandlePayUPaymentVerify = async (status) => {
//     let payload = JSON.stringify({
//     propertyName: Property?.propertyName,
//     propertyId: Property?.propertyId,
//     email: Property?.email,
//     fractionValue: Property?.FC_Price,
//     numberOfFractions: Property?.numberOfFractions,
//     // totalBookingAmount: Property?.totalBookingAmount + 300*Property?.numberOfFractions,
//     totalBookingAmount: 1,
//     Price: Property?.Price,
//     FC_Price: Property?.FC_Price,
//     termsAndConditions:Property?.termsAndConditions,
//     payUpayment: [
//         {
//             txnId: TxnID,
//             amount: 1,
//             // amount: Property?.totalBookingAmount + 300*Property?.numberOfFractions,
//             username: Property?.email,
//             status: status,
//             mihpayid: "MHP12345"
//         }
//     ],
//     bookingStatus: status,
//     statusKey: "BOOK123"
//     }); 
//     console.log(payload,'fghuji');
    
  
//     try {
//         let { data: res } = await CoOwnerBookingverification(payload);
//        console.log('fghj',res);
//         if (res?.success) {
       

//         }
//     } catch (error) {
//         if (error?.response) {
//              console.log('Response Error', error?.response?.data);
//             Alert.alert('Response ErrorP', `${error?.response?.data?.message}`);
//         } else if (error?.request) {
//            console.log('Request error:',` ${JSON.stringify(error?.request)}`);
//             Alert.alert('Request Error:', 'Please Check Your Internet Connection');
//             // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
//         } else {
//             //  console.log('error');
//             Alert.alert('Error:', `${error}`);
//         }
//     }
// };
 

//   const handleNavigationStateChange = (state) => {
//     // Track the URL when the page changes
//    // console.log(state.url);
//     if(state.url=='https://test.bunknbeyond.com/paymentfailure'){
//       let data='Failed'
//       HandlePayUPaymentVerify(data);
//       Alert.alert(
//         'Booking Failed!',"Oops! Your payment has been failed. Any refund amount detucted will be credited to the source account within 5-6 Working days",
//       );
     

//       navigation.navigate('Home');
      
//     }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
//       let data='Success'
//       HandlePayUPaymentVerify(data);
//       Alert.alert(
//         'Booking Completed!',"Our team is currently reviewing your booking status. Please allow us upto 24 hours to confirm your fraction booking status.",
//       );
    
//       navigation.navigate('Home');   
//     }
    
//     setPageUrl(state.url);
//   };

//   const handlePageLoad = () => {
//     // This is called when the page has finished loading
//     setLoading(false);
//   };
  
//   return (
//     // <View>
//   <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
//   onLoad={handlePageLoad}/>
//     // </View>
//   )
// }


// Working Code

// import React, { useEffect, useRef, useState } from 'react';
// import {View,Alert,ActivityIndicator,BackHandler,Linking,AppState,} from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useNavigation } from '@react-navigation/native';
// import {
//   PayUPaymentVerify,
//   CoOwnerBookingverification,
// } from './Services/UserApi';

// /* -------------------- PAYMENT STATES -------------------- */
// const PAYMENT_STATE = {
//   WEBVIEW: 'WEBVIEW',
//   VERIFYING: 'VERIFYING',
// };

// export default function PaymentPage({ route }) {
//   const navigation = useNavigation();
//   const { Link, TxnID, property } = route.params;

//   const [paymentState, setPaymentState] = useState(PAYMENT_STATE.WEBVIEW);


//   const hasVerifiedRef = useRef(false);
//   const payuRedirectedRef = useRef(false);
//   const appStateRef = useRef(AppState.currentState);


//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         if (paymentState === PAYMENT_STATE.WEBVIEW) {
//           Alert.alert(
//             'Cancel Payment?',
//             'If you go back, payment will be cancelled.',
//             [
//               { text: 'No', style: 'cancel' },
//               {
//                 text: 'Yes',
//                 onPress: () => navigation.goBack(),
//               },
//             ]
//           );
//           return true; // block default
//         }
//         return true;
//       }
//     );

//     return () => backHandler.remove();
//   }, [paymentState]);


//   const onShouldStartLoadWithRequest = (request) => {
//     const url = request.url;

//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return true;
//     }

//     if (
//       url.startsWith('upi://') ||
//       url.startsWith('intent://') ||
//       url.includes('paytm') ||
//       url.includes('phonepe') ||
//       url.includes('tez') ||
//       url.includes('gpay')
//     ) {
//       Linking.openURL(url).catch(() => {
//         Alert.alert(
//           'UPI App Not Found',
//           'Please install a UPI app to continue payment.'
//         );
//       });
//       return false;
//     }

//     return false;
//   };


//   const onNavigationStateChange = (state) => {
//     const url = state.url?.toLowerCase() || '';

//     if (
//       url.includes('paymentsuccess') ||
//       url.includes('paymentfailure')
//     ) {
//       payuRedirectedRef.current = true;
//       setPaymentState(PAYMENT_STATE.VERIFYING);

//       // If app already active → verify immediately
//       if (appStateRef.current === 'active') {
//         verifyPayment();
//       }
//     }
//   };
// // 
//   useEffect(() => {
//     const sub = AppState.addEventListener('change', (nextState) => {
//       if (
//         payuRedirectedRef.current &&
//         nextState === 'active' &&
//         !hasVerifiedRef.current
//       ) {
//         verifyPayment();
//       }
//       appStateRef.current = nextState;
//     });

//     return () => sub.remove();
//   }, []);


//   const verifyPayment = async () => {
//     if (hasVerifiedRef.current) return;
//     hasVerifiedRef.current = true;

//     try {
//       const { data: res } = await PayUPaymentVerify({ txnID: TxnID });

//       if (res?.payment?.responseDetails?.status === 'success') {
//         try {
//           const bookingRes = await bookFraction(res.payment);

//           navigation.replace('BookingSuccess', {
//             bookingData: bookingRes,
//             paymentData: res.payment,
//             property,
//           });
//         } catch {
//           Alert.alert(
//             'Booking Failed',
//             'Payment was successful but booking failed. Please contact support.'
//           );
//           navigation.replace('BookingFailure');
//         }
//       }

//     } catch (error) {
//       Alert.alert(
//         'Verification Failed',
//         'Unable to verify payment. Please contact support.'
//       );
//       navigation.replace('BookingFailure');
//     }
//   };


//   const bookFraction = async (paymentData) => {
//     const amountInt = Math.round(Number(paymentData.amount));
//     const payload = {
//       propertyName: property.propertyName,
//       propertyId: property.propertyId,
//       email: property.email,
//       fractionValue: 1000000,
//       numberOfFractions: property.numberOfFractions,
//       totalBookingAmount: amountInt,
//       Price: property.Price,
//       FC_Price: property.FC_Price,
//       termsAndConditions: true,
//       payUpayment: [
//         {
//           txnId: paymentData.txnId,
//           amount: amountInt,
//           username: 'Test',
//           status: paymentData.responseDetails.status,
//           mihpayid: paymentData.responseDetails.mihpayid,
//         },
//       ],
//       bookingStatus: 'Success',
//       statusKey: 'BOOK12345',
//     };

//     try {
//       const { data } = await CoOwnerBookingverification(payload);
//       return data; // ✅ ALWAYS return
//     } catch (error) {
//       console.log(
//         'Booking Fraction Error:',
//         error?.response?.data || error?.message
//       );

//       throw error; // ✅ let caller decide
//     }
//   };



//   return (
//     <View style={{ flex: 1 }}>
//       {paymentState === PAYMENT_STATE.WEBVIEW && (
//         <WebView
//           source={{ html: Link }}
//           onNavigationStateChange={onNavigationStateChange}
//           onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
//           javaScriptEnabled
//           domStorageEnabled
//           originWhitelist={['*']}
//         />
//       )}

//       {paymentState === PAYMENT_STATE.VERIFYING && (
//         <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#fff',}}>
//           <ActivityIndicator size="large" />
//         </View>
//       )}
//     </View>
//   );
// }




import React, { useEffect } from 'react';
import {
  View,
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentPage({ route }) {
  const navigation = useNavigation();
  const { Link, TxnID, property } = route.params;
  console.log("===========PaymentPage=============");

  /* ---------------- BACK BUTTON (CANCEL PAYMENT) ---------------- */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Cancel Payment?',
          'If you go back, payment will be cancelled.',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => navigation.goBack() },
          ]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('PENDING_TXN_ID', TxnID);
    // const tx = AsyncStorage.getItem('PENDING_TXN_ID');
    // console.log("Async: ",TxnID);
  }, []);

  /* ---------------- HANDLE UPI / INTENT ---------------- */
  const onShouldStartLoadWithRequest = (request) => {
    const url = request.url;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }

    if (
      url.startsWith('upi://') ||
      url.startsWith('intent://') ||
      url.includes('paytm') ||
      url.includes('phonepe') ||
      url.includes('tez') ||
      url.includes('gpay')
    ) {
      Linking.openURL(url).catch(() => {
        Alert.alert(
          'UPI App Not Found',
          'Please install a UPI app to continue payment.'
        );
      });
      return false;
    }

    return false;
  };

  /* ---------------- PAYU REDIRECT DETECTION ---------------- */
  const onNavigationStateChange = (state) => {
    const url = state.url?.toLowerCase() || '';
    console.log("URL: ",url);

    if (url.includes('paymentsuccess')) {
      navigation.replace('BookingProcessing', {
        txnId: TxnID,
        property,
      });
    }

    if (url.includes('paymentfailure')) {
      console.log("Going to Failure from Payment page");
      navigation.replace('BookingFailure', {txnId: TxnID, property: property});
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ html: Link }}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />
    </View>
  );
}
