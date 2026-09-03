let hasShownHomePopup = false; // ✅ module-level (shared for app session)

import { View, Text, ScrollView, Image, StyleSheet, Animated, Easing, TouchableOpacity, Linking, Dimensions, Alert, ImageBackground, StatusBar, BackHandler, Modal, PanResponder, Pressable, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome6';
import IconI from 'react-native-vector-icons/AntDesign';
import Iconn from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Fontisto';
import Icoo from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { CallRecord, DisLike, DreamscapeHotels, GetAllNotification, GetCarousel, Like, LikeData, PopularDestination, ProfileDetails, PropertyDetails, updateFCMToken } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
const { width, height } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
// import FastImage from 'react-native-fast-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Video, { VideoRef } from 'react-native-video';
import Svg, { Path } from 'react-native-svg';
import Footer from '../Footer';
import { useDispatch, useSelector } from 'react-redux'
import { fetchPopularHotels, fetchProperties } from '../redux/reducer/homeReducer';
import HomeSkeleton from '../component/HomeSkeleton';
import CompleteProfilePopup from '../component/CompleteProfilePopup';
import CustomSwiper from '../component/CustomSwiper';
import CountdownTimer from '../component/CountdownTimer/CountdownTimer';
import EdgeFab from './altaira/FloatingButton';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
// import CountdownTimer from '../CountdownTimer';

const shouldRequireProfileCompletion = (profile) => {
  if (!profile) return false;
  return (
    profile.verification === true &&
    (!profile.postalAddress?.trim() ||
      !profile.pincode?.trim())
  );
};

export default function HomePage() {

  const { globalState, setGlobalState } = useContext(AppContext);
  const [notification, setNotification] = useState([]);
  const navigation = useNavigation();
  const placeholders = [
    "Hyderabad",
    "Goa",
    "Delhi",
    "Bangalore",
  ];
  const animatedValue = useRef(new Animated.Value(0)).current;

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [Properties, setProperties] = useState([]);
  const [Recommended, setRecommended] = useState([]);
  const [Popular, setPopular] = useState([]);
  const [Offer, setOffer] = useState([]);
  const [Position, setPosition] = useState(0);
  // const [Search, setSearch] = useState('');
  // const [ExpoVideos, setExpoVideos] = useState(true);
  const isFocused = useIsFocused();
  const [like, setLike] = useState([]);
  const [likedProperty, setLikedProperty] = useState([]);
  const [selectCountry, setSelectCountry] = useState('India');
  const [srilankaProp, setSrilankaProp] = useState([]);
  const [indianProp, setIndianProp] = useState([]);
  // console.log("Pendingdepp: ",globalState?.pendingDeepLinkType);
  const [ourStays, setOurStays] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [carousel, setCarousel] = useState([]);
  // const [popUpArray, setPopUpArray] = useState([]);

  const [popUp, setPopUp] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const popupShownRef = useRef(false);

  const [showCompleteProfilePopup, setShowCompleteProfilePopup] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profilePopupDismissed, setProfilePopupDismissed] = useState(false);
  const profilePopupDecisionMade = useRef(false);


  // const[loading, setLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;

  // const [priority, setPriority] = useState('');
  //   // const dispatch = useDispatch();
  // const Offer = useSelector(state => state.home.offer);
  // //const [Offer, setOffer] = useState(Offers);
  // const Properties = useSelector(state => state.home.Properties);
  // const loading = useSelector(state => state.home.loading);

  // console.log("ofer: ",Properties);
  const iconTranslateX = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0.3)).current;

  const insets = useSafeAreaInsets();

  const isValidUri = (uri) =>
    typeof uri === 'string' && uri.trim()?.length > 0;

  useEffect(() => {
    handleProfle()
    handleProperties();
    fetchCarousel();
    // handlePopular();
    closeMenu();
    // FetchAllNotification();
    handleListedHotels();
    // getDeviceToken();

  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async token => {
      const email = await AsyncStorage.getItem('Email');
      console.log("FCM Token Refreshed:", token);

      let payload = JSON.stringify({
        email: email,
        fcmToken: token,
      });
      console.log("update token: ", payload);

      await updateFCMToken(payload);
      await AsyncStorage.setItem('fcmToken', token);
    });

    return unsubscribe;
  }, []);

  const getDeviceToken = async (fcmToken) => {
    try {
      // Request permission (important for iOS)
      await messaging().requestPermission();

      const newToken = await messaging().getToken();
      const savedToken = await AsyncStorage.getItem('fcmToken');
      const email = await AsyncStorage.getItem('Email');

      // console.log("Current FCM Token:", newToken);
      // console.log("Saved Token: ", savedToken);

      if (fcmToken !== newToken) {
        let payload = JSON.stringify({
          email: email,
          fcmToken: newToken,
        });
        // console.log("Payload update fcm token: ", payload);

        const res = await updateFCMToken(payload);
        console.log('FCM update response:', res?.data);

        // Save only if API success
        if (res?.data?.success) {
          console.log("FCM is updating....");
          await AsyncStorage.setItem('fcmToken', newToken);
        }
      }
    } catch (error) {
      console.log('FCM token error:', error?.response?.message || error?.response?.data);
    }
  };

  const fetchCarousel = async () => {
    setLoadingCount(c => c + 1);
    try {
      let { data: res } = await GetCarousel();
      // console.log("Carousel: ", res?.data);
      setCarousel(res?.data);

      const popupList = res?.data?.popup || [];

      setGlobalState(prevState => ({
        ...prevState,
        liveVersion: res?.data?.appVersion?.androidCurrentVersion,
        walletNote: res?.data?.noteForWallet?.isVisible,
        noteMessage: res?.data?.noteForWallet?.message,
      }));

      const popupToShow = popupList.find(p => p.visibility === true);

      // const { pendingDeepLinkType } = globalState;
      // console.log("PenfdinffL: ", pendingDeepLinkType);
      const initialUrl = await Linking.getInitialURL();
      if (popupToShow && initialUrl == null) {
        setActivePopup(popupToShow);
      }
    } catch (error) {
      console.error("Error in fetching carousel: ", error?.response?.data || error?.response?.message);
    } finally {
      setLoadingCount(c => c - 1);
    }
  }


  const cardsFromApi = carousel?.cards || [];

  const offerCards = cardsFromApi.filter(card => {
    if (!card.enabled) return false;

    if (card.type === 'COUNTDOWN') {
      const endTimeMs =
        card?.endTime && !isNaN(new Date(card.endTime).getTime())
          ? new Date(card.endTime).getTime()
          : null;

      const isExpired = endTimeMs ? Date.now() >= endTimeMs : true;

      if (!isExpired) {
        return isValidUri(card.image);
      }

      return isValidUri(card.watchLiveStreamImage);
    }

    return isValidUri(card.image);
  });


  useEffect(() => {
    const checkDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      // console.log("Intial: ",initialUrl);

      if (initialUrl) {
        // 🚀 App opened from deep link
        return; // ❌ Don't show popup
      }

      // Normal app open
      // if (!hasShownHomePopup) {
      //   setPopUp(true);
      //   hasShownHomePopup = true;
      // }
    };

    checkDeepLink();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(iconTranslateX, {
            toValue: 8,          // move right
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(iconTranslateX, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(iconOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(iconOpacity, {
            toValue: 0.3,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const handleProperties = async () => {
    setLoadingCount(c => c + 1);
    try {
      let { data: res } = await PropertyDetails();
      // console.log("Data: ", res?.properties);
      if (res?.success) {
        setOffer(res?.offers)
        const filteredNumbers = res?.properties.filter(number => number.H_property == true);
        setRecommended(filteredNumbers);

        // setPriority(res?.priority);
        let priority = res?.priority;

        let Prop = res?.properties.filter(number => number.PropertyType == 'Domastic' || number.PropertyType == 'International-Villa');
        // console.log("Prop: ",Prop);
        Prop.sort((a, b) => (a.num > b.num ? 1 : -1));
        let PropLable = res?.properties.filter(number => number.PropertyType == 'Label');
        PropLable.sort((a, b) => (a.num > b.num ? 1 : -1));

        setGlobalState(prevState => ({
          ...prevState,
          AllProperty: res?.properties,
          ProDetails: Prop,
          prior: priority,
          LableProDetails: PropLable
        }));
        setProperties(Prop);
        const srilankaProperties = res?.properties.filter(
          item => item.country === 'International',
        );
        const indianProperties = res?.properties.filter(
          item => !item.country && item.PropertyType == 'Domastic',
        );
        indianProperties.sort((a, b) => (a.num > b.num ? 1 : -1));
        setSrilankaProp(srilankaProperties);
        setIndianProp(indianProperties);
        // setLoader(false);
      }
    } catch (error) {
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
    } finally {
      setLoadingCount(c => c - 1);
    }
  };

  const handlePopular = async () => {
    setLoadingCount(c => c + 1);
    try {
      let { data: res } = await PopularDestination();
      // console.log(res?.hotels[1]);

      if (res?.success) {
        setPopular(res?.hotels);

      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
        //setLoader(false);
      } else if (error?.request) {
        // console.log('property', `${JSON.stringify(error?.request)}`);
        // Alert.alert('Request error:', 'Please Check Your Internet Connection');
        //setLoader(false);
      } else {
        Alert.alert('Error:', `${error?.message}`);
        //setLoader(false);
      }
    } finally {
      setLoadingCount(c => c - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Start slide-out animation
      Animated.timing(animatedValue, {
        toValue: 1, // Slide up (or out)
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // After slide-out, update the placeholder and reset animation
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders?.length);
        animatedValue.setValue(0); // Reset animation to start slide-in
      });
    }, 2000); // Change every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [animatedValue]);

  const handleUserType = async (userType) => {
    if (userType) {
      // Add user to owners group
      await messaging().subscribeToTopic('owners');
    } else {
      // Remove user from owners group
      await messaging().unsubscribeFromTopic('owners');
    }
  };

  const handleProfle = async () => {
    const tokenid = await AsyncStorage.getItem('mytoken');
    // console.log("Token: ", tokenid);
    const emailId = await AsyncStorage.getItem('Email');
    if (!tokenid || !emailId) {
      setProfileLoaded(true);
      if (!profilePopupDecisionMade.current) {
        setShowCompleteProfilePopup(false);
        profilePopupDecisionMade.current = true;
      }
      return;
    }
    let payload = JSON.stringify({
      email: emailId,
    });
    try {
      let { data: res } = await ProfileDetails(payload, tokenid);
      getDeviceToken(res?.data?.fcmToken);
      if (res?.success) {
        const userType = res.data?.verification || res?.data?.ownedProperties?.length > 0; // owner or normal
        if (userType) {
          analytics().setUserProperty('user_type', 'owners');
        } else {
          analytics().setUserProperty('user_type', 'normal');
        }

        handleUserType(userType);

        setGlobalState(prevState => ({
          ...prevState,
          userName: res?.data?.userName,
          userEmail: emailId,
          userPhone: res?.data?.phoneNumber,
          token: tokenid,
          userDetails: res?.data,
          userProfile: res?.data?.profilePicture,
        }));

        if (!profilePopupDecisionMade.current) {
          const shouldShow = shouldRequireProfileCompletion(res?.data);
          setShowCompleteProfilePopup(shouldShow);
          profilePopupDecisionMade.current = true;
        }
        setProfileLoaded(true);
      } else {
        if (!profilePopupDecisionMade.current) {
          setShowCompleteProfilePopup(false);
          profilePopupDecisionMade.current = true;
        }
        setProfileLoaded(true);
      }
    } catch (error) {
      if (!profilePopupDecisionMade.current) {
        setShowCompleteProfilePopup(false);
        profilePopupDecisionMade.current = true;
      }
      setProfileLoaded(true);
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
    }
  };

  const FetchAllNotification = async () => {
    const emailId = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify(
      {
        email: emailId
      }
    );
    try {
      let { data: res } = await GetAllNotification(payload);
      // console.log(res?.data);
      setNotification(res?.data);
      // setNotification(res?.data);
    } catch (error) {
      console.error("Error in Fetching All Notification: ", error);
    }
  }

  // const unreadNotifications = notification.some(click => click.email === globalState?.userEmail);
  // console.log(unreadNotifications);
  const unreadNotifications = notification.some(
    item =>
      !item.buttonClicks.some(click => click.email === globalState?.userEmail),
  );

  const handleListedHotels = async () => {
    try {
      let { data: res } = await DreamscapeHotels();

      const cities = [
        ...new Set(res?.hotels?.map(hotel => hotel?.location?.city))
      ];
      // console.log("City name: ",cities);

      setGlobalState(prevState => ({
        ...prevState,
        location: cities,
        ourStays: res?.citySummary,
        HotelDetails: res?.hotels
      }))

      // setLocation(cities);
      setOurStays(res?.citySummary);
      // setHotelDetails(res?.hotels);
    } catch (error) {
      console.log("Errorin Listed Hotels: ", error);
    }
  };




  const { width } = Dimensions.get('window');
  const [menuAnimation] = useState(new Animated.Value(-width * 0.8)); // Initially hidden off-screen
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: -MENU_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
    });
  };

  const MENU_WIDTH = width * 0.8;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      isMenuOpen && Math.abs(gesture.dx) > Math.abs(gesture.dy),

    onPanResponderMove: (_, gesture) => {
      const translateX = Math.min(
        0,
        Math.max(gesture.dx, -MENU_WIDTH)
      );

      menuAnimation.setValue(translateX);
    },

    onPanResponderRelease: (_, gesture) => {
      const shouldClose =
        gesture.dx < -MENU_WIDTH / 3 || gesture.vx < -0.5;

      if (shouldClose) {
        closeMenu();
      } else {
        openMenu();
      }
    },
  });


  const handleLogOut = async () => {
    await AsyncStorage.setItem('mytoken', '');
    await AsyncStorage.setItem('Email', '');
    //navigation.push('LoginPage', { country: '+91', phone: '', email: '' });
    navigation.push('NewLogin');
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true; // prevent default behavior (going back)
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );


  const fetchLikedProperty = async () => {
    const emailId = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: emailId,
    });

    try {
      let { data: res } = await LikeData(payload);
      if (res?.success) {
        const likeProp = res?.properties?.map(item => item._id);
        // console.log("Likes: ",likeProp);
        setLikedProperty(likeProp);
      } else {
        console.log('Error in fetching liked property: ', res.message || res);
      }
    } catch (error) {
      console.error(
        'Error in Fetching Liked Hotels: ',
        error.response?.data || error.message,
      );
    }
  };

  const handleLike = async propId => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: propId,
    });
    try {
      let { data: res } = await Like(payload);
      if (res?.success) {
        //   console.log('Response: ', res);
      } else {
        console.log('Failed to handle like: ', res.message || res);
      }
    } catch (error) {
      console.error(
        'Error in Liking Property: ',
        error.response?.data || error.message,
      );
    }
  };

  const handleRemoveLike = async propId => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: propId,
    });
    try {
      let { data: res } = await DisLike(payload);
      if (res?.success) {
        // console.log('Response: ', res);
      } else {
        console.log('Failed to remove like: ', res.message || res);
      }
    } catch (error) {
      console.error(
        'Error in Removing Liked Prop: ',
        error.response?.data || error.message,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      // handleProfle();
      FetchAllNotification();
      fetchLikedProperty();

      return () => {
        setPlayStates(prev => prev?.map(() => false));
        videoRefs.current.forEach(ref => {
          if (ref) {
            ref.pause && ref.pause();
          }
        });
      };
    }, [])
  );

  useEffect(() => {
    if (!isFocused)
      return;

    if (!profileLoaded)
      return;

    if (showCompleteProfilePopup && !profilePopupDismissed) {
      setPopUp(false);
      return;
    }

    if (
      activePopup &&
      !hasShownHomePopup &&
      (!showCompleteProfilePopup || profilePopupDismissed)
    ) {
      setPopUp(true);
      hasShownHomePopup = true;
    }
  }, [
    profileLoaded,
    activePopup,
    showCompleteProfilePopup,
    profilePopupDismissed,
    isFocused
  ]);
  const videoLayouts = useRef([]);
  const handleVerticalScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const windowHeight = event.nativeEvent.layoutMeasurement.height;

    videoLayouts.current.forEach((layout, index) => {
      if (!layout) return;

      const isVisible =
        layout.y + layout.height > scrollY &&
        layout.y < scrollY + windowHeight;

      if (!isVisible && playStates[index]) {
        const updatedPlayStates = [...playStates];
        updatedPlayStates[index] = false;
        setPlayStates(updatedPlayStates);
      }
    });
  };

  const scaleAnimation = useRef({}).current;
  const toggleLikes = (item) => {
    setLike((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
  };

  const triggerScaleAnimation = itemName => {
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
  };

  const testimonials = [
    {
      name: 'Abdul Basith',
      video:
        'https://duixj37yn5405.cloudfront.net/hls-videos/testimonial2/720p/index.m3u8',
      image:
        'https://duixj37yn5405.cloudfront.net/appImages/testimonial1.png',
      transcript: [
        {
          start: 0.0,
          end: 11.0,
          text: "Hi, this is Abdul Basit and that's my wife  Bushra Khan. Yeah, so I've invested in a Fracspace in the Goa property.",
        },
        {
          start: 12.0,
          end: 23.0,
          text: 'This idea like actually came across in a reality expo and since then You know, it has been quite exciting and interesting to know about this opportunity.',
        },
        {
          start: 26.0,
          end: 34.0,
          text: 'Talking about investment point of view, I see a good value proposition and at the same time what makes a difference is that the company culture,',
        },
        {
          start: 35.0,
          end: 43.0,
          text: 'The people in this whole startup and I feel the staff has been really supportive and have been very patient in giving good information.',
        },
        // { start: 45.0, end: 56.0, text: 'The details of the investment etc. And for me personally I think the returns are something far more exciting and that\'s the reason why I chose this.' },
        // { start: 57.0, end: 66.0, text: 'Besides this I think it\'s a good way to diversify your investment and so far it is going all well.' },
        // { start: 56.0, end: 77.0, text: 'And in the near future, I also aim to scale up my investment once I have a little more experience of going through this journey.' },
        // { start: 78.0, end: 88.0, text: 'I think FracSpace is doing quite a fantastic job here. And I feel, you know, grateful that I came across this opportunity.' },
        // { start: 90.0, end: 102.0, text: 'Besides this, yes, it is just the beginning I would say and looking forward to their success, where eventually my success would lie in theirs. So yeah, thank you so much.' },
      ],
    },
    {
      name: 'Srinivas',
      video:
        'https://duixj37yn5405.cloudfront.net/hls-videos/2417b25a-897f-4c20-b42e-8b2a42d5ace3/720p/index.m3u8',
      image:
        'https://duixj37yn5405.cloudfront.net/appImages/testimonial2.png',
      transcript: [
        {
          start: 0.0,
          end: 7.0,
          text: 'Hi, my name is Srinivas I am from Indusind Bank. I got to know about this Fracspace through an expo.',
        },
        // { start: 4.0, end: 6.0, text: ' ' },
        {
          start: 8.0,
          end: 15.0,
          text: 'I interested in  becoming a  part of this. Looks very interesting, the team is very good.',
        },
        {
          start: 15.0,
          end: 22.0,
          text: 'And  like the concept When you get an opportunity to invest a small amount and get ownership',
        },
        {
          start: 22.0,
          end: 27.0,
          text: 'with a good return I showed this thing, nothing like it so I went for it.',
        },
        {
          start: 27.0,
          end: 29.0,
          text: "I request all of you to consider it. It's a good option.",
        },
        // {
        //   start: 30.0,
        //   end: 33.0,
        //   text: 'I find it interesting and getting to know a lot of people coming into this community. I am enjoying it a lot. Thanks.',
        // },
      ],
    },
    {
      name: 'Prashanth & Nikita',
      video:
        'https://duixj37yn5405.cloudfront.net/hls-videos/9677ef67-836b-491f-82b6-9912f837f1c3/720p/index.m3u8',
      image:
        'https://duixj37yn5405.cloudfront.net/appImages/testimonial3.png',
      transcript: [
        {
          start: 0.0,
          end: 5.0,
          text: "Hi, I'm Prashant and this is Nikita.We're both software engineers.",
        },
        // { start: 3.0, end: 4.0, text: '' },
        {
          start: 6.0,
          end: 13.0,
          text: 'We like the idea of fractional ownership.We thought this was a good entry point.',
        },
        {
          start: 14.0,
          end: 21.0,
          text: 'We found fracspace and then we found that the business model interesting and then the transparency.',
        },
        {
          start: 21.0,
          end: 24.0,
          text: 'We asked them a lot of questions and they answered it very well. ',
        },
        {
          start: 25.0,
          end: 29.0,
          text: 'We just started with one property investment.',
        },
        {
          start: 30.0,
          end: 35.0,
          text: "Yeah, we're enjoying it so far and then we\re looking to do more business with them.",
        },
      ],
    },
  ];
  const [playStates, setPlayStates] = useState(testimonials?.map(() => false));
  const [currentTimes, setCurrentTimes] = useState(testimonials?.map(() => 0));
  const [durations, setDurations] = useState(testimonials?.map(() => 0));
  const transcriptScrollRefs = useRef([]);
  const videoRefs = useRef([]);
  const [videoEnded, setVideoEnded] = useState(testimonials?.map(() => false));
  const [showThumbnails, setShowThumbnails] = useState(
    testimonials?.map(() => true),
  );
  const cardWidth = 250;
  const wireHeight = 100;

  const Wire = ({ cardCount, segmentWidth = 400, height = 70 }) => {
    const wavePath = generateWavePath(cardCount, segmentWidth);

    return (
      <Svg
        width={cardCount * segmentWidth}
        height={height}
        style={{ position: 'absolute', top: 20, left: 0 }}>
        <Path d={wavePath} stroke="#999" strokeWidth={1} fill="none" />
      </Svg>
    );
  };

  const generateWavePath = (
    cardCount,
    segmentWidth,
    amplitude = 30,
    midline = 30,
  ) => {
    let path = `M0,${midline}`;
    for (let i = 0; i < cardCount; i++) {
      const startX = i * segmentWidth;
      const cp1X = startX + segmentWidth * 0.25;
      const cp2X = startX + segmentWidth * 0.75;
      const endX = startX + segmentWidth;

      path += ` C${cp1X},${midline - amplitude} ${cp2X},${midline + amplitude
        } ${endX},${midline}`;
    }
    return path;
  };

  const togglePlay = (index) => {
    const updatedPlayStates = [...playStates];
    updatedPlayStates[index] = !playStates[index];
    setPlayStates(updatedPlayStates);

    if (showThumbnails[index]) {
      const updatedThumbnails = [...showThumbnails];
      updatedThumbnails[index] = false;
      setShowThumbnails(updatedThumbnails);
    }

    if (videoEnded[index]) {
      videoRefs.current[index]?.seek(0);
      const updatedEnded = [...videoEnded];
      updatedEnded[index] = false;
      setVideoEnded(updatedEnded);
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  const SafeImage = ({ source, fallback, ...props }) => {
    // If require('image.png')
    if (typeof source === 'number') {
      return <Image {...props} source={source} />;
    }

    const uri = source?.uri;

    const isValidUri =
      uri && typeof uri === 'string' && uri.trim() !== '';

    return (
      <Image
        {...props}
        source={
          isValidUri
            ? { uri }
            // : fallback || require('./assets/placeholder.png')
            : fallback || require('../assets/placeholder.png')
        }
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}>

        {/* <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}> */}
        <StatusBar
          barStyle="light-content"
          backgroundColor="#021265"
          translucent={false}
        />
        <ScrollView style={{ backgroundColor: '#FFFFFF' }}
          onScroll={handleVerticalScroll} scrollEventThrottle={16}>
          <View style={{ backgroundColor: "#021265", width: '100%', paddingHorizontal: 15, paddingTop: 0, paddingBottom: 10, marginBottom: 0 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <TouchableOpacity style={{ paddingTop: 8 }} onPress={() => {
                  //  navigation.navigate('Home', { details: Properties });
                  openMenu();

                }}>
                  <IconF name="bars-staggered" size={22} color={'#FFFFFF'} />
                </TouchableOpacity>
                <Image
                  style={{ width: 100, height: 60, marginLeft: 15 }}
                  resizeMode='contain'
                  source={require('./assets/Fslogoapp.png')}
                />
                {/* <FastImage
                style={styles.image1}
                source={require('./assets/logovideo.gif')} // Use require for local gif image
                resizeMode={FastImage.resizeMode.contain}
              /> */}

              </View>
              <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate('NotificationsScreen')
                }}>
                  {/* <Ico name={'bell'} size={22} color={'#FFFFFF'} /> */}
                  <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/notification-01.png' }} style={{ width: 22, height: 22 }} />
                  {unreadNotifications &&
                    <View style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: '#FF0000', position: 'absolute', top: 0, right: 0 }}></View>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  navigation.navigate('Like');
                }}>
                  <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/favourite.png' }} style={{ width: 22, height: 22 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('WalletAmount');

                  }}
                  style={{}}>
                  {/* <Icon name={'wallet-outline'} size={25} color={'#FFFFFF'} /> */}
                  <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/wallet-03.png' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </View>

            </View>
          </View>


          <View style={{ height: 215 }}>
            {offerCards?.length > 0 && (
              <CustomSwiper
                data={offerCards}
                height={210}
                // autoplay={true}
                autoplay={carousel?.autoPlay}
              />

            )}
          </View>

          {/* <TouchableOpacity onPress={() => {
          // navigation.navigate('Test');
          testCrash();
        }} style={{padding:20}}>
          <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#000'}}>Test</Text>
        </TouchableOpacity> */}


          <View style={{ backgroundColor: '#EBE9F6', paddingVertical: 12, }}>
            <Text style={styles.mostCommonFaqsTypo}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ gap: 10, paddingHorizontal: 20 }}>
              {carousel?.category?.map((item, index) => (
                <TouchableOpacity onPress={() => {
                  if (item?.heading === 'Co-Own') {
                    navigation.navigate(item?.androidNavigation, { details: Properties });
                  } else {
                    navigation.navigate(item?.androidNavigation)
                  }
                }} key={index} style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 6, width: 135, marginRight: 20, elevation: 5, marginVertical: 10 }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#021265' }}>{item?.heading}</Text>
                  <View style={{ width: 60, marginTop: 5 }}>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 11, color: '#000' }}>{item?.subHeading}</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: 0, right: 5 }}>
                    <Image resizeMode='cover' source={{ uri: item?.image }} style={{ width: 60, height: 60 }} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity onPress={() => {
            navigation.navigate('MembershipHome');
          }} style={{ paddingTop: 20, paddingHorizontal: 20 }}>
            <SafeImage resizeMode='cover' source={{ uri: carousel?.altairaUrl }} style={{ width: '100%', height: 100, borderRadius: 10 }} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[styles.mostCommonFaqsTypo, { paddingVertical: 15, marginTop: 5 }]}>
              Available Properties
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home', { details: Properties });
              }}>
              <Text style={[styles.viewTypo11, { paddingVertical: 15, marginTop: 5, paddingRight: 20 }]}>View More</Text>
            </TouchableOpacity>
          </View>

          {/* {selectCountry == 'India' && ( */}
          <ScrollView
            horizontal={true}
            style={{ paddingHorizontal: 20 }}
            showsHorizontalScrollIndicator={false}>
            {Properties
              .filter(item => item.AvailableFractions > 0)
              .sort((a, b) => (a.num > b.num ? 1 : -1))
              ?.map((item, index) => {
                const itemName = item?.name;
                const propId = item?._id;
                const isLiked = likedProperty.includes(propId);
                if (!scaleAnimation[itemName]) {
                  scaleAnimation[itemName] = new Animated.Value(1);
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Property', { details: item, nav: 'HomePage', Id: item?._id });
                    }}
                    key={index}
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#00000014', borderWidth: 1, padding: 10, borderRadius: 10, elevation: 5, width: width * 0.65, marginRight: 20, marginBottom: 5 }}
                  >
                    <Image
                      resizeMode="cover"
                      source={{ uri: item?.image?.Image1 }}
                      style={{ width: '100%', height: 150 }}
                    />
                    <View style={{ position: 'absolute', top: 15, left: 15 }}>
                      <View>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: '#FFFFFF', }}>
                          {item?.city}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000000', }}>
                            {item?.name}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            triggerScaleAnimation(itemName);
                            toggleLikes(itemName);
                            if (isLiked) {
                              handleRemoveLike(propId);
                              setLikedProperty(prev =>
                                prev.filter(id => id !== propId),
                              );
                            } else {
                              handleLike(propId);
                              setLikedProperty(prev => [...prev, propId]);
                              //  runLikeAnimation(item?.image?.Image1);
                              //  bottomTabRef.current?.animateToLikedTab();
                            }
                          }}
                          style={{}}>
                          <LinearGradient
                            colors={isLiked ? ['#FFFFFF', '#FFFFFF'] : ['#FFFFFF', '#FFFFFF']}
                            style={{ width: 35, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 5, backgroundColor: '#FFFFFF', }}
                          >
                            <Animated.View
                              style={{
                                transform: [{ scale: scaleAnimation[itemName] }],
                              }}>
                              {isLiked ? (
                                <Icon name={'heart'} size={20} color="#ED1C24" />
                              ) : (
                                <Icon name={'heart-outline'} size={20} color="#ED1C24" />
                              )}
                            </Animated.View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099', }}>
                          Total Frac Value:{' '}
                        </Text>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000000', marginLeft: 5, }}>
                          ₹ {item?.Price}
                        </Text>
                      </View>
                      {item?.name !== 'ALTAIRA – VILLA' &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, }}>
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099', }}>
                            Frac Value:{' '}
                          </Text>

                          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000000', marginLeft: 5, }}>
                            ₹ {item?.FC_Price}
                          </Text>

                        </View>
                      }
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099', }}>
                          Available Frac:{' '}
                        </Text>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000000', marginLeft: 5, }}>
                          {item?.AvailableFractions}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                          <Image
                            source={{
                              uri: 'https://duixj37yn5405.cloudfront.net/appImages/square.png',
                            }}
                            style={{ width: 15, height: 15 }}
                          />
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 9, color: '#181D27', marginLeft: 10, }}>
                            {item?.area}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                          <Image
                            source={{
                              uri: 'https://duixj37yn5405.cloudfront.net/appImages/building.png',
                            }}
                            style={{ width: 15, height: 15 }}
                          />
                          <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 9, color: '#181D27', marginLeft: 7, }}>
                            {item?.P_Type}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
          {/* )} */}


          <View style={{ backgroundColor: '#FAFAFF', paddingBottom: 15 }}>
            <View style={{ paddingTop: 20, paddingBottom: 15, }}>
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000', paddingHorizontal: 15, }}>Postcards</Text>
            </View>


            <View style={{ paddingLeft: 20, }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Blogs', { Blogfor: 'SouthIndia' });
                }} style={{ marginRight: 20 }}>
                  <Image resizeMode='cover' source={{ uri: 'https://duixj37yn5405.cloudfront.net/Postcard+Images/PostCard3.png' }} style={{ width: width * 0.85, height: height * 0.36, borderRadius: 15 }} />

                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  navigation.navigate('Blogs', { Blogfor: 'VaranasiBlog' });
                }} style={{ marginRight: 20 }}>
                  <Image resizeMode='cover' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/varanashiPosterImage.jpeg' }} style={{ width: width * 0.85, height: height * 0.36, borderRadius: 15 }} />

                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  navigation.navigate('Blogs', { Blogfor: 'SrilankaBlog' });
                }} style={{ marginRight: 20 }}>
                  <Image resizeMode='cover' source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/srilankaPosterImage.jpeg' }} style={{ width: width * 0.85, height: height * 0.36, borderRadius: 15 }} />

                </TouchableOpacity>

              </ScrollView>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, marginTop: 5, alignItems: 'center' }}>
            <Text style={styles.mostCommonFaqsTypo}>
              Wherever you go, we've a stay
            </Text>
            <View style={{ marginRight: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#081F62' }}>
              {/* <Text style={styles.viewTypo11}>VIEW ALL</Text> */}
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              {ourStays
                ?.filter(item => item.isVisible)
                ?.map((item, index) => (
                  <TouchableOpacity
                    key={item.city}
                    onPress={() => {
                      navigation.navigate('Ourstay', { location: item?.city });
                    }}
                    style={{ marginLeft: 20, alignItems: 'center' }}>
                    <Image resizeMode='contain' source={{ uri: item?.locationImage }} style={{ width: 90, height: 90, }} />
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#000000', marginTop: 5, textAlign: 'center' }}>{item?.city}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>

          <View style={{ paddingTop: 30 }}>
            <Text
              style={styles.mostCommonFaqsTypo}>
              Testimonials
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'column', paddingBottom: 50 }}>
                {/* Wire */}
                <Wire
                  cardCount={3}
                  width={testimonials?.length * (cardWidth + 200)}
                  height={wireHeight}
                />

                {/* Cards with clips */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 70,
                    paddingHorizontal: 20,
                  }}>
                  {testimonials?.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        width: 230,
                        marginRight: 100,
                        alignItems: 'center',
                      }}
                      onLayout={event => {
                        const { y, height } = event.nativeEvent.layout;
                        videoLayouts.current[index] = { y, height };
                      }}
                    >
                      {/* Clip */}
                      <Image
                        source={{
                          uri: 'https://duixj37yn5405.cloudfront.net/appImages/clip.png',
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          position: 'absolute',
                          top: -40,
                          zIndex: 2,
                          right: index % 2 === 0 ? 15 : undefined,
                          left: index % 2 !== 0 ? 5 : undefined,
                        }}
                      />


                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#0000001A',
                          backgroundColor: '#E6E6E670',
                          width: '100%',
                          padding: 10,
                          height: 300,
                          transform: [
                            { rotate: index % 2 === 0 ? '-10deg' : '10deg' },
                          ],
                        }}>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => togglePlay(index)}>
                          <Video
                            ref={ref => (videoRefs.current[index] = ref)}
                            source={{ uri: item?.video }}
                            style={{ width: '100%', height: 150, marginBottom: 8 }}
                            resizeMode="cover"
                            // paused={!playStates[index]}
                            paused={!playStates[index]}
                            onEnd={() => {
                              const updatedPlayStates = [...playStates];
                              updatedPlayStates[index] = false;
                              setPlayStates(updatedPlayStates);

                              const updatedEnded = [...videoEnded];
                              updatedEnded[index] = true;
                              setVideoEnded(updatedEnded);
                            }}
                            onProgress={({ currentTime }) => {
                              const updatedTimes = [...currentTimes];
                              updatedTimes[index] = currentTime;
                              setCurrentTimes(updatedTimes);

                              const activeLineIndex = item.transcript.findIndex(
                                line =>
                                  currentTime >= line.start &&
                                  currentTime <= line.end,
                              );
                              if (
                                activeLineIndex !== -1 &&
                                transcriptScrollRefs.current[index]
                              ) {
                                transcriptScrollRefs.current[index].scrollTo({
                                  y: activeLineIndex * 32,
                                  animated: true,
                                });
                              }
                            }}
                            onLoad={({ duration }) => {
                              const updatedDurations = [...durations];
                              updatedDurations[index] = duration;
                              setDurations(updatedDurations);
                            }}
                          />

                          {showThumbnails[index] && (
                            <View style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                              <Image
                                source={{ uri: item.image }}
                                style={{ width: '100%', height: '100%', resizeMode: 'cover', }}
                              />

                              {/* Play button overlay */}
                              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', }}>
                                <View style={{ width: 35, height: 35, borderRadius: 25, backgroundColor: '#d9d9d97a', alignItems: 'center', justifyContent: 'center', }}>
                                  <IconF name="play" size={22} color="#000" />
                                </View>
                              </View>
                            </View>

                          )}
                        </TouchableOpacity>

                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000', marginBottom: 8, }}> {item.name}</Text>


                        <ScrollView
                          ref={ref => (transcriptScrollRefs.current[index] = ref)}
                          style={{ maxHeight: 150 }}
                          showsVerticalScrollIndicator={false}>
                          {item.transcript?.map((line, idx) => {
                            const isActive =
                              currentTimes[index] >= line.start &&
                              currentTimes[index] <= line.end;
                            return (
                              <Text
                                key={idx}
                                style={{
                                  fontFamily: 'Montserrat-Medium',
                                  fontSize: 12,
                                  color: isActive ? '#1A73E8' : '#0000007A',
                                  fontWeight: isActive ? 'bold' : 'normal',
                                  lineHeight: 18,
                                }}>
                                {line.text}
                              </Text>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>



          {/* </ScrollView> */}


          <Text
            style={[styles.mostCommonFaqsTypo, { paddingTop: 10 }]}>
            In the Media
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 100 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>

              <Image
                style={{ width: 120, height: 80 }}
                resizeMode="contain"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/news2.jpeg',
                }}
              //source={require('./assets/Rectangle3.png')}
              />
              <Image
                style={{ width: 120, height: 80 }}
                resizeMode="contain"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/news1.jpeg',
                }}
              //source={require('./assets/Rectangle3.png')}
              />
              <Image
                style={{ width: 120, height: 80 }}
                resizeMode="contain"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/news3.jpeg',
                }}
              //source={require('./assets/Rectangle3.png')}
              />
              <Image
                style={{ width: 120, height: 80 }}
                resizeMode="contain"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/news4.jpeg',
                }}
              //source={require('./assets/Rectangle3.png')}
              />
            </View>
          </ScrollView>


          <CompleteProfilePopup
            visible={isFocused && showCompleteProfilePopup && !profilePopupDismissed}
            onLater={() => {
              setProfilePopupDismissed(true);
              setShowCompleteProfilePopup(false);
            }}
            onUpdateNow={() => {
              setPopUp(false);
              setShowCompleteProfilePopup(false);
              navigation.navigate('CompleteProfileScreen');
            }}
          />

          {/* {popUp && */}
          <Modal visible={isFocused && popUp && !showCompleteProfilePopup} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: '#000000b3' }}>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setPopUp(false)}
              />

              <View style={{ width: '100%', height: height * 0.53, position: 'absolute', bottom: 0 }}>

                {/* Close button */}
                <View style={{ position: 'absolute', top: -40, alignSelf: 'center', zIndex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setPopUp(false)}
                    style={{ backgroundColor: '#0000005c', borderRadius: 20, padding: 5 }}
                  >
                    <Iconn name={'x'} size={25} color={'#fff'} />
                  </TouchableOpacity>
                </View>

                {/* Popup Image */}
                {activePopup?.image !== "" && (
                  <TouchableOpacity
                    onPress={() => {
                      setPopUp(false);

                      if (activePopup?.navigation && activePopup?.navigationLink) {
                        navigation.navigate(activePopup.navigationLink);
                      }
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      source={{ uri: activePopup?.image }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </TouchableOpacity>
                )}

                {/* Button */}
                {activePopup?.buttonVisibility &&
                  <TouchableOpacity
                    onPress={() => {
                      setPopUp(false);

                      if (activePopup?.navigation && activePopup?.navigationLink) {
                        navigation.navigate(activePopup.navigationLink);
                      }
                    }}
                    style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}
                  >

                    <LinearGradient colors={activePopup?.buttonColor || ['#FAD059', '#FFE7A2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ borderRadius: 50, padding: 12, paddingHorizontal: 50 }}
                    >
                      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: activePopup?.buttonTextColor || '#000' }}>{activePopup?.buttonText || "Learn More"}</Text>
                    </LinearGradient>

                  </TouchableOpacity>
                }

              </View>
            </View>
          </Modal>

          {/* } */}

        </ScrollView>
        {/* <Footer navigation={navigation} activeFooterTab={'HomePage'} /> */}


        {/* </SafeAreaView> */}


      </Animated.ScrollView>
      {carousel?.edgeTab &&
        <EdgeFab scrollY={scrollY} />
      }



      {/* ------------------------- Slide Menu ------------------------------ */}

      {isMenuOpen && (
        <Pressable
          onPress={closeMenu}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
        />
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            transform: [{ translateX: menuAnimation }],
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: MENU_WIDTH,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingBottom: insets.bottom,
            zIndex: 1000,
            elevation: 10,

            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
        ]}
      >
        <ScrollView
          style={{ backgroundColor: '#FFFFFF', top: 50 }}
          contentContainerStyle={{
            paddingBottom: 90 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginHorizontal: 10, borderRadius: 10, backgroundColor: '#021265E5', paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flexDirection: 'row', flex: 2 }}>
              <View>
                <Image resizeMode='cover' source={globalState?.userProfile ? { uri: globalState?.userProfile } : require('../assets/NewProfileImage.jpg')} style={{ width: 45, height: 45, borderRadius: 45, borderWidth: 1, borderColor: '#FFFFFF' }} />
              </View>
              <View style={{
                flexDirection: 'column',
                justifyContent: 'center', marginLeft: 10
              }}>
                <Text style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 14,
                  color: '#FFFFFF'
                }}>Hello {globalState?.userName}!</Text>
                <Text style={{
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 12, color: '#FFFFFF', marginTop: 5
                }}>{globalState?.userEmail}</Text>

              </View>
            </View>
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingRight: 20 }}>
              {/* <IconI name={'right'} color={'#FFFFFF'} size={15} /> */}
            </View>
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <View style={{ marginVertical: 10, }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#1A1A1A' }}>Explore</Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate('Home', { details: Properties });
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row', }}>
                {/* <Icoon name={'building-o'} size={20} color={'#000000'}/> */}
                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/image4.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Co-own</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => {
              setGlobalState(prevState => ({
                ...prevState,
                userEvent: 'Interiors'
              }));
              navigation.navigate('InteriorForm');
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/image8.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Interiors</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => {
              navigation.navigate('DreamscapeHome');
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/image10.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Stays</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <View style={{ marginVertical: 20 }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#1A1A1A' }}>Support</Text>
            </View>

            <TouchableOpacity onPress={() => {
              navigation.navigate('MyProfile', { screen: 'home' });
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Iconn name={'headphones'} size={20} color={'#222222'} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Helpline</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate('TermsAndCondition');
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Iconn name={'info'} size={20} color={'#222222'} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Terms & Policies</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate('Privacy');
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name={'shield-checkmark-outline'} size={20} color={'#222222'} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Privacy Policy</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              navigation.navigate('Aboutus');
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Iconn name={'info'} size={20} color={'#222222'} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>About</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              handleLogOut();
            }} style={{ flexDirection: 'row', marginVertical: 20 }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name={'log-out-outline'} size={20} color={'#F01212'} style={{ transform: [{ rotate: '180deg' }] }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  input: {
    borderColor: '#1A1A1A',
    borderWidth: 1,
    borderRadius: 8,
    fontFamily: 'Barlow-Medium',
    fontSize: 16,

  },

  mostCommonFaqsTypo: {
    fontFamily: 'WorkSans-SemiBold',
    color: "#000",
    textAlign: 'left',
    letterSpacing: 0,
    fontSize: 20,
    marginHorizontal: 15,
    // marginBottom: 15
    //position: "absolute",
  },
  viewTypo1: {
    color: "#000000",
    fontFamily: 'Montserrat-Medium',
    textAlign: "center",
    letterSpacing: 0,
    fontSize: 14,
    paddingVertical: 15

  },
  viewTypo11: {
    color: "#386BF6",
    fontFamily: 'WorkSans-Medium',
    // textAlign: "center",
    fontSize: 12,

  },


  groupChild22: {
    borderRadius: 12,
    borderColor: "#e7e7e7",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: '#ffffff',
    // padding:20,
    paddingVertical: 10,
    width: '100%',
    // flex: 1

  },
  groupChild23: {
    //  top: 175,
    left: 121,
    // alignItems:'center',
    width: 142,
    height: 18,
    //position: "absolute",
    overflow: "hidden",
  },
  airportTypo: {
    color: '#2b2b2b',
    fontSize: 11,
    fontFamily: 'Montserrat-Medium',
    textAlign: "center",
    // fontWeight: "500",
    //paddingVertical: 10
  },
  image: {
    width: '100%',
    height: 220,
    // flex: 1,
    borderRadius: 15,
    // borderWidth:20

  },
  image1: {
    width: 100,
    height: 60,
  },


  wrapper: {},
  container: {
    flex: 1,

  },

  maskGroupIconLayout1: {
    // width: '100%',
    //height: 90,
    // marginLeft:20
  },


  videoContainer: {
    position: 'absolute',
    bottom: 10,
    // right: 10,
    left: 10,
    width: width * 0.44,
    height: height * 0.37,
    //width: 180,
    //height:290,
    overflow: 'hidden',
    borderRadius: 10,

  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
  backgroundVideo2: {
    width: 130,
    height: 60,
  },
  logo: {
    width: '20%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  countdownCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    // bottom: 20,
    // left: 20,
    alignItems: 'center', justifyContent: 'center', top: 40, left: 38
  },
  offerTitle: {
    color: '#FFF',
    fontSize: 18,
    // fontWeight: '700',
    marginBottom: 0,
    fontFamily: 'Poppins-SemiBold',
  },
  timerText: {
    color: '#000',
    fontSize: 22,
    fontWeight: '800',
  },
  dot: {
    backgroundColor: '#D9D9D9',
    width: 8,
    height: 8,
    borderRadius: 8,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#043862',
    width: 8,
    height: 8,
    borderRadius: 8,
    margin: 3,
  },

});

