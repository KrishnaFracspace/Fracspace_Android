import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { CoOwnerBookingverification, GetBookingDetails, PropertyDetailsById } from './Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from './Context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function BookingSuccess(props) {
    // console.log('Booking Success - Booking Data: ',props?.route?.params?.bookingData);
    // console.log('Booking Success - Payment Data: ',props?.route?.params?.paymentData);
    // console.log('Booking Success - Porperty: ',props?.route?.params?.property);
    const [bookingData, setBookingData] = useState(props?.route?.params?.bookingData);
    const [paymentData, setPaymentData] = useState(props?.route?.params?.paymentData);
    const [property, setProperty] = useState(props?.route?.params?.property);
    // console.log("ProrprrL ",props?.route?.params?.property);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const {globalState} = useContext(AppContext);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            const payload = JSON.stringify({
                email: globalState?.userEmail
            });

            const { data: bookingRes } = await GetBookingDetails(payload);

            const booking = bookingRes?.data?.[0];
            console.log("Bookingggg: ",booking);

            if (!booking) {
                setLoading(false);
                return;
            }

            setBookingDetails(booking);

            // Call property API only if propertyId exists
            if (booking?.propertyId) {
                const { data: propertyRes } = await PropertyDetailsById(
                    booking.propertyId
                );
                console.log("Proprrrr: ",propertyRes?.property);
                setPropertyDetails(propertyRes?.property);
            }

        } catch (error) {
            console.log(
                'Error loading screen:',
                error?.response?.data || error?.response?.message
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading || !bookingDetails || !propertyDetails) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const bookingAmt = propertyDetails?.BookingAmt
            ? parseInt(propertyDetails?.BookingAmt.replace(/,/g, ""), 10)
            : 0;

            // console.log("BookingAMt : ",bookingAmt);
    const platformFee = (property?.numberOfFractions) * (bookingAmt * 2.2/100);
    const gst = platformFee * (18/100);

    const extraCharge = platformFee + gst;

    let formatted = "";

    if (paymentData?.responseDetails?.addedon) {
        const date = new Date(paymentData?.responseDetails?.addedon.replace(" ", "T"));

        formatted = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(",", " and");
    }

    // console.log("Form: ",paymentData?.responseDetails?.addedon);

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#021265'}}>
        <ScrollView style={{backgroundColor:'#FFF'}}>
            <View style={{alignItems:'center',padding:20}}>
                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Payment Summary</Text>
            </View>
            <View style={{paddingHorizontal:20}}>
                <LinearGradient colors={['#c7e5fd53','#FFF']} style={{borderRadius:10,padding:20,}}>
                    <View style={{alignItems:'center'}}>
                        <Image source={{uri:'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/checkmark-circle.png'}} style={{width:60,height:60}}/>
                           <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000',marginVertical:5}}>Payment Successful</Text>
                        <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#021265'}}>Congratulations - your frac is now confirmed</Text>
                    </View>
                    <View style={{borderWidth:0.5,borderColor:'#00000080',borderRadius:10,padding:10,marginTop:20}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View>
                                <Image source={{uri: propertyDetails?.image?.Image1}} style={{width:120,borderRadius:5,height:100}}/>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:5}}>{formatted.replace(',' ,' |')}</Text>
                                {/* <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:5}}>31 Jan 2026 | 03:00 PM</Text> */}
                            </View>
                            <View style={{marginLeft:7,gap:5,flex:1}}>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000'}}>{propertyDetails?.name}</Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Location: <Text style={{fontFamily:'WorkSans-Regular'}}>{propertyDetails?.Location}</Text></Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>No.of Fracs: <Text style={{fontFamily:'WorkSans-Regular'}}>{bookingDetails?.numberOfFractions }</Text></Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Booking ID: <Text style={{fontFamily:'WorkSans-Regular'}}>{bookingData?._id }</Text></Text>
                                <View style={{backgroundColor:'#C8DDBA4D',borderRadius:20,padding:5,alignItems:'center'}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#69A143'}}>Frac Reserved</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#000'}}>Price details</Text>
                        <View style={{borderWidth:0.5,borderColor:'#00000080',borderRadius:10,padding:15,marginTop:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Booking Amount</Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>₹{bookingData?.totalBookingAmount }</Text>
                            </View>
                            <View style={{borderWidth:0.5,borderColor:'#0000004D',borderStyle:'dashed',marginVertical:8}}/>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>No of Fracs</Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>{bookingData?.numberOfFractions }</Text>
                            </View>
                            <View style={{borderWidth:0.5,borderColor:'#0000004D',borderStyle:'dashed',marginVertical:8}}/>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Tax & GST Charges</Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>₹{propertyDetails?.offer ? propertyDetails?.gstAmount + propertyDetails?.platformFeeAmount : extraCharge}</Text>
                            </View>
                            <View style={{borderWidth:0.5,borderColor:'#0000004D',borderStyle:'dashed',marginVertical:8}}/>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Total Amount Paid</Text>
                                <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>₹{bookingData?.totalBookingAmount }</Text>
                            </View>
                        </View>
                        <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000',marginTop:10}}>Transaction ID: <Text style={{fontFamily:'WorkSans-Medium'}}>{paymentData?.txnId}</Text></Text>
                    </View>
                </LinearGradient>

                {/* <View style={{borderWidth:0.5,borderRadius:5,borderColor:'#00000080',padding:12,alignItems:'center',marginTop:20}}>
                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#000'}}>Download Receipt</Text>
                </View> */}
                <TouchableOpacity onPress={() => {
                    navigation.navigate('BottomNavigations');
                }} style={{backgroundColor:'#021265',padding:12,alignItems:'center',marginTop:10,borderRadius:5}}>
                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFF'}}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}