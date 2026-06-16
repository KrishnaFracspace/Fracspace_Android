import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PayUPaymentVerify, PropertyDetailsById } from './Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function BookingFailure(props) { 
    const [txn, setTxn] = useState(props?.route?.params?.txnId);
    const [property, setProperty] = useState(props?.route?.params?.property);
    // console.log("Prorrrrrrr: ",property);

    const [verifyPay, setVerifyPay] = useState(null);
    const [propDetails, setPropDetails] = useState(null);
    const navigation = useNavigation();

   const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    // const bookingAmt = ;
    const bookingAmt = propDetails?.BookingAmt
            ? parseInt(propDetails?.BookingAmt.replace(/,/g, ""), 10)
            : 0;

            // console.log("BookingAMt : ",bookingAmt);
    const platformFee = (property?.numberOfFractions) * (bookingAmt * 2.2/100);
    const gst = platformFee * (18/100);

    const extraCharge = platformFee + gst;

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                verifyPayment(),
                GetPropertyById()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async () => {
        let payload = JSON.stringify({
            txnID: txn
        });
        try{
            let {data: res} = await PayUPaymentVerify(payload);
            console.log("reaponsee: ",res?.payment);
            setVerifyPay(res?.payment);
        }catch(error) {
            console.log('Error in verifying payment: ',error?.response?.data || error?.response?.message);
        }
    }

    const GetPropertyById = async() => {
        try{
            let {data: res} = await PropertyDetailsById(property?.propertyId);
            console.log('Propr: ',res?.property);
            setPropDetails(res?.property);
        }catch(error) {
            console.log("Error in fetching prop by id: ",error?.response?.data || error?.response?.message);
        }
    }

    if (loading) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    let formatted = "";

    if (verifyPay?.responseDetails?.addedon) {
        const date = new Date(verifyPay?.responseDetails?.addedon.replace(" ", "T"));

        formatted = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(",", " |");
    }

    const formatIndianAmount = (amount) => {
        if (amount == null) return '0';
        return Number(amount).toLocaleString('en-IN');
    };
    // console.log("Form: ",formatted);

    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'#021265' }}>
            <ScrollView style={{ backgroundColor: '#FFF' }}>
                <View style={{alignItems:'center',padding:20}}>
                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Payment Summary</Text>
                </View>
                <View style={{paddingHorizontal:20}}>
                    <LinearGradient colors={['#c7e5fd53','#FFF']} style={{borderRadius:10,padding:20}}>
                        <View style={{alignItems:'center'}}>
                            <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/cancel-circle.png'}} style={{width:60,height:60}}/>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:16,color:'#000',marginVertical:5}}>Payment Failed</Text>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#021265'}}>The booking was unsuccessful.</Text>
                        </View>
                        <View style={{borderWidth:0.5,borderColor:'#00000080',borderRadius:10,padding:10,marginTop:20}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{flex:1}}>
                                    <Image source={{uri:propDetails?.image?.Image1}} style={{width:120,borderRadius:5,height:100}}/>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000',marginTop:5}}>{formatted}</Text>
                                </View>
                                <View style={{marginLeft:7,gap:5,flex:1}}>
                                    <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#000'}}>{propDetails?.name}</Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Location: <Text style={{fontFamily:'WorkSans-Regular'}}>{propDetails?.Location}</Text></Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>No. of Fracs: <Text style={{fontFamily:'WorkSans-Regular'}}>{property?.numberOfFractions}</Text></Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>Booking ID: <Text style={{fontFamily:'WorkSans-Regular'}}>{verifyPay?._id}</Text></Text>
                                    <View style={{backgroundColor:'#FDDBDB4D',borderRadius:20,padding:5,alignItems:'center'}}>
                                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#F8181C'}}>Booking failed</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{marginTop:15}}>
                            <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#000'}}>Price details</Text>
                            <View style={{borderWidth:0.5,borderColor:'#00000080',borderRadius:10,padding:15,marginTop:10}}>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Booking Amount</Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>₹{propDetails?.BookingAmt}</Text>
                                </View>
                                <View style={{borderWidth:0.5,borderColor:'#0000004D',borderStyle:'dashed',marginVertical:8}}/>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>No of Fracs</Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>{property?.numberOfFractions}</Text>
                                </View>
                                <View style={{borderWidth:0.5,borderColor:'#0000004D',borderStyle:'dashed',marginVertical:8}}/>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#000'}}>Tax & GST Charges</Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000'}}>{propDetails?.offer ? propDetails?.gstAmount + propDetails?.platformFeeAmount : extraCharge}</Text>
                                </View>
                                <View style={{borderWidth:0.5,borderColor:'#0000004D',borderStyle:'dashed',marginVertical:8}}/>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#EB2C19'}}>Total Amount</Text>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#EB2C19'}}>₹{formatIndianAmount(verifyPay?.amount)}</Text>
                                </View>
                            </View>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:14,color:'#000',marginTop:10}}>Transaction ID: <Text style={{fontFamily:'WorkSans-Medium'}}>{verifyPay?.txnId}</Text></Text>
                        </View>
                    </LinearGradient>

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