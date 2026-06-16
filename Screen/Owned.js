import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, Image, Dimensions, ScrollView, Modal, } from 'react-native';
import Ico from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from './Context/AppContext';
import QuarterlyBarChart from './component/QuarterlyBarChart ';
export default function Owned() {
  const { width, height } = Dimensions.get('window');
  const {globalState} = useContext(AppContext);
  const profile = globalState?.userDetails;
    // const [OwnedData, setOwnedData] = useState(profile?.ownedProperties?.filter(
    //     item => item?.status === 'active'
    // ) || [] );

  const [OwnedData, setOwnedData] = useState([]);

    useEffect(() => {
        setOwnedData(
            Array.isArray(profile?.ownedProperties)
                ? profile.ownedProperties.filter(
                    item => item?.status === 'active'
                )
                : []
        );
    }, [profile?.ownedProperties]);
  const navigation = useNavigation();
  const investedAmount = 1500000;
  const data = profile?.addProfit?.map(change => investedAmount + change);
  const monthLabels = profile?.QPaymentInfo?.map(item => item.label);
  const extendedMonths = monthLabels?.length == 0 ? [] : ['', ...monthLabels, ''];
  const screenWidth = Math.max(data?.length * 100, Dimensions.get('window').width);

  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:'#021265'}}>
      <View style={{ flex: 1, width: '100%',backgroundColor:'#FFF' }}>
        {profile?.verification ? 

        <View style={{flex:1}}>
            {OwnedData?.length != 0 ?
                <ScrollView style={{ flex: 1, width: '100%', padding: 20, backgroundColor: '#F6F6F6' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center',alignSelf:'center' }}>
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 24, color: '#021265', }}>Investment Portfolio</Text>
                    </View>
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={{  backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 20,paddingHorizontal:10, marginVertical: 30,elevation:1 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#F6F6F6', borderRadius: 10, padding: 10, }}>
                                    <Ico name={'dollar'} size={20} color={'#081F62'} />
                                    </View>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 13, color: '#000000', marginLeft: 10 }}>P/L Summary</Text>
                                </View>
                            </View>

                            {/* {profile.QPaymentInfo?.length != 0 && profile.addProfit?.length != 0 ? */}
                            {(profile?.QPaymentInfo?.length ?? 0) !== 0 &&
                            (profile?.addProfit?.length ?? 0) !== 0 ?
                                <View style={{ height: 320, width: '100%', }}>
                                    {/* <QuarterlyBarChart data={profile.QPaymentInfo}/> */}
                                    <QuarterlyBarChart
                                        data={Array.isArray(profile?.QPaymentInfo)
                                            ? profile.QPaymentInfo
                                            : []}
                                    />
                                </View>
                                :
                                <View style={{alignItems:'center',marginVertical:15}}>
                                  <Image source={{uri: 'https://duixj37yn5405.cloudfront.net/appImages/NoPayouts.png'}} style={{width:width*0.6,height:height*0.2}}/>
                                  <Text style={{fontFamily:'WorkSans-Regular',fontSize:14,color:'#000',textAlign:'center',marginTop:10}}>Your payout is scheduled and will be released soon</Text>
                                </View>
                                
                            }

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10 }}>
                                <View>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Capital Invested</Text>
                                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{profile?.investedAmount || 'N/A'}</Text>
                                </View>
                                {profile?.currentAmount != "" ?
                                  <View>
                                      <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
                                      <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{profile?.currentAmount || 'N/A'}</Text>
                                  </View>
                                  :
                                  <View>
                                      <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
                                      <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>Released Soon</Text>
                                  </View>
                                }
                            </View>
                        </View>

                        <View style={{ marginBottom: 80 }}>
                            {OwnedData?.map((item, index) => (<TouchableOpacity key={index} onPress={() => {
                            if(item?.exitStatus == 'requested' || item?.exitStatus == 'inProgress'){
                            }else{
                                navigation.navigate('Dashboard', { ownedProDetails: item });
                            }
                            }} style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, flexDirection: 'row', marginBottom: 20, width: '100%', flex: 1 }}>
                            <View>
                                {/* <Image resizeMode='cover' source={{ uri: item?.propertyDetails?.image?.Image1 }} style={{ width: width * 0.32, height: 150, borderRadius: 8 }} /> */}
                                <Image
                                    resizeMode='cover'
                                    source={
                                        item?.propertyDetails?.image?.Image1
                                            ? { uri: item.propertyDetails.image.Image1 }
                                            : undefined
                                    }
                                    style={{ width: width * 0.32, height: 150, borderRadius: 8 }}
                                />
                            </View>
                            <View style={{ width: '60%', justifyContent: 'space-between', marginLeft: 10 }}>
                                <View style={{ gap: 5, width: '100%' }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 15, color: '#5C5CB1', flexShrink: 1 }}>{item?.propertyDetails?.name}</Text>
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#7E7A7A' }}>{item?.propertyDetails?.location}</Text>
                                </View>
                                <View style={{ borderColor: '#EFE8E8', borderWidth: 0.7 }}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>Collective cost </Text>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088', textAlign: 'right' }}>₹{item?.propertyDetails?.Price}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>Investment</Text>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088', textAlign: 'right' }}>₹{item?.totalInvestment}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#000000' }}>{item?.numberOfOwners} Fracs</Text>
                                </View>
                            </View>
                            {(item?.exitStatus == 'requested' || item?.exitStatus == 'inProgress') && (
                                <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'#000000b0',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#FFF'}}>
                                        {item?.exitStatus == 'requested' ? 'Exit request is in process' : 'Transfer request is in process'}
                                    </Text>
                                </View>
                            )}
                            </TouchableOpacity>))}

                        </View>
                    </View> 
                </ScrollView>
                :
                <View style={{flex:1, backgroundColor:'#FFF'}}>
                    <LinearGradient colors={['#c7e5fd', '#FFF']} style={{width:width,height:height*0.3,padding:20,alignItems:'center'}}></LinearGradient>
                    <View style={{position:'absolute',top:height*0.25,backfaceVisibility:'visible',alignSelf:'center', alignItems: 'center', justifyContent: 'center', }}>
                        <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
                            <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/PortfolioEmpty.png' }} style={{ width: width * 0.5, height: height*0.21}} />
                            <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center' ,marginTop:10}}>Your property portfolio is empty.</Text>
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
                                Start exploring exclusive properties and grow your real estate assets with shared ownership
                            </Text>
                            <TouchableOpacity onPress={() => {
                                //  GgoToYosemite(PropertiesArray?.Location);
                                navigation.navigate('Home',{details:globalState?.ProDetails});
                                // navigation.navigate('PropertyListing');
                            }} style={{ backgroundColor: '#021265', borderRadius: 30, paddingHorizontal: 50, marginTop: 15, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
        </View>
        : 
        <View style={{flex:1,backgroundColor:'#FFF'}}>
          <LinearGradient colors={['#C7E5FD', '#FFF']} style={{width:width,height:height*0.3,padding:20,alignItems:'center'}}>
          </LinearGradient>
          <View style={{position:'absolute',top:height*0.25,backfaceVisibility:'visible',alignSelf:'center', alignItems: 'center', justifyContent: 'center', }}>
            <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
              <Image source={{ uri: 'https://duixj37yn5405.cloudfront.net/appImages/PortfolioEmpty.png' }} style={{ width: width * 0.5, height: height*0.21}} />
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center' ,marginTop:10}}>Your property portfolio is empty.</Text>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
                Start exploring exclusive properties and grow your real estate assets with shared ownership
              </Text>
              <TouchableOpacity onPress={() => {
                navigation.navigate('Home',{details:globalState?.ProDetails});
              }} style={{ backgroundColor: '#021265', borderRadius: 30, paddingHorizontal: 50, marginTop: 15, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        }
      </View>

    </SafeAreaView>
  );
};