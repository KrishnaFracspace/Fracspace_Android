import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  Alert,
 
} from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import openMap, { createOpenLink } from 'react-native-open-maps';
import { AppContext } from './Context/AppContext';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconcall from 'react-native-vector-icons/Feather';
import { DisLike, Like, LikeData, NewUpdate, SiteVisit } from './Services/UserApi';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Property(props) {
 
  
  const { globalState, setGlobalState } = useContext(AppContext);
  const [IsLike, setIsLike] = useState([]);
  const [Event, setEvent] = useState(props?.route?.params?.status || false);
  const [Status, setStatus] = useState(true);
  const [Status1, setStatus1] = useState(true);
  const navigation = useNavigation();
  const [showFullText, setShowFullText] = useState(false);

  const [PropertiesArray, setPropertiesArray] = useState(
    props?.route?.params?.details || []);
  const [Newupdate, setNewupdate] = useState([]);
  const [propertyStatu, setPropertyStatu] = useState(
    props?.route?.params?.details?.PropertyStatus || 0,
  );

  const GgoToYosemite = location => {
    openMap({ query: location });
  };

  const handleUpdate = async () => {
    try {
      let { data: res } = await NewUpdate();

      if (res?.success) {
        setNewupdate(res?.updates);
        // setProperties(res?.properties);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request Error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };
  const handleDisLike = async Productid => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: Productid,
    });
    // console.log(payload);
    try {
      let { data: res } = await DisLike(payload);
      if (res?.success) {
        const filteredNumbers = IsLike.filter(number => number !== Productid);
        setIsLike(filteredNumbers);
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

  const handleLike = async item => {
    let payload = JSON.stringify({
      email: globalState?.userEmail,
      propertyId: item?._id,
    });


    try {
      let { data: res } = await Like(payload);

      if (res?.success) {
        setIsLike([...IsLike, item?._id]);
      } else {
        handleDisLike(item?._id);
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
      } else {
        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  const handleAllLike = async () => {
    // const email = await AsyncStorage.getItem('Email');
    let payload = JSON.stringify({
      email: globalState?.userEmail,
    });
    try {
      let { data: res } = await LikeData(payload);

      if (res?.success) {
        setGlobalState(prevState => ({
          ...prevState,
          LikeData: res?.pIds,
        }));
        setIsLike(res?.pIds);
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
  useEffect(() => {
    handleUpdate();
    handleAllLike();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ alignItems: 'center', flex: 1, padding: 8 }}>
      <Image
        style={[styles.maskGroupIconLayout]}
        resizeMode="cover"
        source={{ uri: item?.image }}
      />
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 12,
            // fontWeight: 400,
            fontFamily: 'OpenSans-SemiBold',
            letterSpacing: 0.3,
            //fontFamily: 'Montserrat-SemiBold',
            color: '#2E2E2E',
            textAlign: 'center',
          }}>
          {item?.name}
        </Text>
      </View>
    </View>
  );
  const renderItemSec = ({ item }) => (
    <View style={{ alignItems: 'center', flex: 1, padding: 8, flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 5, borderColor: '#E8ECF3', borderBottomWidth: 1 }}>
      <Image
        style={[styles.maskGroupIconLayout, { borderRadius: 10 }]}
        resizeMode="cover"
        source={{ uri: item?.image }}
      />
      <View style={{ alignItems: 'flex-start', marginHorizontal: 5, flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            // fontWeight: 400,
            fontFamily: 'OpenSans-SemiBold',
            letterSpacing: 0.3,
            //fontFamily: 'Montserrat-SemiBold',
            color: '#2E2E2E',
            textAlign: 'center',
          }}>
          {item?.name}
        </Text>
      </View>

    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1,}}>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
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
            if(props?.route?.params?.nav){
               navigation.navigate('HomePage');

            }else{
            navigation.navigate('Home',{details:globalState?.ProDetails});
            }
           
          }}>
          <Icon name="chevron-back-outline" size={25} color={'#FFFFFF'} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontFamily: 'WorkSans-SemiBold',
          color: '#FFFFFF',
        }}>
          Property Details
        </Text>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'flex-end' }}
          onPress={() => {
           navigation.navigate('HomePage');
          }}>
          <Text style={{
          fontSize: 18,
          fontFamily: 'WorkSans-SemiBold',
          color: '#FFFFFF',
        }}>
          Exit
        </Text>


        </TouchableOpacity>
        {/* <View  style={{ flex: 1, alignItems: 'flex-end' }}></View> */}
      </View>
      <ScrollView
        style={{
          backgroundColor: '#f5f7fe',
        }}>
        <TouchableOpacity
          style={{ paddingBottom: 30, backgroundColor: 'white' }}
          onPress={() => {
            navigation.navigate('BookingStatus', {
              Image: PropertiesArray?.image,
            });
          }}>
          <Swiper
            style={styles.wrapper}
            height={240}
            onMomentumScrollEnd={(e, state, context) => { }}
            dot={
              <View
                style={{
                  backgroundColor: '#D9D9D9',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  // marginBottom: 3
                }}
              />
            }
            activeDot={
              <View
                style={{
                  backgroundColor: '#043862',
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  //   marginBottom: 3,
                }}
              />
            }
            paginationStyle={{
              bottom: -23,
              // left: null,
              right: 10,
            }}
            // loop={false}
            autoplay>
            <Image
              // resizeMode="stretch"
              style={styles.image}
              source={{ uri: PropertiesArray?.image?.Image1 }}
            />

            <Image
              //resizeMode="stretch"
              style={styles.image}
              source={{ uri: PropertiesArray?.image?.Image2 }}
            />

            <Image
              // resizeMode="stretch"
              style={styles.image}
              source={{ uri: PropertiesArray?.image?.Image3 }}
            />

            <Image
              // resizeMode="stretch"
              style={styles.image}
              source={{ uri: PropertiesArray?.image?.Image4 }}
            />
          </Swiper>


          {/* <View style={{
            flexDirection: 'row',
            position: 'absolute',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            width: '100%',
            paddingHorizontal: 15,
            //  borderBottomWidth: 1,
            //shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // elevation: 1,
            //  borderBottomColor: '#DDE1E5'
          }}>
            
            <View></View>
            <TouchableOpacity style={{ flex: 1, padding: 5 }}
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
          </View> */}


          {/* <View
            style={{
              width: '100%',
              height: 240,
              position: 'absolute',
              justifyContent: 'flex-end',
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              // alignItems:'baseline',
              //backgroundColor:'white',

              // marginTop:height*0.06,
             // marginLeft: width * 0.08,
              // borderWidth:1
            }}>
              <View style={{backgroundColor:'#FFFFFF',}}>
            <IconEnty name={'image-inverted'} size={50} color={'#E34234'} />
            </View>
          </View> */}
        </TouchableOpacity>

        <View
          style={{
            // paddingHorizontal: 20,
            backgroundColor: 'white',
            //paddingVertical: 10,
            marginVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
              paddingHorizontal: 20,
              flex: 1,
              width: '100%'
            }}>
            <View style={{ flex: 1 }} >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                  //letterSpacing:0.5
                }}>
                {PropertiesArray?.name}
              </Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, width: '90%', alignItems: 'center' }}>

                <Icon name="location-sharp" size={20} color="#043862" />
                <Text
                  style={{
                    fontSize: 13,
                    // fontWeight: 700,
                    color: '#1E2135',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {PropertiesArray?.Location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (IsLike.includes(`${PropertiesArray?._id}`)) {
                  handleDisLike(PropertiesArray?._id);
                } else {
                  handleLike(PropertiesArray);
                }
              }}>
              {IsLike.includes(`${PropertiesArray?._id}`) ? (
                <IconM name={'cards-heart'} size={40} color={'#FF3659'} />
              ) : (
                <IconM
                  name={'cards-heart-outline'}
                  size={36}
                  color={'#FF3659'}
                />
              )}
            </TouchableOpacity>
          </View>

          {Newupdate[0]?.Status && (
            <View style={{ backgroundColor: '#dafdd5' }}>
              <View
                style={{
                  // borderColor: 'red',
                  backgroundColor: '#dde8ff',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '15%',
                  paddingVertical: 10,
                  borderBottomRightRadius: 40,
                }}>
                <Text
                  style={{
                    //color: 'black',
                    color: '#1E2135',
                    fontSize: 12,
                    fontFamily: 'Futura Heavy font',
                    //fontFamily: 'Montserrat-Bold',
                  }}>
                  New
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginHorizontal: 20,
                  marginTop: -15,
                  alignItems: 'center',
                }}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'WorkSans-SemiBold',
                      color: '#000000',
                    }}>
                    {'          '}
                    {Newupdate[0]?.eventName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Poppins-Regular',
                      // fontFamily: 'Montserrat-Medium',
                      // fontWeight: 700,
                      letterSpacing: 0.3,
                      color: '#1E2135',
                      // textAlign: 'center',
                      // paddingBottom: 5,
                    }}>
                    {' '}
                    {Newupdate[0]?.Description}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={Event}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    const filtered = globalState?.ProDetails.filter(user =>
                      user?.name.includes(Newupdate[0]?.eventName),
                    );
                    navigation.push('Property', {
                      details: filtered[0],
                      status: true,
                    });
                  }}>
                  <Image
                    style={{ width: 80, height: 80, borderRadius: 10 }}
                    resizeMode="cover"
                    source={{ uri: Newupdate[0]?.Image }}
                  />
                  <IconM
                    name="chevron-right-circle"
                    size={30}
                    color="#2F5233"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', padding: 5 }}>
                {/* <IconM name="dots-horizontal" size={30} color="black" /> */}
              </View>
            </View>
          )}

          {/* <ScrollView horizontal={true}> */}
          {/* <View
            style={{
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              marginTop: 10,
              paddingVertical: 10,
            }}>
            <View style={{flexDirection: 'row', marginRight: 20, flex: 1}}> */}
          {/* <View style={{alignItems: 'center', marginRight: 60}}>
                <Image
                  style={{width: 60, height: 60}}
                  resizeMode="cover"
                  source={require('./assets/Vector.jpg')}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#1E2135',
                    // top: -5,
                    // paddingBottom: 5,
                  }}>
                  4 Rooms
                </Text>
              </View>
              <View style={{alignItems: 'center', marginRight: 60}}>
                <Image
                  style={{width: 60, height: 60}}
                  resizeMode="cover"
                  source={require('./assets/Group10.jpg')}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#1E2135',
                    // top: -5,
                    // paddingBottom: 5,
                  }}>
                  4 Bathrooms
                </Text>
              </View> */}
          {/* <View style={{alignItems: 'center'}}>
            <Image
              style={{width: 60, height: 60}}
              resizeMode="cover"
              source={require('./assets/Group12.jpg')}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#1E2135',
               // top: -5,
                // paddingBottom: 5,
              }}>
               {PropertiesArray[0]?.area}
            </Text>
           
          </View> */}

          {/* <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginHorizontal: 90,
                justifyContent: 'space-between',
              }}>
              <View style={{alignItems: 'center', marginRight: 70}}>
                <Image
                  style={{width: 60, height: 60}}
                  resizeMode="cover"
                  source={require('./assets/Group12.jpg')}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#1E2135',
                    // top: -5,
                    // paddingBottom: 5,
                  }}>
                  {PropertiesArray[0]?.area}
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Image
                  style={{width: 60, height: 60}}
                  resizeMode="cover"
                  source={require('./assets/Group12.jpg')}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#1E2135',
                    // top: -5,
                    // paddingBottom: 5,
                  }}>
                  {PropertiesArray[0]?.area}
                </Text>
              </View>
              <View style={{alignItems: 'center'}}></View>
            </View> */}

          {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //paddingVertical:8,
            //paddingHorizontal: 60,
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              style={{width: 60, height: 60}}
              resizeMode="cover"
              source={require('./assets/Vector.jpg')}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#1E2135',
               // top: -5,
                // paddingBottom: 5,
              }}>
              4 Rooms
            </Text>
          
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              style={{width: 60, height: 60}}
              resizeMode="cover"
              source={require('./assets/Group10.jpg')}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#1E2135',
               // top: -5,
                // paddingBottom: 5,
              }}>
              4 Bathrooms
            </Text>
          
          </View>
        
          <View style={{alignItems: 'center'}}>
            <Image
              style={{width: 60, height: 60}}
              resizeMode="cover"
              source={require('./assets/Group12.jpg')}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#1E2135',
               // top: -5,
                // paddingBottom: 5,
              }}>
               {PropertiesArray[0]?.area}
            </Text>
           
          </View>
        </View> */}
          {/* </ScrollView> */}
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: 'white',
            //marginVertical:10
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'WorkSans-SemiBold',
              color: '#000000',
              // paddingVertical:8
              paddingBottom: 5,
            }}>
            Description
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              color: '#1E2135',
              letterSpacing: 0.3,
              // paddingBottom: 5,
            }}>
            {showFullText
              ? PropertiesArray?.Description
              : PropertiesArray?.Description?.slice(0, 160)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowFullText(!showFullText);
            }}>
            <Text
              style={{
                fontSize: 14,
                // fontWeight: 600,
                fontFamily: 'OpenSans-SemiBold',
                letterSpacing: 0.3,
                // fontFamily: 'Montserrat-SemiBold',
                color: '#043862',
                // paddingBottom: 5,
              }}>
              {showFullText ? 'Read less' : 'Read more...'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 10,
            paddingBottom: 20,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8 }}>
            <Text style={{
              fontSize: 18,
              fontFamily: 'WorkSans-SemiBold',
              color: '#000000',
              // paddingVertical:8
              paddingBottom: 5,
            }}>Property Status</Text>
            <Text style={{
              fontSize: 18, fontFamily: 'OpenSans-SemiBold', letterSpacing: 0.2, color: '#1E2135',
              // paddingVertical:8
              paddingBottom: 5,
            }}>{propertyStatu}%</Text>
          </View>
          <Progress.Bar
            progress={parseInt(propertyStatu) / 100}
            width={width - 40}
            borderColor={'#252b5d'}
            color={'#252b5d'}
            borderWidth={1}
            height={5}
          />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginVertical: 20,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              //flexDirection: 'row',
              // justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                paddingBottom: 15,
              }}>
              Property Details
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              marginHorizontal: 20,
              borderColor: '#DADADA',
              //padding: 10,
              borderRadius: 15,
              marginBottom: 10,
              backgroundColor: 'white',
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#DADADA',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                }}>
                Property Type
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                  textTransform: 'capitalize'
                }}>
                {PropertiesArray?.P_Type} {"  "}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#DADADA',
                paddingVertical: 10,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                }}>
                Area Details
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Total Area
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                {PropertiesArray?.area}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#DADADA',
                paddingVertical: 10,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                }}>
                Price Details
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Property Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                {' '}
                {'\u20B9 '}
                {PropertiesArray?.Price}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                  // flex:3
                }}>
                Frac Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                  //flex:1,
                  textAlign: 'center'
                }}>
                {' '}
                {'\u20B9 '}
                {PropertiesArray?.FC_Price}
              </Text>
            </View>
            {PropertiesArray?.SPV && <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',

                }}>
                SPV Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',

                }}>
                {' '}
                {'\u20B9 '}
                {PropertiesArray?.SPV}
              </Text>
            </View>}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',

                }}>
                Booking Value
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',

                }}>
                {' '}
                {'\u20B9 '}
                {PropertiesArray?.BookingAmt}
              </Text>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#DADADA',
                paddingVertical: 10,
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#1E2135',
                }}>
                Fracs Details
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Total Fracs
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                {PropertiesArray?.TotalFractions}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                Available Fracs
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Medium',
                  color: '#1E2135',
                }}>
                {PropertiesArray?.AvailableFractions}
              </Text>
            </View>

            {PropertiesArray?.name == 'FRACSPACE @ HAVELOCK CITY' && <View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#DADADA',
                  paddingVertical: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#1E2135',
                  }}>
                  Pool Details
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#1E2135',
                  }}>
                  Pool-I
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                  }}>
                  6/15
                </Text>

              </View>
              <View style={{
                borderBottomWidth: 1,
                borderBottomColor: '#DADADA', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 10
              }}>
                <Icon name="ellipse" size={10} color={'#1E2135'} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                    paddingLeft: 10


                  }}>
                  Earn fixed 12% yield.
                </Text>
              </View>


              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#1E2135',
                  }}>
                  Pool-II
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                  }}>
                  20/20
                </Text>

              </View>
              <View style={{
                borderBottomWidth: 1,
                borderBottomColor: '#DADADA', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 10
              }}>
                <Icon name="ellipse" size={10} color={'#1E2135'} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                    paddingLeft: 8


                  }}>
                  Equal distribution of rentals after possession of the Property.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#1E2135',
                  }}>
                  Pool-III
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                  }}>
                  15/15
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 10 }}>
                <Icon name="ellipse" size={10} color={'#1E2135'} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                    paddingLeft: 10
                  }}>
                  Only capital appreciation.
                </Text>
              </View>
            </View>}




            {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                  }}>
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                  }}>
                  {PropertiesArray?.AvailableFractions==0?'Not Available':'Available'}
                </Text>
              </View> */}
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
              }}>
              <Text
                style={{fontSize: 14, fontWeight: 700, color: 'black'}}></Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Enquire', {
                    proName: PropertiesArray?.name,
                    fracPrice: PropertiesArray?.FC_Price,
                  });
                }}
                style={{
                  alignItems: 'center',
                  // backgroundColor: '#0B0B45',
                  //backgroundColor: '#043862',
                  borderRadius: 12,
                  borderColor: '#043862',
                  borderWidth: 2,
                  padding: 10,
                }}>
                <Text style={{color: '#043862', fontSize: 16, fontWeight: 600}}>
                  Enquiry now
                </Text>
              </TouchableOpacity>
              <Text
                style={{fontSize: 14, fontWeight: 700, color: 'black'}}></Text>
            </View> */}
          </View>
        </View>

        <View style={{ backgroundColor: '#FFFFFF' }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',

              }}>
              Benefits
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            {PropertiesArray?.Benefits.map((item, index) => (
              <View key={index} style={{ alignItems: 'center', flex: 1, padding: 5 }}>
                <Image
                  style={{ width: 90, height: 90 }}
                  resizeMode="cover"
                  source={{ uri: item?.image }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'OpenSans-Medium',
                    color: '#1E2135',
                    textAlign: 'center',
                    top: -10,
                    // paddingBottom: 5,
                  }}>
                  {item?.name}
                </Text>
              </View>))}


          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            GgoToYosemite(PropertiesArray?.Location);
            //navigation.navigate('Contact');
          }}
          style={{
            backgroundColor: 'white',
            marginVertical: 10,
            paddingBottom: 10,
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                // paddingBottom: 5,
              }}>
              Property Location
            </Text>
          </View>
          <Image
            style={{ width: '100%', height: 300 }}
            source={{ uri: PropertiesArray?.LocationImage }}
          />
        </TouchableOpacity>

        <View style={{ backgroundColor: 'white', marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setStatus(!Status);
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                paddingBottom: Status ? 0 : 20,
              }}>
              Distinctive Amenities
            </Text>
            {Status ? (
              <Iconcall name="chevron-down" size={30} color="#1E2135" />
            ) : (
              <Iconcall name="chevron-right" size={30} color="#1E2135" />
            )}
          </TouchableOpacity>

          {Status && (
            <View
              style={{
                borderWidth: 1,
                marginHorizontal: 10,
                backgroundColor: '#E8ECF3',
                borderColor: '#DADADA',
                //padding: 10,
                borderRadius: 10,
                marginVertical: 10,
                //backgroundColor: 'white',
                padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <FlatList
                  data={PropertiesArray?.DistinctiveAmenities}
                  numColumns={3}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            </View>
          )}
        </View>

        <View style={{ backgroundColor: 'white', marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setStatus1(!Status1);
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
                //letterSpacing: 0.8,
                paddingBottom: Status ? 0 : 20,
              }}>
              Location Highlights
            </Text>
            {Status1 ? (
              <Iconcall name="chevron-down" size={30} color="#1E2135" />
            ) : (
              <Iconcall name="chevron-right" size={30} color="#1E2135" />
            )}
          </TouchableOpacity>

          {Status1 && (
            <View
              style={{
                //borderWidth: 1,
                marginHorizontal: 10,
                //backgroundColor: '#E8ECF3',
                //borderColor: '#DADADA',
                //padding: 10,
                borderRadius: 10,
                marginVertical: 10,
                //backgroundColor: 'white',
                //padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <FlatList
                  data={PropertiesArray?.locationHighlights}
                  numColumns={1}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItemSec}
                />
              </View>
            </View>
          )}
        </View>




        <View style={{ backgroundColor: '#FFFFFF' }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'WorkSans-SemiBold',
                color: '#000000',
             
              }}>
              Testimonials
            </Text>
            {/* <TouchableOpacity

              onPress={() => {

              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#021265',
                  textDecorationLine: 'underline'
                  // paddingBottom: 5,
                }}>
                + Record testimonial
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ScrollView horizontal={true}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('VideoTour', { vlink: PropertiesArray?.testimonial[1], location: 'Testimonials' });
                }}
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{ width: 150, height: 130, borderRadius: 10 }}
                  source={require('./assets/Video1.jpeg')}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 130
                  }}>
                  <Icon name={'caret-forward'} size={30} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {

                  navigation.navigate('VideoTour', { vlink: PropertiesArray?.testimonial[0], location: 'Testimonials' });

                }}
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{ width: 150, height: 130, borderRadius: 10 }}
                  source={require('./assets/Video2.jpeg')}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 130
                  }}>
                  <Icon name={'caret-forward'} size={30} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                 
                  navigation.navigate('VideoTour', { vlink: PropertiesArray?.testimonial[2], location: 'Testimonials' });

                }}
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{ width: 150, height: 130, borderRadius: 10 }}
                  source={require('./assets/Video3.jpeg')}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 130
                  }}>
                  <Icon name={'caret-forward'} size={30} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>



        {PropertiesArray?.propertyReviewVideos.length != 0 &&
          <View style={{ backgroundColor: 'white' }}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'WorkSans-SemiBold',
                  color: '#000000',
                 
                }}>
                Customers Reviews
              </Text>
              {/* <TouchableOpacity

                onPress={() => {
                  navigation.navigate('CustomersReview', { PropertyName: PropertiesArray?.name })

                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'WorkSans-SemiBold',
                    color: '#021265',
                    textDecorationLine: 'underline'
                    // paddingBottom: 5,
                  }}>
                  + Add Review
                </Text>
              </TouchableOpacity> */}

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ScrollView horizontal={true}>
                {PropertiesArray?.propertyReviewVideos.map((item, index) => (<TouchableOpacity
                  key={index}
                  onPress={() => {
                   
                    navigation.navigate('VideoDispay', { vlink: item });
                  }}
                  style={{
                    backgroundColor: 'white',
                    margin: 10,
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{ width: 150, height: 180, borderRadius: 15 }}
                    source={{ uri: PropertiesArray?.userReviewImages[index] }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: 180
                    }}>
                    <Icon name={'caret-forward'} size={40} color={'#AEAEAE'} />
                  </View>
                </TouchableOpacity>))}
                {/* <TouchableOpacity
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  navigation.navigate('VideoDispay',{vlink:PropertiesArray?.propertyReviewVideos[2]});
                }}
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 150, height: 220}}
                  source={{uri:PropertiesArray?.userReviewImages[1]}}
                />
                 <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center', 
                    width:'100%' ,
                    height: 180       
                  }}>
                  <Icon name={'caret-forward'} size={40} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  //navigation.navigate('Contact');
                  navigation.navigate('VideoDispay',{vlink:PropertiesArray?.propertyReviewVideos[0]});
                }}
                style={{
                  backgroundColor: 'white',
                  margin: 10,
                  paddingBottom: 10,
                }}>
                <Image
                  style={{width: 150, height: 220}}
                  source={{uri:PropertiesArray?.userReviewImages[2]}}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center', 
                    width:'100%' ,
                    height: 180       
                  }}>
                  <Icon name={'caret-forward'} size={40} color={'#AEAEAE'} />
                </View>
              </TouchableOpacity> */}
              </ScrollView>
            </View>
          </View>}





      </ScrollView>
      <View
        style={{
          width: '100%',
          backgroundColor: '#f5f7fe',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          height:80,
        //  marginBottom:80
          // opacity:0.4
        }}>
        <TouchableOpacity
          disabled={PropertiesArray?.AvailableFractions == 0 ? true : false}
          style={{
            backgroundColor: PropertiesArray?.AvailableFractions == 0 ? '#AEAEAE' : '#56018A',
            flex: 1,
            borderRadius: 10,
            alignItems: 'center',
            padding: 20,
            marginRight: 10,
          }}
          onPress={() => {
            // if (globalState?.userDetails?.verification) {
            //   navigation.navigate('Book', { property: PropertiesArray });

            // } else {
            //   navigation.navigate('BookNow', { property: PropertiesArray });
            // }
            navigation.navigate('Book', { property: PropertiesArray });

          }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              fontSize: 15,
              fontFamily: "Montserrat-Bold",
              color: '#FFFFFF',
            }}>
            {PropertiesArray?.AvailableFractions == 0 ? 'Not Available' : 'Book Now'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#021265',
            flex: 1,
            borderRadius: 10,
            alignItems: 'center',
            padding: 20,
          }}
          onPress={() => {

            navigation.navigate('Enquirenew', { property: PropertiesArray });
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'OpenSans-Bold',
              color: '#FFFFFF',
            }}>
            Enquire Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  maskGroupIconLayout: {
    width: width * 0.2,
    height: height * 0.12,
  },
  maskGroupIconLayout1: {
    width: width * 0.2,
    height: height * 0.12,
  },


  iconLayout1: {
    height: 16,
    width: 16,
    overflow: 'hidden',
    left: -8,
  },
  image: {
    width,
    flex: 1,
  },
  wrapper: {},
  container: {
    flex: 1,
  },
});
