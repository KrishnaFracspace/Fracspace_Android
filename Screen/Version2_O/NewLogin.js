import { View, Text, SafeAreaView, TextInput, Image, TouchableOpacity, Alert, BackHandler } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import Ico from 'react-native-vector-icons/Ionicons'
import Ic from 'react-native-vector-icons/AntDesign'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { GetLogin, GetOtpForLoginWithNumber, OtpLoginWithEmail, verifyOtpLogin } from '../Services/UserApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/AppContext'
import analytics from '@react-native-firebase/analytics';

export default function NewLogin() {
  const navigation = useNavigation();
  const { globalState, setGlobalState } = useContext(AppContext);
  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [showPicker, setShowPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: '+91', name: 'India' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = text;
    setOtpDigits(updatedOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key == 'Backspace' && otpDigits[index] == '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };


  const handleLogin = async () => {
    const payload = JSON.stringify({
      phoneNumber: selectedCode?.code + phone,
      smsCountry: true
    });

    try {
      const { data: res } = await GetLogin(payload);
      if (res?.success) {
        setVisible2(true);
        setVisible1(false);

      }

    } catch (error) {
      if (error?.response) {
        if (error.response.status == 401) {
          Alert.alert('User not found!', "You're not registered yet. Sign up now.");
          // You can show this in a toast, alert, etc.
        } else {
          console.error('API error:', error.response.data);
        }
        console.log('like', `${JSON.stringify(error?.response)}`);

      } else if (error?.request) {
        // console.log('like', `${JSON.stringify(error?.request)}`);
        Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }

    }
  };

  const handleOTPLogin = async () => {
    const otp = otpDigits.join('');

    const payload = JSON.stringify(
      {
        phoneNumber: selectedCode?.code + phone,
        otp: otp,
        smsCountry: true
      }
    );
  //  console.log('Response:', payload);
    try {
      let { data: res } = await GetOtpForLoginWithNumber(payload);

      // if (res?.success) {

      //   await AsyncStorage.setItem('mytoken', res?.data);
      //   await AsyncStorage.setItem('Email', res?.email);

      //   setGlobalState(prevState => ({
      //     ...prevState,
      //     userName: res?.userName,
      //     userEmail: res?.email,
      //     userPhone: selectedCode?.code + phone,
      //     token: res?.data,
      //   }));

      //   // ✅ Check deep link AFTER login
      //   if (
      //     globalState.pendingDeepLinkType === 'property' &&
      //     globalState.pendingDeepLinkId
      //   ) {

      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         { name: 'BottomNavigations' },
      //         {
      //           name: 'Property',
      //           params: { Id: globalState.pendingDeepLinkId },
      //         },
      //       ],
      //     });

      //     // ✅ Clear deep link safely
      //     setGlobalState(prev => ({
      //       ...prev,
      //       pendingDeepLinkType: null,
      //       pendingDeepLinkId: null,
      //     }));

      //   } else if(globalState.pendingDeepLinkType === 'wallet_section'){
      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         {name: 'BottomNavigations'},
      //         {
      //           name: 'WalletAmount'
      //         }
      //       ]
      //     })

      //     setGlobalState(prev => ({
      //       ...prev,
      //       pendingDeepLinkType: null
      //     }))
      //   } else if(globalState.pendingDeepLinkType === 'payment_link'){
      //     navigation.reset({
      //       index:0,
      //       routes:[
      //         {name: 'BottomNavigations'},
      //         {
      //           name: 'Book',
      //           params: {Id: globalState?.pendingDeepLinkId}
      //         }
      //       ]
      //     })
      //   } else {

      //     navigation.reset({
      //       index: 0,
      //       routes: [{ name: 'BottomNavigations' }],
      //     });

      //   }
      // }

      if (res?.success) {

        await AsyncStorage.setItem('mytoken', res?.data);
        await AsyncStorage.setItem('Email', res?.email);
        // console.log("TOken: ",res?.data);

        analytics().logEvent('user_login_indian', {
            user_id: res?.email,
        });

        setGlobalState(prevState => ({
          ...prevState,
          userName: res?.userName,
          userEmail: res?.email,
          userPhone: selectedCode?.code + phone,
          token: res?.data,
        }));

        // Small delay ensures globalState is updated properly
        setTimeout(() => {

          const { pendingDeepLinkType, pendingDeepLinkId } = globalState;

          switch (pendingDeepLinkType) {

            // ✅ PROPERTY (property + property_share)
            case 'property':
              if (pendingDeepLinkId) {
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'BottomNavigations' },
                    {
                      name: 'Property',
                      params: { Id: pendingDeepLinkId },
                    },
                  ],
                });
              }
              break;

            // ✅ PAYMENT LINK
            case 'payment_link':
              if (pendingDeepLinkId) {
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'BottomNavigations' },
                    {
                      name: 'Book',
                      params: { Id: pendingDeepLinkId },
                    },
                  ],
                });
              }
              break;

            // ✅ WALLET
            case 'wallet_section':
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'BottomNavigations' },
                  { name: 'WalletAmount' },
                ],
              });
              break;

            case 'escape_section':
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'BottomNavigations'},
                  {name: 'MembershipHome'},
                ],
              });
              break;

            case 'concert_section':
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'BottomNavigations'},
                  {
                    name: 'ConcertDetails',
                    params: { concertId: pendingDeepLinkId || null },
                  },
                ],
              });
              break;

            // ✅ NORMAL LOGIN (No deep link)
            default:
              navigation.reset({
                index: 0,
                routes: [{ name: 'BottomNavigations' }],
              });
              break;
          }

          // ✅ Clear deep link after handling
          setGlobalState(prev => ({
            ...prev,
            pendingDeepLinkType: null,
            pendingDeepLinkId: null,
          }));

        }, 300);
      }



    } catch (error) {

      if (error?.response) {
        console.error('Response Error', `${error?.response?.data?.message}`);
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('Request error', `${JSON.stringify(error?.request)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        //console.log('Error:', `${error?.message}`);
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleLoginWithEmail = async () => {
    let payload = JSON.stringify(
      {
        email: email
      }
    );
    try {
      let { data: res } = await OtpLoginWithEmail(payload);
      if (res?.success) {
        setVisible2(true);
        setVisible1(false);

      }
    } catch (error) {
      if (error?.response) {
        if (error.response.status == 401) {
          Alert.alert('User not found!', "You're not registered yet. Sign up now.");
          // You can show this in a toast, alert, etc.
        } else {
          console.error('API error:', error.response.data);
        }
        console.log('like', `${JSON.stringify(error?.response)}`);

      } else if (error?.request) {
        // console.log('like', `${JSON.stringify(error?.request)}`);
        Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  }

  const handleOtpLoginWithEmail = async () => {
    const otp = otpDigits.join('');
    let payload = JSON.stringify(
      {
        email: email,
        otp: otp
      }
    );
    try {
      let { data: res } = await verifyOtpLogin(payload);

      // if (res?.success) {

      //   await AsyncStorage.setItem('mytoken', res?.data);
      //   await AsyncStorage.setItem('Email', res?.email);

      //   setGlobalState(prevState => ({
      //     ...prevState,
      //     userName: res?.userName,
      //     userEmail: res?.email,
      //     // userPhone: selectedCode?.code + phone,
      //     token: res?.data,
      //   }));

      //   // ✅ Check deep link AFTER login
      //   if (
      //     globalState.pendingDeepLinkType === 'property' &&
      //     globalState.pendingDeepLinkId
      //   ) {

      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         { name: 'BottomNavigations' },
      //         {
      //           name: 'Property',
      //           params: { Id: globalState.pendingDeepLinkId },
      //         },
      //       ],
      //     });

      //     // ✅ Clear deep link safely
      //     setGlobalState(prev => ({
      //       ...prev,
      //       pendingDeepLinkType: null,
      //       pendingDeepLinkId: null,
      //     }));

      //   } else if(globalState.pendingDeepLinkType === 'wallet_section'){
      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         {name: 'BottomNavigations'},
      //         {
      //           name: 'WalletAmount'
      //         }
      //       ]
      //     })

      //     setGlobalState(prev => ({
      //       ...prev,
      //       pendingDeepLinkType: null
      //     }))
      //   } else {

      //     navigation.reset({
      //       index: 0,
      //       routes: [{ name: 'BottomNavigations' }],
      //     });

      //   }
      // }

      if (res?.success) {

        await AsyncStorage.setItem('mytoken', res?.data);
        await AsyncStorage.setItem('Email', res?.email);

        analytics().logEvent('user_login_international', {
            user_id: res?.email,
        });

        setGlobalState(prevState => ({
          ...prevState,
          userName: res?.userName,
          userEmail: res?.email,
          userPhone: selectedCode?.code + phone,
          token: res?.data,
        }));

        // Small delay ensures globalState is updated properly
        setTimeout(() => {

          const { pendingDeepLinkType, pendingDeepLinkId } = globalState;

          switch (pendingDeepLinkType) {

            // ✅ PROPERTY (property + property_share)
            case 'property':
              if (pendingDeepLinkId) {
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'BottomNavigations' },
                    {
                      name: 'Property',
                      params: { Id: pendingDeepLinkId },
                    },
                  ],
                });
              }
              break;

            // ✅ PAYMENT LINK
            case 'payment_link':
              if (pendingDeepLinkId) {
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'BottomNavigations' },
                    {
                      name: 'Book',
                      params: { Id: pendingDeepLinkId },
                    },
                  ],
                });
              }
              break;

            // ✅ WALLET
            case 'wallet_section':
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'BottomNavigations' },
                  { name: 'WalletAmount' },
                ],
              });
              break;

            case 'escape_section':
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'BottomNavigations'},
                  {name: 'MembershipHome'},
                ],
              });
              break;

            case 'concert_section':
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'BottomNavigations'},
                  {
                    name: 'ConcertDetails',
                    params: { concertId: pendingDeepLinkId || null },
                  },
                ],
              });
              break;

            // ✅ NORMAL LOGIN (No deep link)
            default:
              navigation.reset({
                index: 0,
                routes: [{ name: 'BottomNavigations' }],
              });
              break;
          }

          // ✅ Clear deep link after handling
          setGlobalState(prev => ({
            ...prev,
            pendingDeepLinkType: null,
            pendingDeepLinkId: null,
          }));

        }, 300);
      }

    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // console.log('like', `${JSON.stringify(error?.request)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }

    }
  }


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
  return (

    <View style={{ backgroundColor: '#E8E8E8', paddingTop: 50, flex: 1 }}>
      <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, flex: 1, borderTopRightRadius: 30 }}>
        <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 23, color: '#160D1F' }}>Sign in</Text>
          <TouchableOpacity
            onPress={() => {navigation.navigate('NewSigin'); }} style={{ backgroundColor: '#EFF3F9', padding: 5, borderRadius: 5 }}>
            <Icon name={'cross'} size={20} color={'#160D1F'} />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20 }}>
          {visible1 &&
            <View>
              <View>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Phone Number</Text>
                <View style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>
                      {selectedCode.code}
                    </Text>
                    <Ic name={'caretdown'} size={10} color={'#000000'} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <TextInput
                      placeholder='Enter your Number'
                      placeholderTextColor={'#B2B8BD'}
                      style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#160D1F' }}
                      keyboardType='number-pad'
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>
              </View>

              {selectedCode.code !== '+91' &&
                <View style={{ marginTop: 15 }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Email</Text>
                  <View style={{ borderColor: '#E1E8EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginTop: 10 }}>
                    <TextInput
                      placeholder='Enter your email'
                      placeholderTextColor={'#B2B8BD'}
                      style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#160D1F' }}
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>
              }

              <CountryPicker
                show={showPicker}
                pickerButtonOnPress={(item) => {
                  setSelectedCode({ code: item.dial_code, name: item.name });
                  setShowPicker(false);
                }}
                onBackdropPress={() => setShowPicker(false)}
                style={{
                  modal: { height: 400 },
                  countryName: { color: '#000000' },
                  dialCode: { color: '#000000' },
                  flag: { color: '#000000' },
                  textInput: { color: '#000000' }
                }}
              />

              <TouchableOpacity onPress={() => {
                if (phone === '') {
                  Alert.alert('Oops! You missed the phone number.');
                  return;
                }

                if (selectedCode.code === '+91') {
                  handleLogin();
                } else {
                  handleLoginWithEmail();
                }
              }} style={{ backgroundColor: '#EFF3F9', padding: 13, borderRadius: 11, alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 15, color: '#160D1F' }}>Get OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                navigation.navigate('NewSigin');
              }} style={{ alignSelf: 'center', marginTop: 40 }}>
                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>
                  Don't have an account yet? <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000000' }}> Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          }

          {visible2 &&
            <>
              <View style={{ alignSelf: 'flex-start' }}>
                <TouchableOpacity onPress={() => {
                  setVisible1(true);
                  setVisible2(false);
                }} style={{ backgroundColor: '#EFF3F9', padding: 7, borderRadius: 5 }}>
                  <Ic name={'arrowleft'} size={20} color={'#160D1F'} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 18, color: '#8E9398' }}>
                    Please enter the code we sent to {' '}
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 18, color: '#272A2B' }}>
                      {selectedCode.code === '+91' ?
                        `${phone}` : `${email}`
                      }
                    </Text>
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 40, width: '100%' }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <View
                      key={index}
                      style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8 }}
                    >
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={{ fontFamily: 'WorkSans-Medium', fontSize: 20, color: '#000000', textAlign: 'center', }}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={otpDigits[index]}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      />
                      <View style={{ borderTopColor: '#8E9398', borderTopWidth: 1, marginBottom: 10 }}></View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity onPress={() => {
                  if (selectedCode.code === '+91') {
                    handleOTPLogin();
                  } else {
                    handleOtpLoginWithEmail();
                  }
                }} style={{ backgroundColor: '#0F1130', padding: 12, alignItems: 'center', borderRadius: 10, marginTop: 40 }}>
                  <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20, color: '#FFFFFF' }}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  if (selectedCode.code === '+91') {
                    handleLogin();
                  } else {
                    handleLoginWithEmail();
                  }
                }} style={{ alignItems: 'center', marginTop: 30 }}>
                  <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>Didn’t get ?{' '}
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#272A2B', textDecorationLine: 'underline' }}>Send me a new OTP</Text></Text>
                </TouchableOpacity>
              </View>
            </>
          }
        </View>
      </View>
    </View>

  )
}