// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     Dimensions,
//     Modal,
//     TextInput,
//     Alert,
//     ActivityIndicator,
//     Touchable
// } from 'react-native';
// import React, { useContext, useRef, useState } from 'react';
// import Icon from 'react-native-vector-icons/AntDesign';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import CustomModal from '../CustomModal';
// import Svg, { Text as SvgText } from 'react-native-svg';
// import { LineChart } from 'react-native-chart-kit';
// import { SendConfirmationOTP, SendConfirmationOTPEmail, TransferProperty, VerifyOtpAndStoreMessage, VerifyOtpAndStoreMessageEmail } from '../Services/UserApi';
// import { AppContext } from '../Context/AppContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// export default function MonthlyInsight(props) {
//     const navigation = useNavigation();
//     const { globalState, setGlobalState } = useContext(AppContext);
//     const { width } = Dimensions.get('window');
//     const [OwnedPropertyDetails, setOwnedPropertyDetails] = useState(
//         props?.route?.params?.OwnedPropertyDetails
//     );
//     const [loader, setLoader] = useState(false);
//     const [visible, setVisible] = useState(false);
//     const [visible1, setVisible1] = useState(false);
//     const [visible2, setVisible2] = useState(false);
//     const [visible3, setVisible3] = useState(false);
//     const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });

//     const startingBooking = 0;
//     const numbersOfBooking = [3, 0, 2, 2, 0];
//     const extendedBooking = [0, ...numbersOfBooking, 0];
//     const monthLabels = ['','Dec', 'Jan', 'Feb', 'Mar', 'Apr',''];
//     const data = extendedBooking?.map(change => startingBooking + change);
//     const firstInput = useRef();
//     const secoundInput = useRef();
//     const thirdInput = useRef();
//     const fourInput = useRef();
//     const fiveInput = useRef();
//     const sixInput = useRef();
//     const screenWidth = Math.max(data?.length * 100, Dimensions.get('window').width);
  

//     // const Gradient = () => (
//     //     <Defs key={'gradient'}>
//     //         <Linear id={'gradient'} x1={'1'} y1={'0'} x2={'0'} y2={'0'}>
//     //             <Stop offset={'0%'} stopColor={'#FCA4A4D6'} stopOpacity={1} />
//     //             <Stop offset={'100%'} stopColor={'#D2FAD554'} stopOpacity={1} />
//     //         </Linear>
//     //         <Linear id={'grad'} x1={'1'} y1={'0'} x2={'0'} y2={'0'}>
//     //             <Stop offset={'0%'} stopColor={'#C12525'} stopOpacity={1} />
//     //             <Stop offset={'100%'} stopColor={'#188C16'} stopOpacity={1} />
//     //         </Linear>
//     //     </Defs>
//     // );


//     const handleResell = async () => {
//         setVisible1(false);

//         if (globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber?.length === 13) {
//             let payload = JSON.stringify({
//                 propertyName: OwnedPropertyDetails?.propertyDetails?.name,
//                 phoneNumber: globalState?.userDetails?.phoneNumber,
//             });
//             console.log(payload);
//             try {
//                 let { data: res } = await SendConfirmationOTP(payload);


//                 if (res?.success) {

//                     setVisible2(true);
//                     //setModalVisible(true);

//                     //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
//                 }
//             } catch (error) {
//                 if (error?.response) {
//                     Alert.alert('Response Error', `${error?.response?.data?.message}`);

//                 } else if (error?.request) {
//                     //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                     Alert.alert('Request Error:', 'Please Check Your Internet Connection');

//                     // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                 } else {
//                     Alert.alert('Error:', `${error}`);

//                 }
//             }
//         } else {
//             let payload = JSON.stringify({
//                 propertyName: OwnedPropertyDetails?.propertyDetails?.name,
//                 email: globalState?.userDetails?.email,
//             });
//             try {
//                 let { data: res } = await SendConfirmationOTPEmail(payload);
//                 if (res?.success) {
//                     setVisible2(true);
//                     //setModalVisible(true);

//                     //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
//                 }
//             } catch (error) {
//                 if (error?.response) {
//                     Alert.alert('Response Error', `${error?.response?.data?.message}`);

//                 } else if (error?.request) {
//                     //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                     Alert.alert('Request Error:', 'Please Check Your Internet Connection');

//                     // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                 } else {
//                     Alert.alert('Error:', `${error}`);

//                 }
//             }

//         }
//     };

//     const handleResellVerification = async (code, message) => {
//         setVisible2(false);
//         if (globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber?.length === 13) {
//             let payload = JSON.stringify({
//                 phoneNumber: globalState?.userDetails?.phoneNumber,
//                 otp: code,
//                 message: message,
//             });
//             try {
//                 let { data: res } = await VerifyOtpAndStoreMessage(payload);
//                 if (res?.success) {
//                     setVisible3(true);

//                 }
//             } catch (error) {
//                 if (error?.response) {
//                     Alert.alert('Response Error', `${error?.response?.data?.message}`);
//                 } else if (error?.request) {
//                     //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                     Alert.alert('Request Error:', 'Please Check Your Internet Connection');
//                     // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                 } else {
//                     Alert.alert('Error:', `${error}`);
//                 }
//             }
//         } else {
//             let payload = JSON.stringify({
//                 email: globalState?.userDetails?.email,
//                 otp: code,
//                 message: message,
//             });
//             try {
//                 let { data: res } = await VerifyOtpAndStoreMessageEmail(payload);
//                 if (res?.success) {
//                     setVisible3(true);
//                     // Alert.alert(
//                     //     'Thank You for Response',
//                     //     `Your ${OwnedPropertyDetails?.propertyDetails?.name} property will be sold within the next 60 days.`,
//                     // );
//                 }
//             } catch (error) {
//                 if (error?.response) {
//                     Alert.alert('Response Error', `${error?.response?.data?.message}`);
//                 } else if (error?.request) {
//                     //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                     Alert.alert('Request Error:', 'Please Check Your Internet Connection');
//                     // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
//                 } else {
//                     Alert.alert('Error:', `${error}`);
//                 }
//             }
//         }
//     };

//     const handleTransfer = async () => {
//         setLoader(true);
//         let payload = JSON.stringify({
//             email: globalState?.userEmail,
//             fromPropertyId: OwnedPropertyDetails?.propertyDetails?._id,
//             fromPropertyName: OwnedPropertyDetails?.propertyDetails?.name,
//             toPropertyId: OwnedPropertyDetails?.propertyDetails?._id,
//             toPropertyName: OwnedPropertyDetails?.propertyDetails?.name,
//             action: 'hold'
//         });
       
//         try {
//             let { data: res } = await TransferProperty(payload);
//             if (res?.success) {
//                 setVisible(true);
//                 setLoader(false);
//             }
//         } catch (error) {
//             if (error?.response) {
//                 Alert.alert('Response Error', `${error?.response?.data?.message}`);
//                 //setLoader(false);
//             } else if (error?.request) {
//                 // console.log('property', `${JSON.stringify(error?.request)}`);
//                 //  Alert.alert('Request error:', 'Please Check Your Internet Connection');
//                 //setLoader(false);
//             } else {
//                 Alert.alert('Error:', `${error?.message}`);
//                 //setLoader(false);
//             }
//         }
//     };


//     return (
//         <SafeAreaView style={{ flex: 1,backgroundColor: '#021265' }}>
//         <View
//             style={{
//                 backgroundColor:'#FFFFFF',
//                 flex: 1,
//             }}>
//             <View style={{ padding: 20 }}>
//                 <View
//                     style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                     }}>
//                     <TouchableOpacity
//                         onPress={() => {
//                             //console.log(OwnedPropertyDetails);
                            
//                           navigation.navigate('Dashboard',{ownedProDetails:OwnedPropertyDetails});

//                         }}
//                         style={{
//                             backgroundColor: '#F6F6F6',
//                             borderColor: '#E3E4E5',
//                             borderWidth: 1,
//                             alignItems: 'center',
//                             padding: 10,
//                             borderRadius: 5,
//                         }}>
//                         <Icon name={'arrowleft'} size={25} color={'#000000'} />
//                     </TouchableOpacity>
//                     <View>
//                         <Text
//                             style={{
//                                 fontFamily: 'Montserrat-SemiBold',
//                                 fontSize: 20,
//                                 color: '#000000',
//                             }}>
//                             Monthly Insights
//                         </Text>
//                     </View>
//                     <View></View>
//                 </View>

//                 <View style={{ marginVertical: 10 }}>
//                     <Text
//                         style={{
//                             fontFamily: 'WorkSans-Medium',
//                             fontSize: 20,
//                             color: '#000000',
//                         }}>
//                         Personalized Graph
//                     </Text>


//                     <View style={{ height: 320, }}>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                             <View style={{ backgroundColor: '#FFFFFF' }}>
//                                 <LineChart
//                                     data={{
//                                         labels: monthLabels,
//                                         datasets: [{ data }]
//                                     }}
//                                     width={screenWidth}
//                                     height={280}
//                                     withDots={false}
//                                     withInnerLines={false}
//                                     withOuterLines={false}
//                                     withShadow={true}
//                                     withVerticalLabels={true}
//                                     withHorizontalLabels={false}
//                                     bezier
//                                     style={{ marginLeft: -60, paddingTop: 30 }}
//                                     chartConfig={{
//                                         backgroundGradientFrom: '#ffffff',
//                                         backgroundGradientTo: '#ffffff',
//                                         decimalPlaces: 0,
//                                         color: () => '#3C5752',
//                                         labelColor: () => '#000',
//                                         fillShadowGradient: '#0A7264',
//                                         fillShadowGradientOpacity: 0.25,
//                                         strokeWidth: 2,
//                                         propsForBackgroundLines: {
//                                             stroke: 'transparent',

//                                         },
//                                     }}
//                                     decorator={() => (
//                                         <Svg>
//                                             {data?.map((value, index) => {
//                                                 if (index === 0 || index == data?.length - 1) return null;
//                                                 const diff = value - startingBooking;
//                                                 //const xVal = x(index);
//                                                 //const yVal = y(value);
//                                                 const x = (index) * (screenWidth / data?.length) + 50;
//                                                 const y = 280 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 200;
//                                                 const color = diff >= 0 ? '#008000' : 'red';
//                                                 //  const color = value >= startingBooking ? '#1B8E0E' : 'red';


//                                                 return (
//                                                     <SvgText
//                                                         key={`pl-${index}`}
//                                                         x={x - 20}
//                                                         y={y - 55}
//                                                         // key={index}
//                                                         // x={xVal}
//                                                         // y={yVal - 10}
//                                                         fontSize={12}
//                                                           fontFamily="Poppins-SemiBold"
//                                                         fill={color}
//                                                         textAnchor="middle">
//                                                         {/* {`${diff > 0 ? '+' : ''}${Math.abs(diff).toLocaleString()}`} */}
//                                                         {`${Math.abs(diff)} Booking`}
//                                                     </SvgText>
//                                                 );
//                                             })}


//                                         </Svg>
//                                     )}
//                                 />
//                             </View>
//                         </ScrollView>
//                     </View>



//                     {/* <View style={{ height: 200, marginTop: 20 }}>
//                         <AreaChart
//                             style={{ flex: 1 }}
//                             data={data}
//                             svg={{
//                                 fill: 'url(#gradient)',
//                                 stroke: 'url(#grad)',
//                                 strokeWidth: 1,
//                             }}
//                             contentInset={{ top: 20, bottom: 20 }}
//                             curve={shape.curveNatural}>
//                             <Gradient />
//                             <Labels />
//                         </AreaChart>
//                     </View> */}
//                 </View>

//                 <View>
//                     <Text
//                         style={{
//                             fontFamily: 'WorkSans-Medium',
//                             fontSize: 20,
//                             color: '#000000',
//                         }}>
//                         April Insights
//                     </Text>
//                     <Text
//                         style={{
//                             fontFamily: 'WorkSans-SemiBold',
//                             fontSize: 12,
//                             color: '#000000B3',
//                             marginTop: 10,
//                         }}>
//                         This property has seen very few bookings and is currently underperforming compared to expectations. We're evaluating the situation and working on measures to improve its performance.
//                     </Text>
//                 </View>

//                 <View
//                     style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
//                     <TouchableOpacity
//                         onPress={() => {
//                                handleTransfer();
                         
//                         }}
//                         style={{ flex: 2 }}>
//                         <LinearGradient
//                             colors={['#081F62', '#17368F']}
//                             style={{ padding: 15, borderRadius: 10, alignItems: 'center' }}>
//                              {loader == true ? (
//                         <ActivityIndicator size="small" color="#ffffff" />
//                     ) : (<Text
//                                 style={{
//                                     fontFamily: 'WorkSans-Medium',
//                                     fontSize: 16,
//                                     color: '#FFFFFF',
//                                 }}>
//                                 Hold
//                             </Text>)}
//                         </LinearGradient>
//                     </TouchableOpacity>
//                     {/* <TouchableOpacity
//                         onPress={() => {
//                             navigation.navigate('Transfer', { OwnedPropertyDetails: OwnedPropertyDetails });
//                         }}
//                         style={{ flex: 1, marginLeft: 20 }}>
//                         <LinearGradient
//                             colors={['#081F62', '#17368F']}
//                             style={{ padding: 15, borderRadius: 10, alignItems: 'center' }}>
//                             <Icon name={'arrowright'} size={25} color={'#FFFFFF'} />
//                         </LinearGradient>
//                     </TouchableOpacity> */}
//                 </View>
//                 <View style={{ marginTop: 5 }}>
//                     <Text
//                         style={{
//                             fontFamily: 'Montserrat-Medium',
//                             fontSize: 10,
//                             color: '#000000CC',
//                         }}>
//                         By clicking 'Transfer', your fractional share will be moved to the
//                         selected property, and ownership rights will be updated accordingly.
//                     </Text>
//                 </View>
//             </View>

//             <View
//                 style={{
//                     backgroundColor: '#FFFFFF',
//                     padding: 20,
//                     flexDirection: 'row',
//                     position: 'absolute',
//                     bottom: 0,
//                     elevation: 10,
//                 }}>
//                 <TouchableOpacity
//                     onPress={() => {
//                         setVisible1(true);
//                         // navigation.navigate("CumulativeEarning");
//                     }}
//                     style={{
//                         backgroundColor: '#484C5212',
//                         padding: 15,
//                         alignItems: 'center',
//                         borderRadius: 10,
//                         flex: 1,
//                         marginHorizontal: 15,
//                     }}>
//                     <Text
//                         style={{
//                             fontFamily: 'WorkSans-Medium',
//                             fontSize: 16,
//                             color: '#FF0000F5',
//                         }}>
//                         Withdraw
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => {
//                            navigation.navigate('Transfer', { OwnedPropertyDetails: OwnedPropertyDetails });
                     
//                         // setVisible(true);
//                     }}
//                     style={{
//                         backgroundColor: '#0F1130',
//                         padding: 15,
//                         alignItems: 'center',
//                         borderColor: '#C0D5F3',
//                         borderWidth: 1,
//                         borderRadius: 10,
//                         flex: 1,
//                         marginHorizontal: 15,
//                     }}>
//                    <Text
//                         style={{
//                             fontFamily: 'WorkSans-Medium',
//                             fontSize: 16,
//                             color: '#FFFFFF',
//                         }}>
//                         Transfer
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* {visible == true && ( */}
//                 <Modal visible={visible} modalStyle={{ width: width }}  animationType='fade' transparent>
//                     <TouchableOpacity  onPress={() => {setVisible(false)}} style={{flex:1,backgroundColor:'#0000008a'}}/>
//                     <View style={{position:'absolute',bottom:0,width:'100%',flex:1, backgroundColor: '#FFFFFF', padding: 20, elevation: 5,borderTopLeftRadius:20,borderTopRightRadius:20 }}>
//                         <Text
//                             style={{
//                                 fontFamily: 'WorkSans-Medium',
//                                 fontSize: 20,
//                                 color: '#188C16',
//                             }}>
//                             Thank you for your patience and understanding.
//                         </Text>
//                         <Text
//                             style={{
//                                 fontFamily: 'Montserrat-SemiBold',
//                                 fontSize: 12,
//                                 color: '#00000080',
//                                 marginVertical: 20,
//                             }}>
//                             We’re actively working on securing guest bookings for your
//                             property and will keep you updated on the progress.
//                         </Text>
//                         <TouchableOpacity
//                             onPress={() => {
//                                 navigation.navigate('Dashboard',{ownedProDetails:OwnedPropertyDetails});
//                             }}
//                             style={{
//                                 backgroundColor: '#0F1130',
//                                 borderColor: '#C0D5F3',
//                                 borderWidth: 1,
//                                 padding: 15,
//                                 alignItems: 'center',
//                                 borderRadius: 10,
//                                 marginVertical: 30,
//                             }}>
//                             <Text
//                                 style={{
//                                     fontFamily: 'WorkSans-Medium',
//                                     fontSize: 16,
//                                     color: '#FFFFFF',
//                                 }}>
//                                 Continue
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </Modal>
//             {/* // )} */}

//             {/* {visible1 === true && ( */}
//                 <Modal visible={visible1} modalStyle={{ width: width }} transparent animationType='fade'>
//                     <TouchableOpacity onPress={() => {setVisible1(false)}} style={{flex:1, backgroundColor:'#0000008a'}}/>
//                     <View style={{ backgroundColor: '#FFFFFF',position:'absolute',bottom:0,width:width, padding: 20, elevation: 5,borderTopLeftRadius:20,borderTopRightRadius:20 }}>
//                         <Text
//                             style={{
//                                 fontFamily: 'Montserrat-SemiBold',
//                                 fontSize: 12,
//                                 color: '#00000080',
//                             }}>
//                             By clicking{' '}
//                             <Text
//                                 style={{
//                                     fontFamily: 'Montserrat-SemiBold',
//                                     fontSize: 12,
//                                     color: '#386BF6',
//                                 }}>
//                                 {' '}
//                                 ‘Withdraw ’{' '}
//                             </Text>
//                             , you will be removed as an investor from this property and will
//                             no longer have access to its details or investment privileges.
//                         </Text>
//                         <View style={{ marginVertical: 30 }}>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     handleResell();

//                                 }}
//                                 style={{
//                                     backgroundColor: '#0F1130',
//                                     padding: 15,
//                                     alignItems: 'center',
//                                     borderRadius: 10,
//                                 }}>
//                                 <Text
//                                     style={{
//                                         fontFamily: 'WorkSans-Medium',
//                                         fontSize: 16,
//                                         color: '#FFFFFF',
//                                     }}>
//                                     Yes, I agree
//                                 </Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     setVisible1(false);
//                                 }}
//                                 style={{ alignItems: 'center', marginTop: 20 }}>
//                                 <Text
//                                     style={{
//                                         fontFamily: 'WorkSans-Medium',
//                                         fontSize: 16,
//                                         color: '#0F1130',
//                                     }}>
//                                     Skip
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </Modal>
//             {/* )} */}


//             {visible2 === true &&
//                 <CustomModal visible={true} modalStyle={{ width: width }}>
//                     <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
//                         <View>
//                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
//                                 <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#0F1130' }}>OTP Verification</Text>
//                                 <TouchableOpacity
//                                     onPress={() => {
//                                         setVisible2(false);
//                                     }}
//                                     style={{ flex: 1, alignItems: 'flex-end' }}>
//                                     <Icon name={'close'} size={20} color={'#000000'} />

//                                 </TouchableOpacity>
//                             </View>
//                             <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080', marginTop: 10 }}>Please verify the OTP sent to your registered mobile number to proceed with the exit.</Text>
//                         </View>
//                         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 30 }}>

//                             <View
//                                 style={{
//                                     flexDirection: 'row',
//                                     justifyContent: 'space-between',
//                                     width: '100%',
//                                     marginBottom: 10,
//                                 }}>
//                                 <TextInput
//                                     style={{
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 3,
//                                         color: '#000000',
//                                         borderWidth: 2,
//                                         borderColor: '#0F113021',
//                                         borderRadius: 8,
//                                         textAlign: 'center',
//                                     }}
//                                     placeholder=""
//                                     // value={otp.charAt(0)}
//                                     ref={firstInput}
//                                     maxLength={1}
//                                     keyboardType={'numeric'}
//                                     placeholderTextColor={'#000'}
//                                     onChangeText={txt => {
//                                         txt && secoundInput.current.focus();
//                                         setOtp({ ...otp, 1: txt });
//                                         //  setPhone(txt);
//                                     }}
//                                 />
//                                 <TextInput
//                                     style={{
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 3,
//                                         color: '#000000',
//                                         borderWidth: 2,
//                                         borderColor: '#0F113021',
//                                         borderRadius: 8,
//                                         textAlign: 'center',
//                                     }}
//                                     placeholder=""
//                                     //value={otp.charAt(1)}
//                                     ref={secoundInput}
//                                     maxLength={1}
//                                     keyboardType={'numeric'}
//                                     placeholderTextColor={'#000'}
//                                     onChangeText={txt => {
//                                         txt
//                                             ? thirdInput.current.focus()
//                                             : firstInput.current.focus();
//                                         setOtp({ ...otp, 2: txt });
//                                         // setPhone(txt);
//                                     }}
//                                 />
//                                 <TextInput
//                                     style={{
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 3,
//                                         color: '#000000',
//                                         borderWidth: 2,
//                                         borderColor: '#0F113021',
//                                         borderRadius: 8,
//                                         textAlign: 'center',
//                                     }}
//                                     placeholder=""
//                                     //value={otp.charAt(2)}
//                                     ref={thirdInput}
//                                     maxLength={1}
//                                     keyboardType={'numeric'}
//                                     placeholderTextColor={'#000'}
//                                     onChangeText={txt => {
//                                         // setPhone(txt);
//                                         txt
//                                             ? fourInput.current.focus()
//                                             : secoundInput.current.focus();
//                                         setOtp({ ...otp, 3: txt });
//                                     }}
//                                 />
//                                 <TextInput
//                                     style={{
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 3,
//                                         color: '#000000',
//                                         borderWidth: 2,
//                                         borderColor: '#0F113021',
//                                         borderRadius: 8,
//                                         textAlign: 'center',
//                                     }}
//                                     placeholder=""
//                                     // value={otp.charAt(3)}
//                                     ref={fourInput}
//                                     maxLength={1}
//                                     keyboardType={'numeric'}
//                                     placeholderTextColor={'#000'}
//                                     onChangeText={txt => {
//                                         // setPhone(txt);\
//                                         txt
//                                             ? fiveInput.current.focus()
//                                             : thirdInput.current.focus();
//                                         setOtp({ ...otp, 4: txt });
//                                         //setOtp(otp + txt);
//                                     }}
//                                 />
//                                 <TextInput
//                                     style={{
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 3,
//                                         color: '#000000',
//                                         borderWidth: 2,
//                                         borderColor: '#0F113021',
//                                         borderRadius: 8,
//                                         textAlign: 'center',
//                                         //padding: 10,
//                                     }}
//                                     placeholder=""
//                                     // value={otp.charAt(4)}
//                                     ref={fiveInput}
//                                     maxLength={1}
//                                     keyboardType={'numeric'}
//                                     placeholderTextColor={'#000'}
//                                     onChangeText={txt => {
//                                         txt ? sixInput.current.focus() : fourInput.current.focus();
//                                         setOtp({ ...otp, 5: txt });
//                                     }}
//                                 />
//                                 <TextInput
//                                     style={{
//                                         //height: 35,
//                                         color: '#000000',
//                                         borderWidth: 2,
//                                         borderColor: '#0F113021',
//                                         borderRadius: 8,
//                                         paddingHorizontal: 10,
//                                         paddingVertical: 3,
//                                         textAlign: 'center',
//                                     }}
//                                     placeholder=""
//                                     ref={sixInput}
//                                     maxLength={1}
//                                     keyboardType={'numeric'}
//                                     placeholderTextColor={'#000'}
//                                     onChangeText={txt => {
//                                         !txt && fiveInput.current.focus();
//                                         setOtp({ ...otp, 6: txt });
//                                     }}
//                                 />
//                             </View>

//                         </View>
//                         <TouchableOpacity onPress={() => {
//                             let code = otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6];
//                             let mssg = 'Exit';
//                             handleResellVerification(code, mssg);


//                         }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', borderWidth: 1, borderRadius: 10, padding: 15, alignItems: 'center' }}>
//                             <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Verify</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </CustomModal>
//             }



//             {visible3 === true &&
//                 <CustomModal visible={true} modalStyle={{ width: width }}>
//                     <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
//                         <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080' }}>
//                             We’ve also updated our support team regarding your request They’ll be reaching out to you shortly for any assistance you may need.
//                         </Text>
//                         <TouchableOpacity onPress={() => {

//                             setVisible3(false);
//                             navigation.navigate("Owned");
//                         }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', borderWidth: 1, padding: 15, alignItems: 'center', borderRadius: 10, marginVertical: 30 }}>
//                             <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Continue</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </CustomModal>
//             }











//         </View>
//         </SafeAreaView>
//     );
// }


import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    Linking
} from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../CustomModal';
// import { AreaChart } from 'react-native-svg-charts';
// import * as shape from 'd3-shape';
// import {
//     Defs,
//     G,
//     Text as SvgText,
//     LinearGradient as Linear,
//     Stop,
// } from 'react-native-svg';
import Svg, { Text as SvgText } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import { GetFeedbackFormForExit, ProfileDetails, SendConfirmationOTP, SendConfirmationOTPEmail, SubmitFeedbackForm, TransferProperty, VerifyOtpAndStoreMessage, VerifyOtpAndStoreMessageEmail } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function MonthlyInsight(props) {
    const navigation = useNavigation();
    const { globalState, setGlobalState } = useContext(AppContext);
    const { width, height } = Dimensions.get('window');
    const [OwnedPropertyDetails, setOwnedPropertyDetails] = useState(
        props?.route?.params?.OwnedPropertyDetails || [],
    );
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });

    const startingBooking = 0;
    const numbersOfBooking = [3, 0, 2, 2, 0];
    const extendedBooking = [0, ...numbersOfBooking, 0];
    const monthLabels = ['','Dec', 'Jan', 'Feb', 'Mar', 'Apr',''];
    const data = extendedBooking.map(change => startingBooking + change);
    const firstInput = useRef();
    const secoundInput = useRef();
    const thirdInput = useRef();
    const fourInput = useRef();
    const fiveInput = useRef();
    const sixInput = useRef();
    const screenWidth = Math.max(data.length * 100, Dimensions.get('window').width);
    const [form, setForm] = useState({});
    const [answers, setAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);

    const userData = globalState?.userDetails;

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };
  

    const handleResell = async () => {
        setVisible1(false);

        if (globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber.length === 13) {
            let payload = JSON.stringify({
                propertyName: OwnedPropertyDetails?.propertyDetails?.name,
                phoneNumber: globalState?.userDetails?.phoneNumber,
            });
            console.log(payload);
            try {
                let { data: res } = await SendConfirmationOTP(payload);


                if (res?.success) {

                    setVisible2(true);
                    //setModalVisible(true);

                    //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
                }
            } catch (error) {
                if (error?.response) {
                    Alert.alert('Response Error', `${error?.response?.data?.message}`);

                } else if (error?.request) {
                    //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                    Alert.alert('Request Error:', 'Please Check Your Internet Connection');

                    // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                } else {
                    Alert.alert('Error:', `${error}`);

                }
            }
        } else {
            let payload = JSON.stringify({
                propertyName: OwnedPropertyDetails?.propertyDetails?.name,
                email: globalState?.userDetails?.email,
            });
            try {
                let { data: res } = await SendConfirmationOTPEmail(payload);
                if (res?.success) {
                    setVisible2(true);
                    //setModalVisible(true);

                    //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
                }
            } catch (error) {
                if (error?.response) {
                    Alert.alert('Response Error', `${error?.response?.data?.message}`);

                } else if (error?.request) {
                    //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                    Alert.alert('Request Error:', 'Please Check Your Internet Connection');

                    // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                } else {
                    Alert.alert('Error:', `${error}`);

                }
            }

        }
    };

    const handleResellVerification = async (code, message) => {
        setLoader(true);
        
        if (globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber.length === 13) {
            let payload = JSON.stringify({
                phoneNumber: globalState?.userDetails?.phoneNumber,
                otp: code,
                message: "",
                isExit: true,
                propertyName: OwnedPropertyDetails?.propertyDetails?.name
            });
            try {
                let { data: res } = await VerifyOtpAndStoreMessage(payload);
                if (res?.success) {
                    handleProfle();
                    setVisible2(false);
                    setVisible3(true);

                }
            } catch (error) {
                if (error?.response) {
                    Alert.alert('Response Error', `${error?.response?.data?.message}`);
                    setLoader(false);
                } else if (error?.request) {
                    //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                    Alert.alert('Request Error:', 'Please Check Your Internet Connection');
                    setLoader(false);
                    // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                } else {
                    Alert.alert('Error:', `${error}`);
                    setLoader(false);
                }
            } finally {
                setLoader(false);
            }
        } else {
            let payload = JSON.stringify({
                email: globalState?.userDetails?.email,
                otp: code,
                message: message,
                isExit: true,
                propertyName: OwnedPropertyDetails?.propertyDetails?.name
            });
            try {
                let { data: res } = await VerifyOtpAndStoreMessageEmail(payload);
                if (res?.success) {
                    handleProfle();
                    setVisible2(false);
                    setVisible3(true);
                    // Alert.alert(
                    //     'Thank You for Response',
                    //     `Your ${OwnedPropertyDetails?.propertyDetails?.name} property will be sold within the next 60 days.`,
                    // );
                }
            } catch (error) {
                if (error?.response) {
                    Alert.alert('Response Error in verifying otp', `${error?.response?.data?.message}`);
                    console.log("Error response in verfying transfer: ", error?.response?.data);
                } else if (error?.request) {
                    //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                    Alert.alert('Request Error:', 'Please Check Your Internet Connection');
                    console.log("Error response in verfying transfer: ", error?.response?.data);
                    // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
                } else {
                    Alert.alert('Error:', `${error}`);
                    console.log("Error response in verfying transfer: ", error?.response?.data);
                }
            }
        }
    };

    const handleProfle = async () => {
        setLoader(true);
        const tokenid = await AsyncStorage.getItem('mytoken');
        // console.log("Token id: ",tokenid);
        const emailId = await AsyncStorage.getItem('Email');
        let payload = JSON.stringify({
          email: emailId,
        });
        try {
          let { data: res } = await ProfileDetails(payload, tokenid);
          if (res?.success) {
            // const userType = res.data?.verification || res?.data?.ownedProperties?.length > 0; // owner or normal
            // if(userType){
            //   analytics().setUserProperty('user_type', 'owners');
            // }else{
            //   analytics().setUserProperty('user_type', 'normal');
            // }
    
            // handleUserType(userType);
    
            setGlobalState(prevState => ({
              ...prevState,
              userName: res?.data?.userName,
              userEmail: emailId,
              userPhone: res?.data?.phoneNumber,
              token: tokenid,
              userDetails: res?.data,
              userProfile: res?.data?.profilePicture,
            }));
    
          }
        } catch (error) {
          if (error?.response) {
            if (error?.response?.data?.message == 'Invalid token.') {
              navigation.navigate('NewLogin');
            } else {
              Alert.alert(
                'Response ErrorProfile',
                `${error?.response?.data?.message}`,
              );
              console.log("Error response in verfying transfer: ", error?.response?.data);
            }
          } else if (error?.request) {
            //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
            //console.log('profilr',`${JSON.stringify(error?.request)}`);
            //Alert.alert('Request error:', 'Please Check Your Internet Connection');
          } else {
            Alert.alert('Error:', `${error}`);
            console.log("Error response in verfying transfer: ", error?.response?.data);
          }
        } finally{
            setLoader(false);
        }
      };

    const handleTransfer = async () => {
        setLoader(true);
        let payload = JSON.stringify({
            email: globalState?.userEmail,
            fromPropertyId: OwnedPropertyDetails?.propertyDetails?._id,
            fromPropertyName: OwnedPropertyDetails?.propertyDetails?.name,
            toPropertyId: OwnedPropertyDetails?.propertyDetails?._id,
            toPropertyName: OwnedPropertyDetails?.propertyDetails?.name,
            action: 'hold'
        });
        // console.log(payload);
        try {
            let { data: res } = await TransferProperty(payload);
            // console.log(res);

            if (res?.success) {
                setVisible(true);
                setLoader(false);

            }
        } catch (error) {
           // console.log(error);

            if (error?.response) {
                Alert.alert('Response Error', `${error?.response?.data?.message}`);
                //setLoader(false);
            } else if (error?.request) {
                // console.log('property', `${JSON.stringify(error?.request)}`);
                //  Alert.alert('Request error:', 'Please Check Your Internet Connection');
                //setLoader(false);
            } else {
                Alert.alert('Error:', `${error?.message}`);
                //setLoader(false);
            }
        }
    };

      const fetchFeedbackForm = async () => {
        try{
          let {data: res} = await GetFeedbackFormForExit();
          // console.log("Response:", res);
          if(res?.success){
            setForm(res?.data);
            setShowFeedback(true);
          }
        }catch(error){
          console.error('Error in fetching feedback form: ', error?.response?.message || error?.response);
        }
      }
    
      const submitFeedbackForm = async () => {
        try {
          const isValid = form?.questions?.every(q => {
            if (!q.required) return true;
    
            const answer = answers[q._id];
    
            // no answer at all
            if (answer === undefined || answer === null) return false;
    
            // empty text
            if (q.type === 'text' && answer.trim() === '') return false;
    
            return true;
          });
    
          if (!isValid) {
            Alert.alert('Alert','Please answer all required questions');
            return;
          }
    
          // build responses array
          const responses = form?.questions?.map(q => ({
            questionId: q._id,
            question: q.question,
            answer: answers[q._id] || '',
            type: q.type
          }));
    
          // final payload
          const payload = {
            userId: userData?._id,                 
            email: userData?.email,
            phoneNumber: userData?.phoneNumber,
            propertyId: OwnedPropertyDetails?.propertyDetails?._id,
            propertyName: OwnedPropertyDetails?.propertyDetails?.name || '',
            responses
          };
    
          console.log('FINAL PAYLOAD:', payload);
    
          let { data: res } = await SubmitFeedbackForm(payload);
    
          console.log('SUCCESS:', res);
    
          setShowFeedback(false); // close modal
          handleResell();
        //   setVisible2(true);
        } catch (error) {
          console.log(
            'Error in submitting the feedback form:',
            error?.response?.data || error?.response?.message
          );
        }
      };

    const renderQuestion = (q) => {
        // normalize type (important)
        const type = q?.type?.toLowerCase();
    
        if (type === 'single choice') {
          return (
            <View key={q._id} style={{marginTop:15}}>
              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>
                {q.question}
              </Text>
    
              {q?.options?.map((opt, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswer(q._id, opt)} // store string directly
                  style={{
                    padding:10,
                    marginTop:8,
                    borderRadius:8,
                    borderWidth:1,
                    borderColor: answers[q._id] === opt ? '#007BFF' : '#ddd',
                    backgroundColor: answers[q._id] === opt ? '#E6F0FF' : '#fff'
                  }}
                >
                  <Text style={{color:'#000'}}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }
    
        if (type === 'text') {
          return (
            <View key={q._id} style={{marginTop:15}}>
              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:13,color:'#000'}}>
                {q.question}
              </Text>
    
              <TextInput
                placeholder="Your Comment"
                placeholderTextColor={'#000'}
                value={answers[q._id] || ''}
                onChangeText={(text) => handleAnswer(q._id, text)}
                multiline
                style={{
                  borderWidth:1,
                  fontFamily:'WorkSans-Medium',fontSize:12,color:'#000',
                  borderColor:'#ddd',
                  borderRadius:8,
                  padding:10,
                  marginTop:8,
                  minHeight:80,
                  textAlignVertical:'top'
                }}
              />
            </View>
          );
        }
    
        return null;
      };


    const handleCallNow = Phone => {
        const phoneNumber = Phone;
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.openURL(phoneUrl)
          .then(supported => {
            if (!supported) {
              Alert.alert('Error', 'Phone number is not supported');
            }
          })
          .catch(error => console.log('Error making phone call:', error));
    };


    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#021265',}}>
            <View style={{flex:1, backgroundColor:'#fafafa'}}>
                <View style={{backgroundColor:'#021265',padding:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={() => {
                        navigation.goBack();
                    }}>
                        <Icon name={'left'} size={20} color={'#FFF'}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,color:'#FFF'}}>Exit & Transfer</Text>
                    <View style={{width:20}}></View>
                </View>
                <ScrollView style={{backgroundColor:'#fafafa',paddingVertical:20,marginBottom:115}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#00000099',textAlign:'center'}}>Manage your investment by transferring or exiting  your frac ownership.</Text>
                    </View>

                    <View style={{backgroundColor:'#FFF',borderRadius:10,padding:20,elevation:5,shadowColor: "#000",shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.2,shadowRadius: 10,marginTop:20,marginHorizontal:20,marginBottom:10}}>
                        <View style={{flexDirection:'row',alignItems:'center',}}>
                            <Text style={{fontSize:20}}>🔄</Text>
                            <Text style={{fontFamily:'Montserrat-Medium',fontSize:16,color:'#000',marginLeft:10}}>Transfer Request</Text>
                        </View>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:13,color:'#00000099',marginVertical:15,lineHeight:20}}>
                            Transfer your frac ownership from this property to another eligible property.
                        </Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Transfer', { OwnedPropertyDetails: OwnedPropertyDetails });
                        }} style={{backgroundColor:'#021265',borderRadius:5,padding:12,alignItems:'center'}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFF'}}>Initiate Transfer →</Text>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#386BF6',marginTop:10}}>Processing time: 5-7 business days</Text>
                    </View>

                    <View style={{backgroundColor:'#FFF',borderRadius:10,padding:20,elevation:5,shadowColor: "#000",shadowOffset: { width: 0, height: 8 },shadowOpacity: 0.2,shadowRadius: 10,marginTop:20,marginHorizontal:20,marginBottom:10}}>
                        <View style={{flexDirection:'row',alignItems:'center',}}>
                            <Text style={{fontSize:20}}>💰</Text>
                            <Text style={{fontFamily:'Montserrat-Medium',fontSize:16,color:'#000',marginLeft:10}}>Exit Request</Text>
                        </View>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:13,color:'#00000099',marginVertical:15,lineHeight:20}}>
                            Initiate an exit request and withdraw your investment with assistance from our team.
                        </Text>
                        <TouchableOpacity onPress={() => {
                            setVisible1(true);
                        }} style={{borderColor:'#021265',borderWidth:0.5,borderRadius:5,padding:12,alignItems:'center'}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#021265'}}>Request Exit →</Text>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#386BF6',marginTop:10}}>Processing time: It will vary based on commitment</Text>
                    </View>

                    {visible1 === true && (
                        <Modal visible={true} transparent animationType='fade' modalStyle={{ width: width }}>
                            <View style={{flex:1,backgroundColor:'#00000065'}}>
                                <TouchableOpacity onPress={() => {setVisible1(false)}} style={{flex:1}}/>
                                <View style={{ position:'absolute', bottom: 0, right: 0, left: 0, backgroundColor: '#FFFFFF', padding: 20, elevation: 5, borderTopLeftRadius:20, borderTopRightRadius:20 }}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#000',alignSelf:'center'}}>Exit Request</Text>
                                    <Text style={{fontFamily: 'Montserrat-SemiBold',fontSize: 12,color: '#00000080',marginTop:15 }}> 
                                        By clicking{' '}
                                        <Text style={{fontFamily: 'Montserrat-SemiBold',fontSize: 12,color: '#386BF6',}}>
                                            {' '}‘Exit Request ’{' '}
                                        </Text>
                                        you will be removed as an investor from this property and will no longer have access to its details or investment privileges.
                                    </Text>
                                    <View style={{ marginVertical: 30 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // handleResell();
                                                fetchFeedbackForm();
                                                
                                                setVisible1(false);
                                            }}
                                            style={{backgroundColor: '#021265',padding: 15,alignItems: 'center',borderRadius: 10,}}
                                        >
                                            <Text style={{fontFamily: 'WorkSans-Medium',fontSize: 16,color: '#FFFFFF', }}> Yes, I agree</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setVisible1(false);
                                            }}
                                            style={{ alignItems: 'center', marginTop: 20, padding: 12, borderColor:'#00000099', borderRadius:10, borderWidth:0.5 }}>
                                            <Text style={{fontFamily: 'WorkSans-Medium',fontSize: 16,color: '#0F1130', }}> Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}

                    <Modal visible={showFeedback} transparent animationType='fade'>
                        <View style={{flex:1,backgroundColor:'#00000065'}}>
                            <TouchableOpacity onPress={() => {setShowFeedback(false)}} style={{flex:1}}/>
                            <ScrollView style={{position:'absolute',bottom:0,left:0,right:0,height:height*0.6,backgroundColor:'#FFF',padding:25,borderTopLeftRadius:25,borderTopRightRadius:25}}>
                                <View style={{alignItems:'center'}}>
                                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>Feedback Form</Text>
                                </View>
                                <View>
                                    {form?.questions?.map(renderQuestion)}
                                </View>
                                <TouchableOpacity onPress={submitFeedbackForm}
                                    style={{backgroundColor:'#0f1265',padding:12,borderRadius:10,marginTop:20,alignItems:'center',marginBottom:50}}
                                >
                                    <Text style={{fontFamily:'WorkSans-Medium',color:'#FFF'}}>Submit</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Modal>

                    {visible2 === true &&
                        <Modal visible={true} transparent animationType='fade' modalStyle={{ width: width }}>
                            <View style={{flex:1, backgroundColor:'#00000065'}}>
                                {/* <TouchableOpacity onPress={() => {setVisible2(false)}} style={{flex:1}}/> */}
                                <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor: '#FFFFFF', padding: 20, elevation: 5,borderTopLeftRadius:20,borderTopRightRadius:20 }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#0F1130' }}>OTP Verification</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setVisible2(false);
                                                }}
                                                style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Icon name={'close'} size={20} color={'#000000'} />

                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080', marginTop: 10 }}>Please verify the OTP sent to your registered mobile number to proceed with the exit.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 30 }}>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                marginBottom: 10,
                                            }}>
                                            <TextInput
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    color: '#000000',
                                                    borderWidth: 2,
                                                    borderColor: '#0F113021',
                                                    borderRadius: 8,
                                                    textAlign: 'center',
                                                }}
                                                placeholder=""
                                                // value={otp.charAt(0)}
                                                ref={firstInput}
                                                maxLength={1}
                                                keyboardType={'numeric'}
                                                placeholderTextColor={'#000'}
                                                onChangeText={txt => {
                                                    txt && secoundInput.current.focus();
                                                    setOtp({ ...otp, 1: txt });
                                                    //  setPhone(txt);
                                                }}
                                            />
                                            <TextInput
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    color: '#000000',
                                                    borderWidth: 2,
                                                    borderColor: '#0F113021',
                                                    borderRadius: 8,
                                                    textAlign: 'center',
                                                }}
                                                placeholder=""
                                                //value={otp.charAt(1)}
                                                ref={secoundInput}
                                                maxLength={1}
                                                keyboardType={'numeric'}
                                                placeholderTextColor={'#000'}
                                                onChangeText={txt => {
                                                    txt
                                                        ? thirdInput.current.focus()
                                                        : firstInput.current.focus();
                                                    setOtp({ ...otp, 2: txt });
                                                    // setPhone(txt);
                                                }}
                                            />
                                            <TextInput
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    color: '#000000',
                                                    borderWidth: 2,
                                                    borderColor: '#0F113021',
                                                    borderRadius: 8,
                                                    textAlign: 'center',
                                                }}
                                                placeholder=""
                                                //value={otp.charAt(2)}
                                                ref={thirdInput}
                                                maxLength={1}
                                                keyboardType={'numeric'}
                                                placeholderTextColor={'#000'}
                                                onChangeText={txt => {
                                                    // setPhone(txt);
                                                    txt
                                                        ? fourInput.current.focus()
                                                        : secoundInput.current.focus();
                                                    setOtp({ ...otp, 3: txt });
                                                }}
                                            />
                                            <TextInput
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    color: '#000000',
                                                    borderWidth: 2,
                                                    borderColor: '#0F113021',
                                                    borderRadius: 8,
                                                    textAlign: 'center',
                                                }}
                                                placeholder=""
                                                // value={otp.charAt(3)}
                                                ref={fourInput}
                                                maxLength={1}
                                                keyboardType={'numeric'}
                                                placeholderTextColor={'#000'}
                                                onChangeText={txt => {
                                                    // setPhone(txt);\
                                                    txt
                                                        ? fiveInput.current.focus()
                                                        : thirdInput.current.focus();
                                                    setOtp({ ...otp, 4: txt });
                                                    //setOtp(otp + txt);
                                                }}
                                            />
                                            <TextInput
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    color: '#000000',
                                                    borderWidth: 2,
                                                    borderColor: '#0F113021',
                                                    borderRadius: 8,
                                                    textAlign: 'center',
                                                    //padding: 10,
                                                }}
                                                placeholder=""
                                                // value={otp.charAt(4)}
                                                ref={fiveInput}
                                                maxLength={1}
                                                keyboardType={'numeric'}
                                                placeholderTextColor={'#000'}
                                                onChangeText={txt => {
                                                    txt ? sixInput.current.focus() : fourInput.current.focus();
                                                    setOtp({ ...otp, 5: txt });
                                                }}
                                            />
                                            <TextInput
                                                style={{
                                                    //height: 35,
                                                    color: '#000000',
                                                    borderWidth: 2,
                                                    borderColor: '#0F113021',
                                                    borderRadius: 8,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    textAlign: 'center',
                                                }}
                                                placeholder=""
                                                ref={sixInput}
                                                maxLength={1}
                                                keyboardType={'numeric'}
                                                placeholderTextColor={'#000'}
                                                onChangeText={txt => {
                                                    !txt && fiveInput.current.focus();
                                                    setOtp({ ...otp, 6: txt });
                                                }}
                                            />
                                        </View>

                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        let code = otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6];
                                        let mssg = 'Exit';
                                        handleResellVerification(code, mssg);


                                    }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', borderWidth: 1, borderRadius: 10, padding: 15, alignItems: 'center' }}>
                                        {/* <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Verify</Text> */}
                                        { loader == true ? (
                                            <ActivityIndicator size="small" color="#ffffff" />
                                            ) : ( <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Verify</Text>)
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    }

                    {visible3 === true &&
                        <Modal visible={true} transparent animationType='fade' modalStyle={{ width: width }}>
                            <View style={{flex:1,backgroundColor:'#00000065'}}>
                                <TouchableOpacity onPress={() => {
                                    setVisible3(false);
                                    navigation.navigate('Owned');
                                    }} style={{flex:1}}/>
                                <View style={{ backgroundColor: '#FFFFFF', padding: 20, elevation: 5 }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#00000080' }}>
                                        Your exit request has been received. Your fractional shares will be processed, and the exit will be completed once the request is successfully processed.
                                        {/* We’ve also updated our support team regarding your request They’ll be reaching out to you shortly for any assistance you may need. */}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setVisible3(false);
                                        navigation.navigate("Owned");
                                    }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', borderWidth: 1, padding: 15, alignItems: 'center', borderRadius: 10, marginVertical: 30 }}>
                                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    }
                </ScrollView>

                <View style={{position:'absolute',bottom:0,left:0,right:0,padding:20}}>
                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',alignSelf:'center'}}>For urgent support, contact our team.</Text>
                    <TouchableOpacity onPress={() => {
                        const Phone = '+919880626111';
                        handleCallNow(Phone);
                    }} style={{backgroundColor:'#021265',padding:12,alignItems:'center',borderRadius:5,marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#f5f5f5'}}>+91 9880626111</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}