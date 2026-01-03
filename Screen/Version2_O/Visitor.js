import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/Entypo';
import { CountryPicker } from 'react-native-country-codes-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Visitor() {
    const navigation = useNavigation();
    const [VisitorData, setVisitorData] = useState({ Name: '',CountryCode:'+91', Phone: '', Email: '', Country: '', City: '', Term: false, Here: '', Bring: '' });
    const [PreferDate, setPreferDate] = useState([]);
    const [show, setShow] = useState(false);

    return (
      <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAFAFF',
                width: '100%'
            }}>
                <TouchableOpacity style={{ flex: 1, padding: 20, }}
                    onPress={() => {
                        navigation.navigate('Exposcreen');

                    }}>
                    <Icon name="chevron-back-outline" size={25} color={'#000'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, padding: 20, }}
                    onPress={() => {
                        navigation.navigate('HomePage');

                    }}>
                    <Text style={{
                        fontSize: 15,
                        fontFamily: 'WorkSans-SemiBold',
                        color: '#0424CB',
                        textAlign: 'right'
                    }}>EXIT</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ backgroundColor: '#FAFAFF', }}>
                <View style={{paddingHorizontal:20}}>
                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 18, color: '#170F49', textAlign: 'center', paddingBottom: 10, }}>Visitors Registration Form</Text>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#170F49', textAlign: 'center', }}>Please fill out the form and our team will get back to </Text>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#170F49', textAlign: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0EFFB' }}>you with more information.</Text>
                <Text style={{
                    fontSize: 16,
                    fontFamily: 'WorkSans-SemiBold',
                    color: '#010101',
                    paddingVertical: 10
                    // textAlign: 'right'
                }}>Basic Details: </Text>



                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 10,
                    paddingBottom: 10

                }}>Full Name</Text>
                <View style={styles.input}>


                    <TextInput
                        style={{
                            width: '100%',
                            paddingVertical:10,
                            // paddingLeft: 30,
                            paddingHorizontal: 10,
                            color: '#010101',
                            fontSize:12,
                            fontFamily: 'WorkSans-Regular',
                        }}
                        placeholder="Enter Full Name"
                        placeholderTextColor={'#000'}
                        value={VisitorData?.Name}
                        onChangeText={txt => {
                            setVisitorData({ ...VisitorData, Name: txt });
                        }}
                    />
                </View>




                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 20,
                    paddingBottom: 10

                }}>Email Address</Text>
                <View style={styles.input}>


                    <TextInput
                        style={{
                            width: '100%',
                            paddingVertical:10,
                            // paddingLeft: 30,
                            paddingHorizontal: 10,
                            color: '#010101',
                            fontSize:12,
                            fontFamily: 'WorkSans-Regular',
                        }}
                        placeholder="Enter Email Id"

                        // multiline
                        placeholderTextColor={'#000'}
                        value={VisitorData?.Email}
                        onChangeText={txt => {
                            setVisitorData({ ...VisitorData, Email: txt });
                            //setEmail(txt);
                        }}
                    />

                    {/* </View> */}
                </View>

                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 20,
                    paddingBottom: 10

                }}>Phone</Text>

                <View
                    style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        //  paddingLeft: 10,
                        //paddingVertical: 8,
                    }}>
                    <TouchableOpacity
                        onPress={() => setShow(true)}
                        style={{
                            width: '20%',
                            // height: 50,
                            borderColor: '#ADB2BB',
                            borderWidth: 1,
                            //backgroundColor: '#C0C0C0',
                            //backgroundColor: '#043862',
                            paddingVertical: 10,
                            paddingHorizontal:8,
                            borderRadius: 5,
                            marginRight: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            // borderWidth:1
                        }}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-Medium',
                                // color: '#ffff',
                                color: '#1E2135',
                                fontSize: 14,
                            }}>
                            {VisitorData?.CountryCode}
                        </Text>
                        <Icon name="caret-down" size={15} color="#1E2135" />
                    </TouchableOpacity>

                    <View style={[styles.input, { width: '75%' }]}>
                        <TextInput
                            style={{
                                width: '100%',
                                paddingVertical:10,
                                // paddingLeft: 30,
                                paddingHorizontal: 10,
                                color: '#010101',
                                fontSize:12,
                                fontFamily: 'WorkSans-Regular',
                            }}
                            placeholder="Enter Mobile Number"

                            // multiline
                            placeholderTextColor={'#000'}
                            keyboardType='number-pad'
                            maxLength={10}
                            value={VisitorData?.Phone}
                            onChangeText={txt => {
                                setVisitorData({ ...VisitorData, Phone: txt });
                                // setPhone(txt);
                            }}
                        />
                    </View>
                </View>

                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 20,
                    paddingBottom: 10

                }}>Country</Text>
                <View style={styles.input}>


                    <TextInput
                        style={{
                            width: '100%',
                            paddingVertical:8,
                            // paddingLeft: 30,
                            paddingHorizontal: 10,
                            color: '#010101',
                            fontSize:12,
                            fontFamily: 'WorkSans-Regular',
                        }}
                        placeholder="Enter Country"

                        // multiline
                        placeholderTextColor={'#000'}
                        value={VisitorData?.Country}
                        onChangeText={txt => {
                            setVisitorData({ ...VisitorData, Country: txt });
                            //setCountry(txt);
                        }}
                    />
                </View>

                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 20,
                    paddingBottom: 10

                }}>City</Text>
                <View style={styles.input}>


                    <TextInput
                        style={{
                            width: '100%',
                            paddingVertical:10,
                            // paddingLeft: 30,
                            paddingHorizontal: 10,
                            color: '#010101',
                            fontSize:12,
                            fontFamily: 'WorkSans-Regular',
                        }}
                        placeholder="Enter City"
                        placeholderTextColor={'#000'}
                        value={VisitorData?.City}
                        onChangeText={txt => {
                            setVisitorData({ ...VisitorData, City: txt });
                            // setCity(txt);
                        }}
                    />
                </View>
                <Text style={{
                    fontSize: 14,
                    fontFamily: 'WorkSans-Medium',
                    color: '#000000',
                    paddingTop: 20,
                    paddingBottom: 10

                }}>Preferred Dates (14, 15, 16 Nov 2025)</Text>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        // paddingHorizontal: 20,
                        marginBottom: 20
                    }}
                    onPress={() => {
                        if (PreferDate.includes('14 Nov 2025')) {
                            let Design = PreferDate.filter(item => item != '14 Nov 2025');
                            setPreferDate(Design);

                        } else {
                            setPreferDate([...PreferDate, '14 Nov 2025']);
                        }
                        //navigation.navigate('ExhibitorDetails');


                    }}>
                    <View style={styles.option}>
                        <View style={[styles.checkbox, { backgroundColor: PreferDate.includes('14 Nov 2025') ? '#021265' : '#FFFFFF', borderWidth: 1, borderColor: '#292D32' }]}>
                            {PreferDate.includes('14 Nov 2025') && (
                                <IconAntDesign name="check" size={10} color="#FFFFFF" />
                            )}
                        </View>
                    </View>

                    <Text style={{
                        fontSize: 13,
                        fontFamily: 'WorkSans-Medium',
                        color: '#000000',
                        paddingLeft: 10,
                        opacity:0.9


                    }}>14 Nov 2025</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        // paddingHorizontal: 20,

                    }}
                    onPress={() => {
                        if (PreferDate.includes('15 Nov 2025')) {
                            let Design = PreferDate.filter(item => item != '15 Nov 2025');
                            setPreferDate(Design);

                        } else {
                            setPreferDate([...PreferDate, '15 Nov 2025']);
                        }


                        //navigation.navigate('ExhibitorDetails');


                    }}>
                    <View style={styles.option}>
                        <View style={[styles.checkbox, { backgroundColor: PreferDate.includes('15 Nov 2025') ? '#021265' : '#FFFFFF', borderWidth: 1, borderColor: '#292D32' }]}>
                            {PreferDate.includes('15 Nov 2025') && (
                                <IconAntDesign name="check" size={10} color="#FFFFFF" />
                            )}
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'WorkSans-Medium',
                        color: '#000000',
                        paddingLeft: 10,
                        opacity:0.9
                        // paddingTop: 20,
                        // paddingBottom: 10

                    }}>15 Nov 2025</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        // paddingHorizontal: 20,
                        marginVertical: 20,
                        paddingBottom: 20

                    }}
                    onPress={() => {
                        if (PreferDate.includes('16 Nov 2025')) {
                            let Design = PreferDate.filter(item => item != '16 Nov 2025');
                            setPreferDate(Design);

                        } else {
                            setPreferDate([...PreferDate, '16 Nov 2025']);
                        }




                    }}>
                    <View style={styles.option}>
                        <View style={[styles.checkbox, { backgroundColor: PreferDate.includes('16 Nov 2025') ? '#021265' : '#FFFFFF', borderWidth: 1, borderColor: '#292D32' }]}>
                            {PreferDate.includes('16 Nov 2025') && (
                                <IconAntDesign name="check" size={10} color="#FFFFFF" />
                            )}
                        </View>
                    </View>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'WorkSans-Medium',
                        color: '#000000',
                        paddingLeft: 10,
                        opacity:0.9
                        // paddingTop: 20,
                        //paddingBottom: 10

                    }}>16 Nov 2025</Text>



                </TouchableOpacity>












                </View>
                <View
                    style={{
                        width: '100%',
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 40,
                        // opacity:0.4
                    }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#FFFFFF',
                            flex: 1,
                            borderRadius: 15,
                            alignItems: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 18,
                            borderWidth: 1,
                            borderColor: '#021265',
                            marginRight: 15,
                        }}
                        onPress={() => {
                            console.log(VisitorData);

                            //navigation.navigate('ExhibitorDetails');


                        }}>
                        <Text
                            style={{
                                // fontFamily: 'Roboto',
                                fontSize: 14,
                                fontFamily: "Poppins-SemiBold",
                                color: '#021265',
                            }}>
                            Go Back
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#021265',
                            flex: 1,
                            borderRadius: 15,
                            alignItems: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 18
                        }}
                        onPress={() => {
                            navigation.navigate('VisitorDetail', { VisitorDetails: VisitorData, ExpDate: PreferDate });

                            // navigation.navigate('Enquirenew', { property: PropertiesArray });
                        }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: 'Poppins-SemiBold',
                                color: '#FFFFFF',
                            }}>
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>





            </ScrollView>

            <CountryPicker
                show={show}
                pickerButtonOnPress={item => {
                    setVisitorData({ ...VisitorData, CountryCode: item.dial_code });
                   // setCountryCode(item.dial_code);
                    setShow(false);
                }}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({



    input: {
        borderColor: '#ADB2B8',
        borderWidth: 1,
        borderRadius: 5,
        fontFamily: 'Barlow-Medium',
        fontSize: 16,

    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        //width:'100%'
    },
    checkbox: {
        height: 15,
        width: 15,
        backgroundColor: '#021265',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'

    },




});


