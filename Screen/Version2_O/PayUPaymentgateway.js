import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { PayUPaymentVerify } from '../Services/UserApi';
export default function PayUPaymentgateway(props) {
 
  const navigation = useNavigation();
  const [pageUrl, setPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
  const HandlePayUPaymentVerify = async () => {
    let payload = JSON.stringify({
       txnID:TxnID
    });
  
    try {
        let { data: res } = await PayUPaymentVerify(payload);
        if (res?.success) {
       

        }
    } catch (error) {
        if (error?.response) {
            // console.log('Response Error', error?.response?.data);
            Alert.alert('Response ErrorPPP', `${error?.response?.data?.message}`);
        } else if (error?.request) {
            // console.log('Request error:', `${JSON.stringify(error?.request)}`);
            Alert.alert('Request Error:', 'Please Check Your Internet Connection');
            // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
            //  console.log('error');
            Alert.alert('Error:', `${error}`);
        }
    }
};

  const handleNavigationStateChange = (state) => {
    // Track the URL when the page changes
   // console.log(state.url);
    if(state.url=='https://test.bunknbeyond.com/paymentfailure'){

      HandlePayUPaymentVerify();
   

      navigation.navigate('StayCancel');
      
    }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
      HandlePayUPaymentVerify();
      navigation.navigate('StayBookingConfirm');   
    }
    
    setPageUrl(state.url);
  };

  const handlePageLoad = () => {
   
    setLoading(false);
  };
  
  return (
 
  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
 
  )
}