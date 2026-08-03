import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  Modal
} from 'react-native';
import { useState, useEffect, useContext, useRef } from 'react';
import Footer from './Footer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/FontAwesome6';
import StarIcon from 'react-native-vector-icons/MaterialIcons';
import CameraIcon from 'react-native-vector-icons/Entypo';
import IconA from 'react-native-vector-icons/AntDesign';
import Icco from 'react-native-vector-icons/SimpleLineIcons';
import { AppContext } from './Context/AppContext';
import * as ImagePicker from 'react-native-image-picker';
import CustomModal from './CustomModal';
import {
  GetBookingDetails,
  ProfileDetails,
  ProfilePic,
  SiteVisitHistory,
} from './Services/UserApi';
const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const navigation = useNavigation();
  const [SiteData, setSiteData] = useState([]);
  const { globalState, setGlobalState } = useContext(AppContext);
  const [ProfileDisplay, setProfileDisplay] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [BookingData, setBookingData] = useState([]);
  const [document, setDocument] = useState(false);
  const [Visible, setVisible] = useState(false);
  const [Docs, setDocs] = useState(globalState?.userDetails?.documents);
  const [PanDoc, setPanDoc] = useState('');
  const [AadharDoc, setAadharDoc] = useState('');
  
 
  // console.log("DOcssss: ", globalState?.userDetails?.documents[1]);

  const launchGallery = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.2,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel != true) {
        setProfileDisplay(response?.assets[0]?.uri);
        setModalVisible(false);
        handleProfilePic(response?.assets);
        // navigation.push(Screens.Post, {images:response.assets})
        //  return response.assets;
      } else {
      }
    });
  };
  const launchCamera = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.2,
    };
    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel != true) {
        setProfileDisplay(response?.assets[0]?.uri);

        setModalVisible(false);
        handleProfilePic(response.assets);
        // navigation.push(Screens.Post, {images:response.assets})
        //return response.assets;
      } else {
      }
    });
  };

  const handleProfilePic = async ProfileData => {
    var form = new FormData();
    form.append('email', globalState?.userDetails?.email);
    // form.append("profile", Profile[0].uri,'profile.jpg');
    form.append('profile', {
      uri: ProfileData[0].uri,
      type: ProfileData[0].type,
      name: ProfileData[0].fileName,
    });

    let payload = form;

    try {
      let { data: res } = await ProfilePic(payload);

      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          userProfile: ProfileData[0].uri,
        }));
        Alert.alert('congratulations!', `${res?.message}`);

        // setProfile(globalState?.userDetails?.profilePicture);
        // setIsLike(res?.pIds);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleProfle = async () => {
    const tokenid = await AsyncStorage.getItem('mytoken');
    const emailId = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: emailId,
    });

    try {
      let { data: res } = await ProfileDetails(payload, tokenid);
      if (res?.success) {
        setProfileDisplay(res?.data?.profilePicture);
        setGlobalState(prevState => ({
          ...prevState,
          userName: res?.data?.userName,
          userEmail: emailId,
          token: tokenid,
          userDetails: res?.data,
          userPhone: res?.data?.phoneNumber,
          userProfile: res?.data?.profilePicture,
        }));
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
  };

  const handleSiteVisit = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
    });

    try {
      let { data: res } = await SiteVisitHistory(payload);

      if (res?.success) {
        setSiteData(res?.data);
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
  };
  const handleBookingDetail = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
    });

    try {
      let { data: res } = await GetBookingDetails(payload);

      if (res?.success) {
        setBookingData(res?.data);
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
  };

  const openWhatsApp = async () => {
    const phoneNumber = '+919880626111';
    const message = 'Hello, I want to know more about Fracspace';
    // const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      console.log("Supported: ",supported);
      if (true) {
        await Linking.openURL(url);
      } else {
        Alert.alert('WhatsApp is not installed');
      }
    } catch (error) {
      console.log('WhatsApp Error => ', error);
    }
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

  // const first = () => {
  //   for (let index = 0; index < Docs.length; index++) {
  //     if (Docs[index].includes("pan")) {
  //       // console.log(Docs[index]);
  //       setPanDoc(Docs[index]);
  //     } else if (Docs[index].includes("aadhar")) {
  //       setAadharDoc(Docs[index]);
  //     } else {
  //       setChequeDoc(Docs[index]);
  //     }
  //   }
  // };

  useEffect(() => {
    handleProfle();
    handleSiteVisit();
    handleBookingDetail();
   // first();
  }, []);
  const handleRating = () => {

    const appStoreUrl = 'https://play.google.com/store/apps/details?id=com.fracspace';
    Linking.openURL(appStoreUrl).catch(error => console.error('Error opening Play Store', error));
  };
  const handleFollow = () => {

    const appStoreUrl = 'https://www.instagram.com/fracspace?igsh=MXhtdWZpeDV5MWI3eA==';
    Linking.openURL(appStoreUrl).catch(error => console.error('Error opening Play Store', error));
  };

  const handleJoin = () => {

    const whatsappChannel = 'https://whatsapp.com/channel/0029VaoLalvGzzKMazD5eC0r';
    Linking.openURL(whatsappChannel).catch(error => console.error('Error opening Play Store', error));
  };
  return (
     <SafeAreaView style={{ flex: 1, backgroundColor:'#021265'}}>
      <View style={{flex:1,backgroundColor: '#F9F9F9'}}>
      <View style={{
        
        alignItems: 'center',
        alignSelf:'center',
        paddingVertical: 12,
        width: '100%',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        elevation: 1,
        borderBottomColor: '#DDE1E5',
        //backgroundColor: '#FFFFFF',
        backgroundColor: '#021265'
      }}>
        {/* <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {

               navigation.navigate('Home',{details:globalState?.ProDetails}); 
         
          }}>
          <Icons name="chevron-back-outline" size={25} color={'#FFFFFF'} />
        </TouchableOpacity> */}
     
        <Text style={{
          fontSize: 18,
          fontFamily: 'WorkSans-SemiBold',
          color: '#FFFFFF',
        }}>
          Profile
        </Text>
        {/* <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
            navigation.navigate('HomePage');

          }}>
          <Text style={{
            fontSize: 15,
            fontFamily: 'WorkSans-SemiBold',
            color: '#FFFFFF',
            textAlign: 'right'
          }}>EXIT</Text>
        </TouchableOpacity> */}
      </View>



      <ScrollView style={{ backgroundColor: '#F9F9F9', padding: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }} style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#e7e7e7',

            //elevation: 5,
            width: '100%', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }}>
          {/* <Image
            style={{
              width: 80,
              height: 80,
              //marginTop: -ThemeUtils.relativeWidth(20),
              borderRadius: 80,
            }}
            source={ProfileDisplay != undefined ? {
              uri: ProfileDisplay,
            } : require('./assets/Profile.png')}
          /> */}
          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
            }}
            source={
              ProfileDisplay && ProfileDisplay.trim() !== ''
                ? { uri: ProfileDisplay }
                : require('./assets/Profile.png')
            }
          />

          <View style={{ flex: 1, paddingLeft: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 3 }}>
              <Text
                style={{
                  color: '#1E1F2E',
                  fontSize: 16,
                  fontFamily: 'WorkSans-SemiBold',
                  textTransform: 'capitalize',

                  //textAlign:'center'
                }}>
                {globalState?.userDetails?.userName}{' '}
              </Text>
              {/* {globalState?.userDetails?.verification && (
                <View style={{ paddingTop: 3 }}>
                  <StarIcon name="verified" size={20} color="#448EE4" />
                </View>
              )} */}
            </View>
            <Text style={{
              color: '#9C9C9C',
              fontSize: 10,
              fontFamily: 'Poppins-Medium',
            }}>
              {globalState?.userDetails?.phoneNumber}
            </Text>
            <Text style={{
              color: '#9C9C9C',
              fontSize: 10,
              fontFamily: 'Poppins-Medium',
            }}>
              {globalState?.userDetails?.email}
            </Text>
            {globalState?.userDetails?.postalAddress && (<Text style={{
              color: '#9C9C9C',
              fontSize: 10,
              fontFamily: 'Poppins-Medium',
            }}>
              {globalState?.userDetails?.postalAddress
                ? globalState?.userDetails?.postalAddress
                : ''}
            </Text>
            )}

            {globalState?.userDetails?.verification && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                {globalState?.userDetails?.verification && (
                  <View style={{}}>
                    <Icons name="checkmark-circle" size={13} color="#448EE4" />
                  </View>
                )}
                <Text
                  style={{
                    color: '#333333',
                    fontSize: 11,
                    fontFamily: 'Poppins-Medium',
                    paddingLeft: 5
                  }}>
                  Profile Verified
                </Text>
              </View>
            )}
          </View>

          <Icons name="camera-outline" size={30} color="#9C9C9C" />

        </TouchableOpacity>
        <View style={{ marginVertical: 20, borderRadius: 10, }}>
          {/* {!globalState?.userDetails?.verification && (
            <TouchableOpacity
              onPress={() => {
                // handleLogOut();
                navigation.navigate('BookNow', { screen: 'Profile' });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                paddingVertical: 12,
                alignItems: 'center'
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Profile1.png' }} />
                <View style={{ paddingLeft: 20 }}>
                  <Text
                    style={{
                      color: '#181D27',
                      fontSize: 16,
                      fontFamily: 'OpenSans-SemiBold',
                    }}>
                    Profile Verification
                  </Text>

                </View>
              </View>
              <Icon name="chevron-right" size={25} color="#555252" />
            </TouchableOpacity>
          )} */}
          {globalState?.userDetails?.verification && (
            <>
              <TouchableOpacity
                onPress={() => {
                  // console.log("Doc: ", Docs[0]);
                  if(globalState?.userDetails?.phoneNumber.startsWith('+91')){
                    setDocument(!document);
                  }else{
                    if(Docs[0].split('?')[0].endsWith('.pdf')){
                      navigation.navigate('DisplayDoc', {Link : Docs[0], screen: 'Doc'});
                    }else{
                      setPanDoc(Docs[0]);
                      setVisible(true);
                    }
                    
                  }
                  // navigation.navigate('Documents');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                  paddingVertical: 12,
                  alignItems: 'center'
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Doc.png' }} />
                  <View style={{ paddingLeft: 20 }}>
                    <Text
                      style={{
                        color: '#181D27',
                        fontSize: 16,
                        fontFamily: 'OpenSans-SemiBold',
                      }}>
                      Documents
                    </Text>

                  </View>
                </View>
                {document ? (
                  <Icon name={'chevron-up'} size={25} color={'#555252'} />
                ) : (
                  <Icon name={'chevron-down'} size={25} color={'#555252'} />
                )}
              </TouchableOpacity>

              {document && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    //paddingBottom: 30,
                    borderRadius: 20,
                    paddingVertical: 12
                    //backgroundColor: '#FFFFFF',
                  }}>
                  <TouchableOpacity style={{ alignItems: 'center', gap: 10 }}
                    onPress={() => {
                       console.log(Docs[1]);
                      // handleLogOut();
                      navigation.navigate('DisplayDoc', { Link: Docs[0], screen: 'Doc' });

                      // navigation.navigate('Documents');
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/appImages/Doc.png',
                      }}
                      style={{ width: 60, height: 70 }}
                    />
                    <Text
                      style={{
                        color: '#181D27',
                        fontSize: 10,
                        fontFamily: 'OpenSans-SemiBold',
                      }}>
                      Aadhar Card
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity   
                    // onPress={() => {
                    // if(globalState?.userDetails?.documents[1].split('?')[1].endsWith('.pdf')){
                    //   navigation.navigate('DisplayDoc', {Link: globalState?.userDetails?.documents[1], screen: 'Doc'})
                    // }else{
                    //   setPanDoc(globalState?.userDetails?.documents[1]);
                    //   setVisible(true);
                    // }
                    
                    
                    // }}
                    onPress={() => {
                      const docUrl = globalState?.userDetails?.documents?.[1];

                      if (!docUrl) return;

                      const cleanUrl = docUrl.split('?')[0].trim().toLowerCase();

                      const isPdf = cleanUrl.endsWith('.pdf');

                      if (isPdf) {
                        navigation.navigate('DisplayDoc', {
                          Link: docUrl,
                          screen: 'Doc',
                        });
                      } else {
                        setPanDoc(docUrl);
                        setVisible(true);
                      }
                    }}
                    style={{ alignItems: 'center', gap: 10 }}>
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/appImages/Doc.png',
                      }}
                      style={{ width: 60, height: 70 }}
                    />
                    <Text
                      style={{
                        color: '#181D27',
                        fontSize: 10,
                        fontFamily: 'OpenSans-SemiBold',
                      }}>
                      Pan Card
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    // onPress={() => {
                    //   if(globalState?.userDetails?.documents[2].split('?')[2].endsWith('.pdf')){
                    //     navigation.navigate('DisplayDoc', {Link: globalState?.userDetails?.documents[2], screen: 'Doc'})
                    //   }else{
                    //     setPanDoc(globalState?.userDetails?.documents[2]);
                    //     setVisible(true);
                    //   }
                    // }}
                    onPress={() => {
                      const docUrl = globalState?.userDetails?.documents?.[2];

                      if (!docUrl) return;

                      const cleanUrl = docUrl.split('?')[0].trim().toLowerCase();

                      const isPdf = cleanUrl.endsWith('.pdf');

                      if (isPdf) {
                        navigation.navigate('DisplayDoc', {
                          Link: docUrl,
                          screen: 'Doc',
                        });
                      } else {
                        setPanDoc(docUrl);
                        setVisible(true);
                      }
                    }}
                    style={{ alignItems: 'center', gap: 10 }}>
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: 'https://duixj37yn5405.cloudfront.net/appImages/Doc.png',
                      }}
                      style={{ width: 60, height: 70 }}
                    />
                    <Text
                      style={{
                        color: '#181D27',
                        fontSize: 10,
                        fontFamily: 'OpenSans-SemiBold',
                      }}>
                      Cancelled Cheque
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>


          )}


          {BookingData?.length == 0 ? <></> : <TouchableOpacity
            onPress={() => {
              navigation.navigate('BookingHistory', { Booking: BookingData })
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical: 12,
              alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/History.png' }} />
              {/* <View style={{ paddingLeft: 3 }}>
                <Icco name={'clock'} size={18} color={'#081F62'} />
              </View> */}

              <View style={{ paddingLeft: 20 }}>
                <Text
                  style={{
                    color: '#181D27',
                    fontSize: 16,
                    fontFamily: 'OpenSans-SemiBold',
                  }}>
                  Purchase History
                </Text>
                {/* <Text style={{ color: '#ABABAB', fontSize: 11, fontFamily: 'OpenSans-Regular' }}>
                  View and track your purchase history
                </Text> */}
              </View>
            </View>
            <Icon name="chevron-right" size={25} color="#555252" />
          </TouchableOpacity>}

          {SiteData?.length == 0 ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SiteHistory', { site: SiteData });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                paddingVertical: 12,
                alignItems: 'center'
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/SiteVisit.png' }} />
                <View style={{ paddingLeft: 20 }}>
                  <Text
                    style={{
                      color: '#181D27',
                      fontSize: 16,
                      fontFamily: 'OpenSans-SemiBold',
                    }}>
                    Site Visit History
                  </Text>

                </View>
              </View>
              <Icon name="chevron-right" size={25} color="#555252" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              // handleFollow();
              navigation.navigate("Chat");
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical: 12,
              //paddingVertical: 20,
              alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Chat.png' }} />
              {/* <IconA name={'instagram'} size={25} color={'#081F62'} /> */}
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: '#181D27', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                  Chat
                </Text>

              </View>
            </View>
            <Icon name="chevron-right" size={25} color="#555252" />
          </TouchableOpacity>

          
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('MyProfile', { screen: 'home' });

            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              ///paddingTop: 20,
              paddingVertical: 12,
              //paddingVertical: 20,
              alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Support.png' }} />
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: '#181D27', fontSize: 14, fontFamily: 'OpenSans-SemiBold' }}>
                  Help & Support
                </Text>

              </View>
            </View>
            <Icon name="chevron-right" size={25} color="#555252" />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => {
              handleFollow();

            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical: 12,
              //paddingVertical: 20,
              alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/instagram.png' }} />
              {/* <IconA name={'instagram'} size={25} color={'#081F62'} /> */}
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: '#181D27', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                  Follow Us on Instagram
                </Text>

              </View>
            </View>
            <Icon name="chevron-right" size={25} color="#555252" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleJoin();

            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical: 12,
              //paddingVertical: 20,
              alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/whatsapp.png' }} />
              {/* <IconA name={'instagram'} size={25} color={'#081F62'} /> */}
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: '#181D27', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                  Join Our WhatsApp Channel
                </Text>

              </View>
            </View>
            <Icon name="chevron-right" size={25} color="#555252" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleRating();
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical: 12,
              alignItems: 'center'
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image style={{ height: 25, width: 25 }} source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/Rating.png' }} />
              {/* <IconA name="staro" size={25} color="#081F62" /> */}
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: '#181D27', fontSize: 16, fontFamily: 'OpenSans-SemiBold' }}>
                  Rate our app
                </Text>

              </View>
            </View>
            <Icon name="chevron-right" size={25} color="#555252" />
          </TouchableOpacity>

          <View style={{borderColor:'#0000004D',borderWidth:0.5,borderRadius:10,padding:15,marginTop:10}}>
            <View style={{alignItems:'center'}}>
              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:15,color:'#181D27'}}>Help and Support</Text>
              <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#00000080',marginTop:10}}>We’re here to help. Choose how you’d like to connect with us.</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20}}>
              <TouchableOpacity onPress={() => {
                openWhatsApp()
              }} style={{alignItems:'center',flex:1}}>
                <View style={{backgroundColor:'#29A71A33',borderRadius:30,padding:10,alignItems:'center',justifyContent:'center'}}>
                  <Icons name={'logo-whatsapp'} size={20} color={'#29A71A'}/>
                </View>
                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#000',textAlign:'center',marginTop:10}}>Connect with us on WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                const phone = "+919880626111"
                handleCallNow(phone);
              }} style={{alignItems:'center',flex:1,marginLeft:8}}>
                <View style={{backgroundColor:'#0212651a',borderRadius:30,padding:10,alignItems:'center',justifyContent:'center'}}>
                  <Icons name={'call'} size={18} color={'#021265'}/>
                </View>
                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#000',textAlign:'center',marginTop:10}}>For Support Enquiries</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                const phone = "+919063448275"
                handleCallNow(phone);
              }} style={{alignItems:'center',flex:1,marginLeft:8}}>
                <View style={{backgroundColor:'#0212651a',borderRadius:30,padding:10,alignItems:'center',justifyContent:'center'}}>
                  <Icons name={'call'} size={18} color={'#021265'}/>
                </View>
                <Text style={{fontFamily:'WorkSans-Regular',fontSize:10,color:'#000',textAlign:'center',marginTop:10}}>For Hospitality/Stays</Text>
              </TouchableOpacity>
            </View>
          </View>


        </View>

      <Text style={{ color: '#898585', fontSize: 12, fontFamily: 'WorkSans-Regular', textAlign: 'center',  }}>
        V 2.0.7
      </Text>
      <Text style={{color:'#021265',fontSize:14,fontFamily:'WorkSans-Medium',textAlign:'center'}}>Fracspace Private Limited</Text>

      <View style={{paddingBottom:120}}></View>

      </ScrollView>
      


      {/* <Footer navigation={navigation} activeFooterTab={'User'} /> */}
      <Modal transparent animationType='fade'
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalStyle={styles.customModal}>
        <View style={{flex:1, backgroundColor:'#00000065'}}>
          <TouchableOpacity onPress={() => {setModalVisible(false)}} style={{flex:1}}/>
          <View style={[styles.modal]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, alignItems: 'center' }}>
              <Text></Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#081F62',
                  textAlign: 'center',
                  paddingTop: 10,
                }}>
                {'  '}Profile Photo
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
              }}>
                <Icons name="close" size={25} color="#808080" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View></View>
              <View style={{ alignItems: 'center', margin: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    launchCamera();
                  }}
                  style={{
                    alignItems: 'center',
                    //flexDirection: 'row',
                    justifyContent: 'center',
                    // backgroundColor: '#043862',
                    // padding: 0,
                    // margin: 20,
                    borderColor: '#081F62',
                    borderWidth: 1,
                    borderRadius: 60,
                    padding: 15,
                    //width:'100%'
                  }}>
                  <CameraIcon name="camera" size={35} color="#081F62" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins-SemiBold',
                    color: '#081F62',
                  }}>
                  {'  '}Camera
                </Text>
              </View>
              <View style={{ alignItems: 'center', margin: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    launchGallery();
                  }}
                  style={{
                    alignItems: 'center',
                    //flexDirection: 'row',
                    justifyContent: 'center',
                    // backgroundColor: '#043862',
                    // padding: 0,
                    //margin: 20,
                    borderColor: '#081F62',
                    borderWidth: 1,
                    borderRadius: 60,
                    padding: 15,
                  }}>
                  <CameraIcon name="image-inverted" size={35} color="#081F62" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins-SemiBold',
                    color: '#081F62',
                  }}>
                  Gallery
                </Text>
              </View>
              <View></View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={Visible} transparent animationType="fade">
        <TouchableOpacity onPress={() => {
          setVisible(false);
        }}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            alignItems: 'center',zIndex:0
          }}>
          <View
            style={{
              position:'absolute',
              alignSelf:'center',
              width: width * 0.85,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 10,
              elevation: 10,
              shadowColor: '#000',
              zIndex:10
            }}>
            <Image
              source={{uri:PanDoc}}
              style={{width: '100%', height: 210, borderRadius: 10}}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 15,
                padding: 2,
              }}
              onPress={() => setVisible(false)}>
              <IconA name="closecircle" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
     </View>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({


  modal: {
    // paddingTop: hp(2),
    // height: hp(70),
    position:'absolute',bottom:0,left:0,right:0,
    width: '100%',
    alignSelf: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: 'white',
    // marginBottom:70
    // marginBottom: hp(6),
    //  borderBottomWidth: 0,
    //borderColor:'red',
    // borderWidth:3,
    //paddingHorizontal: 25,
    //paddingVertical:hp(2),
  },
});
