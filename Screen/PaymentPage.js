import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { PayUPaymentVerify } from '../Services/UserApi';
import { CoOwnerBookingverification } from './Services/UserApi';
export default function PaymentPage(props) {
  //console.log(props?.route?.params?.TxnID);
  const navigation = useNavigation();
  const [pageUrl, setPageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [TxnID,setTxnID]=useState(props?.route?.params?.TxnID);
  const [Property,setProperty]=useState(props?.route?.params?.property);



  const HandlePayUPaymentVerify = async (status) => {
    let payload = JSON.stringify({
    propertyName: Property?.propertyName,
    propertyId: Property?.propertyId,
    email: Property?.email,
    fractionValue: Property?.FC_Price,
    numberOfFractions: Property?.numberOfFractions,
    totalBookingAmount: Property?.totalBookingAmount + 300*Property?.numberOfFractions,
    Price: Property?.Price,
    FC_Price: Property?.FC_Price,
    termsAndConditions:Property?.termsAndConditions,
    payUpayment: [
        {
            txnId: TxnID,
            amount: Property?.totalBookingAmount + 300*Property?.numberOfFractions,
            username: Property?.email,
            status: status,
            mihpayid: "MHP12345"
        }
    ],
    bookingStatus: status,
    statusKey: "BOOK123"
    }); 
    console.log(payload,'fghuji');
    
  
    try {
        let { data: res } = await CoOwnerBookingverification(payload);
       // console.log('fghj',res);
        if (res?.success) {
       

        }
    } catch (error) {
        if (error?.response) {
             console.log('Response Error', error?.response?.data);
            Alert.alert('Response ErrorP', `${error?.response?.data?.message}`);
        } else if (error?.request) {
           console.log('Request error:',` ${JSON.stringify(error?.request)}`);
            Alert.alert('Request Error:', 'Please Check Your Internet Connection');
            // Alert.alert('Request error:', ${JSON.stringify(error?.request)});
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
      let data='Failed'
      HandlePayUPaymentVerify(data);
      Alert.alert(
        'Booking Failed!',"Oops! Your payment has been failed. Any refund amount detucted will be credited to the source account within 5-6 Working days",
      );
     

      navigation.navigate('Home');
      
    }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
      let data='Success'
      HandlePayUPaymentVerify(data);
      Alert.alert(
        'Booking Completed!',"Our team is currently reviewing your booking status. Please allow us upto 24 hours to confirm your fraction booking status.",
      );
    
      navigation.navigate('Home');   
    }
    
    setPageUrl(state.url);
  };

  const handlePageLoad = () => {
    // This is called when the page has finished loading
    setLoading(false);
  };
  
  return (
    // <View>
  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
    // </View>
  )
}
