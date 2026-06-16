import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { GetLogin, GetOtpForLoginWithNumber, GetRegistration, OtpLoginWithEmail, verifyOtpLogin } from '../Services/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../Context/AppContext'
import analytics from '@react-native-firebase/analytics';

export default function NewSigin() {
    const [visible1, setVisible1] = useState(true);
    const { globalState, setGlobalState } = useContext(AppContext);
    const [visible2, setVisible2] = useState(false);
    const navigation = useNavigation();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
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

    const handleRegister = async () => {
        let payload = JSON.stringify(
            {
                userName: name,
                phoneNumber: selectedCode?.code+phone,
                email: email,
                countryCode:selectedCode?.code
            }
        );
        // console.log("Payload: ",payload);
        try {
            let { data: res } = await GetRegistration(payload);
            if (res?.success) {
                if (selectedCode.code === '+91') {
                    //handleLogin();
                    await handleLogin();
                } else {
                    handleLoginWithEmail();
                }


            }
        } catch (error) {
            if (error?.response) {
                if (error.response.status === 409) {
                    Alert.alert('Response Error', `${error?.response?.data?.message}`);
                    // You can show this in a toast, alert, etc.
                } else {
                    console.error('API error:', error.response.data);
                }
                //  console.log('like', `${JSON.stringify(error?.response)}`);

            } else if (error?.request) {
                // console.log('like', `${JSON.stringify(error?.request)}`);
                Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
            } else {
                Alert.alert('Error:', `${error?.message}`);
            }

        }
    }

    const handleLogin = async () => {
        let payload = JSON.stringify(
            {
                phoneNumber:selectedCode?.code+phone,
                smsCountry: true
            }
        );
        try {
            let { data: res } = await GetLogin(payload);
            if (res?.success) {
                setVisible1(false);
                setVisible2(true);


            }

        } catch (error) {
            //  console.error('Erorr in Login: ', error);
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
                // console.error('Erorr in Login: ', error);
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
    }

    const handleOTPLogin = async () => {
        const otp = otpDigits.join('');
        const payload = JSON.stringify(
            {
                phoneNumber: selectedCode?.code+phone,
                otp: otp,
                smsCountry: true
            }
        );
        try {
            let { data: res } = await GetOtpForLoginWithNumber(payload);
            // if (res?.success) {

            //     //setPhoneVerification(true);
            //     await AsyncStorage.setItem('mytoken', res?.data);
            //     await AsyncStorage.setItem('Email', res?.email);
            //     setGlobalState(prevState => ({
            //         ...prevState,
            //         userName: res?.userName,
            //         userEmail: res?.email,
            //         token: res?.data,
            //     }));

            //     if(globalState?.pendingDeepLinkType === 'property' &&
            //         globalState?.pendingDeepLinkId
            //     ) {
            //         navigation.reset({
            //             index: 0,
            //             routes: [
            //                 { name: 'BottomNavigations' },
            //                 {
            //                     name: 'Property',
            //                     params: { Id: globalState.pendingDeepLinkId },
            //                 },
            //             ],
            //         });
            //         setGlobalState(prev => ({
            //             ...prev,
            //             pendingDeepLinkType: null,
            //             pendingDeepLinkId: null
            //         }));
            //     } else if(globalState.pendingDeepLinkType === 'wallet_section'){
            //         navigation.reset({
            //             index: 0,
            //             routes: [
            //             {name: 'BottomNavigations'},
            //             {
            //                 name: 'WalletAmount'
            //             }
            //             ]
            //         })

            //         setGlobalState(prev => ({
            //             ...prev,
            //             pendingDeepLinkType: null
            //         }))
            //     } else {
            //         navigation.reset({
            //             index: 0,
            //             routes: [{ name: 'BottomNavigations' }],
            //         });
            //     }

            //     // setLoader(false);
            //     // navigation.navigate('BottomNavigations');
            // }

            if (res?.success) {

                await AsyncStorage.setItem('mytoken', res?.data);
                await AsyncStorage.setItem('Email', res?.email);

                analytics().logEvent('newUser_signin_indian', {
                    user_id: res?.email,
                });

                setGlobalState(prevState => ({
                    ...prevState,
                    userName: res?.userName,
                    userEmail: res?.email,
                    // userPhone: selectedCode?.code + phone,
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
    };

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
            //     await AsyncStorage.setItem('mytoken', res?.data);
            //     await AsyncStorage.setItem('Email', email);
            //     setGlobalState(prevState => ({
            //         ...prevState,
            //         userName: res?.userName,
            //         userEmail: email,
            //         token: res?.data,
            //     }));

            //     if(globalState?.pendingDeepLinkType === 'property' &&
            //         globalState?.pendingDeepLinkId
            //     ) {
            //         navigation.reset({
            //             index: 0,
            //             routes: [
            //                 {name: 'BottomNavigations'},
            //                 {
            //                     name: 'Property',
            //                     params: { Id: globalState?.pendingDeepLinkId },
            //                 },
            //             ],
            //         });
            //         setGlobalState(prev => ({
            //             ...prev,
            //             pendingDeepLinkType: null,
            //             pendingDeepLinkId: null
            //         }));
            //     } else if(globalState.pendingDeepLinkType === 'wallet_section'){
            //         navigation.reset({
            //             index: 0,
            //             routes: [
            //             {name: 'BottomNavigations'},
            //             {
            //                 name: 'WalletAmount'
            //             }
            //             ]
            //         })

            //         setGlobalState(prev => ({
            //             ...prev,
            //             pendingDeepLinkType: null
            //         }))
            //     } else {
            //         navigation.reset({
            //             index: 0,
            //             routes: [{ name: 'BottomNavigations' }],
            //         });
            //     }

            //     // navigation.navigate('BottomNavigations');
            // }

            if (res?.success) {

                await AsyncStorage.setItem('mytoken', res?.data);
                await AsyncStorage.setItem('Email', res?.email);

                analytics().logEvent('newUser_signin_international', {
                    user_id: res?.email,
                });

                setGlobalState(prevState => ({
                    ...prevState,
                    userName: res?.userName,
                    userEmail: res?.email,
                    // userPhone: selectedCode?.code + phone,
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
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#E8E8E8', paddingTop: 50, flex: 1 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1 }}>

                    {(visible2) && (
                        <View style={{ padding: 20, alignSelf: 'flex-start' }}>
                            <TouchableOpacity onPress={() => {
                                setVisible2(false);
                                setVisible1(true);
                            }} style={{ backgroundColor: '#EFF3F9', padding: 7, borderRadius: 5 }}>
                                <Icon name={'arrowleft'} size={20} color={'#160D1F'} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {visible1 && (
                        <View>
                            <View style={{ padding: 20, alignSelf: 'flex-start' }}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('NewLogin');
                                }} style={{ backgroundColor: '#EFF3F9', padding: 7, borderRadius: 5 }}>
                                    <Icon name={'arrowleft'} size={20} color={'#160D1F'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 30 }}>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 25, color: '#000000' }}>Welcome to
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 25, color: '#0F1130' }}> FRACSPACE</Text>
                                </Text>
                                {/* <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 18, color: '#8E9398' }}>Please verify your email to continue</Text> */}
                            </View>
                            <View style={{ padding: 20, marginTop: 20 }}>
                                <View>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Your Name</Text>
                                    <View style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10, marginTop: 10 }}>
                                        <TextInput
                                            placeholder='Enter your name'
                                            placeholderTextColor={'#B2B8BD'}
                                            style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, color: '#160D1F' }}
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginVertical: 15 }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Email</Text>
                                    <View style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10, marginTop: 10 }}>
                                        <TextInput
                                            placeholder='Enter your email'
                                            placeholderTextColor={'#B2B8BD'}
                                            style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#160D1F' }}
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#160D1F' }}>Phone Number</Text>
                                    <View style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 11, paddingHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => setShowPicker(true)}
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#000000' }}>{selectedCode.code}</Text>
                                            <Icon name={'caretdown'} size={10} color={'#000000'} style={{ marginLeft: 5 }} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <TextInput
                                                placeholder='Enter your number'
                                                placeholderTextColor={'#B2B8BD'}
                                                style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#160D1F' }}
                                                keyboardType='number-pad'
                                                maxLength={10}
                                                value={phone}
                                                onChangeText={setPhone}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <CountryPicker
                                    show={showPicker}
                                    pickerButtonOnPress={(item) => {
                                        setSelectedCode({ code: item.dial_code, name: item.name });
                                        setShowPicker(false)
                                    }}
                                    onBackdropPress={() => setShowPicker(false)}
                                    style={{
                                        modal: { height: 400 },
                                        countryName: { color: '#000000' },
                                        flag: { color: '#000000' },
                                        dialCode: { color: '#000000' },
                                        textInput: { color: '#000000' }
                                    }}
                                />

                                <TouchableOpacity onPress={async () => {
                                    if (phone === '' || name === '' || email === '') {
                                        Alert.alert('Oops! You missed some details.');
                                        return;
                                    } else {
                                        handleRegister();

                                    }


                                }} style={{ backgroundColor: '#0F1130', borderRadius: 11, padding: 12, alignItems: 'center', marginTop: 25 }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Register</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('NewLogin');
                            }} style={{ alignSelf: 'center', marginTop: 20 }}>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>
                                    Already have an account? <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#000000' }}>Sign in</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {visible2 && (
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ marginTop: 30 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 18, color: '#8E9398' }}>
                                    Please enter the code we sent to {' '}
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 18, color: '#272A2B' }}>{selectedCode.code === '+91' ?`${phone}` : `${email}`}</Text>
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center',width:'100%',justifyContent:'space-between', marginTop: 40 }}>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <View key={index} style={{ borderColor: '#E1E6EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 5 }}>
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
                            </View>

                            <TouchableOpacity onPress={() => {
                                if (selectedCode.code == '+91') {
                                    handleOTPLogin();
                                } else {
                                    handleOtpLoginWithEmail()
                                }

                            }} style={{ backgroundColor: '#0F1130', padding: 12, alignItems: 'center', borderRadius: 10, marginTop: 40 }}>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 18, color: '#FFFFFF' }}>Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (selectedCode.code == '+91') {
                                    //handleLogin();
                                    handleLogin();
                                } else {
                                    handleLoginWithEmail();
                                }

                            }} style={{ alignItems: 'center', marginTop: 30 }}>
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#8E9398' }}>Didn’t get ?{' '}
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#272A2B', textDecorationLine: 'underline' }}>Send me a new OTP</Text></Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
