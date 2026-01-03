// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   ActivityIndicator,
//   BackHandler,
//   Linking,
// } from 'react-native';
// import { useContext, useEffect, useRef, useState } from 'react';
// import { FontFamily, Color, FontSize, Padding, Border } from './GlobalStyles';
// import { useNavigation } from '@react-navigation/native';
// import { AppContext } from './Context/AppContext';
// const { width, height } = Dimensions.get('window');
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import IconF from 'react-native-vector-icons/FontAwesome6';
// import Footer from './Footer';
// import {
//   DisLike,
//   Like,
//   LikeData,
//   Login,
//   ProfileDetails,
//   PropertyDetails,
// } from './Services/UserApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function Home(props) {
//   const [loader, setLoader] = useState(false);
//   const { globalState, setGlobalState } = useContext(AppContext);
//   const navigation = useNavigation();
//   const [Properties, setProperties] = useState(props?.route?.params?.details || globalState?.ProDetails);
//   const [PropertiesArray, setPropertiesArray] = useState([]);
//   const [IsLike, setIsLike] = useState([]);
//   const [Display, setDisplay] = useState(0);
//   const [offer, setOffer] = useState(globalState?.offer);
//   const handleDisLike = async Productid => {
//     let payload = JSON.stringify({
//       email: globalState?.userEmail,
//       propertyId: Productid,
//     });

//     try {
//       let { data: res } = await DisLike(payload);
//       if (res?.success) {
//         const filteredNumbers = IsLike.filter(number => number !== Productid);
//         setIsLike(filteredNumbers);
//       }
//     } catch (error) {
//       if (error?.response) {
//         Alert.alert('Response Error', `${error?.response?.data?.message}`);
//       } else if (error?.request) {
//         //console.log('Request error:', `${JSON.stringify(error)}`);
//         Alert.alert('Request error:', 'Please Check Your Internet Connection');
//       } else {
//         Alert.alert('Error:', `${error?.message}`);
//       }
//     }
//   };

//   const handleLike = async item => {
//     let payload = JSON.stringify({
//       email: globalState?.userEmail,
//       propertyId: item?._id,
//     });

//     try {
//       let { data: res } = await Like(payload);

//       if (res?.success) {
//         //setIsLike(Productid);
//         setIsLike([...IsLike, item?._id]);
//       } else {
//         handleDisLike(item?._id);
//       }
//     } catch (error) {
//       if (error?.response) {
//         Alert.alert('Response Error', `${error?.response?.data?.message}`);
//       } else if (error?.request) {
//         Alert.alert('Request error:', 'Please Check Your Internet Connection');
//       } else {
//         Alert.alert('Error:', `${error?.message}`);
//       }
//     }
//   };



//   const handleAllLike = async () => {
//     const email = await AsyncStorage.getItem('Email');
//     let payload = JSON.stringify({
//       email: email,
//     });
//     try {
//       let { data: res } = await LikeData(payload);

//       if (res?.success) {
//         setGlobalState(prevState => ({
//           ...prevState,
//           LikeData: res?.pIds,
//         }));
//         setIsLike(res?.pIds);
//       }
//     } catch (error) {
//       if (error?.response) {
//         Alert.alert('Response Error', `${error?.response?.data?.message}`);
//       } else if (error?.request) {

//         Alert.alert('Request error:', 'Please Check Your Internet Connection');
//       } else {
//         Alert.alert('Error:', `${error?.message}`);
//       }
//     }
//   };

//   useEffect(() => {

//     handleAllLike();

//   }, []);













//   return (

//     <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
//       <View style={[styles.iphone13Mini9, { paddingVertical: 10 }]}>

//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
//           <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

//             <Text
//               style={[
//                 styles.jonathan,
//                 ,
//                 { fontSize: 22, },
//               ]}>
//               {" "}Hi, {globalState?.userName}!
//             </Text>
//           </View>
//           <TouchableOpacity style={{ flex: 1 }}
//             onPress={() => {
//               navigation.navigate('HomePage');

//             }}>
//             <Text style={{
//               fontSize: 15,

//               fontFamily: 'WorkSans-SemiBold',
//               color: '#0424CB',
//               textAlign: 'right',
//               marginRight: 10,
//               padding: 10,

//             }}>EXIT</Text>
//           </TouchableOpacity>
//         </View>
//         <ScrollView horizontal={true}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 30, width: '100%', flex: 1 }}>
//             <TouchableOpacity

//               onPress={() => {
//                 const filtered = globalState?.ProDetails.filter(user =>
//                   user?.P_Type.includes('APARTMENT'),
//                 );
//                 setProperties(filtered);
//                 setDisplay(1);
//               }}

//             >
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{ justifyContent: 'center', borderColor: Display == 1 ? '#C2D8F7' : '#FAFAFF', borderWidth: 20, width: 80, height: 80, borderRadius: 80, alignItems: 'center' }}>
//                   <Image
//                     style={{ width: 60, height: 60 }}
//                     resizeMode='contain'
//                     source={require('./assets/fillter11.png')}
//                   />
//                 </View>
//                 <Text
//                   style={{ paddingHorizontal: 8, fontFamily: 'WorkSans-Bold', fontSize: 16, color: '#021265', paddingBottom: 20 }}>
//                   Apartment
//                 </Text>

//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{ paddingHorizontal: 12 }}
//               onPress={() => {
//                 const filtered = globalState?.ProDetails.filter(user =>
//                   user?.P_Type.includes('VILLA'),
//                 );
//                 setProperties(filtered);
//                 setDisplay(2);
//               }}

//             >
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{ justifyContent: 'center', borderColor: Display == 2 ? '#C1DFE8' : '#FAFAFF', borderWidth: 20, width: 80, height: 80, borderRadius: 80, alignItems: 'center' }}>
//                   <Image

//                     style={{ width: 60, height: 60 }}
//                     resizeMode='contain'
//                     source={require('./assets/filter22.png')}
//                   />
//                 </View>
//                 <Text
//                   style={{ paddingHorizontal: 8, fontFamily: 'WorkSans-Bold', fontSize: 16, color: '#021265', paddingBottom: 20 }}>
//                   Villa
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity

//               onPress={() => {
//                 const filtered = globalState?.ProDetails.filter(user =>
//                   user?.P_Type.includes('FARM HOUSE'),
//                 );
//                 setProperties(filtered);
//                 setDisplay(3);
//               }}

//             >
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{ justifyContent: 'center', borderColor: Display == 3 ? '#EFE8DA' : '#FAFAFF', borderWidth: 20, width: 80, height: 80, borderRadius: 80, alignItems: 'center' }}>
//                   <Image

//                     style={{ width: 60, height: 60 }}
//                     resizeMode='contain'
//                     source={require('./assets/filter33.png')}
//                   />
//                 </View>

//                 <Text
//                   style={{ paddingHorizontal: 8, fontFamily: 'WorkSans-Bold', fontSize: 16, color: '#021265', paddingBottom: 20 }}>
//                   Farm House
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{ paddingHorizontal: 10 }}
//               onPress={() => {
//                 const filtered = globalState?.ProDetails.filter(user =>
//                   user?.P_Type.includes('RESORT'),
//                 );
//                 setProperties(filtered);
//                 setDisplay(4);
//               }}

//             >
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{ justifyContent: 'center', borderColor: Display == 4 ? '#FFECDE' : '#FAFAFF', borderWidth: 20, width: 80, height: 80, borderRadius: 80, alignItems: 'center' }}>
//                   <Image
//                     style={{ width: 60, height: 60 }}
//                     resizeMode='contain'
//                     source={require('./assets/filter44.png')}
//                   />
//                 </View>

//                 <Text
//                   style={{ paddingHorizontal: 8, fontFamily: 'WorkSans-Bold', fontSize: 16, color: '#021265', paddingBottom: 20 }}>
//                   Resort
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         <ScrollView style={{ backgroundColor: '#FAFAFF' }}>


//           <View
//             style={{
//               paddingHorizontal: 10,
//               // paddingTop: 0,
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',

//               paddingTop: 20,
//               paddingBottom: 10

//             }}>
//             <Text style={[styles.textTypo2, { paddingVertical: 0, color: '#081F62', fontFamily: 'WorkSans-Bold', fontSize: 18 }]}>
//               Featured Estates
//             </Text>
//             <TouchableOpacity onPress={() => {
//               setProperties(props?.route?.params?.details);
//               setDisplay(0);
//             }} >
//               <Text style={{ fontSize: 10, color: '#081F62', fontFamily: 'WorkSans-SemiBold', borderBottomColor: '#081F62', borderBottomWidth: 1 }}>View All</Text>
//             </TouchableOpacity>
//           </View>
//           {loader == true ? (
//             <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
//               <ActivityIndicator size="large" color="#043862" /></View>) : <View style={{ marginBottom: 20 }}>
//             {Properties.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={{
//                   borderBottomWidth: 1,
//                   borderLeftWidth: 1,
//                   borderRightWidth: 1,
//                   borderTopWidth: 0.3,
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   marginHorizontal: 10,
//                   flexDirection: 'row',
//                   borderColor: '#DADADA',
//                   flex: 1,
//                   //padding: 10,
//                   borderRadius: 15,
//                   marginVertical: 10,
//                   backgroundColor: 'white',
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.3,
//                 }}
//                 onPress={() => {

//                   navigation.navigate('Property', { details: item });
//                 }}>
//                 <View style={{ flex: 1 }}>
//                   <Image
//                     style={{
//                       width: width * 0.95,
//                       height: height * 0.25,
//                       borderTopLeftRadius: 15,
//                       borderTopRightRadius: 15,
//                       opacity: item?.AvailableFractions == 0 ? 0.5 : null,
//                     }}
//                     source={{ uri: item?.image?.Image1 }}
//                   />
//                   <View
//                     style={{
//                       position: 'absolute',
//                       margin: 10,
//                       backgroundColor: IsLike.includes(`${item?._id}`) ? 'white' : '#043862',

//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       height: 40,
//                       width: 40,
//                       borderRadius: 40,
//                     }}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         if (IsLike.includes(`${item?._id}`)) {
//                           handleDisLike(item?._id);
//                         } else {
//                           handleLike(item);
//                         }
//                       }}>
//                       {IsLike.includes(`${item?._id}`) ? (
//                         <Icon
//                           name={'cards-heart'}
//                           size={25}
//                           color={'#FF3659'}
//                         />
//                       ) : (
//                         <Icon
//                           name={'cards-heart'}
//                           size={20}
//                           color={'#FFFFFF'}
//                         />
//                       )}
//                     </TouchableOpacity>
//                   </View>



//                   {item?.H_property && (
//                     <View
//                       style={{
//                         width: '100%',
//                         height: height * 0.25,
//                         position: 'absolute',
//                         justifyContent: 'flex-end',
//                         flex: 1,
//                         alignItems: 'flex-end',

//                         marginLeft: '8%',
//                       }}>
//                       <Image
//                         style={{
//                           width: 150,
//                           height: 150,
//                         }}
//                         source={require('./assets/HotProperty.png')}
//                       />
//                     </View>
//                   )}
//                   {item?.AvailableFractions == 0 && (
//                     <View
//                       style={{
//                         width: '100%',
//                         position: 'absolute',
//                         flex: 1,
//                         alignItems: 'flex-end',
//                       }}>
//                       <Image
//                         style={{
//                           width: 60,
//                           height: 60,
//                           borderRadius: 60,
//                         }}
//                         source={require('./assets/SoldOut2.png')}
//                       />
//                     </View>
//                   )}
//                   <View style={{ marginHorizontal: 0, marginVertical: 10 }}>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         flex: 1,
//                         marginHorizontal: 6,

//                       }}>
//                       <View style={{ flex: 2, alignItems: 'flex-start' }}>
//                         <Text
//                           style={
//                             { fontSize: 12, color: '#081F62', fontFamily: 'Montserrat-SemiBold', }
//                           }>
//                           {item?.name}
//                         </Text>
//                       </View>
//                       <View style={{ flex: 1, alignItems: 'flex-end' }}>
//                         <Text
//                           style={{ fontSize: 14, color: '#081F62', fontFamily: 'Montserrat-SemiBold', }}>
//                           {'\u20B9'}{item?.Price}
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         marginHorizontal: 10,
//                         flex: 1,
//                         paddingTop: 5
//                       }}>
//                       <Text
//                         style={[
//                           styles.textTypo2,
//                           {
//                             paddingLeft: 0,
//                             fontSize: 12,
//                             fontFamily: 'Montserrat-Medium',
//                           },
//                         ]}>
//                         Frac Price
//                       </Text>
//                       <Text
//                         style={[
//                           styles.textTypo2,
//                           {
//                             paddingLeft: 0,
//                             letterSpacing: 0.3,
//                             fontSize: 12,
//                             fontFamily: 'OpenSans-SemiBold',
//                           },
//                         ]}>
//                         {'\u20B9'}
//                         {item?.FC_Price}
//                       </Text>
//                     </View>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         marginHorizontal: 10,
//                         flex: 1,
//                         paddingBottom: 5
//                       }}>
//                       <Text
//                         style={[
//                           styles.textTypo2,
//                           {
//                             paddingLeft: 0,
//                             fontSize: 12,
//                             fontFamily: 'Montserrat-Medium',
//                           },
//                         ]}>
//                         Available Fractions
//                       </Text>
//                       <Text
//                         style={[
//                           styles.textTypo2,
//                           {

//                             letterSpacing: 0.3,
//                             fontSize: 12,
//                             fontFamily: 'OpenSans-SemiBold',

//                           },
//                         ]}>
//                         {item?.AvailableFractions}
//                       </Text>
//                     </View>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         marginVertical: 5,
//                       }}>
//                       <View style={{ paddingLeft: 8, flex: 1, width: '100%' }}>
//                         <View style={[styles.layout1, { borderBottomColor: '#F0EFFB', borderBottomWidth: 1, paddingTop: 8 }]}>


//                           <Text style={[styles.text15, styles.textTypo, { color: '#4D5369', paddingBottom: 10 }]}>
//                             {item?.Type}
//                           </Text>
//                         </View>


//                       </View>
//                       <View
//                         style={{
//                           paddingHorizontal: 25,
//                           borderBottomLeftRadius: 20,
//                           borderTopLeftRadius: 20,
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           borderColor: '#043862',
//                           backgroundColor: '#043862',
//                         }}>
//                         <Text
//                           style={{ color: '#FFFFFF', fontFamily: 'OpenSans-Bold', fontSize: 12 }}>
//                           View Details
//                         </Text>
//                       </View>
//                     </View>
//                     <View style={[styles.layout1, { marginLeft: 10, alignItems: 'center' }]}>
//                       <Icon
//                         name="arrow-expand-all"
//                         size={15}
//                         color="#043862"
//                       />
//                       <Text style={[styles.textTypo, { color: '#000929', textAlign: 'center', }]}> {item?.area}</Text>
//                     </View>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>}
//           <View
//             style={{
//               paddingHorizontal: 10,
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingBottom: 20

//             }}>
//             <Text style={[styles.textTypo2, { paddingVertical: 0, color: '#081F62', fontFamily: 'WorkSans-Bold', fontSize: 18 }]}>
//               Go beyond your Typical Stay
//             </Text>


//           </View>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <ScrollView horizontal={true}>
//               <View
//                 style={{
//                   backgroundColor: 'white',
//                   margin: 10,
//                   paddingBottom: 80,
//                 }}>
//                 <Image
//                   style={{ borderRadius: 10, width: 160, height: 260 }}
//                   source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/WhatsApp+Image+2024-12-27+at+4.25.29+PM.jpeg' }}
//                 />
//                 <View
//                   style={{
//                     position: 'absolute',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     width: '100%',
//                     height: 240,
//                     paddingHorizontal: 20
//                   }}>
//                   <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF', textAlign: 'center' }}>24/7 Concierge Servies</Text>
//                 </View>
//               </View>
//               <View

//                 style={{
//                   backgroundColor: '#FFFFFF',
//                   margin: 10,
//                   paddingBottom: 10,
//                 }}>
//                 <Image
//                   style={{ borderRadius: 10, width: 160, height: 260 }}
//                   source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/offers/20.jpeg' }}
//                 />
//                 <View
//                   style={{
//                     position: 'absolute',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     width: '100%',
//                     height: 240,
//                     paddingHorizontal: 20
//                     // paddingLeft: 20
//                   }}>
//                   <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF', textAlign: 'center' }}>Marketing For Rental Units</Text>
//                 </View>
//               </View>
//               <View

//                 style={{
//                   backgroundColor: 'white',
//                   margin: 10,
//                   paddingBottom: 10,
//                 }}>
//                 <Image
//                   style={{ borderRadius: 10, width: 160, height: 260 }}
//                   source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/WhatsApp+Image+2024-12-27+at+4.27.19+PM.jpeg' }}
//                 />
//                 <View
//                   style={{
//                     position: 'absolute',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     width: '100%',
//                     height: 240,
//                     paddingHorizontal: 20
//                   }}>
//                   <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF', textAlign: 'center' }}>Guest Management</Text>
//                 </View>
//               </View>
//               <View

//                 style={{
//                   backgroundColor: 'white',
//                   margin: 10,
//                   paddingBottom: 10,
//                 }}>
//                 <Image
//                   style={{ borderRadius: 10, width: 160, height: 260 }}
//                   source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/WhatsApp+Image+2024-12-27+at+4.27.28+PM.jpeg' }}
//                 />
//                 <View
//                   style={{
//                     position: 'absolute',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     width: '100%',
//                     height: 240,
//                     paddingHorizontal: 20
//                   }}>
//                   <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF', textAlign: 'center' }}>Property Documentation</Text>
//                 </View>
//               </View>
//               <View

//                 style={{
//                   backgroundColor: 'white',
//                   margin: 10,
//                   paddingBottom: 10,
//                   borderRadius: 8
//                 }}>
//                 <Image
//                   style={{ borderRadius: 10, width: 160, height: 260 }}
//                   source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/WhatsApp+Image+2024-12-27+at+4.27.37+PM.jpeg' }}
//                 />
//                 <View
//                   style={{
//                     position: 'absolute',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     width: '100%',
//                     height: 220,
//                     paddingHorizontal: 20
//                   }}>
//                   <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#FFFFFF', textAlign: 'center' }}>Easy Exit</Text>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>


//         </ScrollView>

//       </View>
//       <Footer navigation={navigation} activeFooterTab={'home'} />
//     </SafeAreaView>

//   );
// }
// const styles = StyleSheet.create({
//   itemHeaderTextButton1: {
//     left: 2,
//   },
//   customModal: {
//     width: '100%',
//     paddingBottom: 20,
//     marginBottom: 5,
//   },


//   maskGroupIconLayout: {
//     width: 40,
//     height: 40,
//   },

//   buttonLocationSmall: {
//     backgroundColor: '#dde8ff',
//     padding: Padding.p_5xs,
//     // height: 56,
//     borderRadius: Border.br_31xl,
//   },
//   layoutPosition: {
//     marginTop: 10,
//   },

//   buttonLocationSmall1: {
//     backgroundColor: '#e7dffd',
//     marginLeft: 10,
//     padding: Padding.p_5xs,
//     // height: 56,
//     borderRadius: Border.br_31xl,
//   },
//   text6Typo: {
//     marginLeft: 8,
//     // letterSpacing: 0.4,
//     color: Color.colorGray,
//     fontSize: FontSize.size_sm,
//     textAlign: 'left',
//   },
//   layout: {
//     flexDirection: 'row',
//     //position: "absolute",
//   },
//   rural: {
//     fontFamily: FontFamily.interSemiBold,
//   },
//   buttonSpaceBlock: {
//     paddingBottom: Padding.p_5xs,
//     paddingRight: Padding.p_base,
//     paddingTop: Padding.p_5xs,
//     paddingLeft: Padding.p_5xs,
//     marginLeft: 10,
//     //height: 56,
//     borderRadius: Border.br_31xl,
//   },
//   materialSymbolsLighthomeIcon: {
//     height: 15,
//     width: 18,
//     overflow: 'hidden',
//   },
//   text15: {
//     marginLeft: 2,
//   },
//   textTypo: {
//     color: Color.greyMedium,
//     fontSize: FontSize.size_xs,
//     textAlign: 'left',
//     fontFamily: FontFamily.interRegular,
//   },

//   text17: {
//     color: Color.colorGray,
//     // letterSpacing: 0.5,
//     textAlign: 'left',
//     fontSize: FontSize.size_base,
//   },

//   textTypo3: {
//     fontFamily: FontFamily.interSemiBold,
//   },
//   text6: {
//     fontFamily: FontFamily.interSemiBold,
//   },

//   iphone13Mini9: {
//     backgroundColor: '#FAFAFF',
//     flex: 1,
//     overflow: 'hidden',
//     width: '100%',
//   },
//   iphone13Mini9Item: {
//     // top: -164,
//     left: -137,
//     width: 330,
//     height: 150,
//     opacity: 0.15,
//     position: 'absolute',
//   },
//   frameParent: {
//     width: '100%',
//     flexDirection: 'row',
//     // position: "absolute",
//   },

//   iconLayout1: {
//     height: 24,
//     width: 24,
//     overflow: 'hidden',
//     // marginLeft: 10,
//   },
//   californiaus: {
//     color: '#252d4b',
//     marginLeft: 4,
//     fontSize: FontSize.size_sm,
//     fontFamily: FontFamily.interMedium,
//     textAlign: 'left',
//   },
//   layout1: {
//     justifyContent: 'flex-start',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: {
//     top: 100,
//     left: 17,
//     fontSize: FontSize.size_lg,
//     // letterSpacing: 0.5,
//     position: 'absolute',
//   },
//   jonathan: {
//     //fontFamily: 'Futura XBlk BT',
//     fontFamily: 'Montserrat-Bold',
//     color: '#1E2135',
//   },

//   textTypo2: {
//     fontFamily: FontFamily.interBold,
//     color: '#000000',
//     //letterSpacing: 0.5,
//     fontSize: FontSize.size_lg,
//     textAlign: 'left',
//     paddingLeft: 5,
//   },
//   renderItem1_parentView1: {
//     backgroundColor: '#ffffff',
//     borderRadius: 18,
//     height: 150,
//     width: 320,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     overflow: 'hidden',
//     //marginVertical: 20,
//   },
//   renderItem1_img: {
//     width: 320,
//     height: 150,
//   },
//   maskGroupIconLayout1: {
//     width: 110,
//     height: 90,
//     // marginLeft:20
//   },
//   image: {
//     width,
//     //borderBottomLeftRadius:40,
//     // borderTopRightRadius:60,
//     //borderBottomLeftRadius:60,
//     // borderWidth:3,
//     borderRadius: 3,
//     //borderColor:'#043862',
//     flex: 1,
//   },
//   wrapper: {},
//   container: {
//     flex: 1,
//     // borderRadius:80,

//     alignItems: 'center',
//     // padding:20
//   },
// });



import { View, Text,  ScrollView, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions, Modal, Animated, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/Feather';
import Icc from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import {
  DisLike,
  Like,
  LikeData,
 
} from './Services/UserApi';
import { AppContext } from './Context/AppContext';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from './Footer';


export default function Home(props) {
  // console.log('Response: ',props?.route?.params?.details);
  const [PropertyDetails, setPropertyDetails] = useState(props?.route?.params?.details||[]);
  // const [indianProp, setIndianProp] = useState(props?.route?.params?.details.filter(
  //         item => item.country === 'srilanka',
  //       ));
  // const [sriLankaProp, setSriLankaProp] = useState(props.route.params.lankaProp);

  // const { indianProp, srilankaProp, setPropertyDesc } = useContext(CoOwnContext);
 const { globalState, setGlobalState } = useContext(AppContext);
  const [selectCountry, setSelectCountry] = useState('India');
  const [propDetails, setPropDetails] = useState([]);
  const [likedProperty, setLikedProperty] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [location, setLocation] = useState([]);
  const [apartment, setApartment] = useState('');
  const [categories, setCategories] = useState('All')
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const [filterBy, setFilterBy] = useState('Property Type');
  const defaultRange = [500000, 3000000];
  const [priceRange, setPriceRange] = useState(defaultRange);
  const [visible, setVisible] = useState(false);
  const [like, setLike] = useState([]);
  const [hasUsedFilters, setHasUsedFilters] = useState(false);

  const scaleAnimation = useRef({}).current;



  useEffect(() => {
    if (selectCountry == 'India') {
      const indianProperties = PropertyDetails.filter(
        item => !item.country && item.PropertyType == 'Domastic',
      );
      indianProperties.sort((a, b) => (a.num > b.num ? 1 : -1));
      setPropDetails(indianProperties);
    } else {
      const srilankaProperties = PropertyDetails.filter(
        item => item.country == 'International',
      );
      srilankaProperties.sort((a, b) => (a.num > b.num ? 1 : -1));
      setPropDetails(srilankaProperties);
    }
  }, [selectCountry]);



  const handleAllLike = async () => {
    let payload = JSON.stringify({
      email:  globalState?.userEmail,
    });
    try {
      let { data: res } = await LikeData(payload);
      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          LikeData: res?.pIds,
        }));

        const likeProp = res?.properties.map(item => item._id);
        setLikedProperty(likeProp);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {

        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  useEffect(() => {

    handleAllLike();

  }, []);
   const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });

    try {
      let { data: res } = await DisLike(payload);
      if (res?.success) {
        // const filteredNumbers = IsLike.filter(number => number !== Productid);
        // setIsLike(filteredNumbers);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('Request error:', `${JSON.stringify(error)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleLike = async propId => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId:propId,
    });

    try {
      let { data: res } = await Like(payload);

      if (res?.success) {
        //setIsLike(Productid);
      //   setIsLike([...IsLike, item?._id]);
      // } else {
      //   handleDisLike(item?._id);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };




  // const handleRemoveLike = async (propId) => {
  //   let payload = JSON.stringify(
  //     {
  //       email: "look@gmail.com",
  //       propertyId: propId
  //     }
  //   );
  //   try {
  //     let { data: res } = await RemoveLike(payload);
  //     console.log("Response: ", res);
  //   } catch (error) {
  //     console.error("Error in Removing Liked Prop: ", error);
  //   }
  // }

  // const handleLike = async (propId) => {
  //   let payload = JSON.stringify(
  //     {
  //       email: "look@gmail.com",
  //       propertyId: propId
  //     }
  //   );
  //   try {
  //     let { data: res } = await LikeProperty(payload);
  //     console.log("Response: ", res);
  //   } catch (error) {
  //     console.error("Error in Liking Property: ", error);
  //   }
  // }

  const toggleLike = (item) => {
    setLike((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
  };

  const triggerScaleAnimation = (itemName) => {
    if (!scaleAnimation[itemName]) {
      scaleAnimation[itemName] = new Animated.Value(1);
    }

    Animated.sequence([
      Animated.timing(scaleAnimation[itemName], {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation[itemName], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }

  const cityMap = {};
  const typeMap = {};

  propDetails?.forEach(item => {
    const city = item.city?.trim().toLowerCase();
    if (city) {
      cityMap[city] = (cityMap[city] || { name: item.city, count: 0 });
      cityMap[city].count += 1;
    }
  });

  propDetails?.forEach(item => {
    const type = item.P_Type?.trim().toLowerCase();
    if (type) {
      typeMap[type] = (typeMap[type] || { name: item.P_Type, count: 0 });
      typeMap[type].count += 1;
    }
  })

  const uniqueCities = Object.values(cityMap);
  const uniqueTypes = Object.values(typeMap);

  const filteredAvlProps = (propDetails || [])
    .filter(item => item.AvailableFractions > 0)
    .filter((prop) => {
      if (propertyType.length > 0) {
        return propertyType.some(type => prop.P_Type?.toLowerCase() === type.toLowerCase());
      }
      return true;
    })
    .filter((prop) => {
      if (location.length > 0) {
        return location.some(loc => prop.city?.toLowerCase() === loc.toLowerCase());
      }
      return true;
    })
    .filter((item) => {
      const price = parseInt(item.FC_Price.replace(/[^\d]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter((item) => {
      if (searchQuery.trim() !== '') {
        return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.Location?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

  const filteredNonAvlProps = (propDetails || [])
    .filter(item => item.AvailableFractions === 0)
    .filter(prop => {
      if (propertyType.length > 0) {
        return propertyType.includes(prop.P_Type?.toLowerCase());
      }
      return true;
    })
    .filter(loc => {
      if (location.length > 0) {
        return location.includes(loc.city?.toLowerCase());
      }
      return true;
    })
    .filter(item => {
      const price = parseInt(item.FC_Price.replace(/[^\d]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter((item) => {
      if (searchQuery.trim() !== '') {
        return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.Location?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView>
        <View style={{ padding: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#0000001A', borderBottomWidth: 1, paddingTop: 40 }}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('HomePage');
          }} style={{ backgroundColor: '#FFFFFF' }}>
            <Icc name={'chevron-left'} size={20} color={'#000000'} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#191D31' }}>Property Listing</Text>
          <View></View>
        </View>

        <View style={{ padding: 20, paddingBottom: 80 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ borderColor: '#0000001A', flex: 1, borderWidth: 1, borderRadius: 30, paddingHorizontal: 15, height: 45, flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              <Ic name={'search'} size={20} color={'#00000099'} />
              <TextInput
                placeholder='Search'
                placeholderTextColor={'#00000099'}
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                style={{ marginLeft: 10, flex: 1, fontFamily: 'Poppins-Medium', fontSize: 13, color: '#000' }}
              />
            </View>
            <TouchableOpacity onPress={() => {
              setVisible(!visible);
            }} style={{ borderColor: '#0000001A', borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, padding: 12 }}>
              <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Filter1.png' }} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#9DB2CE3D', borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => {
              setSelectCountry('India');
            }} style={{ padding: 10, flex: 1, alignItems: 'center', backgroundColor: selectCountry === 'India' ? '#0F1130' : 'transparent', borderRadius: 10 }}>
              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: selectCountry == 'India' ? '#FFF' : '#000' }}>Domestic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectCountry('SriLanka');
            }} style={{ padding: 10, flex: 1, alignItems: 'center', backgroundColor: selectCountry === 'SriLanka' ? '#0F1130' : 'transparent', borderRadius: 10 }}>
              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: selectCountry == 'SriLanka' ? '#FFF' : '#000' }}>Global</Text>
            </TouchableOpacity>
          </View>

          {(hasUsedFilters || propertyType.length > 0 || location.length > 0 || priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) &&
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#191D31' }}>Categories</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setCategories('All');
                    setPropertyType([]);
                    setLocation([]);
                    if (priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) {
                      setPriceRange(defaultRange);
                    }
                    setHasUsedFilters(true);
                  }}
                  style={{
                    borderRadius: 20, padding: 8, paddingHorizontal: 20,
                    backgroundColor:
                      propertyType.length === 0 &&
                        location.length === 0 &&
                        priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1] ? '#0F1130' : '#FFFFFF',
                    borderColor:
                      propertyType.length === 0 &&
                        location.length === 0 &&
                        priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1] ? 'transparent' : '#0061FF1A',
                    borderWidth:
                      propertyType.length === 0 &&
                        location.length === 0 &&
                        priceRange[0] === defaultRange[0] &&
                        priceRange[1] === defaultRange[1]
                        ? 0
                        : 1,
                  }}
                >
                  <Text style={{
                    fontFamily: propertyType.length === 0 &&
                      location.length === 0 && priceRange[0] === defaultRange[0] &&
                      priceRange[1] === defaultRange[1] ? 'WorkSans-SemiBold' : 'WorkSans-Regular',
                    fontSize: 12,
                    color: propertyType.length === 0 &&
                      location.length === 0 &&
                      priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1] ? '#FFFFFF' : '#191D31',
                  }}>All</Text>
                </TouchableOpacity>

                {propertyType.length > 0 && propertyType.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setPropertyType(prev => prev.filter(item => item !== type));
                      setHasUsedFilters(true);
                    }}
                    style={{ borderColor: '', borderWidth: 1, padding: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 15, backgroundColor: '#0F1130' }}
                  >
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#FFF' }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </TouchableOpacity>
                ))}

                {!(priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1]) && (
                  <TouchableOpacity
                    onPress={() => {
                      setPriceRange(defaultRange);
                      setHasUsedFilters(true);
                    }}
                    style={{ borderColor: '', borderWidth: 1, padding: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 15, backgroundColor: '#0F1130' }}
                  >
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#FFF' }}>
                      ₹{priceRange[0] / 1000}K - ₹{priceRange[1] / 1000}K
                    </Text>
                  </TouchableOpacity>
                )}

                {location.length > 0 && location.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setLocation(prev => prev.filter(item => item !== loc));
                      setHasUsedFilters(true);
                    }}
                    style={{ borderColor: '', borderWidth: 1, padding: 8, paddingHorizontal: 20, borderRadius: 20, marginLeft: 15, backgroundColor: '#0F1130' }}
                  >
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#FFF' }}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          }

          <View style={{ marginTop: 0 }}>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#191D31' }}>Filtered Properties</Text>
          </View>

          {filteredAvlProps.length === 0 && filteredNonAvlProps.length === 0 ?
            (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/NoResultt.jpg' }} style={{ width: width * 0.7, height: 200 }} />
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#191D31', marginTop: 20 }}>No properties match your selected filters</Text>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#7A7A7A', marginTop: 5 }}>Try adjusting or resetting filters</Text>
              </View>
            )
            :
            (filteredAvlProps
              .map((item, index) => {
                const itemName = item?.name;
                const propId = item?._id;
                const isLiked = likedProperty.includes(propId);
                if (!scaleAnimation[itemName]) {
                  scaleAnimation[itemName] = new Animated.Value(1);
                }
                return (
                  <TouchableOpacity onPress={() => {
                    // setPropertyDesc(item);
                    // navigation.navigate('CoOwnPropDetail');
                    navigation.navigate('Property', { details: item });
                  }} key={index} style={{ borderColor: '#0000001A', borderWidth: 1, backgroundColor: '#FFFFFF', padding: 10, elevation: 5, marginTop: 20 }}>
                    <View>
                      <View>
                        <Image source={{ uri: item?.image?.Image1 }} style={{ width: '100%', height: 200 }} />
                        <View style={{ position: 'absolute', bottom: -25, right: 25 }}>
                          <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/HotProperty.png' }} style={{ width: 60, height: 100 }} />
                        </View>
                      </View>
                      <View style={{ position: 'absolute', top: 15, left: 15 }}>
                        <TouchableOpacity onPress={() => {
                          triggerScaleAnimation(itemName);
                          toggleLike(itemName);
                          if (isLiked) {
                            handleDisLike(propId);
                            setLikedProperty(prev => prev.filter(id => id !== propId));
                          } else {
                            handleLike(propId);
                            setLikedProperty(prev => [...prev, propId]);
                          }
                        }} style={{}}>
                          <LinearGradient
                            colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                            style={{ width: 36, height: 36, borderRadius: 36, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Animated.View style={{ transform: [{ scale: scaleAnimation[itemName] }] }}>
                              {isLiked ? (
                                <Ico name={'heart'} size={20} color="#ED1C24" />
                              ) : (
                                <Ico name={'heart-outline'} size={20} color="#ED1C24" />
                              )}
                            </Animated.View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>{item?.name}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#1E3A8A' }}>₹{item?.Price}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Frac value:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>₹ {item?.FC_Price}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <View style={{ flex: 2 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Available Frac</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>{item?.AvailableFractions}</Text>
                        </View>
                      </View>
                      <View style={{ borderColor: '#00000024', borderTopWidth: 1, marginVertical: 8 }}></View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png' }} style={{ width: 18, height: 18 }} />
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 10 }}>{item?.area}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png' }} style={{ width: 20, height: 20 }} />
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 7 }}>{item?.P_Type}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            )}

          {filteredNonAvlProps
            .map((item, index) => {
              const itemName = item?.name;
              const propId = item?._id;
              const isLiked = likedProperty.includes(propId);
              if (!scaleAnimation[itemName]) {
                scaleAnimation[itemName] = new Animated.Value(1);
              }

              return (
                <TouchableOpacity onPress={() => {
                  // setPropertyDesc(item);
                  // navigation.navigate('CoOwnPropDetail');
                    navigation.navigate('Property', { details: item });
                }} key={index} style={{ borderColor: '#0000001A', borderWidth: 1, backgroundColor: '#FFFFFF', padding: 10, elevation: 5, marginTop: 20 }}>
                  <View>
                    <ImageBackground source={{ uri: item?.image?.Image1 }} style={{ width: '100%', height: 200 }}>
                      <View style={{ flex: 1, backgroundColor: '#FFFCFC7F' }}></View>
                    </ImageBackground>
                    <View style={{ position: 'absolute', top: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%' }}>
                      <TouchableOpacity onPress={() => {
                        triggerScaleAnimation(itemName);
                        toggleLike(itemName);
                        if (isLiked) {
                          handleDisLike(propId);
                          setLikedProperty(prev => prev.filter(id => id !== propId));
                        } else {
                          handleLike(propId);
                          setLikedProperty(prev => [...prev, propId]);
                        }
                      }} style={{ marginLeft: 15 }}>
                        <LinearGradient
                          colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                          style={{ width: 36, height: 36, borderRadius: 36, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Animated.View style={{ transform: [{ scale: scaleAnimation[itemName] }] }}>
                            {isLiked ? (
                              <Ico name={'heart'} size={20} color="#ED1C24" />
                            ) : (
                              <Ico name={'heart-outline'} size={20} color="#ED1C24" />
                            )}
                          </Animated.View>
                        </LinearGradient>
                      </TouchableOpacity>
                      <View>
                        <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/sold.png' }} style={{ width: 90, height: 30 }} />
                      </View>
                    </View>
                  </View>
                  <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>{item?.name}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#1E3A8A' }}>₹ {item?.Price}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Frac value:</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>₹ {item?.FC_Price}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000' }}>Available Frac</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#1E3A8A' }}>{item?.AvailableFractions}</Text>
                      </View>
                    </View>
                    <View style={{ borderColor: '#00000024', borderTopWidth: 1, marginVertical: 8 }}></View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png' }} style={{ width: 18, height: 18 }} />
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 10 }}>{item?.area}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png' }} style={{ width: 20, height: 20 }} />
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#181D27', marginLeft: 7 }}>{item?.P_Type}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
        </View>
      </ScrollView>

      {/* --------------------------------------Filters-------------------------------------- */}

      {visible &&
        <Modal visible={true} modalStyle={{ width: width, flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <View style={{ backgroundColor: '#FFFFFF', padding: 20, flexDirection: 'row', justifyContent: 'space-between', elevation: 5, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#191D31' }}>Filter by</Text>
              <TouchableOpacity onPress={() => {
                setPropertyType([]);
                setLocation([]);
                if (priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) {
                  setPriceRange(defaultRange);
                }
              }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#191D31' }}>Reset</Text>
                <Ico name={'refresh'} size={17} color={'#000000'} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', elevation: 5 }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => {
                  setFilterBy('Property Type');
                }} style={{ marginTop: 20, padding: 20, backgroundColor: filterBy == 'Property Type' ? '#FFFFFF' : '', borderLeftWidth: filterBy == 'Property Type' ? 5 : 0, borderLeftColor: '#1849D6' }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: filterBy == 'Property Type' ? '#386BF6' : '#000000' }}>Property Type</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setFilterBy('Location');
                }} style={{ backgroundColor: filterBy == 'Location' ? '#FFFFFF' : '', padding: 20, borderLeftWidth: filterBy == 'Location' ? 5 : 0, borderLeftColor: '#1849D6' }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: filterBy == 'Location' ? '#386BF6' : '#000000' }}>Location</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setFilterBy('Price Range');
                }} style={{ padding: 20, backgroundColor: filterBy == 'Price Range' ? '#FFFFFF' : '', borderLeftWidth: filterBy == 'Price Range' ? 5 : 0, borderLeftColor: '#1849D6' }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: filterBy == 'Price Range' ? '#386BF6' : '#000000' }}>Price range</Text>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: filterBy == 'Price Range' ? '#386BF68F' : '#00000047' }}>(Per Frac)</Text>
                </TouchableOpacity>

              </View>

              <View style={{ borderLeftColor: '#00000021', borderLeftWidth: 1 }}></View>

              <View style={{ flex: 1.5 }}>
                {filterBy == 'Property Type' &&
                  <View>
                    {uniqueTypes.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setPropertyType(prev =>
                            prev.includes(item.name.toLowerCase())
                              ? prev.filter(t => t !== item.name.toLowerCase())
                              : [...prev, item.name.toLowerCase()]
                          );
                        }}
                        style={{ flexDirection: 'row', marginTop: 25, paddingHorizontal: 20, justifyContent: 'space-between' }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#000' }}>{item.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#0000004D' }}>{item.count}</Text>
                          {propertyType.includes(item.name.toLowerCase()) ? (
                            <Ico name={'checkbox'} size={20} color={'#386BF6'} />
                          ) : (
                            <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'} />
                          )}
                        </View>
                      </TouchableOpacity>

                    ))}
                  </View>
                }

                {filterBy == 'Location' &&
                  <View>
                    {uniqueCities.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setLocation(prev =>
                            prev.includes(item.name.toLowerCase())
                              ? prev.filter(c => c !== item.name.toLowerCase())
                              : [...prev, item.name.toLowerCase()]
                          );
                        }}
                        style={{ flexDirection: 'row', marginTop: 25, paddingHorizontal: 20, justifyContent: 'space-between' }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#000' }}>{item.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#0000004D' }}>{item.count}</Text>
                          {location.includes(item.name.toLowerCase()) ? (
                            <Ico name={'checkbox'} size={20} color={'#386BF6'} />
                          ) : (
                            <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'} />
                          )}
                        </View>
                      </TouchableOpacity>

                    ))}
                  </View>

                }

                {filterBy == 'Price Range' &&
                  <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 25, paddingHorizontal: 20 }}>
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000000' }}>Choose Price Range</Text>
                    </View>
                    <View style={{ margin: 20 }}>
                      <MultiSlider
                        style={{ width: width * 0.5 }}
                        values={priceRange}
                        sliderLength={width * 0.48}
                        onValuesChange={(values) => setPriceRange(values)}
                        min={500000}
                        max={3000000}
                        step={100000}
                        selectedStyle={{ backgroundColor: '#2853CE', }}
                        unselectedStyle={{ backgroundColor: '#E3E3E3' }}
                        customMarker={(e) => (
                          <View style={{ alignItems: 'center', }}>
                            {/* Marker Dot */}
                            <View style={{ width: 20, height: 20, backgroundColor: '#2853CE', borderRadius: 10, marginTop: 40 }} />
                            {/* Label Below Marker */}
                            <Text style={{ marginTop: 5, fontSize: 12, fontFamily: 'WorkSans-Medium', color: '#2853CE', }}>
                              ₹{e.currentValue.toLocaleString('en-IN')}
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000000' }}>Finalized Price Range</Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <View style={{}}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#101010' }}>Min</Text>
                          <Text style={{ color: '#386BF6', fontFamily: 'Montserrat-SemiBold', fontSize: 15, marginTop: 5 }}>
                            {`₹${priceRange[0]}`}
                          </Text>
                        </View>
                        <View style={{}}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#101010' }}>Max</Text>
                          <Text style={{ color: '#386BF6', fontFamily: 'Montserrat-SemiBold', fontSize: 15, marginTop: 5 }}>
                            {`₹${priceRange[1]}`}
                          </Text>
                        </View>
                      </View>
                      {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#386BF6',marginTop:10}}>{`₹${priceRange[1]}`}</Text> */}
                    </View>
                  </View>
                }
              </View>
            </View>

            <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 35, elevation: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                  setVisible(!visible);
                }} style={{ backgroundColor: '#0F1130', borderColor: '#000000', borderWidth: 1, padding: 10, flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 15, color: '#FFFFFF' }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setVisible(!visible);
                }} style={{ backgroundColor: '#F0F4FA', borderWidth: 1, borderColor: '#9DB2CE30', padding: 10, flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 15, color: '#021265' }}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      }
      <Footer navigation={navigation} activeFooterTab={'home'} />
    </SafeAreaView>
  )
}