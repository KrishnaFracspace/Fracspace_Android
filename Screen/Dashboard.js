import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import IconDown from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/Feather';
import IconD from 'react-native-vector-icons/Octicons';
import * as Progress from 'react-native-progress';
import IconC from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-swiper';
import {
  GetFeedbackFormForExit,
  PaymentUPI,
  ProfileDetails,
  RentalData,
  SendConfirmationOTP,
  SendConfirmationOTPEmail,
  SubmitFeedbackForm,
  VerifyOtpAndStoreMessage,
  VerifyOtpAndStoreMessageEmail,
} from './Services/UserApi';
import { AppContext } from './Context/AppContext';
import CustomModal from './CustomModal';
// import RNFetchBlob from 'rn-fetch-blob';
import openMap, { createOpenLink } from 'react-native-open-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import IconC from 'react-native-vector-icons/Ionicons';
// import Iconn from 'react-native-vector-icons/Feather';
// import Iccoon from 'react-native-vector-icons/FontAwesome';
// import Ic from 'react-native-vector-icons/FontAwesome6';

export default function Dashboard(props) {
  const { globalState, setGlobalState } = useContext(AppContext);
  const [OwnedPropertyDetails, setOwnedPropertyDetails] = useState(
    props?.route?.params?.ownedProDetails
  );
  // console.log("Owned Property: ", props?.route?.params?.ownedProDetails);
  const [selectDetails, setSelectDetails] = useState('Investment Details');
  const [loader, setLoader] = useState(false);
  const [propertyStatu, setPropertyStatu] = useState(
    props?.route?.params?.ownedProDetails?.propertyDetails?.PropertyStatus || "0",
  );
  // const [propertyStatu, setPropertyStatu] = useState("10");
  const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const firstInput = useRef();
  const secoundInput = useRef();
  const thirdInput = useRef();
  const fourInput = useRef();
  const fiveInput = useRef();
  const sixInput = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [Year, setYear] = useState('');
  const [PayOutDetails, setPayOutDetails] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [PropertiesArray, setPropertiesArray] = useState([]);
  const navigation = useNavigation();
  const [showFullText, setShowFullText] = useState(false);
  const [sort, setSort] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [month, setMonth] = useState(false);
  // const [monthBy, setMonthBy] = useState('');
  const [yearData, setYearData] = useState(false);
  // const [yearBy, setYearBy] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);

  const [answers, setAnswers] = useState({});
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const userData = globalState?.userDetails;

  // const handleChange = (text, index) => {
  //     const updatedOtp = [...otpDigits];
  //     updatedOtp[index] = text;
  //     setOtpDigits(updatedOtp);

  //     if (text && index < 5) {
  //         inputRefs.current[index + 1]?.focus();
  //     }
  // };
  const handleKeyPress = (e, index) => {
      if (e.nativeEvent.key == 'Backspace' && otpDigits[index] == '') {
          if (index > 0) {
              inputRefs.current[index - 1]?.focus();
          }
      }
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const payload = {
      // formId: form.formId,
      answers: Object.keys(answers).map(qId => ({
        questionId: qId,
        answer: answers[qId]
      }))
    };

    console.log('SUBMIT DATA:', payload);
    setShowFeedback(false);
  };

  const createButtonAlert = () =>
    Alert.alert('Ready to part ways?', 'Confirm to sell your Frac now.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => {
        fetchFeedbackForm();
        setShowFeedback(true);
      } },
    ]);
    
  const handleResell = async () => {
    setLoader(true);
    if (globalState?.userDetails?.phoneNumber?.startsWith('+91') && globalState?.userDetails?.phoneNumber?.length === 13) {
      let payload = JSON.stringify({
        propertyName: OwnedPropertyDetails?.propertyDetails?.name,
        phoneNumber: globalState?.userDetails?.phoneNumber,
      });
      try {
        let { data: res } = await SendConfirmationOTP(payload);
        if (res?.success) {
          setModalVisible(true);
          setLoader(false);
          //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
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
      }
    } else {
      let payload = JSON.stringify({
        propertyName: OwnedPropertyDetails?.propertyDetails?.name,
        email: globalState?.userDetails?.email,
      });
      try {
        let { data: res } = await SendConfirmationOTPEmail(payload);
        if (res?.success) {
          setModalVisible(true);
          setLoader(false);
          //Alert.alert('Congratulations!', 'The Community link has been successfully sent to your message section.Kindly Join the Community');
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
      }

    }
  };

  const handleResellVerification = async (code, message) => {
    setLoader(true)
    if (globalState?.userDetails?.phoneNumber?.startsWith('+91') && globalState?.userDetails?.phoneNumber?.length === 13) {
      let payload = JSON.stringify({
        phoneNumber: globalState?.userDetails?.phoneNumber,
        otp: code,
        message: message,
        isExit: true,
        propertyName: OwnedPropertyDetails?.propertyDetails?.name
      });
      console.log("Payload for verfying sell/exit: ", payload);
      try {
        let { data: res } = await VerifyOtpAndStoreMessage(payload);
        if (res?.success) {
          handleProfle();
          setModalVisible(false);
          // navigation.navigate('Owned');
          setSuccess(true);
          // Alert.alert(
          //   'Thank You for your Request',"Your request submitted successfully. Our team will contact you soon"
          //   // [
          //   //   {
          //   //     text: `Your request submitted successfully. Our team will contact you soon`,
          //   //     onPress: () => {navigation.navigate('Owned')}
          //   //   }
          //   // ]
          // );
        }
      } catch (error) {
        if (error?.response) {
          Alert.alert('Response Error', `${error?.response?.data?.message}`);
          console.log('Response Error in verifying otp', `${error?.response?.data}`)
          setLoader(false);
        } else if (error?.request) {
          //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
          Alert.alert('Request Error:', 'Please Check Your Internet Connection');
          setLoader(false);
          // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
          Alert.alert('Error:', `${error}`);
          console.log('Response Error in verifying otp', `${error?.response?.data}`)
          setLoader(false)
        }
      }finally{
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
      console.log("Payload for verfying sell/exit for international: ", payload);
      try {
        let { data: res } = await VerifyOtpAndStoreMessageEmail(payload);
        if (res?.success) {
          handleProfle();
          setModalVisible(false);
          // navigation.navigate('Owned');
          setSuccess(true);
          // Alert.alert(
          //   'Thank You for Enquiry','Your request submitted successfully. Our team will contact you soon'
          //   // [
          //   //   {
          //   //     text: `Your request submitted successfully. Our team will contact you soon`,
          //   //     onPress: () => {navigation.navigate('Owned')}
          //   //   }
          //   // ]
          // );
        }
      } catch (error) {
        if (error?.response) {
          Alert.alert('Response Error', `${error?.response?.data?.message}`);
          console.log('Response Error in verifying otp', `${error?.response?.data || error?.response?.message}`)
          setLoader(false);
        } else if (error?.request) {
          //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
          Alert.alert('Request Error:', 'Please Check Your Internet Connection');
          setLoader(false);
          // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        } else {
          Alert.alert('Error:', `${error}`);
          console.log('Response Error in verifying otp', `${error?.response?.data || error?.response?.message}`)
          setLoader(false);
        }
      } finally{
        setLoader(false);
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
            }
          } else if (error?.request) {
            //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
            //console.log('profilr',`${JSON.stringify(error?.request)}`);
            //Alert.alert('Request error:', 'Please Check Your Internet Connection');
          } else {
            Alert.alert('Error:', `${error}`);
          }
        } finally{
            setLoader(false);
        }
      };

  const formatIndianAmount = (amount) => {
      if (amount == null) return '0';
      return Number(amount).toLocaleString('en-IN');
  };


  const [downloading, setDownloading] = useState(false);

  const handleDownloadPayout = async (image) => {
    setDownloading(true);
    const imageUrl = image; // URL of the image
    const dirs = RNFetchBlob.fs.dirs;
    const imagePath = dirs.DownloadDir + '/downloaded_image.jpg'; // Path to save the image

    // Start the image download
    RNFetchBlob.config({
      fileCache: true, // Cache the file locally
      path: imagePath, // Save file to the specified path
    })
      .fetch('GET', imageUrl)
      .then((res) => {
        // After downloading the image, show a success message
        Alert.alert('Download Complete', 'Image has been saved to your device!');
        // console.log('File path:', res.path());
      })
      .catch((err) => {
        // If an error occurs, show an error message
        Alert.alert('Download Failed', 'Failed to download the image.');
        console.log('Download error:', err);
      })
      .finally(() => {
        setDownloading(false);
      });
  };
  const [images, setImages] = useState([]);
  useEffect(() => {
    const imageObject = OwnedPropertyDetails?.propertyDetails?.image || {};
    const imageArray = Object.values(imageObject).filter(Boolean); // removes null/undefined
    setImages(imageArray);
  }, []);
  const extraImages = images?.length > 5 ? images?.length - 4 : 0;

  const [GestArray, setGestArray] = useState([]);

  const fetchFeedbackForm = async () => {
    try{
      let {data: res} = await GetFeedbackFormForExit();
      // console.log("Response:", res);
      if(res?.success){
        setForm(res?.data);
      }
    }catch(error){
      console.error('Error in fetching feedback form: ', error?.response?.message || error?.response);
    }
  }

  const submitFeedbackForm = async () => {
    try {
      // validation (important)
      // const isValid = form?.questions?.every(q => {
      //   if (!q.required) return true;
      //   return answers[q._id];
      // });
      const isValid = form?.questions?.every(q => {
        if (!q.required) return true;

        const answer = answers[q._id];

        // ❌ no answer at all
        if (answer === undefined || answer === null) return false;

        // ❌ empty text
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
      // setModalVisible(true);
    } catch (error) {
      console.log(
        'Error in submitting the feedback form:',
        error?.response?.data || error?.response?.message
      );
    }
  };

  const handleGuestUpdate = async () => {
    let payload = JSON.stringify({
      propertyId: OwnedPropertyDetails?.propertyDetails?._id,
    });
    try {
      let { data: res } = await RentalData(payload);

      if (res?.success) {
        setGestArray(res?.data);
        // console.log(res?.data[0]?.via);
        
      }
    } catch (error) {
      if (error?.response) {
       // Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
  useEffect(() => {
    const filteredNumbers = globalState?.AllProperty.filter(number => number._id == OwnedPropertyDetails?.propertyDetails?._id);
    // console.log("Prop: ",filteredNumbers);
    setPropertiesArray(filteredNumbers[0]);
    if (propertyStatu == 100) {
      handleGuestUpdate();
    }
    // fetchFeedbackForm();
  }, []);

  const GgoToYosemite = location => {
    openMap({ query: location });
  };

  const parseDate = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split('-');
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const getAvailableYears = () => {
    const years = GestArray.map(item => {
      const date = parseDate(item.checkOutDate);
      return date.getFullYear();
    });
    
    // console.log("Yeee: ",years);

    return [...new Set(years)].sort((a, b) => b - a); // latest first
  };
  
  useEffect(() => {
    const years = getAvailableYears();

    if (years?.length && !selectedYear) {
      setSelectedYear(years[0]); // latest year
    }
  }, [GestArray]);

  useEffect(() => {
    if (selectedMonth !== null && !selectedYear) {
      const years = getAvailableYears();
      if (years?.length) {
        setSelectedYear(years[0]); // latest year
      }
    }
  }, [selectedMonth]);

  const getMonthsWithRevenue = () => {
    if (!selectedYear) return [];

    const monthMap = {};

    GestArray.forEach(item => {
      const date = parseDate(item.checkOutDate);
      const year = date.getFullYear();

      if (year === selectedYear) {
        const month = date.getMonth(); // 0–11

        if (!monthMap[month]) {
          monthMap[month] = 0;
        }

        monthMap[month] += item.rentalAmount || 0;
      }
    });

    return Object.keys(monthMap).map(m => ({
      month: Number(m),
      revenue: formatIndianAmount(Math.round(monthMap[m])),
    })).sort((a, b) => b.month - a.month);
  };

  const getDisplayRevenue = () => {
    let total = 0;

    // Default → total data
    if (!selectedYear && selectedMonth === null) {
      total = GestArray.reduce(
        (acc, curr) => acc + (curr.rentalAmount || 0),
        0
      );
    } else {
      let filtered = [...GestArray];

      if (selectedYear) {
        filtered = filtered.filter(item => {
          const date = parseDate(item.checkOutDate);
          return date.getFullYear() === selectedYear;
        });
      }

      if (selectedMonth !== null) {
        filtered = filtered.filter(item => {
          const date = parseDate(item.checkOutDate);
          return date.getMonth() === selectedMonth;
        });
      }

      total = filtered.reduce(
        (acc, curr) => acc + (curr.rentalAmount || 0),
        0
      );
    }

    return Math.round(total); // removes decimals
  };

  const monthNames = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  const getRevenueLabel = () => {
    if (!selectedYear && selectedMonth === null) {
      return 'Total Sales';
    }

    if (selectedYear && selectedMonth === null) {
      return `Year ${selectedYear} Sales`;
    }

    if (selectedYear && selectedMonth !== null) {
      return `${monthNames[selectedMonth]} ${selectedYear} Monthly Sales`;
    }

    return 'Revenue';
  };

  const displayRevenue = getDisplayRevenue();
  const label = getRevenueLabel();

  const getFilteredGuestData = () => {
    const filteredData = [...GestArray]
      .filter((rental) => {
        if (sortBy === 'Low to High' || sortBy === 'High to Low') {
          return rental.rentalAmount > 0;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Low to High') return a.rentalAmount - b.rentalAmount;
        if (sortBy === 'High to Low') return b.rentalAmount - a.rentalAmount;
        return 0;
      })
      .filter((rental) => {
        if (sortBy === 'Complimentary Stays') {
          return rental.rentalAmount === 0;
        }
        return true;
      })
      .filter((rental) => {
        const date = parseDate(rental.checkOutDate);

        if (selectedYear && date.getFullYear() !== selectedYear) {
          return false;
        }

        if (
          selectedMonth !== null &&
          date.getMonth() !== selectedMonth
        ) {
          return false;
        }

        return true;
      });

    const totalRevenue = filteredData.reduce(
      (acc, curr) => acc + (curr.rentalAmount || 0),
      0
    );

    return { filteredData, totalRevenue };
  };

  const renderGuestItem = ({ item }) => (
    <View style={{
      backgroundColor: '#F6F6F6',
      borderRadius: 10,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
      paddingHorizontal: 20,
    }}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <Image
          source={require('./assets/NewProfileImage.jpg')}
          style={{ width: 50, height: 50, marginRight: 5, borderRadius: 50 }}
        />
        <View style={{ width: '80%', }}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#0F1130' }}>
              {item?.guestName}
            </Text>
            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#188C16', textAlign: 'right' }}>
              ₹{item?.rentalAmount}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#1E3A8A' }}>
              {item?.checkInDate} -
            </Text>
            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#1E3A8A' }}>
              {item?.checkOutDate}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#0F1130' }}>
              Source of Booking :
            </Text>
            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 11, color: '#1E3A8A', }}> {item?.via}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const handleSmallImagePress = (index) => {
    setCurrentIndex(index + 1);
    setExpanded(true);
  };

  const { filteredData, totalRevenue } = getFilteredGuestData();
  const years = getAvailableYears();
  // console.log("Get year: ", years);
  const monthsData = getMonthsWithRevenue();

  const resetFilters = () => {
    setSortBy('');
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  const getMonthLabel = () => {
    if (selectedMonth !== null) {
      return monthNames[selectedMonth];
    }
    return 'Month';
  };

  const getYearLabel = () => {
    if (selectedYear) {
      return selectedYear;
    }
    return 'Year';
  };

  const getSortLabel = () => {
    return sortBy || 'Sort';
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <FlatList
        data={selectDetails === 'Guest Booking Details' ? filteredData : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderGuestItem}
        ListFooterComponent={<View style={{ height: 20 }} />}
        style={{ backgroundColor: '#FFFFFF' }}
        ListHeaderComponent={
          <>
            <View style={styles.mainImageContainer}>
              <Swiper
                autoplay={!expanded}
                loop
                showsPagination={false}
                scrollEnabled={false}
                index={currentIndex}
                onIndexChanged={(index) => setCurrentIndex(index)}
                autoplayTimeout={3}
              >
                {images?.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.mainImage}
                    resizeMode="cover"
                  />
                ))}
              </Swiper>

              <TouchableOpacity
                onPress={() => expanded ? setExpanded(false) : navigation.navigate("Owned")}
                style={{ position: 'absolute', top: 30, left: 20 }}
              >
                <Icon name={'chevron-left'} size={30} color={'#FFFFFF'} />
              </TouchableOpacity>

              <View style={[styles.bottomImagesContainer, expanded && { height: 100, width: width }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {images?.map((item, index) => {
                    if (!expanded && index > 2) return null;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => handleSmallImagePress(index)}
                        style={{ marginRight: expanded ? 10 : -40 }}
                      >
                        <Image
                          source={{ uri: item }}
                          style={[
                            styles.smallImage,
                            currentIndex === index
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}

                  {!expanded && extraImages > 0 && (
                    <TouchableOpacity onPress={() => setExpanded(true)} activeOpacity={0.8} style={{ marginRight: 10 }}>
                      <View style={styles.smallImage}>
                        <Image
                          source={{ uri: images[4] }}
                          style={StyleSheet.absoluteFillObject}
                          resizeMode="cover"
                        />
                        <View style={styles.overlay}>
                          <Text style={styles.moreText}>+{extraImages}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
              <TouchableOpacity onPress={() => setSelectDetails('Property Details')} 
                style={{ 
                  borderColor: selectDetails === 'Property Details' ? '#021365' : '#DDDEE2', 
                  borderWidth: selectDetails === 'Property Details' ? 1 : 0, 
                  backgroundColor: selectDetails === 'Property Details' ? '#CCD5F954' : '#F0F0F0', 
                  paddingHorizontal: 10, paddingVertical: 8, borderRadius: 30, alignItems: 'center', justifyContent: 'center' 
                }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: selectDetails === 'Property Details' ? '#021265' : '#8F909D' }}>Property Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectDetails('Investment Details')} 
                style={{ 
                  borderColor: selectDetails === 'Investment Details' ? '#021365' : '#DDDEE2', 
                  borderWidth: selectDetails === 'Investment Details' ? 1 : 0, marginLeft: 10, 
                  backgroundColor: selectDetails === 'Investment Details' ? '#CCD5F954' : '#F0F0F0', 
                  paddingHorizontal: 10, paddingVertical: 8, borderRadius: 30, alignItems: 'center', justifyContent: 'center' 
                }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: selectDetails === 'Investment Details' ? '#021265' : '#8F909D' }}>Investment Details</Text>
              </TouchableOpacity>
              {propertyStatu == 100 && (
                <TouchableOpacity onPress={() => setSelectDetails('Guest Booking Details')} 
                  style={{ 
                    borderColor: selectDetails === 'Guest Booking Details' ? '#021365' : '#DDDEE2', 
                    borderWidth: selectDetails === 'Guest Booking Details' ? 1 : 0, marginLeft: 10, 
                    backgroundColor: selectDetails === 'Guest Booking Details' ? '#CCD5F954' : '#F0F0F0', 
                    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 30, alignItems: 'center', justifyContent: 'center' 
                  }}>
                  <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: selectDetails === 'Guest Booking Details' ? '#021265' : '#8F909D' }}>Guest Booking Details</Text>
                </TouchableOpacity>
              )}
              {/* <TouchableOpacity onPress={() => setSelectDetails('Watch Live')} 
                style={{ 
                  borderColor: selectDetails === 'Watch Live' ? '#021365' : '#DDDEE2', 
                  borderWidth: selectDetails === 'Watch Live' ? 1 : 0, marginLeft: 10, 
                  backgroundColor: selectDetails === 'Watch Live' ? '#CCD5F954' : '#F0F0F0', 
                  paddingHorizontal: 10, paddingVertical: 8, borderRadius: 30, alignItems: 'center', justifyContent: 'center',marginRight:15 
                }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: selectDetails === 'Watch Live' ? '#021265' : '#8F909D' }}>Watch Live</Text>
              </TouchableOpacity> */}
            </ScrollView>

            <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
              {selectDetails != 'Watch Live' &&
              <View style={{ marginTop: 0 }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 22, color: '#000000' }}>{OwnedPropertyDetails?.propertyDetails?.name}</Text>
              </View>
              }

              {OwnedPropertyDetails?.badRentalHistory && (
                <TouchableOpacity onPress={() => navigation.navigate("MonthlyInsight", { OwnedPropertyDetails: OwnedPropertyDetails })} style={{ backgroundColor: '#FA9F9F38', padding: 20, borderRadius: 15, marginVertical: 10 }}>
                  <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000000' }}>📊 Performance Insight:</Text>
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#00000091', marginTop: 5 }}>
                    This property has not been performing well as per expectations. <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#C12525', textDecorationLine: 'underline' }}> Know more </Text>
                    to understand the performance insights.
                  </Text>
                </TouchableOpacity>
              )}

              {selectDetails === 'Investment Details' && (
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image resizeMode='cover' source={require('./assets/NewProfileImage.jpg')} style={{ width: 42, height: 40, borderRadius: 30, borderWidth: 5 }} />
                        <Image resizeMode='cover' source={require('./assets/NewProfileImage.jpg')} style={{ width: 42, height: 40, borderRadius: 30, marginLeft: -20 }} />
                        <Image resizeMode='cover' source={require('./assets/NewProfileImage.jpg')} style={{ width: 42, height: 40, borderRadius: 30, marginLeft: -20 }} />
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#0F1130' }}>Total Investors</Text>
                      </View>
                    </View>
                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000', paddingRight: 5 }}>{OwnedPropertyDetails?.numberOfOwners} Investors</Text>
                  </View>

                  <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 10, marginVertical: 20, elevation: 5, flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                      <View style={{ marginRight: 15, borderWidth: 2, width: 25, height: 25, borderRadius: 25, borderColor: '#081F62', alignItems: 'center', justifyContent: 'center' }}>
                        <IconDown name="currency-rupee" size={15} color={'#081F62'} />
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#0F113075' }}>Collective Cost</Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#081F62' }}> {'\u20B9'} {OwnedPropertyDetails?.propertyDetails?.Price}</Text>
                      </View>
                    </View>
                    <View style={{ borderLeftColor: '#969494', borderLeftWidth: 1 }}></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                      <View style={{ marginRight: 15, borderWidth: 2, width: 25, height: 25, borderRadius: 25, borderColor: '#081F62', alignItems: 'center', justifyContent: 'center' }}>
                        <IconDown name="currency-rupee" size={15} color={'#081F62'} />
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#0F113075' }}>Total Investment</Text>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#081F62' }}>  {'\u20B9'} {formatIndianAmount(OwnedPropertyDetails?.totalInvestment)}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 10, paddingBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.title}>Property Status</Text>
                      <Text style={styles.title}>{propertyStatu}%</Text>
                    </View>
                    <Progress.Bar
                      progress={parseInt(propertyStatu) / 100}
                      width={width - 50}
                      borderColor={'#252b5d'}
                      color={'#252b5d'}
                      borderWidth={1}
                      height={5}
                    />
                  </View>

                  <View style={{ marginVertical: 10, paddingHorizontal: 10, backgroundColor: '#DAE5F336', borderColor: '#B1CEF3', borderWidth: 1, borderRadius: 15 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'WorkSans-SemiBold', color: '#000000', paddingVertical: 10 }}>Acquired Fractions</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: '#1A1A1A', textAlign: 'left' }}>Shares Owned</Text>
                      <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: '#1A1A1A', opacity: 0.7 }}>{OwnedPropertyDetails?.totalSharesOwned?.length}</Text>
                    </View>
                    {OwnedPropertyDetails?.totalSharesOwned?.map((item, index) => (
                      <View key={index} style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: '#1A1A1A' }}>Frac {item?.fraction} acquired on</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', color: '#1A1A1A', opacity: 0.7 }}>{item?.installmentDateAndAmount[0]?.date}</Text>
                      </View>
                    ))}
                  </View>

                  {propertyStatu == 100 && (
                    <TouchableOpacity onPress={() => navigation.navigate('Enquire', { propertyid: OwnedPropertyDetails?.propertyDetails?.name })} style={{ backgroundColor: '#F7F9FC', borderColor: '#B1CEF3', borderWidth: 1, padding: 15, marginVertical: 20, borderRadius: 15 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.title, { paddingBottom: 0, paddingLeft: 0 }]}>Complimentary Stay</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ backgroundColor: '#759CCE', alignItems: 'center', justifyContent: 'center', height: 30, width: 30, borderRadius: 30, marginRight: 10 }}>
                            <Text style={{ color: '#ffffff', fontSize: 11, fontFamily: 'Montserrat-SemiBold' }}> {OwnedPropertyDetails?.AvailableFreeStays}/N </Text>
                          </View>
                          <Icon1 name="chevron-right" size={25} color="#000000" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}

                  {OwnedPropertyDetails?.ownershipDocuments?.length != 0 && (
                    <View style={{ borderRadius: 10, marginBottom: 20 }}>
                      <Text style={styles.title}>Ownership Documents</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        {OwnedPropertyDetails?.ownershipDocuments?.map((item, index) => (
                          <TouchableOpacity key={index} onPress={() => navigation.navigate('DisplayDoc', { Link: item })}>
                            {item != '' && (
                              <View>
                                <Image style={[styles.reviewChildLayout, { marginRight: 20 }]} resizeMode="cover" source={require('./assets/FOA.jpeg')} />
                                <Text style={[styles.cardTypo]}>{item.includes('ownershipagreement') ? 'FOA' : item.includes('shareholdercertificate') ? 'SHC' : ''}</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  <TouchableOpacity onPress={() => createButtonAlert()} disabled={!OwnedPropertyDetails?.eligibleToResell} style={{ alignItems: 'center', backgroundColor: !OwnedPropertyDetails?.eligibleToResell ? '#AEAEAE' : '#021265', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 15, marginVertical: 8, marginBottom: 20, justifyContent: 'center' }}>
                    {loader == true ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={{ color: 'white', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>Sell</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Modal visible={showFeedback} transparent animationType='fade'>
              <View style={{flex:1, backgroundColor:'#00000065'}}>
                <TouchableOpacity onPress={() => {setShowFeedback(false)}} style={{flex:1}}/>
                <ScrollView style={{position:'absolute',bottom:0,left:0,right:0,height:height*0.6,backgroundColor:'#FFF',padding:25,borderTopLeftRadius:25,borderTopRightRadius:25}}>
                  <View style={{alignItems:'center'}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>FeedBack Form</Text>
                  </View>
                  <View>
                    {form?.questions?.map(renderQuestion)}
                  </View>

                  <TouchableOpacity
                    // onPress={() => {setModalVisible(true)}}
                    onPress={submitFeedbackForm}
                    style={{backgroundColor:'#0f1265',padding:12,borderRadius:10,marginTop:20,alignItems:'center',marginBottom:50}}
                  >
                    <Text style={{color:'#fff',fontFamily:'WorkSans-Medium'}}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Modal>

            <Modal transparent animationType='fade'
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              modalStyle={styles.customModal}>
              <View style={{flex:1,backgroundColor:'#00000065'}}>
                {/* <TouchableOpacity onPress={() => {setModalVisible(false)}} style={{flex:1}}/> */}
                <View style={[styles.modal]}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <View style={{width:30}}/>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: 'OpenSans-SemiBold',
                        color: '#043862',
                        textAlign: 'center',
                        paddingTop: 10,
                      }}>
                      Enter Code
                    </Text>
                    <TouchableOpacity onPress={() => {
                      setModalVisible(false);
                    }} style={{backgroundColor:'#231f1fab',padding:5,borderRadius:20,marginRight:5}}>
                      <Icon name={'cross'} size={20} color={'#FFF'}/>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Poppins-Regular',
                      color: '#1E2135',
                      textAlign: 'center',
                      paddingTop: 10,
                      marginHorizontal: 20,
                    }}>
                    Enter the code one time password sent to{' '}
                    {globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber?.length === 13 ? globalState?.userDetails?.phoneNumber : globalState?.userDetails?.email}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20, }}>
                    <TextInput style={{height: 40,color: '#1E2135',borderWidth: 2,borderColor: '#043862',borderRadius: 5,alignItems: 'center',}}
                      placeholder=""
                      ref={firstInput}
                      maxLength={1}
                      keyboardType={'numeric'}
                      placeholderTextColor={'#000'}
                      onChangeText={txt => {
                        txt && secoundInput.current.focus();
                        setOtp({ ...otp, 1: txt });
                      }}
                    />
                    <TextInput
                      style={{height: 40,color: '#1E2135',borderWidth: 2,borderColor: '#043862',borderRadius: 5,alignItems: 'center',}}
                      placeholder=""
                      ref={secoundInput}
                      maxLength={1}
                      keyboardType={'numeric'}
                      placeholderTextColor={'#000'}
                      onChangeText={txt => {
                        txt ? thirdInput.current.focus() : firstInput.current.focus();
                        setOtp({ ...otp, 2: txt });
                        // setPhone(txt);
                      }}
                    />
                    <TextInput
                      style={{
                        height: 40,
                        color: '#1E2135',
                        borderWidth: 2,
                        borderColor: '#043862',
                        borderRadius: 5,
                        alignItems: 'center',
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
                        height: 40,
                        color: '#1E2135',
                        borderWidth: 2,
                        borderColor: '#043862',
                        borderRadius: 5,
                        alignItems: 'center',
                      }}
                      placeholder=""
                      // value={otp.charAt(3)}
                      ref={fourInput}
                      maxLength={1}
                      keyboardType={'numeric'}
                      placeholderTextColor={'#000'}
                      onChangeText={txt => {
                        // setPhone(txt);\
                        txt ? fiveInput.current.focus() : thirdInput.current.focus();
                        setOtp({ ...otp, 4: txt });
                        //setOtp(otp + txt);
                      }}
                    />
                    <TextInput
                      style={{
                        height: 40,
                        color: '#1E2135',
                        borderWidth: 2,
                        borderColor: '#043862',
                        borderRadius: 5,
                        alignItems: 'center',
                      }}
                      placeholder=""
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
                        height: 40,
                        color: '#1E2135',
                        borderWidth: 2,
                        borderColor: '#043862',
                        borderRadius: 5,
                        alignItems: 'center',
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
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center',width:'100%',justifyContent:'space-between', marginTop: 15,paddingHorizontal:15 }}>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                          <View key={index} style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 4 }}>
                              <TextInput
                                  ref={(ref) => (inputRefs.current[index] = ref)}
                                  style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#000000', marginLeft: 5 }}
                                  maxLength={1}
                                  keyboardType="number-pad"
                                  value={otpDigits[index]}
                                  onChangeText={(text) => handleChange(text, index)}
                                  onKeyPress={(e) => handleKeyPress(e, index)}
                              />
                              <View style={{ borderTopColor: '#8E9398', borderWidth: 1, marginBottom: 10 }}></View>
                          </View>
                      ))}
                  </View> */}
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between',marginBottom:5 }}>
                    <Text></Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleResell();
                      }}>
                      <Text
                        style={{
                          color: '#043862',
                          fontSize: 16,
                          fontFamily: 'OpenSans-SemiBold',
                          paddingRight: 20,
                        }}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!form &&
                    <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                      <View style={styles.input}>
                        <View
                          style={{
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            width: '90%',
                            paddingLeft: 10,
                          }}>

                          <TextInput
                            style={{ width: '100%', paddingLeft: 10, color: 'black' }}
                            editable
                            multiline
                            //  numberOfLines={8}
                            placeholder="Reason for Sale"
                            value={message}
                            // placeholderTextColor={'#DADADA'}
                            onChangeText={txt => {
                              setMessage(txt);
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={[
                          styles.labelContainer,
                          {
                            top: -(height * 0.01),
                          },
                        ]}>
                        <Text
                          style={[
                            styles.label,
                            {
                              fontSize: 16,
                            },
                          ]}>
                          Message
                        </Text>
                      </View>
                    </View>
                  }
                  <TouchableOpacity
                    onPress={() => {
                      const code =
                        otp?.[1] +
                        otp?.[2] +
                        otp?.[3] +
                        otp?.[4] +
                        otp?.[5] +
                        otp?.[6];
                      handleResellVerification(code, message);
                    }}
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#043862',
                      borderRadius: 12,
                      marginHorizontal: 20,
                      padding: 20,
                      marginBottom: 30,
                    }}>
                      {loader == true ? <ActivityIndicator size="small" color="#FFF"/> : <Text style={{fontFamily:'OpenSans-SemiBold',fontSize:16,color:'#FFF'}}>Submit</Text>}
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => createButtonAlert()} disabled={!OwnedPropertyDetails?.eligibleToResell} style={{ alignItems: 'center', backgroundColor: !OwnedPropertyDetails?.eligibleToResell ? '#AEAEAE' : '#56018A', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 15, marginVertical: 8, marginBottom: 20, justifyContent: 'center' }}>
                    {loader == true ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={{ color: 'white', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>Sell My Frac</Text>}
                  </TouchableOpacity> */}
                </View>
              </View>
            </Modal>

            {success === true &&
              <Modal visible={true} transparent animationType='fade' modalStyle={{ width }}>
                  <View style={{flex:1,backgroundColor:'#00000065'}}>
                      <TouchableOpacity onPress={() => {
                          setSuccess(false);
                          navigation.navigate('Owned');
                      }} style={{flex:1}}/>
                      <View style={{position:'absolute',bottom:0, left:0,right:0, backgroundColor: '#FFFFFF', padding: 20, elevation: 5, borderTopLeftRadius:20,borderTopRightRadius:20 }}>
                          <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#021265',textAlign:'center' }}>Request Submitted!</Text>
                          <View style={{ marginVertical: 10 }}>
                              <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#00000080' }}>
                                  Thank You for your Request.Your request submitted successfully. Our team will contact you soon
                              </Text>
                          </View>
                          <TouchableOpacity onPress={() => {
                              // setNotSelected(!notselected);
                              setSuccess(false);
                              navigation.navigate('Owned');
                          }} style={{ backgroundColor: '#0F1130', borderColor: '#C0D5F3', padding: 15, alignItems: 'center', borderRadius: 10, marginVertical: 30 }}>
                              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#FFFFFF' }}>Continue</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </Modal>
          }

            {selectDetails === 'Guest Booking Details' && (
              <View style={{ paddingHorizontal: 20 }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  {(sortBy || selectedYear || selectedMonth !== null) && (
                    <TouchableOpacity onPress={resetFilters} style={{ borderColor: '#eb2c19', borderWidth: 1, backgroundColor: '#eb2a1925', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center',marginRight: 10 }}>
                      <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000' }}>Reset Filter</Text>
                      {/* <Icon name={'chevron-down'} size={15} color={'#021265'} style={{ marginLeft: 5 }} /> */}
                  </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setSort(!sort)} style={{ borderColor: '#021265', borderWidth: 1, backgroundColor: '#EEF1FD', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#021265' }}>Sort</Text>
                    <Icon name={'chevron-down'} size={15} color={'#021265'} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMonth(!month)} style={{ borderColor: '#021265', borderWidth: 1, backgroundColor: '#EEF1FD', borderRadius: 20, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#021265' }}>{getMonthLabel()}</Text>
                    <Icon name={'chevron-down'} size={15} color={'#021265'} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setYearData(!yearData)} style={{ borderColor: '#021265', borderWidth: 1, backgroundColor: '#EEF1FD', borderRadius: 20, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#021265' }}>{getYearLabel()}</Text>
                    <Icon name={'chevron-down'} size={15} color={'#021265'} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                </ScrollView>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18, color: '#081F62', paddingVertical: 10 }}>Guest Booking Details</Text>
                {(sortBy || selectedYear || selectedMonth !== null) &&
                <View style={{ marginTop: 20 }}>
                  <View style={{ backgroundColor: '#ECF7FE', flexDirection: 'row', padding: 10, justifyContent: 'space-between', borderRadius: 10, paddingHorizontal: 10,flex:1 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000' }}>{label}</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#21721F' }}>₹ {displayRevenue.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
                }
              </View>
            )}

            {/* {selectDetails === 'Watch Live' && (
              <View style={{ paddingHorizontal: 20, paddingBottom:10 }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 22, color: '#000' }}>Exclusive Investor Live View</Text>
                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>This live stream is provided exclusively for verified investors and is for viewing purposes only.</Text>

                <View style={{marginTop:15}}>
                  <Image resizeMode='contain' source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/ReceptionCam.png'}} style={{width:'100%',height:220}}/>
                  <View style={{position:'absolute',top:15,left:15}}>
                    <View style={{backgroundColor:'#EB2C1980',borderRadius:20,paddingHorizontal:7,paddingVertical:3,alignItems:'center',flexDirection:'row'}}>
                      <Icon1 name={'radio'} size={15} color={'#FFF'}/>
                      <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#FFF',marginLeft:3}}>Live</Text>
                    </View>
                  </View>
                  <View style={{position:'absolute',alignSelf:'center',justifyContent:'center',top:70}}>
                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#FFF'}}>Main Reception Cam</Text>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('LiveStream', {liveStreamUrl: 'https://occasionally-homodont-eve.ngrok-free.dev/hls/192.168.0.4_1/index.m3u8'})
                    }} style={{backgroundColor:'#FFFFFF4D',borderRadius:5,padding:12,alignItems:'center',justifyContent:'center',marginHorizontal:20,marginTop:10}}>
                      <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFF'}}>Watch Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#021265',marginTop:10}}>Secure feed • View-only access</Text>
              </View>
            )} */}

            {selectDetails === 'Property Details' && (
              <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 19, color: '#081F62', paddingBottom: 5 }}>Description</Text>
                <Text style={{ fontSize: 12, fontFamily: 'WorkSans-Medium', color: '#949494' }}>
                  {showFullText ? PropertiesArray?.Description : PropertiesArray?.Description.slice(0, 160)}
                </Text>
                <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
                  <Text style={{ fontSize: 14, fontFamily: 'WorkSans-SemiBold', color: '#6D6D6D' }}>{showFullText ? 'Read less' : 'Read more..'}</Text>
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 19, color: '#081F62', paddingVertical: 15 }}>Property Details</Text>
                <View style={{ borderWidth: 1, borderColor: '#DADADA', borderRadius: 15, marginBottom: 10, backgroundColor: '#FFFFFF', padding: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DADADA' }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#1A1A1A' }}>Property Type</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7, textTransform: 'capitalize' }}>{PropertiesArray?.P_Type}</Text>
                  </View>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#DADADA', paddingVertical: 10, marginTop: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#1A1A1A' }}>Area Details</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>Total Area</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}>{PropertiesArray?.area}</Text>
                  </View>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#DADADA', paddingVertical: 10, marginTop: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#1A1A1A' }}>Price Details</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>Property Value</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}> {'\u20B9 '} {PropertiesArray?.Price}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>Frac Value</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}> {'\u20B9 '} {PropertiesArray?.FC_Price}</Text>
                  </View>
                  {PropertiesArray?.SPV && Math.round(Number(PropertiesArray?.SPV)) >= 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                      <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>SPV Value</Text>
                      <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}> {'\u20B9 '} {PropertiesArray?.SPV}</Text>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>Booking Value</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}> {PropertiesArray?.currencyType == 'USD' ? '$' : '₹'} {PropertiesArray?.BookingAmt}</Text>
                  </View>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#DADADA', paddingVertical: 10, marginTop: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#1A1A1A' }}>Fracs Details</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>Total Fracs</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}>{PropertiesArray?.TotalFractions}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#1A1A1A' }}>Available Fracs</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}>{PropertiesArray?.AvailableFractions}</Text>
                  </View>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#DADADA', marginTop: 10 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#1A1A1A' }}>Property Status</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 12, color: '#000000', opacity: 0.7 }}>{propertyStatu}%</Text>
                  </View>
                  <Progress.Bar progress={parseInt(propertyStatu) / 100} width={width - 60} borderColor={'#043862'} color={'#043862'} borderWidth={1} height={8} />
                </View>

                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 19, color: '#081F62', paddingTop: 15 }}>Benefits</Text>
                <FlatList
                  horizontal
                  data={PropertiesArray?.Benefits || []}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 5, paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <View style={{ width: 90, alignItems: 'center', marginRight: 15 }}>
                      <View style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: 'WorkSans-Medium', color: '#949494', textAlign: 'center', marginTop: -8 }} numberOfLines={2}>{item?.name}</Text>
                    </View>
                  )}
                />

                <TouchableOpacity onPress={() => GgoToYosemite(PropertiesArray?.Location)}>
                  <View style={{ paddingBottom: 10 }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 19, color: '#081F62', paddingBottom: 5 }}>Property Location</Text>
                  </View>
                  <Image style={{ width: '100%', height: 200, borderWidth: 1, borderColor: '#A5A5A5', borderRadius: 10 }} source={{ uri: PropertiesArray?.LocationImage }} />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 19, color: '#081F62', paddingVertical: 5 }}>Testimonials</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ScrollView horizontal={true}>
                    <TouchableOpacity onPress={() => navigation.navigate('VideoTour', { vlink: PropertiesArray?.testimonial[1], location: 'Testimonials' })} style={{ marginVertical: 10, paddingBottom: 10 }}>
                      <Image style={{ width: 150, height: 130, borderRadius: 10 }} source={require('./assets/Video1.jpeg')} />
                      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: 130 }}>
                        <IconC name={'caret-forward'} size={30} color={'#AEAEAE'} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('VideoTour', { vlink: PropertiesArray?.testimonial[0], location: 'Testimonials' })} style={{ backgroundColor: '#FFFFFF', margin: 10, paddingBottom: 10 }}>
                      <Image style={{ width: 150, height: 130, borderRadius: 10 }} source={require('./assets/Video2.jpeg')} />
                      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: 130 }}>
                        <IconC name={'caret-forward'} size={30} color={'#AEAEAE'} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('VideoTour', { vlink: PropertiesArray?.testimonial[2], location: 'Testimonials' })} style={{ backgroundColor: '#FFFFFF', margin: 10, paddingBottom: 10 }}>
                      <Image style={{ width: 150, height: 130, borderRadius: 10 }} source={require('./assets/Video3.jpeg')} />
                      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: 130 }}>
                        <IconC name={'caret-forward'} size={30} color={'#AEAEAE'} />
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            )}
          </>
        }
      />

      {/* <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} modalStyle={styles.customModal}>
        <View style={[styles.modal]}>
          <Text style={{ fontSize: 20, fontFamily: 'OpenSans-SemiBold', color: '#043862', textAlign: 'center', paddingTop: 10 }}>{'  '}Enter Code</Text>
          <Text style={{ fontSize: 20, fontFamily: 'Poppins-Regular', color: '#1E2135', textAlign: 'center', paddingTop: 10, marginHorizontal: 20 }}>
            Enter the code one time password sent to{' '}
            {globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber?.length === 13 ? globalState?.userDetails?.phoneNumber : globalState?.userDetails?.email}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20, marginBottom: 10 }}>
            <TextInput style={{ height: 40, color: '#1E2135', borderWidth: 2, borderColor: '#043862', borderRadius: 5, alignItems: 'center' }} placeholder="" ref={firstInput} maxLength={1} keyboardType={'numeric'} placeholderTextColor={'#000'} onChangeText={txt => { txt && secoundInput.current.focus(); setOtp({ ...otp, 1: txt }); }} />
            <TextInput style={{ height: 40, color: '#1E2135', borderWidth: 2, borderColor: '#043862', borderRadius: 5, alignItems: 'center' }} placeholder="" ref={secoundInput} maxLength={1} keyboardType={'numeric'} placeholderTextColor={'#000'} onChangeText={txt => { txt ? thirdInput.current.focus() : firstInput.current.focus(); setOtp({ ...otp, 2: txt }); }} />
            <TextInput style={{ height: 40, color: '#1E2135', borderWidth: 2, borderColor: '#043862', borderRadius: 5, alignItems: 'center' }} placeholder="" ref={thirdInput} maxLength={1} keyboardType={'numeric'} placeholderTextColor={'#000'} onChangeText={txt => { txt ? fourInput.current.focus() : secoundInput.current.focus(); setOtp({ ...otp, 3: txt }); }} />
            <TextInput style={{ height: 40, color: '#1E2135', borderWidth: 2, borderColor: '#043862', borderRadius: 5, alignItems: 'center' }} placeholder="" ref={fourInput} maxLength={1} keyboardType={'numeric'} placeholderTextColor={'#000'} onChangeText={txt => { txt ? fiveInput.current.focus() : thirdInput.current.focus(); setOtp({ ...otp, 4: txt }); }} />
            <TextInput style={{ height: 40, color: '#1E2135', borderWidth: 2, borderColor: '#043862', borderRadius: 5, alignItems: 'center' }} placeholder="" ref={fiveInput} maxLength={1} keyboardType={'numeric'} placeholderTextColor={'#000'} onChangeText={txt => { txt ? sixInput.current.focus() : fourInput.current.focus(); setOtp({ ...otp, 5: txt }); }} />
            <TextInput style={{ height: 40, color: '#1E2135', borderWidth: 2, borderColor: '#043862', borderRadius: 5, alignItems: 'center' }} placeholder="" ref={sixInput} maxLength={1} keyboardType={'numeric'} placeholderTextColor={'#000'} onChangeText={txt => { !txt && fiveInput.current.focus(); setOtp({ ...otp, 6: txt }); }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text></Text>
            <TouchableOpacity onPress={() => handleResell()}>
              <Text style={{ color: '#043862', fontSize: 16, fontFamily: 'OpenSans-SemiBold', paddingRight: 20 }}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <View style={styles.input}>
              <View style={{ justifyContent: 'flex-start', flexDirection: 'row', width: '90%', paddingLeft: 10 }}>
                <TextInput style={{ width: '100%', paddingLeft: 10, color: 'black' }} editable multiline placeholder="Reason for Sale" value={message} onChangeText={txt => setMessage(txt)} />
              </View>
            </View>
            <View style={[styles.labelContainer, { top: -(height * 0.01) }]}>
              <Text style={[styles.label, { fontSize: 16 }]}>Message</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => { const code = otp?.[1] + otp?.[2] + otp?.[3] + otp?.[4] + otp?.[5] + otp?.[6]; handleResellVerification(code, message); }} style={{ alignItems: 'center', backgroundColor: '#043862', borderRadius: 12, marginHorizontal: 20, padding: 20, marginBottom: 50 }}>
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </CustomModal> */}

      {sort && (
        <Modal visible={true} transparent animationType='fade'>
          <View style={{ backgroundColor: '#00000042', flex: 1 }}>
            <TouchableOpacity onPress={() => setSort(false)} style={{ flex: 1 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#F6F6F6', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#000000' }}>Sort By</Text>
                <TouchableOpacity onPress={() => setSort(!sort)}><Icon name={'cross'} size={20} color={'#000000'} /></TouchableOpacity>
              </View>
              <View style={{ borderTopColor: '#E7E9EB', borderTopWidth: 1, marginVertical: 15 }}></View>
              <View>
                <TouchableOpacity onPress={() => { setSortBy(prev => prev === "Complimentary Stays" ? "" : "Complimentary Stays"); setSort(!sort); }} style={{ flexDirection: 'row' }}>
                  {sortBy == "Complimentary Stays" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Complimentary Stays</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSortBy(prev => prev === "Low to High" ? "" : "Low to High"); setSort(!sort); }} style={{ flexDirection: 'row', marginVertical: 15 }}>
                  {sortBy == "Low to High" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Price (Low to High)</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSortBy(prev => prev === "High to Low" ? "" : "High to Low"); setSort(!sort); }} style={{ flexDirection: 'row', paddingBottom: 40 }}>
                  {sortBy == "High to Low" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Price (High to Low)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {month && (
        <Modal visible={true} transparent animationType='fade'>
          <View style={{ backgroundColor: '#00000042', flex: 1 }}>
            <TouchableOpacity onPress={() => setMonth(false)} style={{ flex: 1 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#F6F6F6', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#000000' }}>Select Months</Text>
                <TouchableOpacity onPress={() => setMonth(!month)}><Icon name={'cross'} size={20} color={'#000000'} /></TouchableOpacity>
              </View>
              <View style={{ borderTopColor: '#E7E9EB', borderTopWidth: 1, marginVertical: 15 }}></View>
              <View>
                {/* <TouchableOpacity onPress={() => { setMonthBy(prev => prev === "3" ? "" : "3"); setMonth(!month); }} style={{ flexDirection: 'row' }}>
                  {monthBy == "3" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Last 3 Months</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setMonthBy(prev => prev === "6" ? "" : "6"); setMonth(!month); }} style={{ flexDirection: 'row', marginVertical: 15 }}>
                  {monthBy == "6" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Last 6 Months</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setMonthBy(prev => prev === "12" ? "" : "12"); setMonth(!month); }} style={{ flexDirection: 'row', paddingBottom: 40 }}>
                  {monthBy == "12" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Last 12 Months</Text>
                </TouchableOpacity> */}
                {monthsData?.map(({ month, revenue }) => (
                  <TouchableOpacity
                    key={month}
                    onPress={() => {
                      setSelectedMonth(month);
                      setMonth(false);
                    }}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      {selectedMonth === month ? (
                        <IconC name="radio-button-on-outline" size={20} color="#001DD8" />
                      ) : (
                        <IconC name="radio-button-off-outline" size={20} color="#9B9B9B" />
                      )}
                      <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>
                        {monthNames[month]}
                      </Text>
                    </View>

                    <Text style={{ color: '#000' }}>
                      ₹{revenue}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {yearData && (
        <Modal visible={true} transparent animationType='fade'>
          <View style={{ backgroundColor: '#00000042', flex: 1 }}>
            <TouchableOpacity onPress={() => setYearData(false)} style={{ flex: 1 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#F6F6F6', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#000000' }}>Select Year</Text>
                <TouchableOpacity onPress={() => setYearData(!yearData)}><Icon name={'cross'} size={20} color={'#000000'} /></TouchableOpacity>
              </View>
              <View style={{ borderTopColor: '#E7E9EB', borderTopWidth: 1, marginVertical: 15 }}></View>
              <View>
                {/* <TouchableOpacity onPress={() => { setYearBy(prev => prev === "1" ? "" : "1"); setYearData(!yearData); }} style={{ flexDirection: 'row' }}>
                  {yearBy == "1" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Last 1 Year</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setYearBy(prev => prev === "2" ? "" : "2"); setYearData(!yearData); }} style={{ flexDirection: 'row', marginVertical: 15, paddingBottom: 40 }}>
                  {yearBy == "2" ? <IconC name={'radio-button-on-outline'} size={20} color={'#001DD8'} /> : <IconC name={'radio-button-off-outline'} size={20} color={'#9B9B9B'} />}
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>Last 2 Years</Text>
                </TouchableOpacity> */}
                {years?.map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => {
                      setSelectedYear(year);
                      setSelectedMonth(null); // reset month
                      setYearData(false);
                    }}
                    style={{ flexDirection: 'row', marginVertical: 10 }}
                  >
                    {selectedYear === year ? (
                      <IconC name="radio-button-on-outline" size={20} color="#001DD8" />
                    ) : (
                      <IconC name="radio-button-off-outline" size={20} color="#9B9B9B" />
                    )}
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#000000', marginLeft: 10 }}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: 'WorkSans-SemiBold',
    color: '#000000',
    paddingLeft: 5,
    paddingBottom: 10
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    //alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2E2E2E',
    // opacity: 0.9,
  },
  cardTypo: {
    // borderWidth:1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    // left: 10,
    color: '#1e2135',
    // fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingTop: 150,
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    flex: 1,
    letterSpacing: 0.8,
  },
  reviewChildLayout: {
    height: 180,
    width: 150,
    borderColor: '#2B53A1',
    borderRadius: 10,
    borderWidth: 1
    // borderRadius: 5,

    // left: 32,
    //position: 'absolute',
  },
  modal: {
    position:'absolute',bottom:0,right:0,left:0,padding:10,
    width: '100%',
    alignSelf: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    backgroundColor: 'white',
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#043862',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  labelContainer: {
    position: 'absolute',

    left: 16,
    top: -6,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 14,
    // fontWeight: 600,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',

    // color: 'black'
  },
  mainImageContainer: {
    width: width,
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  bottomImagesContainer: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 8,
    padding: 5,
    width: width * 0.47,
    flexDirection: 'row',
    alignItems: 'center'
  },
  smallImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

