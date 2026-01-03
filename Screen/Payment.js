// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import React, {memo, useContext, useState} from 'react';
// import Upload from 'react-native-vector-icons/FontAwesome';
// const {width, height} = Dimensions.get('window');
// import DocumentPicker from 'react-native-document-picker';
// import {VerificationScreenshorts} from './Services/UserApi';
// import {AppContext} from './Context/AppContext';
// import { ScrollView } from 'react-native-virtualized-view';
// import { useNavigation } from '@react-navigation/native';
// export default function Payment(props) {
//   const navigation = useNavigation();
//   const [PickedSS, setPickedSS] = useState(null);
//   const [Status,setStatus]=useState(props?.route?.params?.status)
//   const {globalState, setGlobalState} = useContext(AppContext);
//   const [propertyDetails, setPropertyDetails] = useState(
//     props?.route?.params?.Property,
//   );
//   const [loader, setLoader] = useState(false);
//   const [Error, setError] = useState('');
//   const PickScreenShort = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles], // You can specify the types of documents you want to pick
//       });
//       setPickedSS(res);
//       setError('');
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//       //  Alert.alert(''User cancelled the picker');
//       } else {
//         Alert.alert('Error picking document:', err);
//       }
//     }
//   };

//   const handleProfileVerify = async () => {
//     var form = new FormData();
//     form.append('email', globalState?.userEmail);
//     form.append('propertyId', propertyDetails?.propertyId);
//     form.append('propertyName', propertyDetails?.propertyName);
//     form.append('BookingAmount', propertyDetails?.totalBookingAmount);
//     form.append('invoice', {
//       uri: PickedSS[0].uri,
//       type: PickedSS[0].type,
//       name: PickedSS[0].name,
//       size: PickedSS[0].size,
//     });

//     let payload = form; 
//    // console.log(payload);

//     try {
//       let {data: res} = await VerificationScreenshorts(payload);

//       if (res?.success) {
//         setLoader(false);
//         Alert.alert('Thanks for your submission!',"Our team is currently reviewing your transaction status. Please allow us upto 24 hours to confirm your allotment.");
//         navigation.navigate('Home');
//       }
//     } catch (error) {
//       if (error?.response) {
//         Alert.alert('Response Error', `${error?.response?.data?.message}`);
//         setLoader(false);
//       } else if (error?.request) {
//         Alert.alert('Request error:', 'Please Check Your Internet Connection');
//         setLoader(false);
//       } else {
//         Alert.alert('Error:', `${error?.message}`);
//         setLoader(false);
//       }
//     }
//   };

//   return (
//     <ScrollView
//       style={{
//         padding: 20,
//         backgroundColor: '#f5f7fe',
//         width: '100%',
//         // flex: 1,
//         //alignItems: 'center',
//       }}>
//       <View
//         style={{
//           backgroundColor: '#ffffff',
//           width: '100%',
//           borderRadius: 10,
//           padding: 20,
//         }}>
//        {Status && <View style={{width: '100%'}}>
//           <View style={{borderBottomWidth: 1, borderBottomColor: '#DADADA'}}>
//             <Text style={styles.title}>Bank Account Details</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               paddingVertical: 10,
//             }}>
//             <Text style={[styles.label, {flex: 2}]}>Account Holder Name</Text>
//             <Text style={[styles.label1, {flex: 1}]}>
//               Fracspace Private Limited
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={[styles.label,{flex:1}]}>Account Number</Text>
//             <Text style={[styles.label1,{flex:2,textAlign:'right'}]}>193905000450</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={styles.label}>IFSC Code</Text>
//             <Text style={[styles.label1,{flex:2,textAlign:'right'}]}>ICIC0001939</Text>
//           </View>
//         </View>}

//         <View style={{paddingVertical: 10}}>
//           <View style={{borderBottomWidth: 1, borderBottomColor: '#DADADA'}}>
//             <Text style={styles.title}>Frac Allotment Details</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={styles.label}>Property Name</Text>
//             <Text style={styles.label1}>{propertyDetails?.propertyName}</Text>
//           </View>
//           {/* <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={styles.label}>Property Price</Text>
//             <Text style={styles.label1}>{propertyDetails?.Price}</Text>
//           </View> */}
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={styles.label}>Frac Price</Text>
//             <Text style={styles.label1}> {'\u20B9 '}{propertyDetails?.FC_Price}</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={styles.label}>No. Of Frac Alloted</Text>
//             <Text style={styles.label1}>
//               {propertyDetails?.numberOfFractions}
//             </Text>
//           </View>

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: 10,
//             }}>
//             <Text style={styles.label}>Total Booking Amount</Text>
//             <Text style={styles.label1}>
//             {'\u20B9 '}{propertyDetails?.totalBookingAmount}
//             </Text>
//           </View>
//         </View>
//         <View style={{paddingVertical: 10}}>
        
//             <Text style={[styles.title,{fontSize:14}]}>
//             Provide a screenshot to validate the successful transaction
//             </Text>
       
//           <TouchableOpacity
//             style={{
//               alignItems: 'center',
//               backgroundColor: '#f5f7fe',
//               padding: 10,
//               borderColor: Error != '' ? '#C41E3A' : '#043862',
//               borderWidth: 1,
//               borderRadius: 10,
//               marginTop: 20,
//             }}
//             onPress={() => {
//               PickScreenShort();
//             }}>
//             <Upload name="cloud-upload" size={28} color="#043862" />
//             <Text style={{fontSize: 14,  fontFamily: 'Poppins-Medium', color: '#000000'}}>
//               Upload Payment Success Screenshort
//             </Text>
//           </TouchableOpacity>
//           {PickedSS != null && (
//             <Text style={{fontSize: 14,  fontFamily: 'Poppins-Medium', color: '#008000'}}>
//               {"   "}Screenshort Uploaded
//             </Text>
//           )}
//            {Error != '' && (
//         <Text
//           style={{color: '#C41E3A', fontFamily: 'Poppins-Medium', fontSize: 14}}>
//            {"   "}{Error}
//         </Text>
//       )}
//         </View>

//       </View>

   
//       <TouchableOpacity
//         onPress={() => {
//           if (PickedSS != null) {
//             setError('');
//             setLoader(true);
//             handleProfileVerify();
//           } else {
//             setError('Please upload Payment screenshort!');
//           }
        
//         }}
//         style={{
//           alignItems: 'center',
//           backgroundColor: '#043862',
//           padding: 20,
//           borderColor: '#043862',
//           borderWidth: 1,
//           borderRadius: 10,
//           marginTop: 30,
//           width: '100%',
//           marginVertical: 30,
//         }}>
//         {loader==true? <ActivityIndicator size="small" color="#ffffff" />: <Text style={{fontSize: 16, fontFamily:'Poppins-SemiBold', color: 'white'}}>
//         Submit
//         </Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   iphone13Mini9: {
//     backgroundColor: '#f5f7fe',
//     //flex: 1,
//     // overflow: 'hidden',
//     //width: '100%',
//   },
//   labelContainer: {
//     position: 'absolute',
//     left: width * 0.04,
//     // top: -(height*0.2),
//     paddingHorizontal: 8,
//     backgroundColor: 'white',
//   },
//   label: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//     color: '#1E2135',
//     flex: 2,
//   },
//   label1: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Bold',
//     color: '#1E2135',
//     flex: 1,
//   },
//   label2: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//     color: '#1E2135',
//     //flex:2
//   },
//   input: {
//     // marginTop:20,
//     padding: 10,
//     borderColor: '#B9C4CA',
//     borderWidth: 2,
//     borderRadius: 10,

//     fontSize: 16,
//   },
//   title: {
//     color: '#252b5d',
//     fontFamily: 'Poppins-Bold',
//     fontSize: 18,
//     paddingBottom: 10,
//     letterSpacing: 0.3,
//   },
//   maskGroupIconLayout: {
//     // width: 110,
//     // height: 110,
//     width: width * 0.3,
//     height: height * 0.16,
//   },
// });


import { View, Text, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
export default function Payment(props) {
  //console.log(props?.route?.params?.property);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);





 

  const handleNavigationStateChange = (state) => {
    // Track the URL when the page changes
   // console.log(state.url);
    if(state.url=='https://test.bunknbeyond.com/paymentfailure'){
     
      let data='Failed'
   
      Alert.alert(
        'Booking Failed!',"Oops! Your payment has been failed. Any refund amount detucted will be credited to the source account within 5-6 Working days",
      );
      navigation.navigate('Home');
      
    }if(state.url=='https://test.bunknbeyond.com/paymentsuccess'){
      let data='Success'
    
      Alert.alert(
        'Booking Completed!',"Our team is currently reviewing your booking status. Please allow us upto 24 hours to confirm your fraction booking status.",
      );
    
      navigation.navigate('Home');   
    }
    
   
  };

  const handlePageLoad = () => {
    // This is called when the page has finished loading
    setLoading(false);
  };
  
  return (

  <WebView source={{html:props?.route?.params?.Link}} style={{ width:'100%'}} scalesPageToFit={false} onNavigationStateChange={handleNavigationStateChange}
  onLoad={handlePageLoad}/>
  
  )
}
