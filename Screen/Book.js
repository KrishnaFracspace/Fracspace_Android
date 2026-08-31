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
  Modal,
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import IconAntDesign from 'react-native-vector-icons/Entypo';
import { PaymentPayU, PropertyBook, PropertyDetailsById } from './Services/UserApi';
import { AppContext } from './Context/AppContext';
// import Icon from 'react-native-vector-icons/AntDesign';
// import IconC from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo'
import Ico from 'react-native-vector-icons/Ionicons'
import Ic from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Book(props) {
  // console.log(props?.route?.params?.property?.image?.Image1);

  const { globalState, setGlobalState } = useContext(AppContext);
  const [propertyId, setPropertyId] = useState(props?.route?.params?.Id);
  const navigation = useNavigation();
  // const [Number, setNumber] = useState(1);
  const [Terms, setTerms] = useState(false);
  const [Property, setProperty] = useState(props?.route?.params?.property || []);
  //   console.log("eeeeeeeeeeee ", props?.route?.params?.property)
  const [Available, setAvailable] = useState(
    props?.route?.params?.property?.AvailableFractions || ''
  );
  const [numOfFrac, setNumOfFrac] = useState(1);
  const [agree, setAgree] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewDetails, setReviewDetails] = useState(null);

  const totalFrac = ((Property?.BookingAmount) * numOfFrac);
  const platform = (totalFrac * (2.2 / 100));
  const gst = (platform * (18 / 100));

  const platformFeeFromBackend = Property?.platformFeeAmount || 0;
  const gstFromBackend = Property?.gstAmount || 0;
  const totalAmountFromBackend = totalFrac + platformFeeFromBackend + gstFromBackend;

  // const formatIndianAmount = (amount) => {
  //     if (amount == null) return '0';
  //     return Number(amount).toLocaleString('en-IN');
  // };

  const totalAmt = (totalFrac + gst + platform);

  useEffect(() => {
    fetchPropById(propertyId)
  })

  const fetchPropById = async (id) => {
    try {
      const { data: res } = await PropertyDetailsById(id);
      if (res) {
        setProperty(res?.property);
        setAvailable(res?.property?.AvailableFractions);
      }
    } catch (error) {
      console.log("Error in fetching Prop by id: ", error?.response?.data || error?.message);
    }
  }

  // const IncrementCount = () => {
  //   if (Number < Available) {
  //     setNumber(Number + 1);
  //   }
  // };

  // const DecrementCount = () => {
  //   if (Number > 1) {
  //     setNumber(Number - 1);
  //   }
  // };
  const handleBooking = async () => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyName: Property?.name,
      propertyId: Property?._id,
      Price: Property?.Price,
      FC_Price: Property?.FC_Price,
      fractionValue: Property?.FC_Price,
      numberOfFractions: numOfFrac,
      totalBookingAmount: numOfFrac * Property?.BookingAmount,
      termsAndConditions: Terms,
    });
    try {
      let { data: res } = await PropertyBook(payload);
      console.log("ressssssssssss: ", res);

      if (res?.success) {
        // navigation.navigate('Review', { proprtyDetails: res, PropertyImage: Property?.image?.Image1 });
        setReviewDetails(res?.data)
        setShowReview(true);
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


  const handlePayment = async () => {
    let id = `tnxnid-fracspace-app-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    let payload = JSON.stringify({
      // amount:reviewDetails?.totalBookingAmount + 300*reviewDetails?.numberOfFractions,
      amount: Property?.offer ? totalAmountFromBackend : totalAmt,
      // amount:1,
      productinfo: "Co-ownership Product",
      firstname: globalState?.userName,
      email: globalState?.userDetails?.email,
      phone: globalState?.userDetails?.phoneNumber,
      txnid: id,
      surl: "https://test.bunknbeyond.com/paymentsuccess",
      furl: "https://test.bunknbeyond.com/paymentfailure"

    });
    console.log("Initiate Payload: ", payload);

    try {
      let { data: res } = await PaymentPayU(payload);
      console.log("Response: ", res);
      if (res?.success) {
        setShowReview(false);
        navigation.navigate('PaymentPage', { Link: res?.form, TxnID: id, property: reviewDetails });
        // navigation.navigate('BookingFailure', { Link: res?.form, TxnID: id ,property:property});
        // console.log("Response: ",res.form);
        // console.log("TXNId: ",id);
      }
    } catch (error) {
      if (error?.response) {

        Alert.alert('Response ErrorPPP', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        // console.log('Request error:', `${JSON.stringify(error?.request)}`);
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
      } else {
        //  console.log('error');
        Alert.alert('Error:', `${error}`);
      }
    }
  };

  const formatIndianAmount = (amount) => {
    if (amount == null) return '0';
    return Number(amount).toLocaleString('en-IN');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265', }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <View style={{ padding: 20, backgroundColor: '#021265', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => {
            navigation.goBack();
          }}>
            <Icon name={'chevron-left'} size={20} color={'#FFF'} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16, color: '#FFF' }}>Book Frac</Text>
          <TouchableOpacity onPress={() => {
            navigation.popToTop();
          }}>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#FFF' }}>Exit</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View>
            <Image resizeMode='stretch' source={{ uri: Property?.image?.Image1 }} style={{ width: '100%', height: 250 }} />
            <LinearGradient colors={['#00000000', '#00000066', '#000000A6', '#000000CC']}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
            ></LinearGradient>
          </View>

          <View style={{ padding: 20, marginTop: -100 }}>
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#FFF' }}>{Property?.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ico name={'location-outline'} size={15} color={'#FFF'} />
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#FFF' }}>{Property?.Location}</Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#FFF', borderRadius: 10, paddingVertical: 20, paddingHorizontal: 25, marginTop: 10, elevation: 5 }}>
              {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                              <View>
                                  <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#021265'}}>Available Fracs</Text>
                                  <Text style={{fontFamily:'WorkSans-Regular',fontSize:16,color:'#00000080'}}><Text style={{fontFamily:'WorkSans-Bold',fontSize:18,color:'#000'}}>{Property?.AvailableFractions}</Text> / 25 Fracs</Text>
                              </View>
                          </View> */}

              <View style={{ marginTop: 0 }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#021265' }}>Booking Details</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <View style={{ backgroundColor: '#9DB2CE1A', borderColor: '#EBF2F8', borderWidth: 0.5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 5, flex: 1 }}>
                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000B3' }}>Available</Text>
                    {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{Property?.AvailableFractions}</Text> */}
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#00000080' }}><Text style={{ fontFamily: 'WorkSans-Bold', fontSize: 16, color: '#000' }}>{Property?.AvailableFractions}</Text> Fracs</Text>
                  </View>
                  <View style={{ backgroundColor: '#9DB2CE1A', borderColor: '#EBF2F8', borderWidth: 0.5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 5, flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#000000B3' }}>Frac Booking Price</Text>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#00000080', marginTop: 3 }}><Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>₹ {formatIndianAmount(Property?.BookingAmount)}</Text>/Frac</Text>
                  </View>

                </View>
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#021265' }}>No of Fracs</Text>
                <View style={{ backgroundColor: '#9DB2CE1A', padding: 10, borderColor: '#EBF2F8', borderWidth: 0.5, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <TouchableOpacity onPress={() => {
                    if (numOfFrac > 1) {
                      setNumOfFrac(numOfFrac - 1);
                    }
                  }} style={{ backgroundColor: '#0212651A', borderRadius: 3, padding: 5 }}>
                    <Icon name={'minus'} size={20} color={'#021265'} />
                  </TouchableOpacity>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000000B3' }}>{numOfFrac}</Text>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 10, color: '#000' }}>Selected</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    if (numOfFrac < 5 && numOfFrac < Property?.AvailableFractions) {
                      setNumOfFrac(numOfFrac + 1);
                    }
                  }} style={{ backgroundColor: '#021265', borderRadius: 3, padding: 5 }}>
                    <Icon name={'plus'} size={20} color={'#FFF'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
              <TouchableOpacity onPress={() => {
                setAgree(!agree);
              }}>
                {agree ?
                  <Ico name={'checkbox'} size={20} color={'#021265'} />
                  :
                  <Ico name={'checkbox-outline'} size={20} color={'#000'} />
                }
              </TouchableOpacity>
              <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', marginLeft: 7 }}>I agree to the <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Terms & Conditions</Text> and <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>Privacy Policy</Text></Text>
            </View>
          </View>

          {/* <Modal visible={showBreakdown} transparent animationType='slide'>
                      <TouchableOpacity onPress={() => {
                          setShowBreakdown(false);
                      }} style={{flex:1,backgroundColor:'#0000007a'}}/>
                      <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#FFF',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20}}>
                          <TouchableOpacity onPress={() => {
                              setShowBreakdown(false);
                          }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                              <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000'}}>Breakdown Of Total Amount</Text>
                              <Icon name={'chevron-down'} size={20} color={'#000'}/>
                          </TouchableOpacity>
  
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                              <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000'}}>Fraction Booking Amount</Text>
                              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{formatIndianAmount(Property?.BookingAmount)}</Text>
                          </View>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                              <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000'}}>Number of Fracs</Text>
                              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{numOfFrac}</Text>
                          </View>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                              <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000'}}>Platform Fees (2.2%)</Text>
                              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{formatIndianAmount(platform)}</Text>
                          </View>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                              <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000'}}>GST charges (18%)</Text>
                              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{gst}</Text>
                          </View>
                          <View style={{borderWidth:0.5,borderColor:'#0000009b',marginVertical:10,borderStyle:'dashed'}}/>
                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                              <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000'}}>Total Amount</Text>
                              <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{formatIndianAmount(totalAmt)}</Text>
                          </View>
                      </View>
                  </Modal> */}

          <Modal visible={showBreakdown} transparent animationType='slide'>
            <TouchableOpacity onPress={() => {
              setShowBreakdown(false);
            }} style={{ flex: 1, backgroundColor: '#0000007a' }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <TouchableOpacity onPress={() => {
                setShowBreakdown(false);
              }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000' }}>Breakdown Of Total Amount</Text>
                <Icon name={'chevron-down'} size={20} color={'#000'} />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Fraction Booking Amount</Text>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(Property?.BookingAmount)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Number of Fracs</Text>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{numOfFrac}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Platform Fees (2.2%)</Text>
                {!Property?.offer ?
                  <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(platform)}</Text>
                  :
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#0000009c', left: -2, right: 18, top: 10.5, }}></View>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(platform)}</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', marginLeft: 10 }}>{platformFeeFromBackend}</Text>
                  </View>
                }
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>GST charges (18%)</Text>
                {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{gst}</Text> */}
                {!Property?.offer ?
                  <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(gst)}</Text>
                  :
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#0000009c', left: -2, right: 18, top: 10.5, }}></View>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(gst)}</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', marginLeft: 10 }}>{gstFromBackend}</Text>
                  </View>
                }
              </View>
              <View style={{ borderWidth: 0.5, borderColor: '#0000009b', marginVertical: 10, borderStyle: 'dashed' }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#000' }}>Total Amount</Text>
                {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000'}}>{formatIndianAmount(totalAmt)}</Text> */}
                {!Property?.offer ?
                  <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000' }}>{formatIndianAmount(totalAmt)}</Text>
                  :
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#0000009c', left: -2, right: 50, top: 10.5, }}></View>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(totalAmt)}</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', marginLeft: 10 }}>{totalAmountFromBackend}</Text>
                  </View>
                }
              </View>
            </View>
          </Modal>

          <Modal visible={showReview} transparent animationType='slide'>
            <TouchableOpacity onPress={() => {
              setShowReview(false);
            }} style={{ flex: 1, backgroundColor: '#00000080' }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#000' }}>Property Details</Text>
              <View style={{ borderWidth: 0.5, borderColor: '#00000080', padding: 15, borderRadius: 10, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Image source={{ uri: Property?.image?.Image1 }} style={{ width: '100%', height: 80, borderRadius: 5 }} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#021265' }}>{reviewDetails?.propertyName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
                      <Ico name={'location-outline'} size={15} color={'#000'} />
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>{Property?.Location}</Text>
                    </View>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000' }}>No of Fracs: <Text style={{ fontFamily: 'WorkSans-SemiBold' }}>{numOfFrac}</Text></Text>
                  </View>
                </View>

                <View style={{ borderColor: '#0000004D', borderTopWidth: 0.5, marginVertical: 13 }} />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {reviewDetails?.propertyName != "ALTAIRA – VILLA" &&
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#00000080' }}>Frac Value</Text>
                      <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000' }}>₹{reviewDetails?.FC_Price}</Text>
                    </View>
                  }
                  {reviewDetails?.propertyName != "ALTAIRA – VILLA" &&
                    <View style={{ borderLeftWidth: 0.5, borderColor: '#0000004D', height: 40 }} />
                  }
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#00000080' }}>Booking Amount</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000' }}>₹{formatIndianAmount(reviewDetails?.totalBookingAmount)}</Text>
                  </View>
                </View>
              </View>

              <View style={{ borderWidth: 0.5, borderColor: '#00000080', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#00000080' }}>Total Amount</Text>
                {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000'}}>₹{formatIndianAmount(totalAmt)}</Text> */}
                {!Property?.offer ?
                  <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#000' }}>₹{formatIndianAmount(totalAmt)}</Text>
                  :
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#0000009c', left: -2, right: 50, top: 10.5, }}></View>
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(totalAmt)}</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', marginLeft: 10 }}>{totalAmountFromBackend}</Text>
                  </View>
                }
              </View>

              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: '#000', marginTop: 15 }}>Personal Details</Text>
              <View style={{ borderWidth: 0.5, borderColor: '#00000080', padding: 15, borderRadius: 10, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: '30%', alignItems: 'center' }}>
                    <Image resizeMode='contain' source={{ uri: globalState?.userProfile }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#000', textAlign: 'center' }}>{globalState?.userName}</Text>
                  </View>
                  <View style={{ borderLeftWidth: 0.5, height: '100%', borderColor: '#0000004D', marginHorizontal: 10 }}></View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ backgroundColor: '#9DB2CE1A', padding: 5, borderRadius: 15 }}>
                        <Ic name={'mail'} size={15} color={'#021265'} />
                      </View>
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', marginLeft: 10 }}>{globalState?.userDetails?.email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ backgroundColor: '#9DB2CE1A', padding: 5, borderRadius: 15, marginVertical: 5 }}>
                        <Ic name={'phone'} size={15} color={'#021265'} />
                      </View>
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', marginLeft: 10 }}>{globalState?.userDetails?.phoneNumber}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ backgroundColor: '#9DB2CE1A', padding: 5, borderRadius: 15 }}>
                        <Ico name={'location-outline'} size={15} color={'#021265'} />
                      </View>
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000', marginLeft: 10 }}>
                        {globalState?.userDetails?.postalAddress},{' '}
                        {globalState?.userDetails?.pincode}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={() => {
                handlePayment();
              }} style={{ backgroundColor: '#021265', borderRadius: 5, padding: 12, alignItems: 'center', marginTop: 18 }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFF' }}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

      </ScrollView>

      <View style={{ position: 'absolute', bottom: 45, left: 0, right: 0, backgroundColor: '#9DB2CE1A', padding: 20, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          setShowBreakdown(true);
        }} style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#000'}}>₹{formatIndianAmount(totalAmt)}</Text> */}
            {!Property?.offer ?
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000' }}>₹{formatIndianAmount(totalAmt)}</Text>
              :
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#0000009c', left: -2, right: 50, top: 10.5, }}></View>
                <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 14, color: '#0000009c' }}>₹{formatIndianAmount(totalAmt)}</Text>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 14, color: '#000', marginLeft: 10 }}>{totalAmountFromBackend}</Text>
              </View>
            }
            <Icon name={'chevron-up'} size={20} color={'#000'} style={{ marginLeft: 22 }} />
          </View>
          <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: '#000000B3', marginTop: 2 }}>Total Booking Amount</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {!agree ?
            <View style={{ backgroundColor: '#322c2c86', padding: 12, borderRadius: 5, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFF' }}>Review</Text>
            </View>
            :
            <TouchableOpacity onPress={() => {
              handleBooking();
              // setShowReview(true);
            }} style={{ backgroundColor: '#021265', padding: 12, borderRadius: 5, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFF' }}>Review</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>

    //     <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
    //     <View style={{
    //       flexDirection: 'row',
    //       justifyContent: 'space-between',
    //       alignItems: 'center',
    //       paddingVertical: 15,
    //       width: '100%',
    //       paddingHorizontal: 15,
    //       borderBottomWidth: 1,
    //       shadowColor: '#000',
    //       shadowOffset: { width: 0, height: 2 },
    //       shadowOpacity: 0.8,
    //       shadowRadius: 2,
    //       elevation: 1,
    //       borderBottomColor: '#DDE1E5',
    //       backgroundColor: '#021265'
    //     }}>
    //       <TouchableOpacity style={{ flex: 1 }}
    //         onPress={() => {

    //           // navigation.navigate('Property',{details:Property});
    //           navigation.goBack();

    //         }}>
    //         <IconC name="chevron-back-outline" size={25} color={'#FFFFFF'} />
    //       </TouchableOpacity>
    //       <Text style={{
    //         fontSize: 18,
    //         fontFamily: 'WorkSans-SemiBold',
    //         color: '#FFFFFF',
    //       }}>
    //         Book
    //       </Text>
    //       <TouchableOpacity style={{ flex: 1 }}
    //         onPress={() => {
    //           // navigation.navigate('HomePage');
    //           navigation.popToTop();
    //         }}>
    //         <Text style={{
    //           fontSize: 15,
    //           fontFamily: 'WorkSans-SemiBold',
    //           color: '#FFFFFF',
    //           textAlign: 'right'
    //         }}>EXIT</Text>
    //       </TouchableOpacity>
    //     </View>

    //     <ScrollView style={{width:'100%', padding: 20, backgroundColor: '#FFFFFF',}}>

    //       <Text
    //         style={{
    //           fontFamily: 'Montserrat-SemiBold',
    //           fontSize: 20,
    //           color: '#000000',
    //         }}>
    //         Hurry ! Book your property now
    //       </Text>
    //       <View style={{ width: '100%', alignItems: 'center',flex:1,}}>
    //         <Image
    //           resizeMode="cover"
    //           source={{ uri: Property?.image?.Image1 }}
    //           style={{
    //             width: '100%',
    //             height: height * 0.34,
    //             borderRadius: 8,
    //             marginTop: 20,
    //           }}
    //         />
    //         <View
    //           style={{
    //             alignItems: 'center', 
    //             position: 'absolute',
    //             marginTop: height * 0.3,
    //             width:'100%',
    //             flex:1
    //           }}>
    //           <View
    //             style={{
    //               backgroundColor: '#FFFFFF',

    //               borderWidth: 1,
    //               borderRadius: 8,
    //               borderColor: '#DCDCDC',
    //               // marginHorizontal:50,
    //               // margin: 20,
    //               //  flex:1,
    //               marginHorizontal:12,

    //               padding: 20,

    //               // alignItems: 'center',
    //               // justifyContent: 'flex-end',
    //              // width: '100%',
    //               //height: 240,
    //             }}>
    //             {/* <Text
    //               style={{
    //                 fontFamily: 'WorkSans-SemiBold',
    //                 fontSize: 16,
    //                 color: '#000000',
    //               }}>
    //               Enjoy Complimentary Stay{' '}
    //             </Text> */}
    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between',
    //                 paddingVertical: 10,
    //                 // borderWidth: 1,
    //                 width: '100%',
    //               }}>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#0F1130',
    //                     fontFamily: 'WorkSans-SemiBold',
    //                     fontSize: 14,
    //                   }}>
    //                   Property Name :
    //                 </Text>
    //               </View>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#000000',
    //                     fontSize: 12,
    //                     fontFamily: 'Montserrat-Medium',
    //                     // textAlign: 'right',
    //                   }}>
    //                   {Property?.name}
    //                 </Text>
    //               </View>
    //             </View>

    //             <View
    //               style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#0F1130',
    //                     fontFamily: 'WorkSans-SemiBold',
    //                     fontSize: 14,
    //                   }}>
    //                   Available Fracs :
    //                 </Text>
    //               </View>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#000000',
    //                     fontSize: 12,
    //                     fontFamily: 'Montserrat-Medium',
    //                     // textAlign: 'left',
    //                   }}>
    //                   {Property?.AvailableFractions}
    //                 </Text>
    //               </View>
    //             </View>

    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between',
    //                 paddingVertical: 10,
    //                 //alignItems:'center'
    //               }}>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#0F1130',
    //                     fontFamily: 'WorkSans-SemiBold',
    //                     fontSize: 14,
    //                   }}>
    //                   Booking Amount Per Frac :
    //                 </Text>
    //               </View>
    //               <View style={{ flex: 1 ,paddingTop:3}}>
    //                 <Text
    //                   style={{
    //                     color: '#000000',
    //                     fontSize: 12,
    //                     fontFamily: 'Montserrat-Medium',
    //                   }}>
    //                   {'\u20B9'} {Property?.BookingAmount}
    //                 </Text>
    //               </View>
    //             </View>
    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between',
    //                 // paddingVertical: 10,
    //               }}>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#0F1130',
    //                     fontFamily: 'WorkSans-SemiBold',
    //                     fontSize: 14,
    //                   }}>
    //                   Platform Fee :
    //                 </Text>
    //               </View>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#000000',
    //                     fontSize: 12,
    //                     fontFamily: 'Montserrat-Medium',
    //                   }}>
    //                   {'\u20B9'} {300}
    //                 </Text>
    //               </View>
    //             </View>

    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between',
    //                 paddingTop: 10,
    //               }}>
    //               <View style={{ flex: 1 }}>
    //                 <Text
    //                   style={{
    //                     color: '#0F1130',
    //                     fontFamily: 'WorkSans-SemiBold',
    //                     fontSize: 14,
    //                   }}>
    //                   No of Fractions :
    //                 </Text>
    //               </View>
    //               <View
    //                 style={{
    //                   flex: 1,
    //                   borderColor: '#979797',
    //                   borderRadius: 5,
    //                   backgroundColor: '#FFFFFF',
    //                   flexDirection: 'row',
    //                   // width: 80,
    //                   justifyContent: 'space-between',
    //                   borderWidth: 1,
    //                   padding: 3,
    //                   alignItems: 'center',
    //                 }}>
    //                 <TouchableOpacity
    //                   onPress={() => {
    //                     DecrementCount();
    //                   }}>
    //                   <Icon name={'minus'} size={20} color={'#188C16'} />
    //                 </TouchableOpacity>
    //                 <Text
    //                   style={{
    //                     fontFamily: 'WorkSans-SemiBold',
    //                     fontSize: 16,
    //                     color: '#188C16',
    //                   }}>
    //                   {Number}
    //                 </Text>

    //                 <TouchableOpacity
    //                   style={{}}
    //                   onPress={() => {
    //                     IncrementCount();
    //                   }}>
    //                   <Icon name={'plus'} size={20} color={'#188C16'} />
    //                 </TouchableOpacity>
    //               </View>
    //             </View>
    //           </View>
    //           <View
    //             style={{
    //               borderColor: '#418841',
    //               borderWidth: 1,
    //               backgroundColor: '#51AC51',
    //               borderRadius: 5,
    //               padding: 15,
    //               flexDirection: 'row',
    //               justifyContent: 'space-between',
    //               marginVertical:30,
    //               width:'100%',
    //               flex:1
    //               // marginTop: height * 0.38,
    //             }}>
    //             <Text
    //               style={{
    //                 fontFamily: 'Montserrat-Bold',
    //                 fontSize: 14,
    //                 color: '#FFFFFF',
    //               }}>
    //               Total Booking Amount
    //             </Text>
    //             <Text
    //               style={{
    //                 fontFamily: 'Montserrat-Bold',
    //                 fontSize: 14,
    //                 color: '#FFFFFF',
    //               }}>
    //               {'\u20B9'} {Number * Property?.BookingAmount + 300 * Number}
    //             </Text>
    //           </View>
    //           <View
    //           style={{
    //             justifyContent: 'flex-start',
    //             flexDirection: 'row',
    //             padding: 5,
    //            // marginVertical: 10,
    //             flex: 1,
    //             width: '100%'
    //           }}>
    //           <TouchableOpacity
    //             onPress={() => {
    //               setTerms(!Terms);
    //             }}>
    //             <View style={styles.option}>
    //               <View style={[styles.checkbox, { backgroundColor: Terms ? '#081F62' : '#ffff', }]}>
    //                 {Terms && (
    //                   <IconAntDesign name="check" size={10} color="#FFFFFF" />
    //                 )}
    //               </View>
    //             </View>
    //           </TouchableOpacity>
    //           {/* <Text  style={{color: '#1E2135',fontWeight:400,fontSize:14}}> I have read</Text> */}
    //           <Text
    //             style={{
    //               color: '#1E2135',
    //               fontFamily: 'Montserrat-Medium',
    //               fontSize: 11,
    //             }}>
    //             {" "}I agree to the
    //           </Text>
    //           <TouchableOpacity
    //             onPress={() => {
    //               navigation.navigate('TermsAndCondition');
    //             }}>
    //             <Text
    //               style={{
    //                 color: '#0F1130',
    //                 fontFamily: 'Montserrat-SemiBold',
    //                 fontSize: 11,
    //               }}>
    //               {' '}
    //               Terms & conditions
    //             </Text>
    //           </TouchableOpacity>
    //           <Text
    //             style={{
    //               color: '#1E2135',
    //               fontFamily: 'Montserrat-Medium',
    //               fontSize: 11,
    //             }}>
    //             {' '}
    //             and
    //           </Text>

    //           <TouchableOpacity
    //             onPress={() => {
    //               navigation.navigate('Privacy');
    //             }}>
    //             <Text
    //               style={{
    //                 color: '#0F1130',
    //                 fontFamily: 'Montserrat-SemiBold',
    //                 fontSize: 11,
    //               }}>
    //               {' '}
    //               Privacy Policy
    //             </Text>
    //           </TouchableOpacity>
    //         </View>

    //         <TouchableOpacity
    //           disabled={!Terms}
    //           onPress={() => {
    //             //console.log('submit');
    //             handleBooking();
    //           }}
    //           style={{
    //             alignItems: 'center',
    //             backgroundColor: Terms == false ? '#AEAEAE' : '#081F62',
    //             paddingHorizontal: 10,
    //             paddingVertical: 10,
    //           //  marginHorizontal: 20,
    //             width:'80%',
    //             // borderColor: '#043862',
    //             //borderWidth: 1,
    //             borderRadius: 8,
    //             //marginTop: 30,
    //             marginTop: 20,
    //             marginBottom: 60
    //           }}>
    //           <Text
    //             style={{
    //               fontSize: 16,
    //               fontFamily: 'Montserrat-SemiBold',
    //               color: '#FFFFFF',
    //             }}>
    //             Review
    //           </Text>
    //         </TouchableOpacity>


    //         </View>
    //       </View>
    //       <View style={{ marginTop: height * 0.8, }}>
    //         {/* <View
    //           style={{
    //             borderColor: '#418841',
    //             borderWidth: 1,
    //             backgroundColor: '#51AC51',
    //             borderRadius: 5,
    //             padding: 15,
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             // marginTop: height * 0.38,
    //           }}>
    //           <Text
    //             style={{
    //               fontFamily: 'Montserrat-Bold',
    //               fontSize: 14,
    //               color: '#FFFFFF',
    //             }}>
    //             Total Booking Amount
    //           </Text>
    //           <Text
    //             style={{
    //               fontFamily: 'Montserrat-Bold',
    //               fontSize: 14,
    //               color: '#FFFFFF',
    //             }}>
    //             {'\u20B9'} {Number * Property?.BookingAmount + 300 * Number}
    //           </Text>
    //         </View> */}
    //         {/* <View
    //           style={{
    //             justifyContent: 'flex-start',
    //             flexDirection: 'row',
    //             padding: 5,
    //             marginVertical: 10,
    //             flex: 1,
    //             width: '100%'
    //           }}>
    //           <TouchableOpacity
    //             onPress={() => {
    //               setTerms(!Terms);
    //             }}>
    //             <View style={styles.option}>
    //               <View style={[styles.checkbox, { backgroundColor: Terms ? '#081F62' : '#ffff', }]}>
    //                 {Terms && (
    //                   <IconAntDesign name="check" size={10} color="#FFFFFF" />
    //                 )}
    //               </View>
    //             </View>
    //           </TouchableOpacity>

    //           <Text
    //             style={{
    //               color: '#1E2135',
    //               fontFamily: 'Montserrat-Medium',
    //               fontSize: 12,
    //             }}>
    //             {" "}I agree to the
    //           </Text>
    //           <TouchableOpacity
    //             onPress={() => {
    //               navigation.navigate('TermsAndCondition');
    //             }}>
    //             <Text
    //               style={{
    //                 color: '#0F1130',
    //                 fontFamily: 'Montserrat-SemiBold',
    //                 fontSize: 12,
    //               }}>
    //               {' '}
    //               Terms & conditions
    //             </Text>
    //           </TouchableOpacity>
    //           <Text
    //             style={{
    //               color: '#1E2135',
    //               fontFamily: 'Montserrat-Medium',
    //               fontSize: 12,
    //             }}>
    //             {' '}
    //             and
    //           </Text>

    //           <TouchableOpacity
    //             onPress={() => {
    //               navigation.navigate('Privacy');
    //             }}>
    //             <Text
    //               style={{
    //                 color: '#0F1130',
    //                 fontFamily: 'Montserrat-SemiBold',
    //                 fontSize: 12,
    //               }}>
    //               {' '}
    //               Privacy Policy
    //             </Text>
    //           </TouchableOpacity>
    //         // </View> */}
    //         {/* <TouchableOpacity
    //           disabled={!Terms}
    //           onPress={() => {
    //             //console.log('submit');
    //             handleBooking();
    //           }}
    //           style={{
    //             alignItems: 'center',
    //             backgroundColor: Terms == false ? '#AEAEAE' : '#081F62',
    //             paddingHorizontal: 10,
    //             paddingVertical: 10,
    //             marginHorizontal: 30,
    //             // borderColor: '#043862',
    //             //borderWidth: 1,
    //             borderRadius: 8,
    //             //marginTop: 30,
    //             marginTop: 20,
    //             marginBottom: 60
    //           }}>
    //           <Text
    //             style={{
    //               fontSize: 16,
    //               fontFamily: 'Montserrat-SemiBold',
    //               color: '#FFFFFF',
    //             }}>
    //             Review
    //           </Text>
    //         </TouchableOpacity> */}
    //           </View> 

    //     </ScrollView>
    //  </SafeAreaView>





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
