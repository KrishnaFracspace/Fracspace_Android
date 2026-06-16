import {View,Text,Image,TouchableOpacity,Dimensions,ScrollView,Alert,ActivityIndicator, StyleSheet,} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Footer from './Footer';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Octicons';
import IconC from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/Entypo';
import {DisLike, LikeData} from './Services/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from './Context/AppContext';
import Contact from './Contact';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function Like() {
  const {globalState, setGlobalState} = useContext(AppContext);

  const navigation = useNavigation();
  const [IsLike, setIsLike] = useState([]);
  const [Eventstatus, setEventstatus] = useState(0);
  const [Massage, setMassage] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleAllLike = async () => {
  //   const email = await AsyncStorage.getItem('Email');
  //   let payload = JSON.stringify({
  //     email: email,
  //   });

  //   try {
  //     let {data: res} = await LikeData(payload);
  //     setLoading(true);
  //     if (res?.success) {
  //       if (res?.properties?.length != 0) {
  //         setGlobalState(prevState => ({
  //           ...prevState,
  //           LikeData: res?.pIds,
  //         }));
  //         setIsLike(res?.properties);
  //       } else {
  //         setMassage(
  //           'Great news! The properties you liked have been wishlisted for your convenience. Happy browsing!',
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     if (error?.response) {
  //       Alert.alert('Response Error', `${error?.response?.data?.message}`);
  //     } else if (error?.request) {
  //       Alert.alert('Request error:', 'Please Check Your Internet Connection');
  //     } else {
  //       Alert.alert('Error:', `${error?.message}`);
  //     }
  //   } finally{
  //     setLoading(false);
  //   }
  // };

  const handleAllLike = async () => {
  try {
    setLoading(true); // 👈 START loader immediately

    const email = await AsyncStorage.getItem('Email');

    let payload = JSON.stringify({
      email: email,
    });

    let { data: res } = await LikeData(payload);

    if (res?.success) {
      if (res?.properties?.length !== 0) {
        setGlobalState(prevState => ({
          ...prevState,
          LikeData: res?.pIds,
        }));
        setIsLike(res?.properties);
      } else {
        setMassage(
          'Great news! The properties you liked have been wishlisted for your convenience. Happy browsing!',
        );
      }
    }

  } catch (error) {
    if (error?.response) {
      Alert.alert('Response Error', error?.response?.data?.message);
    } else if (error?.request) {
      Alert.alert('Request error', 'Please check your internet connection');
    } else {
      Alert.alert('Error', error?.message);
    }
  } finally {
    setLoading(false); // 👈 STOP loader always
  }
};


  const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });
    try {
      let {data: res} = await DisLike(payload);
      if (res?.success) {
        const filteredNumbers = IsLike.filter(number => number !== Productid);
        setIsLike(filteredNumbers);
        if(IsLike?.length==1){
          setIsLike([]);
        }
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log('Request error:', `${JSON.stringify(error)}`);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  useEffect(() => {
    
    handleAllLike();
  }, [Eventstatus]);

  return (
     <SafeAreaView style={{ flex: 1,backgroundColor:'#021265'}}>

       <View style={{flex:1}}>
      {IsLike?.length == 0 ?(
        <View style={{flex:1,backgroundColor:'#FFF',alignItems:'center'}}>
          <LinearGradient colors={['#C7E5FD', '#FFF']} style={{width: width, height: height*0.3,padding:20,}}>
              <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',paddingVertical:10}}>
                  <TouchableOpacity onPress={() => {
                      navigation.goBack();
                  }}>
                      <Ico name={'chevron-left'} size={20} color={'#000'}/>
                  </TouchableOpacity>
                  <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Wishlist</Text>
                  <View style={{width:20}}/>
              </View>
          </LinearGradient>
          <View style={{position:'absolute',top:height*0.2,alignItems:'center'}}>
              <Image resizeMode='contain' source={{uri: "https://duixj37yn5405.cloudfront.net/appImages/NoWishlist.png"}} style={{width:width*0.55,height:height*0.25}}/>
              <View style={{alignItems:'center'}}>
                  <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#000'}}>Your wishlist is waiting</Text>
                  <Text style={{fontFamily:'WorkSans-Regular',fontSize:13,color:'#00000099',marginTop:10}}>Discover stays and co-ownerships worth coming back to.</Text>
              </View>
              <TouchableOpacity onPress={() => {
                  navigation.goBack();
              }} style={{backgroundColor:'#021265',padding:10,paddingHorizontal:35,borderRadius:30,alignItems:'center',marginTop:20}}>
                  <Text style={{fontFamily:'WorkSans-Medium',fontSize:16,color:'#FFF'}}>Start Exploring</Text>
              </TouchableOpacity>
          </View>
      </View>
      ): (
        <View style={{flex:1, backgroundColor: '#FAFAFF'}}>
          
            <ScrollView style={{}}>
            <LinearGradient colors={['#C7E5FD', '#FFF']} style={{width: width, height: height*0.3,padding:20,position:'absolute',top:0}}>
              <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',paddingVertical:10}}>
                  <TouchableOpacity onPress={() => {
                      navigation.goBack();
                  }}>
                      <Ico name={'chevron-left'} size={20} color={'#000'}/>
                  </TouchableOpacity>
                  <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Wishlist</Text>
                  <View style={{width:20}}/>
              </View>
          </LinearGradient>
            <View style={{marginVertical: 80,paddingHorizontal:10}}>
              {IsLike?.map((item, index) => (
              <TouchableOpacity
              key={index}
              style={{width: '100%',borderRadius: 5,borderColor: '#E2E2E2',borderWidth: 1,flexDirection: 'row',justifyContent: 'flex-start',marginBottom: 15}}
              onPress={() => {
                //  const name = item?.name;
                navigation.navigate('Property', {Id: item?._id});
              }}>
            
              <Image
                style={{
                  width: width * 0.35,
                  height: 120,
                  borderRadius: 5,
                  opacity:item?.AvailableFractions == 0? 0.5:null,
                }}
                source={{uri: item?.image?.Image1}}
              />
              
                  {item?.AvailableFractions == 0 && (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        position: 'absolute',
                        // justifyContent: 'center',
                        // alignItems:'center',
                        opacity: 0.7,
                        
                        left: width*0.21,
                      // top: height*0.10,
                        //right: -100,
                      }}
                      source={require('./assets/SoldOut2.png')}
                    />
                  )}
                
              <View style={{ flex:1,width:'100%',alignItems:'flex-start',paddingVertical:10}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',paddingHorizontal:8}}>
                <View style={{flex:9}}>
                <Text
                  style={{
                    color: '#1E2135',
                    fontSize: 12,
                    fontFamily:'Montserrat-SemiBold',
                  // paddingVertical: 2,
                  }}>
                  {item?.name}
                </Text>
                </View>
                <TouchableOpacity style={{flex:1}}
                onPress={()=>{
                  handleDisLike(item?._id);
                  
                    
                }}>
                <Icon
                    name={'trash' }
                    size={19}
                    color={'#E73131'}
                  />
    
    
    
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width:'100%',
                    padding:8,
                  // borderWidth:3
                    
                  }}>
                      <View style={{flex:1,}}>
                  <Text style={{fontSize: 10, fontFamily:'Montserrat-Medium', color: '#1E2135'}}>
                  Frac value 
                  </Text>
                  </View>
                  <View style={{flex:1}}>
                  <Text style={{fontSize: 10,fontFamily:'Montserrat-Medium', color: '#1E2135',}}>{'\u20B9'}{item?.FC_Price}
                  </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width:'100%',
                    flex:1,
                    paddingHorizontal:8,
                  }}>
                    <View style={{flex:1}}>
                  <Text style={{fontSize: 10, fontFamily:'Montserrat-Medium', color: '#236C1C'}}>
                  Available Fraction
                  </Text>
                  </View>
                  <View style={{flex:1}}>
                  <Text style={{fontSize: 10,fontFamily:'Montserrat-Medium', color: '#236C1C'}}>
                  {' '}{item?.AvailableFractions}
                  </Text>
                  </View>
                
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width:'100%',
                  // margin:5
                  // paddingTop:5,
                    paddingHorizontal:8,
                  }}>
                    <View></View>
                <View style={{
                  backgroundColor:'#FFFFFF',
                  paddingHorizontal:12,
                  borderRadius:20,
                  paddingVertical:8,
                  elevation: 5,
                  shadowColor: '#000',
                  shadowRadius: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  }}>
                <Text style={{fontSize: 10, fontFamily:'Poppins-SemiBold', color: '#043862',}}>
                View Details
                  </Text>
                </View>
                </View>
            
              </View>
            </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
      </View>

     {loading && (
       <View
         style={{
           position: 'absolute',
           top: 0,
           bottom: 0,
           left: 0,
           right: 0,
           backgroundColor: 'rgba(0,0,0,0.15)',
           justifyContent: 'center',
           alignItems: 'center',
           zIndex: 999,
         }}
       >
         <View
           style={{
             backgroundColor: '#FFF',
             paddingVertical: 25,
             paddingHorizontal: 35,
             borderRadius: 18,
             alignItems: 'center',
             elevation: 8,
           }}
         >
           <ActivityIndicator size="large" color="#021265" />
           <Text
             style={{
               marginTop: 12,
               fontSize: 13,
               fontFamily: 'Montserrat-Medium',
             }}
           >
             Loading your wishlist…
           </Text>
         </View>
       </View>
     )}
    

     </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)', // optional dim
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
