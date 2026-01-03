let hasShownHomePopup = false; // ✅ module-level (shared for app session)

import { View, Text, ScrollView, Image, StyleSheet, Animated, Easing, TouchableOpacity, Linking, Dimensions, Alert, ImageBackground, StatusBar, BackHandler, Modal, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome6';
import IconI from 'react-native-vector-icons/AntDesign';
import Iconn from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Fontisto';
import Icoo from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { CallRecord, DisLike, GetAllNotification, Like, LikeData, PopularDestination, ProfileDetails, PropertyDetails } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
const { width, height } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
// import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video, { VideoRef } from 'react-native-video';
import Svg, { Path } from 'react-native-svg';
import Footer from '../Footer';

export default function HomePage() {

  const { globalState, setGlobalState } = useContext(AppContext);
  const [notification, setNotification] = useState([]);
  const navigation = useNavigation();
  const placeholders = [
    "Hyderabad",
    "Goa",
    "Delhi",
    "Banglore",
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
  const [popUp, setPopUp] = useState(false);

  const iconTranslateX = useRef(new Animated.Value(0)).current;
const iconOpacity = useRef(new Animated.Value(0.3)).current;


  useEffect(() => {
    if (!hasShownHomePopup) {
      setPopUp(true);
      hasShownHomePopup = true;
    }
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



  const handleCallRecord = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      ContactNumberOfFs: "+919880626111",
      enquiryAbout: "Home Page call"
    });


    try {
      let { data: res } = await CallRecord(payload);
      if (res?.success) {
        handleCallNow();
      }
    } catch (error) {
      if (error?.response) {
        // Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
        // Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
      } else {
        // Alert.alert('Error:', `${error}`);
      }
    }
  };

  const handleCallNow = () => {

    const phoneNumber = '+919880626111';
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Phone number is not supported');
        }
      })
      .catch(error => console.log('Error making phone call:', error));
  };

  const handleRating = () => {

    const appStoreUrl = 'https://play.google.com/store/apps/details?id=com.fracspace';
    Linking.openURL(appStoreUrl).catch(error => console.error('Error opening Play Store', error));
  };



  const handleProperties = async () => {
    try {
      let { data: res } = await PropertyDetails();
      if (res?.success) {
        setOffer(res?.offers)
        const filteredNumbers = res?.properties.filter(number => number.H_property == true);
        setRecommended(filteredNumbers);

        let Prop = res?.properties.filter(number => number.PropertyType == 'Domastic');
        Prop.sort((a, b) => (a.num > b.num ? 1 : -1));
        let PropLable = res?.properties.filter(number => number.PropertyType == 'Label');
        PropLable.sort((a, b) => (a.num > b.num ? 1 : -1));

        setGlobalState(prevState => ({
          ...prevState,
          ProDetails: Prop,
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
    }
  };

  const handlePopular = async () => {
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
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        animatedValue.setValue(0); // Reset animation to start slide-in
      });
    }, 2000); // Change every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [animatedValue]);

  const handleProfle = async () => {
    const tokenid = await AsyncStorage.getItem('mytoken');
    const emailId = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: emailId,
    });

    try {
      let { data: res } = await ProfileDetails(payload, tokenid);
      //console.log(res);


      if (res?.success) {
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
          navigation.navigate('LoginPage');
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
    let payload = JSON.stringify(
      {
        email: globalState?.userEmail
      }
    );
    try {
      let { data: res } = await GetAllNotification(payload);
      // console.log(res?.data[0]?.buttonClicks);
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







  useEffect(() => {
    handleProfle()
    handleProperties();
    handlePopular();
    closeMenu();
    FetchAllNotification();


  }, []);

  const { width } = Dimensions.get('window');
  const [menuAnimation] = useState(new Animated.Value(-width * 0.8)); // Initially hidden off-screen

  const openMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: -width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

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
        const likeProp = res?.properties.map(item => item._id);
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
      fetchLikedProperty();

      return () => {
        setPlayStates(prev => prev.map(() => false));
        videoRefs.current.forEach(ref => {
          if (ref) {
            ref.pause && ref.pause();
          }
        });
      };
    }, [])
  );
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
        'https://fracspace-properties.s3.ap-south-1.amazonaws.com/fracspace_properties_images/testimonials/testimonial2.mp4',
      image:
        'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/testimonial1.png',
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
        'https://fracspace-properties.s3.ap-south-1.amazonaws.com/fracspace_properties_images/testimonials/testimonial3.mp4',
      image:
        'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/testimonial2.png',
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
        {
          start: 30.0,
          end: 37.0,
          text: 'I find it interesting and getting to know a lot of people coming into this community. I am enjoying it a lot. Thanks.',
        },
      ],
    },
    {
      name: 'Prashanth & Nikita',
      video:
        'https://fracspace-properties.s3.ap-south-1.amazonaws.com/fracspace_properties_images/testimonials/testimonial1.mp4',
      image:
        'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/testimonial3.png',
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
  const [playStates, setPlayStates] = useState(testimonials.map(() => false));
  const [currentTimes, setCurrentTimes] = useState(testimonials.map(() => 0));
  const [durations, setDurations] = useState(testimonials.map(() => 0));
  const transcriptScrollRefs = useRef([]);
  const videoRefs = useRef([]);
  const [videoEnded, setVideoEnded] = useState(testimonials.map(() => false));
  const [showThumbnails, setShowThumbnails] = useState(
    testimonials.map(() => true),
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






  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#021265"
        translucent={false}
      />
      <ScrollView style={{ backgroundColor: '#FFFFFF', }}
        onScroll={handleVerticalScroll} scrollEventThrottle={16}>
        <View style={{ backgroundColor: "#021265", width: '100%', paddingHorizontal: 15, paddingTop: 20, paddingBottom: 10, marginBottom: 20 }}>
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
            <View style={{ flexDirection: 'row', width: '35%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('NotificationsScreen')
              }}>
                <Ico name={'bell'} size={22} color={'#FFFFFF'} />
                {unreadNotifications &&
                  <View style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: '#FF0000', position: 'absolute', top: 0, right: 0 }}></View>
                }
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {
                navigation.navigate('Chat');

              }} style={{ alignItems: 'flex-end', width: '100%', flex: 1, }}>
                <Icon name="chatbubbles-outline" size={23} color={'#FFFFFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FeedbackForm');
                }}
                style={{ alignItems: 'flex-end', width: '100%', flex: 1 }}>
                <Image
                  style={{ width: 22, height: 22 }}
                  resizeMode="cover"
                  source={{
                    uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/message.png',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('WalletAmount');

                }}
                style={{ alignItems: 'flex-end', width: '100%', flex: 1 }}>
                <Icon name={'wallet-outline'} size={25} color={'#FFFFFF'} />
              </TouchableOpacity>



            </View>

          </View>



        </View>



        <Swiper
          style={styles.wrapper}
          height={200}
          showsPagination={true}
          // autoplayTimeout={2}
          dot={
            <View
              style={{
                backgroundColor: '#D9D9D9',
                width: 8,
                height: 8,
                borderRadius: 8,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 5,

              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: '#043862',
                width: 8,
                height: 8,
                borderRadius: 8,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 5,

              }}
            />
          }
          onIndexChanged={(index) => setPosition(index)}
          paginationStyle={{
            bottom: -5,
            right: 10,
          }}
          loop={true}
          autoplay={true}
        >
          <TouchableOpacity onPress={() => {
            navigation.navigate('IntroAnim');
          }} style={{ flex: 1, alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={[styles.image]}
              source={{ uri: Offer[0]?.image5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Home', { details: Properties });
          }} style={{ flex: 1, alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={[styles.image]}
              source={{ uri: Offer[0]?.image1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            // setGlobalState(prevState => ({
            //   ...prevState,
            //   userEvent: 'Construction'
            // }));
            // navigation.navigate('InteriorForm')
            navigation.navigate('Packages');
          }} style={{ flex: 1, alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={[styles.image]}
              source={{ uri: Offer[0]?.image2 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setGlobalState(prevState => ({
              ...prevState,
              userEvent: 'Construction'
            }));
            navigation.navigate('InteriorForm')
          }} style={{ flex: 1, alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={[styles.image]}
              source={{ uri: Offer[0]?.image3 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('DreamscapeHome');
          }} style={{ flex: 1, alignItems: 'center' }}>
            <Image
              resizeMode='cover'
              style={[styles.image]}
              source={{ uri: Offer[0]?.image4 }}
            />
          </TouchableOpacity>
        </Swiper>



        {/* <Text style={[styles.mostCommonFaqsTypo, { paddingVertical: 15 }]}>
          Categories
        </Text> */}
        {/* <View style={{ marginBottom: 10, marginHorizontal: 20 }}>
          <View style={[styles.groupChild22, { paddingVertical: 20, }]}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TouchableOpacity style={{ alignItems: 'center', flex: 1, }}
                onPress={() => {
                  // navigation.navigate('CownHome');
                     navigation.navigate('BottomNavigations');

                 // navigation.navigate('Home', { details: Properties });
                }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  resizeMode='contain'
                  source={require("./assets/Layer1.png")}
                />
                <Text style={[styles.airportTypo, { paddingTop: 8 }]}>
                  Co-ownership
                </Text>
              </TouchableOpacity >
           
              <TouchableOpacity style={{ alignItems: 'center', flex: 1 }}
                onPress={() => {
                  //handleCallNow();
                  //navigation.navigate('PropertyForm');
                  setGlobalState(prevState => ({
                    ...prevState,
                    userEvent: 'Interiors'
                  }));
                  navigation.navigate('InteriorForm');
                }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  resizeMode='contain'
                  source={require("./assets/Layer8.png")}
                />
                <Text style={[styles.airportTypo, { paddingTop: 8 }]}>
                  Interiors
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center', flex: 1 }}
                onPress={() => {
                  navigation.navigate('DreamscapeHome');
                }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  resizeMode='contain'
                  source={require("./assets/stay.png")}
                />
                <Text style={[styles.airportTypo, { paddingTop: 8 }]}>
                  Stay
                </Text>
              </TouchableOpacity>
             
            </View>
        
          
          </View>
        </View> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[styles.mostCommonFaqsTypo, { paddingVertical: 15, marginTop: 5 }]}>
            Availabile Properties
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home', { details: Properties });
            }}>
            <Text style={[styles.viewTypo11, { paddingVertical: 15, marginTop: 5, paddingRight: 20 }]}>View More</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}>

          <TouchableOpacity
            onPress={() => {
              setSelectCountry('India');
            }}
            style={{
              backgroundColor: selectCountry == 'India' ? '#0F1130' : '#FFFFFF',
              paddingHorizontal: 45,
              paddingVertical: 8,
              borderRadius: 5,
              borderColor: '#000000',
              borderWidth: 1,
              marginTop: 5
            }}>
            <Text
              style={{
                color: selectCountry == 'India' ? '#FFFFFF' : '#000000',
                fontFamily: 'WorkSans-Medium',
                fontSize: 12,
              }}>
              Domestic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectCountry('International');
            }}
            style={{
              backgroundColor:
                selectCountry == 'International' ? '#0F1130' : '#FFFFFF',
              paddingHorizontal: 50,
              paddingVertical: 8,
              borderRadius: 5,
              borderColor: '#000000',
              borderWidth: 1,
              marginTop: 5
            }}>
            <Text
              style={{
                color: selectCountry == 'International' ? '#FFFFFF' : '#000000',
                fontFamily: 'WorkSans-Medium',
                fontSize: 12,
              }}>
              Global
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: '#0F1130',
              paddingHorizontal: 30,
              paddingVertical: 10,
              borderRadius:10
            }}>
            <Text style={{color:'#FFFFFF',fontFamily:'WorkSans-Medium',fontSize:12}}>
              Lifestyle
            </Text>
          </TouchableOpacity> */}
        </View>

        {selectCountry == 'India' && (
          <ScrollView
            horizontal={true}
            style={{ padding: 20 }}
            showsHorizontalScrollIndicator={false}>
            {indianProp
              .filter(item => item.AvailableFractions > 0)
              .map((item, index) => {
                const itemName = item?.name;
                const propId = item?._id;
                const isLiked = likedProperty.includes(propId);
                if (!scaleAnimation[itemName]) {
                  scaleAnimation[itemName] = new Animated.Value(1);
                }
                return (
                  <TouchableOpacity
                    onPress={() => {

                      navigation.navigate('Property', { details: item, nav: 'HomePage' });

                    }}
                    key={index}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#00000014',
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      elevation: 5,
                      width: width * 0.65,
                      marginRight: 20,
                    }}>
                    <Image
                      resizeMode="cover"
                      source={{ uri: item?.image?.Image1 }}
                      style={{ width: '100%', height: 150 }}
                    />
                    <View style={{ position: 'absolute', top: 15, left: 15 }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 20,
                            color: '#FFFFFF',
                          }}>
                          {item?.city}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          flex: 1,
                        }}>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 13,
                              color: '#000000',
                            }}>
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
                            colors={
                              isLiked
                                ? ['#FFFFFF', '#FFFFFF']
                                : ['#FFFFFF', '#FFFFFF']
                            }
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                              elevation: 5,
                              backgroundColor: '#FFFFFF',
                            }}>
                            <Animated.View
                              style={{
                                transform: [{ scale: scaleAnimation[itemName] }],
                              }}>
                              {isLiked ? (
                                <Icon
                                  name={'heart'}
                                  size={20}
                                  color="#ED1C24"
                                />
                              ) : (
                                <Icon
                                  name={'heart-outline'}
                                  size={20}
                                  color="#ED1C24"
                                />
                              )}
                            </Animated.View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Meidum',
                            fontSize: 11,
                            color: '#00000099',
                          }}>
                          Total Frac Value:{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 11,
                            color: '#000000',
                            marginLeft: 5,
                          }}>
                          ₹ {item?.Price}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 8,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 11,
                            color: '#00000099',
                          }}>
                          Frac Value:{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 11,
                            color: '#000000',
                            marginLeft: 5,
                          }}>
                          ₹ {item?.FC_Price}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 11,
                            color: '#00000099',
                          }}>
                          Available Frac:{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 11,
                            color: '#000000',
                            marginLeft: 5,
                          }}>
                          {item?.AvailableFractions}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Image
                            source={{
                              uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png',
                            }}
                            style={{ width: 15, height: 15 }}
                          />
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 9,
                              color: '#181D27',
                              marginLeft: 10,
                            }}>
                            {item?.area}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Image
                            source={{
                              uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png',
                            }}
                            style={{ width: 15, height: 15 }}
                          />
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 9,
                              color: '#181D27',
                              marginLeft: 7,
                            }}>
                            {item?.P_Type}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        )}



        {selectCountry == 'International' && (
          <ScrollView
            horizontal={true}
            style={{ padding: 20 }}
            showsHorizontalScrollIndicator={false}>
            {srilankaProp
              .filter(item => item.AvailableFractions > 0)
              .map((item, index) => {
                const itemName = item?.name;
                const propId = item?._id;
                const isLiked = likedProperty.includes(propId);
                if (!scaleAnimation[itemName]) {
                  scaleAnimation[itemName] = new Animated.Value(1);
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Property', { details: item, nav: 'HomePage' });
                      // navigation.navigate('CoOwnPropDetail', { data: item })
                    }}
                    key={index}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#00000014',
                      borderWidth: 1,
                      padding: 10,
                      elevation: 5,
                      width: width * 0.65,
                      marginRight: 20,
                      borderRadius: 10,
                    }}>
                    <Image
                      resizeMode="cover"
                      source={{ uri: item?.image?.Image1 }}
                      style={{ width: '100%', height: 150 }}
                    />
                    <View style={{ position: 'absolute', top: 15, left: 15 }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 20,
                            color: '#FFF',
                          }}>
                          {item.city}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          flex: 1,
                        }}>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 13,
                              color: '#000',
                            }}>
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
                            }
                          }}>
                          <LinearGradient
                            colors={['#FFF', '#FFF']}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 20,
                              alignItems: 'center',
                              justifyContent: 'center',
                              elevation: 5,
                              backgroundColor: '#FFF',
                            }}>
                            <Animated.View
                              style={{
                                transform: [{ scale: scaleAnimation[itemName] }],
                              }}>
                              {isLiked ? (
                                <Icon
                                  name={'heart'}
                                  size={20}
                                  color="#ed1c24"
                                />
                              ) : (
                                <Icon
                                  name={'heart-outline'}
                                  size={20}
                                  color="#ed1c24"
                                />
                              )}
                            </Animated.View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 11,
                            color: '#00000099',
                          }}>
                          Total Frac Value:{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 11,
                            color: '#000',
                            marginLeft: 5,
                          }}>
                          ₹ {item?.Price}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 8,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 11,
                            color: '#00000099',
                          }}>
                          Frac Value:{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 11,
                            color: '#000',
                            marginLeft: 5,
                          }}>
                          ₹ {item?.FC_Price}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 11,
                            color: '#00000099',
                          }}>
                          Available Frac:{' '}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 11,
                            color: '#000',
                            marginLeft: 5,
                          }}>
                          {item?.AvailableFractions}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Image
                            source={{
                              uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png',
                            }}
                            style={{ width: 15, height: 15 }}
                          />
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 9,
                              color: '#181d27',
                              marginLeft: 10,
                            }}>
                            {item?.area}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Image
                            source={{
                              uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png',
                            }}
                            style={{ width: 15, height: 15 }}
                          />
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 9,
                              color: '#181d27',
                              marginLeft: 10,
                            }}>
                            {item?.P_Type}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        )}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('IntroAnim');
          }}>
          <LinearGradient
            colors={['#F6D365', '#FEF3BC', '#F1D269']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              borderRadius: 40,
              borderColor: '#E5AA01',
              borderWidth: 1.5,
              paddingHorizontal: 17,
              paddingVertical: 15,
              marginHorizontal: 20,
              marginBottom:20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 2}}>
              <View>
                <Image
                  source={{
                    uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/premium.png',
                  }}
                  style={{width: 35, height: 35}}
                />
              </View>
              <View style={{marginLeft: 5}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    color: '#163434',
                  }}>
                  Altaira by Fracspace
                </Text>
                <Text
                  style={{
                    fontFamily: 'Popppins-Regular',
                    fontSize: 11,
                    color: '#163434F2',
                    marginTop: -2,
                  }}>
                  Above the Clouds, Beyond Expectations
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: '#000000',
                }}>
                Explore More
              </Text>
              <Iconn name={'chevron-right'} size={15} color={'#000000'} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: '#EBE9F6',

            paddingVertical: 10,
          }}>
          <Text style={[styles.mostCommonFaqsTypo, { paddingVertical: 15 }]}>
            More Than Co-Ownership
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingHorizontal: 15,
                paddingTop: 10,
                paddingBottom: 30
              }}>
              <TouchableOpacity
                onPress={() => {

                  navigation.navigate('Packages');
                }}>
                <Image
                  style={{ width: 135, height: 110, borderRadius: 10 }}
                  resizeMode="cover"
                  source={{
                    uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/package_image1.jpeg',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setGlobalState(prevState => ({
                    ...prevState,
                    userEvent: 'Interiors',
                  }));
                  navigation.navigate('InteriorForm');
                }}>
                <Image
                  style={{ width: 135, height: 110, borderRadius: 10 }}
                  resizeMode="cover"
                  source={{
                    uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/package_image2.jpeg',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DreamscapeHome');
                }}>
                <Image
                  style={{ width: 135, height: 110, borderRadius: 10 }}
                  resizeMode="cover"
                  source={{
                    uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/package_image3.jpeg',
                  }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={{ backgroundColor: '#FAFAFF', paddingBottom: 15 }}>
          <View style={{ paddingTop: 20, paddingBottom: 15, }}>
            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000', paddingHorizontal: 15, }}>Postcards</Text>
          </View>


          <View style={{ paddingLeft: 20, }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Blogs', { Blogfor: 'VaranasiBlog' });
              }} style={{ marginRight: 20 }}>
                <Image resizeMode='cover' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/varanashiPosterImage.jpeg' }} style={{ width: width * 0.85, height: height * 0.36, borderRadius: 15 }} />

              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                navigation.navigate('Blogs', { Blogfor: 'SrilankaBlog' });
              }} style={{ marginRight: 20 }}>
                <Image resizeMode='cover' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/srilankaPosterImage.jpeg' }} style={{ width: width * 0.85, height: height * 0.36, borderRadius: 15 }} />

              </TouchableOpacity>

            </ScrollView>
          </View>




        </View>


        {/* 
        <View style={{ backgroundColor: '#EBE9F6', }}>
          <View style={{ paddingHorizontal: 15, paddingTop: 25 }}>
            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000' }}>Explore our services</Text>
          </View>
          <ScrollView horizontal={true} style={{ paddingHorizontal: 15, marginTop: 20, marginBottom: 35 }}>
            <TouchableOpacity onPress={() => {
              navigation.navigate('Home', { details: Properties });
            }} style={{ backgroundColor: '#FFFFFF', borderRadius: 11, padding: 15 }}>
              <View>
                <Image style={{ width: 80, height: 80, }}
                  //source={require('./assets/LayerPer.png')}
                  source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/icon7.jpeg', }}
                />
              </View>
              <View style={{ width: 141, marginVertical: 10 }}>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#000000' }}>Start your journey with fractional ownership today </Text>
              </View>
            </TouchableOpacity>




            <TouchableOpacity onPress={() => {
              setGlobalState(prevState => ({
                ...prevState,
                userEvent: 'Interiors'
              }));
              navigation.navigate('InteriorForm');


            }} style={{ backgroundColor: '#FFFFFF', borderRadius: 11, padding: 15, marginLeft: 20 }}>
              <View>
                <Image style={{ width: 80, height: 80, }}

                  source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/icon2.jpeg' }} />
              </View>
              <View style={{ width: 141, marginVertical: 10 }}>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#000000' }}>Book Interiors fractional ownership today </Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {
              navigation.navigate('DreamscapeHome');

            }} style={{ backgroundColor: '#FFFFFF', borderRadius: 11, padding: 15, marginLeft: 20, marginRight: 20 }}>
              <View>
                <Image style={{ width: 80, height: 80, }} source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Frame+1.png', }} />
              </View>
              <View style={{ width: 141, marginVertical: 10 }}>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#000000' }}>Unveil the art of luxurious living only at Dreamscape.</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View> */}



        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, marginTop: 5, alignItems: 'center' }}>
          <Text style={styles.mostCommonFaqsTypo}>
            Wherever you go we've a stay
          </Text>
          <View style={{ marginRight: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#081F62' }}>
            {/* <Text style={styles.viewTypo11}>VIEW ALL</Text> */}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {

                navigation.navigate('Ourstay', { location: 'Hyderabad' });

              }}
              style={{ marginLeft: 20, alignItems: 'center' }}>
              <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Hyderabad.png' }} style={{ width: width * 0.3, height: height * 0.15, }} />
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000', marginTop: 5, textAlign: 'center' }}>Hyderabad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {

                navigation.navigate('Ourstay', { location: 'Munnar', });

              }} style={{ marginLeft: 20, alignItems: 'center' }}>
              <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Munnar2.png' }} style={{ width: width * 0.3, height: height * 0.15, }} />
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000', marginTop: 5, textAlign: 'center' }}>Munnar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate('Ourstay', { location: 'Varanasi', });

            }} style={{ alignItems: 'center', marginLeft: 20, }}>
              <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Varanasi.png' }} style={{ width: width * 0.3, height: height * 0.15, }} />
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000', marginTop: 5, textAlign: 'center' }}>Varanasi</Text>
            </TouchableOpacity>
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
                width={testimonials.length * (cardWidth + 200)}
                height={wireHeight}
              />

              {/* Cards with clips */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 70,
                  paddingHorizontal: 20,
                }}>
                {testimonials.map((item, index) => (
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
                        uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/clip.png',
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
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              top: 0,
                              left: 0,
                              resizeMode: 'cover',
                              zIndex: 1,
                            }}
                          />
                        )}
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontFamily: 'WorkSans-SemiBold',
                          fontSize: 15,
                          color: '#000000',
                          marginBottom: 8,
                        }}>
                        {item.name}
                      </Text>


                      <ScrollView
                        ref={ref => (transcriptScrollRefs.current[index] = ref)}
                        style={{ maxHeight: 150 }}
                        showsVerticalScrollIndicator={false}>
                        {item.transcript.map((line, idx) => {
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

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, marginTop: 20, alignItems: 'center' }}>

          <Text style={styles.mostCommonFaqsTypo}>
            Popular Destinations
          </Text>
          <View style={{ marginRight: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#081F62' }}>
       
          </View>
        </View> */}
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, width: '100%', }}>
          <ScrollView horizontal={true}>
            {Popular.map((item, index) => (
              <TouchableOpacity style={{ marginRight: 15 }} key={index}
                onPress={() => {
                  // navigation.navigate('PopularDestination', { details: item });
                  setGlobalState(prevState => ({
                    ...prevState,
                    HotelUserDetails: {},
                  }));
                  navigation.navigate('SelectRoomFS', { detail: item });
                }}>
                <Image
                  style={{ width: 180, height: 180, borderRadius: 8 }}
                  contentFit="cover"
                  source={{ uri: item?.images[0] }}
                //source={require('./assets/Rectangle3.png')}
                />
                <View style={{ position: 'absolute', width: '80%' }}>

                  <Text style={{ paddingBottom: 5, paddingTop: 5, fontFamily: "Montserrat-Bold", color: '#FFFFFF', fontSize: 18, paddingLeft: 5 }}>
                    {item?.location?.city}
                  </Text>
                  <View style={{}}>
                    <ImageBackground source={require("./assets/Sport.png")} style={{
                      //flex: 1,
                      justifyContent: 'flex-start',
                    }} >
                      <Text style={{ padding: 5, color: '#FFFFFF', fontSize: 10, fontFamily: 'Poppins-Medium', }}>{item?.spotsCount}+ spots to chill</Text>
                    </ImageBackground>
                  </View>
                </View>
              </TouchableOpacity>))}
          </ScrollView>
        </View> */}


        <Text
          style={[styles.mostCommonFaqsTypo, { paddingTop: 10 }]}>
          In the Media
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>

            <Image
              style={{ width: 120, height: 80 }}
              resizeMode="contain"
              source={{
                uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/news2.jpeg',
              }}
            //source={require('./assets/Rectangle3.png')}
            />
            <Image
              style={{ width: 120, height: 80 }}
              resizeMode="contain"
              source={{
                uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/news1.jpeg',
              }}
            //source={require('./assets/Rectangle3.png')}
            />
            <Image
              style={{ width: 120, height: 80 }}
              resizeMode="contain"
              source={{
                uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/news3.jpeg',
              }}
            //source={require('./assets/Rectangle3.png')}
            />
            <Image
              style={{ width: 120, height: 80 }}
              resizeMode="contain"
              source={{
                uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/news4.jpeg',
              }}
            //source={require('./assets/Rectangle3.png')}
            />
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => {
          handleRating();

        }}
          style={{ alignItems: 'center', }}>
          <Image
            style={styles.image}
            resizeMode='contain'
            source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Rate_us.jpeg' }}
          //source={require('./assets/Rectangle3.png')}
          />
        </TouchableOpacity>



        <View style={{ padding: 15 }}>
          <TouchableOpacity
            onPress={() => {
              handleCallRecord();
              //handleCallNow();
            }}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              //  backgroundColor: '#56018A',
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderColor: '#021265',
              borderWidth: 1,
              borderRadius: 5,
              width: '100%',
              marginBottom: 50,

            }}>
            <Icon name="call" size={20} color="#2955D2" />
            <Text style={{ fontSize: 16, fontFamily: "Montserrat-Bold", color: '#2955D2' }}>
              {'  '}Enquire Now
            </Text>
          </TouchableOpacity>
        </View>


        {/* <View style={{ padding: 15 }}>
          <TouchableOpacity
            onPress={() => {
              // handleCallRecord();
              navigation.navigate('Exposcreen')
              //handleCallNow();
            }}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              //  backgroundColor: '#56018A',
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderColor: '#021265',
              borderWidth: 1,
              borderRadius: 5,
              width: '100%',
              marginBottom: 50,

            }}>
            <Icon name="call" size={20} color="#2955D2" />
            <Text style={{ fontSize: 16, fontFamily: "Montserrat-Bold", color: '#2955D2' }}>
              {'  '}Expo Now
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* {popUp && */}
          <Modal modalStyle={{ width }} visible={popUp} transparent animationType='fade'>
            <View style={{flex:1, backgroundColor:'#000000b3'}}>
              <TouchableOpacity onPress={() => {
                setPopUp(false);
              }} style={{flex:1}}/>
              <View style={{width:'100%', height: height*0.53,position:'absolute',bottom:0}}>
                <View style={{position:'absolute',top:-40,alignSelf:'center',zIndex:1}}>
                  <TouchableOpacity onPress={() => {
                      setPopUp(false);
                  }} style={{ backgroundColor:'#0000005c', borderRadius: 20, padding: 5 }}>
                      <Iconn name={'x'} size={25} color={'#fff'} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
                  setPopUp(false);
                  navigation.navigate('IntroAnim');
                }}>
                  <Image resizeMode='contain' source={{uri : 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/AltairaPopUp.png'}} style={{width:'100%',height:'100%'}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setPopUp(false);
                  navigation.navigate('IntroAnim');
                }} style={{position:'absolute',bottom:40,alignSelf:'center'}}>
                  <LinearGradient colors={['#FAD059', '#FFE7A2', '#EDC249']} start={{x:0, y:0}} end={{x:1, y:0}}
                    style={{borderRadius:50,padding:15,paddingHorizontal:50}}
                  >
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000'}}>Discover Altaira</Text>

                      <View style={{ flexDirection: 'row',alignItems:'center',marginLeft:10}}>
                        {[...Array(3)].map((_, index) => (
                            <Animated.View
                                key={index}
                                style={{
                                    marginLeft: index * -1,
                                    opacity: Animated.multiply(iconOpacity, 1 - index * 0.3),
                                    transform: [
                                        {
                                            translateX: Animated.multiply(
                                                iconTranslateX,
                                                1 - index * 0.1
                                            ),
                                        },
                                    ],
                                }}
                            >
                                <IconF name="chevron-right" size={15} color="#000" />
                            </Animated.View>
                        ))}
                    </View>


                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        {/* } */}

      </ScrollView>
      {/* <Footer navigation={navigation} activeFooterTab={'HomePage'} /> */}
      

      {/* {ExpoVideos &&
        <View style={styles.videoContainer}>
          <TouchableOpacity onPress={() => {
            setExpoVideos(false);

          }} style={{ backgroundColor: '#021265', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Icon name="close-circle" size={25} color={'#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            // navigation.navigate('Anniversary');
            navigation.navigate('Exposcreen');

          }}>
            <Video
              // source={{uri:'https://fracspace-updates.s3.ap-south-1.amazonaws.com/videos/Fracspace+Anniversary+Video+-+1+(App)+(8).mp4'}}
              source={require('./assets/ExpoFinal.mp4')} // Use a URL or local file path
              style={styles.backgroundVideo}
              repeat={true} // Optional: Repeat the video
              muted={true} // Optional: Mute the video
              resizeMode="cover" // Optional: Choose the right resize mode
            />
          </TouchableOpacity>
        </View>} */}

      {/* <TouchableOpacity onPress={() => {
            navigation.navigate('Exposcreen');

          }}style={{position:'absolute',  bottom: 10,right:0,}}>
        
        <Image
            style={{width:160,height:100}}
            resizeMode='contain'
            source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Dreamscape4.png' }}
          //source={require('./assets/Rectangle3.png')}
          />

        </TouchableOpacity> */}





      <Animated.View style={[
        { transform: [{ translateX: menuAnimation }] },
        {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: width * 0.8, // Half screen width
          backgroundColor: '#fff',
          paddingHorizontal: 15,
          paddingVertical: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }
      ]}>
        <ScrollView style={{ backgroundColor: '#FFFFFF', top: 30 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingBottom: 10
          }}>
            <View></View>
            <TouchableOpacity style={{ paddingVertical: 10, flex: 1, alignItems: 'flex-end' }} onPress={() => {

              closeMenu();

            }}>
              <Iconn name={'x'} size={20} color={'#000000'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 10,
              borderRadius: 10,
              backgroundColor: '#021265E5',
              paddingHorizontal: 10,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%'
            }}>
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
          <View style={{ marginHorizontal: 15, borderWidth: 1, borderColor: '#DCDCDC', borderRadius: 10, marginVertical: 20, padding: 15, flexDirection: 'row', backgroundColor: '#FFFFFF', justifyContent: 'space-between', elevation: 5 }}>
            <TouchableOpacity onPress={() => {
              handleCallRecord();


            }} style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Ico3.png' }} style={{ width: 50, height: 50 }} />
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: '#1A1A1A', marginTop: 5 }}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              handleRating();


            }} style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Ico2.png' }} style={{ width: 50, height: 50 }} />
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: '#1A1A1A', marginTop: 5 }}>Rate App</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate('FeedbackForm');



            }} style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Ico1.png' }} style={{ width: 50, height: 50 }} />
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 10, color: '#1A1A1A', marginTop: 5 }}>Feedback</Text>
            </TouchableOpacity>
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
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image4.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Co-own</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => {
              navigation.navigate('PropertyForm');


            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image6.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>List Your Property</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate('PropertyListing', { section: 'Sell' });


            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image7.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Buy Property</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => {
              navigation.navigate('PropertyListing', { section: 'Rent' });


            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image7.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Rent Property</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => {
              setGlobalState(prevState => ({
                ...prevState,
                userEvent: 'Interiors'
              }));
              navigation.navigate('InteriorForm');


            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image8.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Interiors</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => {
              setGlobalState(prevState => ({
                ...prevState,
                userEvent: 'Construction'
              }));

              navigation.navigate('InteriorForm');



            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image5.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Book constructions</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => {
              navigation.navigate('PropertyManagment');



            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F6F6F6', borderBottomWidth: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image9.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Book Professional Services</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => {
              navigation.navigate('DreamscapeHome');
            }} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/image10.jpeg' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Stays</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </TouchableOpacity>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name={'airplane-outline'} size={20} style={{ transform: [{ rotate: '270deg' }], }} />
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Book Flights</Text>
              </View>
              <IconI name={'right'} size={15} color={'#081F62'} />
            </View> */}
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
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#1A1A1A', marginLeft: 20 }}>Log out</Text>
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
    width: width * 0.95,
    height: height * 0.22,
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
});










