import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import IconAntDesign from 'react-native-vector-icons/Entypo';
import { PropertyBook } from './Services/UserApi';
import { AppContext } from './Context/AppContext';
import Icon from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Book(props) {
 // console.log(props?.route?.params?.property?.image?.Image1);

  const { globalState, setGlobalState } = useContext(AppContext);
  const navigation = useNavigation();
  const [Number, setNumber] = useState(1);
  const [Terms, setTerms] = useState(false);
  const [Property, setProperty] = useState(props?.route?.params?.property);
  const [Available, setAvailable] = useState(
    props?.route?.params?.property?.AvailableFractions,
  );

  const IncrementCount = () => {
    if (Number < Available) {
      setNumber(Number + 1);
    }
  };

  const DecrementCount = () => {
    if (Number > 1) {
      setNumber(Number - 1);
    }
  };
  const handleBooking = async item => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyName: Property?.name,
      propertyId: Property?._id,
      Price: Property?.Price,
      FC_Price: Property?.FC_Price,
      fractionValue: Property?.FC_Price,
      numberOfFractions: Number,
      totalBookingAmount: Number * Property?.BookingAmount,
      termsAndConditions: Terms,
    });
    try {
      let { data: res } = await PropertyBook(payload);
     // console.log(res);

      if (res?.success) {
        navigation.navigate('Review', { proprtyDetails: res, PropertyImage: Property?.image?.Image1 });
      }
    } catch (error) {
      if (error.response) {
        //console.log(error?.response?.data?.message);

        Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', `${JSON.stringify(error)}`);
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        borderBottomColor: '#DDE1E5',
        backgroundColor: '#021265'
      }}>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
          
            navigation.navigate('Property',{details:Property});

          }}>
          <IconC name="chevron-back-outline" size={25} color={'#FFFFFF'} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontFamily: 'WorkSans-SemiBold',
          color: '#FFFFFF',
        }}>
          Book
        </Text>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
            navigation.navigate('HomePage');

          }}>
          <Text style={{
            fontSize: 15,
            fontFamily: 'WorkSans-SemiBold',
            color: '#FFFFFF',
            textAlign: 'right'
          }}>EXIT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{width:'100%', padding: 20, backgroundColor: '#FFFFFF',}}>
      
        <Text
          style={{
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 20,
            color: '#000000',
          }}>
          Hurry ! Book your property now
        </Text>
        <View style={{ width: '100%', alignItems: 'center',flex:1,}}>
          <Image
            resizeMode="cover"
            source={{ uri: Property?.image?.Image1 }}
            style={{
              width: '100%',
              height: height * 0.34,
              borderRadius: 8,
              marginTop: 20,
            }}
          />
          <View
            style={{
              alignItems: 'center', 
              position: 'absolute',
              marginTop: height * 0.3,
              width:'100%',
              flex:1
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
              
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#DCDCDC',
                // marginHorizontal:50,
                // margin: 20,
                //  flex:1,
                marginHorizontal:12,

                padding: 20,

                // alignItems: 'center',
                // justifyContent: 'flex-end',
               // width: '100%',
                //height: 240,
              }}>
              <Text
                style={{
                  fontFamily: 'WorkSans-SemiBold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Enjoy Complimentary Stay{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  // borderWidth: 1,
                  width: '100%',
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Property Name :
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                      // textAlign: 'right',
                    }}>
                    {Property?.name}
                  </Text>
                </View>
              </View>

              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Available Fracs :
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                      // textAlign: 'left',
                    }}>
                    {Property?.AvailableFractions}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  //alignItems:'center'
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Booking Amount Per Frac :
                  </Text>
                </View>
                <View style={{ flex: 1 ,paddingTop:3}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {'\u20B9'} {Property?.BookingAmount}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // paddingVertical: 10,
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    Platform Fee :
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {'\u20B9'} {300}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#0F1130',
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 14,
                    }}>
                    No of Fractions :
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    borderColor: '#979797',
                    borderRadius: 5,
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                    // width: 80,
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    padding: 3,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      DecrementCount();
                    }}>
                    <Icon name={'minus'} size={20} color={'#188C16'} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'WorkSans-SemiBold',
                      fontSize: 16,
                      color: '#188C16',
                    }}>
                    {Number}
                  </Text>

                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      IncrementCount();
                    }}>
                    <Icon name={'plus'} size={20} color={'#188C16'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                borderColor: '#418841',
                borderWidth: 1,
                backgroundColor: '#51AC51',
                borderRadius: 5,
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical:30,
                width:'100%',
                flex:1
                // marginTop: height * 0.38,
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 14,
                  color: '#FFFFFF',
                }}>
                Total Booking Amount
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 14,
                  color: '#FFFFFF',
                }}>
                {'\u20B9'} {Number * Property?.BookingAmount + 300 * Number}
              </Text>
            </View>
            <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              padding: 5,
             // marginVertical: 10,
              flex: 1,
              width: '100%'
            }}>
            <TouchableOpacity
              onPress={() => {
                setTerms(!Terms);
              }}>
              <View style={styles.option}>
                <View style={[styles.checkbox, { backgroundColor: Terms ? '#081F62' : '#ffff', }]}>
                  {Terms && (
                    <IconAntDesign name="check" size={10} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {/* <Text  style={{color: '#1E2135',fontWeight:400,fontSize:14}}> I have read</Text> */}
            <Text
              style={{
                color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                fontSize: 11,
              }}>
              {" "}I agree to the
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndCondition');
              }}>
              <Text
                style={{
                  color: '#0F1130',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 11,
                }}>
                {' '}
                Terms & conditions
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                fontSize: 11,
              }}>
              {' '}
              and
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Privacy');
              }}>
              <Text
                style={{
                  color: '#0F1130',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 11,
                }}>
                {' '}
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
       
          <TouchableOpacity
            disabled={!Terms}
            onPress={() => {
              //console.log('submit');
              handleBooking();
            }}
            style={{
              alignItems: 'center',
              backgroundColor: Terms == false ? '#AEAEAE' : '#081F62',
              paddingHorizontal: 10,
              paddingVertical: 10,
            //  marginHorizontal: 20,
              width:'80%',
              // borderColor: '#043862',
              //borderWidth: 1,
              borderRadius: 8,
              //marginTop: 30,
              marginTop: 20,
              marginBottom: 60
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Montserrat-SemiBold',
                color: '#FFFFFF',
              }}>
              Review
            </Text>
          </TouchableOpacity>
     
          
          </View>
        </View>
        <View style={{ marginTop: height * 0.8, }}>
          {/* <View
            style={{
              borderColor: '#418841',
              borderWidth: 1,
              backgroundColor: '#51AC51',
              borderRadius: 5,
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginTop: height * 0.38,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 14,
                color: '#FFFFFF',
              }}>
              Total Booking Amount
            </Text>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 14,
                color: '#FFFFFF',
              }}>
              {'\u20B9'} {Number * Property?.BookingAmount + 300 * Number}
            </Text>
          </View> */}
          {/* <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              padding: 5,
              marginVertical: 10,
              flex: 1,
              width: '100%'
            }}>
            <TouchableOpacity
              onPress={() => {
                setTerms(!Terms);
              }}>
              <View style={styles.option}>
                <View style={[styles.checkbox, { backgroundColor: Terms ? '#081F62' : '#ffff', }]}>
                  {Terms && (
                    <IconAntDesign name="check" size={10} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
         
            <Text
              style={{
                color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                fontSize: 12,
              }}>
              {" "}I agree to the
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndCondition');
              }}>
              <Text
                style={{
                  color: '#0F1130',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 12,
                }}>
                {' '}
                Terms & conditions
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: '#1E2135',
                fontFamily: 'Montserrat-Medium',
                fontSize: 12,
              }}>
              {' '}
              and
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Privacy');
              }}>
              <Text
                style={{
                  color: '#0F1130',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 12,
                }}>
                {' '}
                Privacy Policy
              </Text>
            </TouchableOpacity>
          // </View> */}
          {/* <TouchableOpacity
            disabled={!Terms}
            onPress={() => {
              //console.log('submit');
              handleBooking();
            }}
            style={{
              alignItems: 'center',
              backgroundColor: Terms == false ? '#AEAEAE' : '#081F62',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginHorizontal: 30,
              // borderColor: '#043862',
              //borderWidth: 1,
              borderRadius: 8,
              //marginTop: 30,
              marginTop: 20,
              marginBottom: 60
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Montserrat-SemiBold',
                color: '#FFFFFF',
              }}>
              Review
            </Text>
          </TouchableOpacity> */}
            </View> 
   
      </ScrollView>
   </SafeAreaView>

    // <View
    //   style={{ backgroundColor: 'white', padding: 20, width: '100%', flex: 1 }}>



    //   <Text
    //     style={{ color: '#252B5C', fontSize: 28, fontFamily: 'Poppins-Bold' }}>
    //     Hurry ! Book your property now
    //   </Text>
    //   <View
    //     style={{
    //       backgroundColor: '#F5F5F5',
    //       borderRadius: 20,
    //       marginVertical: 20,
    //       padding: 20,
    //     }}>
    //     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    //       <View style={{ flex: 1 }}>
    //         <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: 'Poppins-SemiBold',
    //           }}>
    //           Property Name
    //         </Text>
    //       </View>
    //       <View style={{ flex: 1 }}>
    //         <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: 'Poppins-SemiBold',
    //             textAlign: 'right'
    //           }}>
    //           {Property?.name}
    //         </Text>
    //       </View>
    //     </View>
    //     <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
    //       <View style={{ flex: 1 }}>
    //         {/* <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: "Poppins-SemiBold",
    //             marginTop: 10,
    //           }}>
    //           Property Amount
    //         </Text> */}
    //         <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: 'Poppins-SemiBold',
    //             marginVertical: 10,
    //           }}>
    //           Available Frac
    //         </Text>
    //         <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: 'Poppins-SemiBold',
    //           }}>
    //           Booking Amount Per Frac
    //         </Text>
    //       </View>
    //       <View style={{ flex: 1 }}>
    //         {/* <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: "Poppins-SemiBold",
    //             marginTop: 10,
    //           }}>
    //            {'\u20B9'} {Property?.Price}
    //         </Text> */}
    //         <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: 'Poppins-SemiBold',
    //             marginVertical: 10,
    //             textAlign: 'right'
    //           }}>
    //           {Property?.AvailableFractions}{'           '}
    //         </Text>
    //         <Text
    //           style={{
    //             color: '#1E2135',
    //             fontSize: 15,
    //             fontFamily: 'Poppins-SemiBold',
    //             textAlign: 'right'
    //           }}>
    //           {'\u20B9'} {Property?.BookingAmount}
    //         </Text>
    //       </View>
    //     </View>
    //     <Text
    //       style={{
    //         color: '#252B5C',
    //         fontSize: 15,
    //         fontFamily: 'Poppins-Bold',
    //         marginVertical: 10,
    //         textAlign: 'center'
    //       }}>
    //       Enjoy {7 * Number}N / {8 * Number}D of stay at this Property
    //     </Text>
    //   </View>
    //   {/* <View style={{marginTop: 20}}>
    //       <View style={styles.input}>
    //         <View
    //           style={{
    //             justifyContent: 'flex-start',
    //             flexDirection: 'row',
    //             alignItems: 'center',
    //             width: '100%',
    //             paddingLeft: 10,
    //           }}>

    //           <TextInput
    //             style={{width: '100%', paddingLeft: 10, color: 'black'}}
    //             placeholder="1"
    //             value={Name}
    //             onChangeText={txt => {
    //               setName(txt);
    //             }}
    //           />
    //         </View>
    //       </View>
    //       <View
    //         style={[
    //           styles.labelContainer,
    //           {
    //             top: -(height * 0.01),
    //           },
    //         ]}>
    //         <Text
    //           style={[
    //             styles.label,
    //             {
    //               fontSize: 16,
    //             },
    //           ]}>
    //           No of Frac
    //         </Text>
    //       </View>
    //     </View> */}
    //   <View style={{ flexDirection: 'row', width: '100%', marginVertical: 20, alignItems: 'center' }}>
    //     <View
    //       style={{
    //         flex: 1,
    //         backgroundColor: '#F5F5F5',
    //         paddingVertical: 5,
    //         paddingHorizontal: 20
    //       }}>
    //       <Text
    //         style={[
    //           styles.label,
    //           {
    //             fontSize: 15,
    //           },
    //         ]}>
    //         {' '}
    //         No of Frac{' '}
    //       </Text>
    //     </View>
    //     <View
    //       style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 2 }}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           DecrementCount();
    //         }}
    //         style={{
    //           alignItems: 'center',
    //           backgroundColor: '#043862',
    //           flex: 1,
    //         }}>
    //         <Text
    //           style={{
    //             color: 'white',
    //             fontSize: 18,
    //             fontFamily: 'Poppins-SemiBold',
    //           }}>
    //           -
    //         </Text>
    //       </TouchableOpacity>
    //       <View
    //         style={{
    //           alignItems: 'center',

    //           backgroundColor: '#F5F5F5',

    //           flex: 1,
    //         }}>
    //         <Text
    //           style={{
    //             color: 'black',
    //             fontSize: 18,
    //             fontFamily: 'Poppins-SemiBold',
    //           }}>
    //           {Number}
    //         </Text>
    //       </View>
    //       <TouchableOpacity
    //         onPress={() => {
    //           IncrementCount();
    //         }}
    //         style={{
    //           alignItems: 'center',

    //           backgroundColor: '#043862',

    //           flex: 1,
    //         }}>
    //         <Text
    //           style={{
    //             color: 'white',
    //             fontSize: 18,
    //             fontFamily: 'Poppins-SemiBold',
    //           }}>
    //           +
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>

    //   <View
    //     style={{
    //       backgroundColor: '#F5F5F5',
    //       borderRadius: 20,
    //       marginTop: 20,
    //       justifyContent: 'space-between',
    //       flexDirection: 'row',
    //       padding: 20,
    //     }}>
    //     <Text
    //       style={{
    //         color: '#1E2135',
    //         fontSize: 15,
    //         fontFamily: 'Poppins-SemiBold',
    //       }}>
    //       Total Booking Amount
    //     </Text>
    //     <Text
    //       style={{
    //         color: '#1E2135',
    //         fontSize: 15,
    //         fontFamily: 'Poppins-SemiBold',
    //       }}>
    //       {'\u20B9'}{' '}
    //       {Number * Property?.BookingAmount || Property?.BookingAmount}
    //     </Text>
    //   </View>
    //   <View
    //     style={{
    //       justifyContent: 'flex-start',
    //       flexDirection: 'row',
    //       padding: 5,
    //       marginVertical: 15
    //     }}>
    //     <TouchableOpacity
    //       onPress={() => {
    //         setTerms(!Terms);
    //       }}>
    //       <View style={styles.option}>
    //         <View style={styles.checkbox}>
    //           {Terms && (
    //             <IconAntDesign name="check" size={15} color="#043862" />
    //           )}
    //         </View>
    //       </View>
    //     </TouchableOpacity>
    //     {/* <Text  style={{color: '#1E2135',fontWeight:400,fontSize:14}}> I have read</Text> */}
    //     <TouchableOpacity
    //       onPress={() => {
    //         navigation.navigate('TermsAndCondition');
    //       }}>
    //       <Text
    //         style={{
    //           color: '#043862',
    //           fontFamily: 'Poppins-Bold',
    //           fontSize: 14,
    //         }}>
    //         {' '}
    //         Terms & conditions{' '}
    //       </Text>
    //     </TouchableOpacity>
    //     <Text
    //       style={{
    //         color: '#1E2135',
    //         fontFamily: 'Poppins-Medium',
    //         fontSize: 14,
    //       }}>
    //       {' '}
    //       and{' '}
    //     </Text>

    //     <TouchableOpacity
    //       onPress={() => {
    //         navigation.navigate('Privacy');
    //       }}>
    //       <Text
    //         style={{
    //           color: '#043862',
    //           fontFamily: 'Poppins-Bold',
    //           fontSize: 14,
    //         }}>
    //         {' '}
    //         privacy policy
    //       </Text>
    //     </TouchableOpacity>
    //   </View>

    //   <TouchableOpacity
    //     disabled={!Terms}
    //     onPress={() => {
    //       handleBooking();
    //     }}
    //     style={{
    //       alignItems: 'center',
    //       backgroundColor: Terms == false ? '#AEAEAE' : '#043862',
    //       padding: 20,
    //       // borderColor: '#043862',
    //       // borderWidth: 1,
    //       borderRadius: 10,
    //       // marginTop: 30,
    //     }}>
    //     <Text
    //       style={{
    //         fontSize: 16,
    //         fontFamily: 'Poppins-SemiBold',
    //         color: 'white',
    //       }}>
    //       Review
    //     </Text>
    //   </TouchableOpacity>
    // </View>

  );
}
const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
  },
  labelContainer: {
    position: 'absolute',
    left: width * 0.04,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  input: {
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    width: width * 0.3,
    height: height * 0.16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 18,
    width: 18,
    borderColor: '#043862',
    borderWidth: 2,
    backgroundColor: '#ffff',
    borderRadius: 2,
    alignItems: 'center',
  },
});
