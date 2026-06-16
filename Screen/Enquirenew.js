import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { useContext, useState } from 'react';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconLocation from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppContext } from './Context/AppContext';
import { SiteVisit } from './Services/UserApi';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function Enquirenew(props) {
  const { globalState, setGlobalState } = useContext(AppContext);
  const navigation = useNavigation();
  const [PropertiesArray, setPropertiesArray] = useState(
    props?.route?.params?.property || []
  );
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleCallNow = () => {
    // Replace '1234567890' with the phone number you want to call
    const phoneNumber = '+919880626111';
    const phoneUrl = `tel:${phoneNumber}`;

    // Use the Linking API to initiate the phone call
    Linking.openURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Phone number is not supported');
        }
      })
      .catch(error => console.log('Error making phone call:', error));
  };
  const handleMail = () => {
    const mailto = 'mailto:support@fracspace.com';
    Linking.openURL(mailto)
      .catch((err) => console.error('An error occurred', err));
  };
  const handleSiteVist = async date => {

    let payload = JSON.stringify({
      email: globalState?.userEmail,
      userName: globalState?.userName,
      propertyId: PropertiesArray?._id,
      propertyName: PropertiesArray?.name,
      price: PropertiesArray?.Price,
      FC_Price: PropertiesArray?.FC_Price,
      phoneNumber: globalState?.userDetails?.phoneNumber,
      date: date,
      time: date,
    });
    //console.log(payload);
    try {
      let { data: res } = await SiteVisit(payload);

      if (res?.success) {
        Alert.alert(
          'Successful Schedule Site Visit',
          `Your Site Visit Schedule is ${date}`,
        );
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

  const hideDatePicker = () => {
    setOpen(false);
  };

  const handleConfirm = date => {
    //console.log(date);

    handleSiteVist(new Date(date).toLocaleString());
    hideDatePicker();
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
        backgroundColor: '#FAFAFF',
        borderBottomColor: '#DDE1E5'
      }}>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
            // navigation.navigate('Property',{details:PropertiesArray});
            navigation.goBack();

          }}>
          <IconLocation name="chevron-back-outline" size={25} color={'#000'} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontFamily: 'WorkSans-SemiBold',
          color: '#000000',
        }}>
          Enquire
        </Text>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={() => {
            navigation.popToTop();
            // navigation.navigate('HomePage');

          }}>
          <Text style={{
            fontSize: 15,
            fontFamily: 'WorkSans-SemiBold',
            color: '#0424CB',
            textAlign: 'right'
          }}>EXIT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ backgroundColor: '#FAFAFF', padding: 15 }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#f5f7fe',
            //padding: 0,
          }}>
          <Image
            style={{ width: '100%', height: 200, borderRadius: 5 }}
            source={{ uri: PropertiesArray?.image?.Image1 }}
          />
          <Text style={{ color: '#081F62', fontFamily: 'Montserrat-Bold', fontSize: 14, paddingVertical: 8 }}>{PropertiesArray?.name}</Text>

          <Text style={{ color: '#000000', fontFamily: 'Montserrat-Bold', fontSize: 14, paddingVertical: 8 }}>Why choose fracspace?</Text>
          <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
            <ScrollView horizontal={true}>
              <View
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.01,
                  shadowRadius: 1,
                  backgroundColor: '#ffffff',
                  elevation: 1,
                  marginRight: 20,
                  borderRadius: 15,
                  borderColor: '#DCDCDC',
                  borderWidth: 1,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V10.png' }}
                  //source={require('./assets/Ima1.png')}
                  resizeMode={'contain'}
                />
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Risk
                </Text>
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Mitigation
                </Text>
              </View>
              <View
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.01,
                  shadowRadius: 1,
                  backgroundColor: '#ffffff',
                  elevation: 1,
                  marginRight: 20,
                  borderRadius: 15,
                  borderColor: '#DCDCDC',
                  borderWidth: 1,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V11.png' }}
                // source={require('./assets/Ima2.png')}
                />
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Transparent
                </Text>
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  and Secure
                </Text>
              </View>
              <View
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.01,
                  shadowRadius: 1,
                  backgroundColor: '#ffffff',
                  elevation: 1,
                  marginRight: 20,
                  borderRadius: 15,
                  borderColor: '#DCDCDC',
                  borderWidth: 1,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V13.png' }}
                //  source={require('./assets/Ima4.png')}
                />
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Global reach,
                </Text>
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Local expertise
                </Text>
              </View>
              <View
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.01,
                  shadowRadius: 1,
                  backgroundColor: '#ffffff',
                  elevation: 1,
                  marginRight: 20,
                  borderRadius: 15,
                  borderColor: '#DCDCDC',
                  borderWidth: 1,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V12.png' }}
                //  source={require('./assets/Ima3.png')}
                />
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Built for
                </Text>
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  everyone
                </Text>
              </View>

              <View
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.01,
                  shadowRadius: 1,
                  backgroundColor: '#ffffff',
                  elevation: 1,
                  marginRight: 20,
                  borderRadius: 15,
                  borderColor: '#DCDCDC',
                  borderWidth: 1,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: 'https://duixj37yn5405.cloudfront.net/offers/app-Image-Icon/V14.png' }}
                //source={require('./assets/Ima5.png')}
                />
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>
                  Easy exit
                </Text>
                <Text
                  style={{
                    lineHeight: 20,
                    color: '#021265',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 14,
                  }}>

                </Text>
              </View>
            </ScrollView>
          </View>

          <Text style={{ color: '#000000', fontFamily: 'Montserrat-Bold', fontSize: 14, paddingVertical: 8 }}>Contact us</Text>
          <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                handleCallNow();
              }}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#021265',
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderColor: '#2276E9',
                borderWidth: 1,
                borderRadius: 8,
                // borderBottomLeftRadius:30,
                // borderTopLeftRadius:30,
                marginTop: 20,
                width: '100%',

              }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="phone" size={20} color="#ffff" />
                <Text style={{ fontSize: 16, fontFamily: "WorkSans-Medium", color: '#ffff', paddingLeft: 10 }}>
                  Call Now
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontFamily: "WorkSans-Medium", color: '#ffff', }}>
                +919880626111
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleMail();
                // setOpen(true);
                //console.log('submit');
              }}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: '#043862',
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderColor: '#357EE1',
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 20,
                width: '100%',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="mail"
                  size={22}
                  color="#021265"
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'WorkSans-Medium',
                    color: '#222F78',
                    paddingLeft: 10,
                  }}>
                  Mail Us
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'WorkSans-Medium',
                    color: '#222F78',
                  }}>
                  support@fracspace.com
                </Text>
              </View>
              {/* <IconLocation
                  name="chevron-down-outline"
                  size={22}
                  color="#000000"
                /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpen(true);

              }}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: '#',
                padding: 10,
                borderColor: '#357EE1',
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 20,
                width: '100%',
                marginBottom: 60
              }}>
              <View style={{ flexDirection: 'row' }}>
                <IconM name={'calendar-clock-outline'} size={22} color={"#021265"} />
                <Text style={{ fontSize: 16, fontFamily: "WorkSans-Medium", color: '#222F78', paddingLeft: 10, }}>
                  Schedule Site Visit
                </Text>
              </View>
              <IconLocation name="chevron-down-outline" size={25} color={'#021265'} />
            </TouchableOpacity>
          </View>


          <DateTimePickerModal
            isVisible={open}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
