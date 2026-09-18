import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Dimensions, Alert, PermissionsAndroid, Linking } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Home';
// import LoginPage from '../LoginPage';
// import Signin from '../Signin';
import Property from '../Property';
import Enquire from '../Enquire';
import Contact from '../Contact';
import Location from '../Location';
import ForgotPassword from '../ForgotPassword';
import Profile from '../Profile';
import Like from '../Like';
import Owned from '../Owned';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/AppContext';
import Privacy from '../Privacy';
import Aboutus from '../Aboutus';
import Dashboard from '../Dashboard';
import Chat from '../Chat';
import BookNow from '../BookNow';
import Enquirenew from '../Enquirenew';
import Book from '../Book';
import Review from '../Review';
import Documents from '../Documents';
import TermsAndCondition from '../TermsAndCondition';
import SiteHistory from '../SiteHistory';
import BookingHistory from '../BookingHistory';
import DisplayDoc from '../DisplayDoc';
import Payment from '../Payment';
import GuestBookingDetails from '../GuestBookingDetails';
import RentalBook from '../RentalBook';
import BookingStatus from '../BookingStatus';
import VideoDispay from '../VideoDispay';
import PaymentPage from '../PaymentPage';
import HomePage from '../Version2_O/HomePage';
// import NewLogin from '../Version2_O/NewLogin';
// import NewSigin from '../Version2_O/NewSign';
// import PropertyForm from '../Version2_O/PropertyForm';
// import PropertyFormSec from '../Version2_O/PropertyFormSec';
// import PropertyFormThird from '../Version2_O/PropertyFormThird';
import { ProfileDetails, PropertyDetailsById, updateFCMToken } from '../Services/UserApi';
// import PropertyListing from '../Version2_O/PropertyListing';
// import PropertyDetailsNew from '../Version2_O/PropertyDetailsNew';
// import PopularDestination from '../Version2_O/PopularDestination';
import InteriorForm from '../Version2_O/InteriorForm';
import InteriorFormSec from '../Version2_O/InteriorFormSec';
import InteriorFormThird from '../Version2_O/InteriorFormThird';
import InteriorFSec from '../Version2_O/InteriorFSec';
// import PropertyManagment from '../Version2_O/PropertyManagment';
import Filter from '../Version2_O/Filter';
import Locationview from '../Version2_O/Locationview';

// import StayBooking from '../Version2_O/StayBooking';
// import StayBookingDetail from '../Version2_O/StayBookingDetail';
// import SearchResult from '../Version2_O/SearchResult';
// import StayPropertyDetails from '../Version2_O/StayPropertyDetails';
// import StayBookNow from '../Version2_O/StayBookNow';
// import StayBookingConfirm from '../Version2_O/StayBookingConfirm';
// import Customer from '../Version2_O/Customer';
import messaging from '@react-native-firebase/messaging';
// import SelectRoom from '../Version2_O/SelectRoom';
import PayUPaymentgateway from '../Version2_O/PayUPaymentgateway';
// import StayCancel from '../Version2_O/StayCancel';
import MyProfile from '../MyProfile';
import EnquirtyFS from '../Version2_O/EnquirtyFS';
// import Offer from '../Version2_O/Offer';
// import Exposcreen from '../Version2_O/Exposcreen';
// import Exhibitor from '../Version2_O/Exhibitor';
// import Visitor from '../Version2_O/Visitor';
// import ExhibitorDetails from '../Version2_O/ExhibitorDetails';
// import VisitorDetail from '../Version2_O/VisitorDetail';
import CustomersReview from '../Version2_O/CustomerReview';
// import Anniversary from '../Version2_O/Anniversary';
// import AnniversaryPage from '../Version2_O/AnniversaryPage';
import DreamscapeHome from '../Version2_O/DreamscapeHome';
import RoomDescription from '../Version2_O/RoomDescription';
import RoomListing from '../Version2_O/RoomListing';
import SelectRoomFS from '../Version2_O/SelectRoomFS';
import Ourstay from '../Version2_O/Ourstay';
import VideoTour from '../Version2_O/VideoTour';
import FeedbackForm from '../Version2_O/FeedbackForm';
import NotificationsScreen from '../Version2_O/NotificationsScreen';
import { CommonActions, useNavigation } from '@react-navigation/native';
import MonthlyInsight from '../Version2_O/MonthlyInsight';
import Transfer from '../Version2_O/Transfer';
import Blogs from '../Version2_O/Blogs';
import Wallet from '../Version2_O/Wallet';
// import LableScreen from '../Version2_O/LableScreen';
// import LableComming from '../Version2_O/LableComming';
// import LableCommingSoon from '../Version2_O/LableCommingSoon';
// import LablePropertyDis from '../Version2_O/LablePropertyDis';
// import LableProperty from '../Version2_O/LableProperty';
import WalletAmount from '../Version2_O/WalletAmount';
import PaidSuccessfully from '../Version2_O/PaidSuccessfully';
import NewLogin from '../Version2_O/NewLogin';
import NewSigin from '../Version2_O/NewSign';
import BoardingScreen from '../Version2_O/BoardingScreen';
// import CownHome from '../Version2_O/CownHome';
// import BottomNavigations from './BottomNavigations';
import Packages from '../Version2_O/Packages';
import IntroAnim from '../Version2_O/IntroAnim';
import LabelsDescription from '../Version2_O/LabelsDescription';
import LabelsProperty from '../Version2_O/LabelsProperty';
import PropertyImages from '../Version2_O/PropertyImages';
import BookingSuccess from '../BookingSuccess';
import BookingFailure from '../BookingFailure';
import BookingProcessing from '../BookingProcessing';
import BottomNavigations from './BottomNavigation';
import PropertyScreen from '../Version2_O/altaira/AltairaExperience';
import EdgeFab from '../Version2_O/altaira/FloatingButton';
import AltairaExperience from '../Version2_O/altaira/AltairaExperience';
import PdfViewerScreen from '../Version2_O/PdfViewerScreen';
import LiveStream from '../Version2_O/altaira/LiveStream';
import appsFlyer from 'react-native-appsflyer';
// import Test from '../Test';
import NoInternet from '../component/NoInternet';
import Test from '../Test';
import MembershipHome from '../Version2_O/escapeMembership/MembershipHome';
import MembershipProfile from '../Version2_O/escapeMembership/MembershipProfile';
import MembershipProprtyDesc from '../Version2_O/escapeMembership/MembershipProprtyDesc';
import PaymentSuccessEscape from '../Version2_O/escapeMembership/PaymentSuccessEscape';
import PaymentFailedEscape from '../Version2_O/escapeMembership/PaymentFailedEscape';
import EscapePaymentPage from '../Version2_O/escapeMembership/EscapePaymentPage';
import TranHisForEscape from '../Version2_O/escapeMembership/TranHisForEscape';
import ViewAgreement from '../Version2_O/escapeMembership/ViewAgreement';
import AddressSearchScreen from '../Version2_O/AddessSearchScreen';
import CompleteProfileScreen from '../Version2_O/CompleteProfileScreen';
import ConcertDetails from '../Version2_O/ConcertDetails';
// import Exhibitor from '../Version2_O/Exhibitor';

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
  const [Loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const { globalState, setGlobalState } = useContext(AppContext);
  const navigation = useNavigation();
  // const email = globalState?.userEmail;
  // console.log('email: ', email);

// useEffect(() => {
//   const unsubscribe = appsFlyer.onDeepLink(async res => {
//     console.log('AF deep link response:', res);

//     if (res?.deepLinkStatus !== 'FOUND') return;

//     const data = res?.deepLink;
//     console.log('Deep link data:', data);

//     // 🔑 MATCH OneLink deep_link_value exactly
//     if (data?.deep_link_value === 'property_share' && data?.propertyId) {
//       try {
//         const prop = await fetchPropById(data.propertyId);

//         if (!prop) return;

//         navigation.navigate('Property', {
//           details: prop,
//         });
//       } catch (err) {
//         console.error('Deep link navigation error:', err);
//       }
//     }
//   });

//   return () => unsubscribe();
// }, []);



  // const fetchPropById = async (id) => {
  //   try {
  //     const { data: res } = await PropertyDetailsById(id);
  //     return res?.data;
  //   } catch (error) {
  //     console.error(
  //       'Error in fetching Prop by Id:',
  //       error?.response?.data || error?.message
  //     );
  //     return null;
  //   }
  // };


  const handleProfle = async (emailId, tokenid) => {
    // const tokenid = await AsyncStorage.getItem('mytoken');
    //const emailId = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: emailId,
    });

    try {
      let { data: res } = await ProfileDetails(payload, tokenid);

      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          userName: res?.data?.userName,
          userEmail: emailId,
          token: tokenid,
          userPhone: res?.data?.phoneNumber,
          userDetails: res?.data,
          userProfile: res?.data?.profilePicture,
        }));

      }
    } catch (error) {
      if (error?.response) {
        if (error?.response?.data?.message == 'Invalid token.') {
          //  navigation.navigate('LoginPage');
          setToken('');
          setLoading(false);
        } else {
          Alert.alert(
            'Response ErrorProfile',
            `${error?.response?.data?.message}`,
          );
        }
      } else if (error?.request) {
        //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        //console.log('profilr',`${JSON.stringify(error?.request)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error}`);
      }
    }
  };




  const handleAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('mytoken');
      const email = await AsyncStorage.getItem('Email');
      // console.log('token',token);

      if (token) {
        //  console.log('token1',token);
        handleProfle(email, token);
        setToken(token);
        setLoading(false);
      } else {
        // console.log('token2',token);
        setToken('');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error checking authentication:', error);
    }
  };
  const requestUserPermission = async () => {
    const authStatus = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };




  // This is for when user was in process of booking and app was closed force fully or automatically id there was any txnId then it navigate it to BookingProcess screen
  // useEffect(() => {
  //   const checkPendingPayment = async () => {
  //     const txnId = await AsyncStorage.getItem('PENDING_TXN_ID');
  //     console.log("Txnid: ",txnId);

  //     if (txnId) {
  //       navigation.replace('BookingProcessing', {
  //         txnId,
  //         property: null, // fetch from backend if needed
  //       });
  //     }
  //   };

  //   checkPendingPayment();
  // }, []);


// useEffect(() => {
//   const checkPendingPayment = async () => {
//     const txnId = await AsyncStorage.getItem('PENDING_TXN_ID');
//     console.log('TxnId:', txnId);
// // 
//     if (txnId) {
//       navigation.dispatch(
//         CommonActions
//         .reset({
//           index: 0,
//           routes: [
//             {
//               name: 'BookingProcessing',
//               params: {
//                 txnId,
//                 property: null,
//               },
//             },
//           ],
//         })
//       );
//     }
//   };

//   checkPendingPayment();
// }, []);







  useEffect(() => {
    requestUserPermission();
    handleAuth();


  }, []);
  if (Loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Image
        resizeMode='stretch'
          source={{uri: "https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/SplashImage.png"}}
          style={{ width: width, height: height}}
        />
      </View>
    );
  }
  return (
    // <Stack.Navigator initialRouteName={token != '' ? 'Home' : 'LoginPage'}>
  
    <Stack.Navigator initialRouteName={token != '' ? 'BottomNavigations' : 'NewLogin'}>
      {/* // <Stack.Navigator initialRouteName={token != '' ? 'NewLogin' : 'NewLogin'}> */}
      {/* <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{ headerShown: false, }}
      // options={{title: 'Welcome'}}
      /> */}
      <Stack.Screen
        name="NewLogin"
        component={NewLogin}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="NoInternet" component={NoInternet} options={{headerShown:false}}/>
      <Stack.Screen name="MembershipHome" component={MembershipHome} options={{headerShown:false}}/>
      <Stack.Screen name="ConcertDetails" component={ConcertDetails} options={{headerShown:false}}/>
      <Stack.Screen name="MembershipProfile" component={MembershipProfile} options={{headerShown:false}}/>
      <Stack.Screen name="MembershipProprtyDesc" component={MembershipProprtyDesc} options={{headerShown:false}}/>
      <Stack.Screen name="PaymentSuccessEscape" component={PaymentSuccessEscape} options={{headerShown:false}}/>
      <Stack.Screen name="PaymentFailedEscape" component={PaymentFailedEscape} options={{headerShown:false}}/>
      <Stack.Screen name="EscapePaymentPage" component={EscapePaymentPage} options={{headerShown:false}}/>
      <Stack.Screen name="TranHisForEscape" component={TranHisForEscape} options={{headerShown:false}}/>
      <Stack.Screen name="ViewAgreement" component={ViewAgreement} options={{headerShown:false}}/>

      <Stack.Screen
        name="EdgeFab"
        component={EdgeFab}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='Test'
        component={Test}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AltairaExperience"
        component={AltairaExperience}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LiveStream"
        component={LiveStream}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PdfViewerScreen"
        component={PdfViewerScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="BottomNavigations"
        component={BottomNavigations}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressSearchScreen"
        component={AddressSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompleteProfileScreen"
        component={CompleteProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingFailure"
        component={BookingFailure}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='BookingProcessing'
        component={BookingProcessing}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      /> */}
       
      <Stack.Screen
        name="NewSigin"
        component={NewSigin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Property"
        component={Property}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      />

      <Stack.Screen
        name="Enquire"
        component={Enquire}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        //options={{headerShown: false}}
        options={{ title: 'Cancellation & Refund Policy' }}
      />
      {/* <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      /> */}
      <Stack.Screen
        name="Like"
        component={Like}
        options={{ headerShown: false }}
      // options={{title: 'Welcome'}}
      />
      <Stack.Screen
        name="Owned"
        component={Owned}
        options={{ headerShown: false }}
      //options={{ title: 'Your Properties' }}
      />
      {/* 2nd Phase */}
      <Stack.Screen
        name="Privacy"
        component={Privacy}
       options={{headerShown: false}}
      />
      <Stack.Screen
        name="Aboutus"
        component={Aboutus}
        // options={{ title: 'About Us' }}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
       options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookNow"
        component={BookNow}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Book"
        component={Book}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Enquirenew"
        component={Enquirenew}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Documents"
        component={Documents}
    
      /> */}
      {/* <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{title: 'Upload Document of Customer'}}
        // options={{headerShown: false}}
      />
      <Stack.Screen
        name="CostumerDetail"
        component={CostumerDetail}
        options={{title: 'Upload Customer Owned Data'}}
        // options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        //options={{ title: 'Terms And Condition' }}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SiteHistory"
        component={SiteHistory}
        options={{ title: 'Site Visit History' }}
      //options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingHistory"
        component={BookingHistory}
        //options={{ title: 'Purchases History' }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DisplayDoc"
        component={DisplayDoc}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ headerShown: false }}
      // options={{title: 'Purchases History'}}
      />
      <Stack.Screen
        name="GuestBookingDetails"
        component={GuestBookingDetails}
        options={{ title: 'Guest Booking Details' }}
      //options={{headerShown: false}}
      />
      <Stack.Screen
        name="RentalBook"
        component={RentalBook}
      //options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingStatus"
        component={BookingStatus}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoDispay"
        component={VideoDispay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentPage}
        options={{ headerShown: false }}
      />


      {/* Version 2.0 */}


      {/* Expo */}
      {/* <Stack.Screen
        name="ProfileExpo"
        component={ProfileExpo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LayoutExpo"
        component={LayoutExpo}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="HomeExpo"
        component={HomeExpo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DevProfileList"
        component={DevProfileList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyListExpo"
        component={PropertyListExpo}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Faq"
        component={Faq}
        options={{ headerShown: false }}
      /> */}




      {/* App Version 2.0 */}

      <Stack.Screen
        name="BoardingScreen"
        component={BoardingScreen}
        options={{ headerShown: false }}
      />

   
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="PropertyForm"
        component={PropertyForm}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="PropertyFormSec"
        component={PropertyFormSec}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="PropertyFormThird"
        component={PropertyFormThird}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="PropertyListing"
        component={PropertyListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyDetailsNew"
        component={PropertyDetailsNew}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="PopularDestination"
        component={PopularDestination}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="InteriorForm"
        component={InteriorForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InteriorFormSec"
        component={InteriorFormSec}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InteriorFormThird"
        component={InteriorFormThird}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="InteriorFSec"
        component={InteriorFSec}
        options={{ headerShown: false }}
      />
     
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Locationview"
        component={Locationview}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name="Stay"
        component={Stay}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="StayBooking"
        component={StayBooking}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="StayBookingDetail"
        component={StayBookingDetail}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="StayPropertyDetails"
        component={StayPropertyDetails}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="SelectRoom"
        component={SelectRoom}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="StayBookNow"
        component={StayBookNow}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="StayBookingConfirm"
        component={StayBookingConfirm}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Customer"
        component={Customer}
        options={{ headerShown: false }}
      /> */}


      <Stack.Screen
        name="PayUPaymentgateway"
        component={PayUPaymentgateway}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name="StayCancel"
        component={StayCancel}
        options={{ headerShown: false }}
      /> */}


      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EnquirtyFS"
        component={EnquirtyFS}
        options={{ headerShown: false }}
      />

   
      <Stack.Screen
        name="CustomersReview"
        component={CustomersReview}
        options={{ headerShown: false }}
      />
     
      <Stack.Screen
        name="DreamscapeHome"
        component={DreamscapeHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDescription"
        component={RoomDescription}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomListing"
        component={RoomListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectRoomFS"
        component={SelectRoomFS}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Ourstay"
        component={Ourstay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoTour"
        component={VideoTour}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedbackForm"
        component={FeedbackForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MonthlyInsight"
        component={MonthlyInsight}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Transfer"
        component={Transfer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Blogs"
        component={Blogs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="LableScreen"
        component={LableScreen}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="LableComming"
        component={LableComming}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LableCommingSoon"
        component={LableCommingSoon}
        options={{ headerShown: false }}
      /> */}
       {/* <Stack.Screen
        name="LableProperty"
        component={LableProperty}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="LablePropertyDis"
        component={LablePropertyDis}
        options={{ headerShown: false }}
      /> */}


      <Stack.Screen
        name="WalletAmount"
        component={WalletAmount}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="PaidSuccessfully"
        component={PaidSuccessfully}
        options={{ headerShown: false }}
      />
{/*        
         <Stack.Screen
        name="BottomNavigations"
        component={BottomNavigations}
        options={{ headerShown: false }}
      /> */}
        <Stack.Screen
        name="Packages"
        component={Packages}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="IntroAnim"
        component={IntroAnim}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="LabelsDescription"
        component={LabelsDescription}
        options={{ headerShown: false }}
      />
       {/* <Stack.Screen
        name="LabelsProperty"
        component={LabelsProperty}
        options={{ headerShown: false }}
      /> */}
       <Stack.Screen
        name="PropertyImages"
        component={PropertyImages}
        options={{ headerShown: false }}
      />


    </Stack.Navigator>

  );
}
