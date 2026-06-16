import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import IconF from 'react-native-vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from './Context/AppContext';
import { GetBookingAmountDate, GetBookingAmountDatelink, PaymentPayU, PaymentUPI } from './Services/UserApi';

const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Review(props) {
 // console.log(props?.route?.params?.PropertyImage);


  const navigation = useNavigation();
  const [propertyImage, setPropertyImage] = useState(
    props?.route?.params?.PropertyImage,
  );
  const [property, setProperty] = useState(
    props?.route?.params?.proprtyDetails?.data,
  );
  // console.log("Property: ",property);
  const [modalVisible, setModalVisible] = useState(false);
  const [SelectPic, setSelectPic] = useState(0);
  const { globalState, setGlobalState } = useContext(AppContext);
  const [Docs, setDocs] = useState(globalState?.userDetails?.documents);
  const [PanDoc, setPanDoc] = useState('');
  const [AadharDoc, setAadharDoc] = useState('');
  const [ChequeDoc, setChequeDoc] = useState('');

  const first = () => {
    for (let index = 0; index < Docs.length; index++) {
      if (Docs[index].includes('pan')) {
        setPanDoc(Docs[index]);
      } else if (Docs[index].includes('aadhar')) {
        setAadharDoc(Docs[index]);
      } else {
        setChequeDoc(Docs[index]);
      }
    }
  };


  useEffect(() => {
    first();
  }, []);




  // const handlePaymentgate  = async() => {
  //   let payload = JSON.stringify({
  //     amount:property?.totalBookingAmount+'00',
  //     currencyCode:'356',
  //     email:globalState?.userDetails?.email,
  //     phone:globalState?.userDetails?.phoneNumber
  //   });

  //   try {
  //     let {data: res} = await GetBookingAmountDate(payload);
  //     if (res?.success) {
  //       navigation.navigate('PaymentPage');

  //     }
  //   } catch (error) {
  //     if (error?.response) {
  //       Alert.alert('Response Error', `${error?.response?.data?.message}`);
  //     } else if (error?.request) {
  //       //Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
  //       Alert.alert('Request Error:', 'Please Check Your Internet Connection');
  //      // Alert.alert('Request error:', `${JSON.stringify(error?.request)}`);
  //     } else {
  //       Alert.alert('Error:', `${error}`);
  //     }
  //   }
  // }


  const handlePayment = async () => {
    let id = `tnxnid-fracspace-app-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    let payload = JSON.stringify({
      amount:property?.totalBookingAmount + 300*property?.numberOfFractions,
      // amount:1,
      productinfo: "Co-ownership Product",
      firstname: globalState?.userName,
      email: globalState?.userDetails?.email,
      phone: globalState?.userDetails?.phoneNumber,
      txnid: id,
      surl: "https://test.bunknbeyond.com/paymentsuccess",
      furl: "https://test.bunknbeyond.com/paymentfailure"

    });
    console.log("Initiate Payload: ",payload);

    try {
      let { data: res } = await PaymentPayU(payload);
      console.log("Response: ",res);
      if (res?.success) {
        navigation.navigate('PaymentPage', { Link: res?.form, TxnID: id ,property:property});
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





  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <View style={{
        backgroundColor:'#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%',
        paddingHorizontal: 15,
        backgroundColor:'#021265',
        // /borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
     
      }}>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
           // navigation.navigate('Book',{property:property});
           navigation.goBack();

          }}>
          <Icon name="chevron-back-outline" size={25} color={'#FFFFFF'} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontFamily: 'WorkSans-SemiBold',
          color: '#FFFFFF',
        }}>
          Review
        </Text>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
            navigation.popToTop();
            // navigation.navigate('HomePage');

          }}>
          <Text style={{
            fontSize: 15,
            fontFamily: 'WorkSans-SemiBold',
            color: '#FFFFFF',
            textAlign: 'right'
          }}>EXIT</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%', backgroundColor: '#FAFAFF',padding:20 }}>

        {/* <TouchableOpacity
        onPress={() => {
          navigation.navigate('Book', {property: property});
        }}
        style={{
         
         
         // position: 'absolute',
          width: '100%',
          padding: 20,
          alignItems: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            height: 25,
            width: 25,
            borderRadius: 25,
            marginRight: 10,
          }}>
          <Icon name="arrow-back-outline" size={20} color="black" />
        </View>

        <Text style={[styles.text]}>Book</Text>
      </TouchableOpacity> */}
        <Image
          style={{ width: width*0.89, height: height *0.22,borderRadius:10 }}
          resizeMode='cover'
          source={{ uri: propertyImage }}
       
        />

        <View
          style={{
            backgroundColor: '#FFFFFF',
           // padding: 10,
            borderRadius: 10,
         
            marginVertical: 20,
          }}>
          <Text style={styles.title}>Property Details</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
             // alignItems: 'center',
              paddingBottom: 8,
              width: '100%',
             // borderWidth:1
            }}>
             <Text style={[styles.text4Typo, { flex: 1 }]}>
             Property Name
            </Text>
            <Text style={[styles.serenityHeights, { flex: 1 }]}>{property?.propertyName}</Text>
          </View>
        
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
              width: '100%'
            }}>
            <Text style={[styles.text4Typo, { flex: 1 }]}>
              Frac Price
            </Text>
            <Text style={[styles.textTypo, { flex: 1 }]}>
              {'\u20B9'}{property?.FC_Price}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
              width: '100%'
            }}>
            <Text style={[styles.text4Typo, { flex: 1 }]}>
              Booking Amount
            </Text>
            <Text style={[styles.textTypo, { flex: 1 }]}>
              {'\u20B9'}{property?.totalBookingAmount}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 10,
              width: '100%'
            }}>
            <Text style={[styles.text4Typo, { flex: 1 }]}>
              Platform Fee
            </Text>
            <Text style={[styles.textTypo, { flex: 1 }]}>
              {'\u20B9 '}{300}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              paddingBottom: 10,
            }}>
            <Text style={[styles.text4Typo, { flex: 1 }]}>
              No of Fractions{"  "}
            </Text>
            <Text style={[styles.textTypo, { flex: 1, }]}>{property?.numberOfFractions}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              paddingBottom: 10,
              // borderWidth:1
            }}>
            <Text style={[styles.text4Typo, { fontFamily: 'OpenSans-Bold', flex: 1, }]}>
              Total Amount{"  "}
            </Text>
            <Text style={[styles.textTypo, {  fontFamily: 'OpenSans-Bold',flex: 1,opacity:1 }]}>{'\u20B9 '}{property?.totalBookingAmount + property?.numberOfFractions*300}</Text>
          </View>
        </View>


        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
           // marginHorizontal: 30,
            // marginTop: -40,
            marginBottom: 20,
          }}>
          <Text style={styles.title}>Personal Details</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 8,
            }}>
            <Icon name="person" size={20} color="#021265" />
            <Text
              style={{fontFamily:'Montserrat-Medium',fontSize:16,color:'#000000',paddingLeft:10}}>
              {globalState?.userDetails?.userName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 8,
            }}>
            <Icon name="mail" size={20} color="#021265" />
            <Text style={{fontFamily:'Montserrat-Medium',fontSize:16,color:'#000000',paddingLeft:10}}>
              {globalState?.userDetails?.email}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 8,
            }}>
            <IconF name="phone-volume" size={20} color="#021265" />
            <Text style={{fontFamily:'Montserrat-Medium',fontSize:16,color:'#000000',paddingLeft:10}}>
              {globalState?.userDetails?.phoneNumber}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingBottom: 8,
              //flex:1
            }}>
            <IconF name="location-dot" size={20} color="#021165" />
            <Text style={{fontFamily:'Montserrat-Medium',fontSize:16,color:'#000000',paddingLeft:10}}>
              {globalState?.userDetails?.postalAddress},{' '}
              {globalState?.userDetails?.pincode}
              {/* Yorem ipsum dolor sit amet, consectetur adipiscing elit. */}
            </Text>
          </View>
        </View>

       {globalState?.userDetails?.verification && <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 10,
            borderRadius: 10,
            marginBottom: 20,
          }}>
          <Text style={styles.title}>Pre-approval Documentation</Text>

          {globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber.length == 13 ? <>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectPic(1);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Icon name="checkbox" size={30} color="#188C16" />
              <Text style={[styles.cardTypo]}>Pan Card</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#000000" />

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectPic(2);
              }}
              style={{
                flexDirection: 'row',
                justifyContent:'space-between',
                alignItems: 'center',

                marginBottom: 14,
              }}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Icon name="checkbox" size={30} color="#188C16" />
              <Text style={[styles.cardTypo]}>Cancelled Cheque</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // setModalVisible(!modalVisible);
                //setSelectPic(2);
                navigation.navigate('DisplayDoc', { Link: AadharDoc, screen: 'Rev' });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Icon name="checkbox" size={30} color="#188C16" />
              <Text style={[styles.cardTypo]}>Aadhar Card</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#000000" />
            </TouchableOpacity></> : <TouchableOpacity
              onPress={() => {
                // setModalVisible(!modalVisible);
                //setSelectPic(2);
                navigation.navigate('DisplayDoc', { Link: AadharDoc, screen: 'Rev' });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
         <Icon name="checkbox" size={30} color="#188C16" />
            <Text style={[styles.cardTypo]}> Government Issued Photo ID</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#000000" />
          </TouchableOpacity>}
        </View>}

        {/* {globalState?.userDetails?.phoneNumber.startsWith('+91') && globalState?.userDetails?.phoneNumber.length === 13 &&
          <TouchableOpacity
            onPress={() => {
              //handlePaymentgate();
              handlePayment();

            }}
            style={{
              alignItems: 'center',
              backgroundColor: '#081F62',
              borderRadius: 12,
              padding: 20,
              marginVertical: 8,
              marginHorizontal: 30,
              marginBottom: 80,
              justifyContent: 'center'
            }}>
            <Text style={{ color: 'white', fontSize: 16, fontFamily: "OpenSans-SemiBold" }}>
              Book Now
            </Text>
          </TouchableOpacity>} */}

        {/* <TouchableOpacity
        onPress={() => {
          //handlePayment();
         // handlePayment();
          navigation.navigate('Payment',{Property:property,status:true});
        
        }}
        style={{
          alignItems: 'center',
          backgroundColor: '#043862',
          borderRadius: 12,
          padding: 20,
          marginVertical: 8,
          marginHorizontal: 30,
          marginBottom: 20,
          justifyContent:'center'
        }}>
        <Text style={{color: 'white', fontSize: 16, fontFamily: "OpenSans-SemiBold"}}>
          Make Payment Via Bank Account 
        </Text>
      </TouchableOpacity> */}



        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity
            style={styles.centeredView}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (SelectPic - 1 == 0) {
                    setSelectPic(2);
                  } else {
                    setSelectPic(SelectPic - 1);
                  }
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  source={require('./assets/LeftArrow.png')}
                />
              </TouchableOpacity>
              {SelectPic == 1 && (
                <Image
                  style={{
                    width: '90%',
                    height: 200,
                    borderRadius: 10,
                    marginHorizontal: 5,
                  }}
                  source={
                    PanDoc != ''
                      ? { uri: PanDoc }
                      : require('./assets/Rectangle63692.png')
                  }
                />
              )}

              {SelectPic == 2 && (
                <Image
                  style={{
                    width: '90%',
                    height: 200,
                    borderRadius: 10,
                    marginHorizontal: 5,
                  }}
                  source={
                    ChequeDoc != ''
                      ? { uri: ChequeDoc }
                      : require('./assets/Rectangle63691.png')
                  }
                />
              )}
              <TouchableOpacity
                onPress={() => {

                  if (SelectPic + 1 > 2) {
                    setSelectPic(1);
                  } else {
                    setSelectPic(SelectPic + 1);
                  }
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require('./assets/RigthArrow.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </ScrollView>
      <View
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingBottom: 30,
          paddingTop: 20,
          // opacity:0.4
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            // padding: 15,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Montserrat-Medium',
              color: '#101010',
            }}>
            ₹ {property?.totalBookingAmount}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Montserrat-SemiBold',
              color: '#081F62',
            }}>
            + ₹{property?.numberOfFractions*300} taxes and fees
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#081F62',
            flex: 1,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            width: '100%',
            // padding: 15,
          }}
          onPress={() => {
            // handlePayment();
            //console.log(ItineraryKey);
            handlePayment();

            //  navigation.navigate('StayBookNow', { ItineraryKey: ItineraryKey })
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Poppins-Medium',
              color: '#FFFFFF',
            }}>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: '#000000',
    opacity: 0.8,
  },
  text3Typo: {
    left: 32,
    color: '#252b2d',
    fontFamily: 'Montserrat-SemiBold',

    fontSize: 18,
    textAlign: 'left',

  //  position: 'absolute',
  },

  text4Typo: {
    color: '#000000',
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
  },
  textTypo: {
    color: '#000000',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    opacity:0.7
  },
  parentFlexBox: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    left: 31,
    position: 'absolute',
  },
  parentFlexBox1: {
    flexDirection: 'row',
    position: 'absolute',
  },
  cardTypo: {
    left: 10,
    color: '#000000',
    //fontFamily: 'Inter-Regular',
    fontFamily: "WorkSans-Medium",
    textAlign: 'left',
    fontSize: 16,

  },
  icroundHomeIconLayout: {
    height: 24,
    position: 'absolute',
  },

  crystineLeeTypo: {
    lineHeight: 20,
    textAlign: 'left',
    fontSize: 16,
  },
  reviewChildLayout: {
    height: 50,
    width: 90,
    borderRadius: 5,
    // left: 32,
    //position: 'absolute',
  },
  reviewBeforePaymentChild: {
    //left: -2,
    width: '100%',
    height: 176,
    backgroundColor: 'transparent',
  },
  batteryIcon: {
    right: 0,
    height: 11,
    position: 'absolute',
  },
  wifiIcon: {
    width: 15,
    height: 11,
  },
  mobileSignalIcon: {
    width: 17,
    height: 11,
  },
  rightSide: {
    right: 25,
    width: 67,
    height: 11,
  },
  leftSideIcon: {
    left: 25,
    width: 28,
    height: 11,
  },

  iosstatusBarblack: {
    height: 44,
  },
  text: {
    // fontFamily: "Inter-Medium",
    color: '#fff',
    fontFamily: "OpenSans-Bold",

    fontSize: 16,
  },


 
  title: {
    color: '#000000',
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    paddingBottom: 10,
    //letterSpacing: 0.3
  },
  title1: {
    top: 525,
  },

  text3: {
    top: '15.31%',
  },
  bxsphoneCallIcon: {
    width: 20,
    height: 20,
    overflow: 'hidden',
  },
  text4: {
    marginLeft: 6,
  },
  bxsphoneCallParent: {
    top: 367,
  },
  fluentmail20FilledParent: {
    top: 397,
  },
  yoremIpsumDolor: {
    width: 304,
    marginLeft: 6,
  },
  mdilocationParent: {
    top: 427,
    left: 31,
  },

  serenityHeights: {
    color: '#000000',
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    opacity:0.7
  },
  icroundHomeIcon: {
    left: 0,
    width: 24,
    top: 0,
    overflow: 'hidden',
  },
  serenityHeightsParent: {
    top: 162,
    width: 160,
    left: 31,
  },
  crystineLee: {
    fontFamily: "OpenSans-Bold",
    color: '#1e2135',
    marginLeft: 6,
  },
  iconamoonprofileFillParent: {
    top: 337,
    left: 31,
  },

  makePayment: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',

  },
  loginButton: {
    // top: 757,
    borderRadius: 8,
    backgroundColor: '#043862',
    width: 343,
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 10,
    left: 15,
  },

});
