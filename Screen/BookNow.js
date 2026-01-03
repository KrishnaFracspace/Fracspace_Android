import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useContext, useState } from 'react';
const { width, height } = Dimensions.get('window');
import Octicons from 'react-native-vector-icons/Octicons';
import Font from 'react-native-vector-icons/Fontisto';
import Upload from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import PinIcon from 'react-native-vector-icons/SimpleLineIcons';
import PinIconse from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from './Context/AppContext';
import DocumentPicker from 'react-native-document-picker';
import { ProfileVerification } from './Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BookNow(props) {
  const { globalState, setGlobalState } = useContext(AppContext);
  const navigation = useNavigation();
  const [Address, setAddreess] = useState('');
  const [Email, setEmail] = useState(globalState?.userDetails?.email);
  const [Phone, setPhone] = useState(globalState?.userDetails?.phoneNumber);
  //const [Phone, setPhone] = useState('+12519013219');
  const [Account, setAccount] = useState('');
  const [Bank, setBank] = useState('');
  const [Pin, setPin] = useState('');
  const [Name, setName] = useState(globalState?.userDetails?.userName);
  const [PickedAadhar, setPickedAadhar] = useState(null);
  // const [PickedGov, setPickedGov] = useState(null);
  const [PickedPan, setPickedPan] = useState(null);
  const [PickedCheque, setPickedCheque] = useState(null);
  const [Property, setProperty] = useState(props?.route?.params?.property || []);
  const [loader, setLoader] = useState(false);
  const PickAadhar = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can specify the types of documents you want to pick
      });
      setPickedAadhar(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User cancelled the picker');
      } else {
        Alert.alert('Error picking document');
      }
    }
  };
  const PickGoverment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can specify the types of documents you want to pick
      });
      setPickedGov(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User cancelled the picker');
      } else {
        Alert.alert('Error picking document');
      }
    }
  };
  const PickPan = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can specify the types of documents you want to pick
      });
      setPickedPan(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('User cancelled the picker');
      } else {
        Alert.alert('Error picking document');
      }
    }
  };
  const PickCheque = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can specify the types of documents you want to pick
      });
      setPickedCheque(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Error picking document');

      } else {
        Alert.alert('Error picking document');
      }
    }
  };
  const handleProfileVerify = async () => {
    var form = new FormData();
    form.append('email', Email);
    form.append('postalAddress', Address);
    form.append('pincode', Pin);
    form.append('phoneNumber', Phone);
    form.append('bankdetails', Bank);
    form.append('AccountNumber', Account);
    form.append('aadhar', {
      uri: PickedAadhar[0].uri,
      type: PickedAadhar[0].type,
      name: PickedAadhar[0].name,
      size: PickedAadhar[0].size,
    });

    form.append('chequebook', PickedCheque != null ? {
      uri: PickedCheque[0]?.uri,
      type: PickedCheque[0]?.type,
      name: PickedCheque[0]?.name,
      size: PickedCheque[0]?.size,
    } : null);
    form.append('pan', PickedPan != null ? {
      uri: PickedPan[0]?.uri,
      type: PickedPan[0]?.type,
      name: PickedPan[0]?.name,
      size: PickedPan[0]?.size,
    } : null);

    let payload = form;

    try {
      let { data: res } = await ProfileVerification(payload);

      if (res?.success) {
        if (props?.route?.params?.screen == 'Profile') {
          Alert.alert(
            'Thanks for your submission!', "Our team is currently reviewing your Document status. Please allow us upto 24 hours to confirm your profile verification.",
          );
          setLoader(false);
          navigation.navigate('Profile');
        } else {
          setLoader(false);
          navigation.navigate('Book', { property: Property });
        }
        //  console.log(globalState?.userDetails?.profilePicture);
      }
    } catch (error) {
      if (error?.response) {
        // console.log(error?.response?.data?.message);
        Alert.alert('Response Error', "Please upload supported file formats.");
        setLoader(false);
      } else if (error?.request) {
        // console.log(error?.request);
        Alert.alert('Request error:', 'Please Check Your Internet Connection');
        setLoader(false);
      } else {

        Alert.alert('Error:', `${error?.message}`);
        setLoader(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{ backgroundColor: 'white', padding: 20, width: '100%', flex: 1 }}>
          {props?.route?.params?.screen == 'Profile' ? (
            <Text style={{ color: '#252B5C', fontSize: 28, fontWeight: 700 }}>
              Hurry ! Verify Your Account
            </Text>
          ) : (
            <Text style={{ color: '#252B5C', fontSize: 28, fontWeight: 700 }}>
              Hurry ! Book your property now
            </Text>
          )}

          <View style={{ marginTop: 20 }}>
            <View style={styles.input}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  paddingLeft: 10,
                }}>
                <Octicons name="person" size={22} color="black" />
                <TextInput
                  style={{ width: '100%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  value={Name}
                  onChangeText={txt => {
                    setName(txt);
                  }}
                />
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                  },
                ]}>
                Your Name
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.input}>
              <View
                style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <Font name="email" size={22} color="black" />
                  <TextInput
                    editable={false}
                    style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                    placeholder=""
                    placeholderTextColor={'#000'}
                    value={Email}
                    onChangeText={txt => {
                      setEmail(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                  },
                ]}>
                Email
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={styles.input}>
              <View
                style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <Icon name="call-outline" size={22} color="black" />
                  <TextInput
                    editable={false}
                    style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                    placeholder=""
                    value={Phone}
                    placeholderTextColor={'#000'}
                    onChangeText={txt => {
                      setPhone(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,

                  },
                ]}>
                Phone Number
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={styles.input}>
              <View
                style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%',
                    paddingLeft: 10,
                  }}>
                  <PinIcon name="location-pin" size={22} color="black" />
                  <TextInput
                    style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                    placeholder=""
                    value={Pin}
                    placeholderTextColor={'#000'}
                    onChangeText={txt => {
                      setPin(txt);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                    // color: 'Red' ,
                  },
                ]}>
                Pincode
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.input}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  paddingLeft: 10,
                }}>
                <PinIcon name="location-pin" size={22} color="black" />
                <TextInput
                  style={{ width: '100%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  value={Address}
                  onChangeText={txt => {
                    setAddreess(txt);
                  }}
                />
              </View>
            </View>
            <View
              style={[
                styles.labelContainer,
                {
                  top: -(height * 0.01),
                },
              ]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 16,
                  },
                ]}>
                Address
              </Text>
            </View>
          </View>

          {Phone.startsWith('+91') && Phone.length == 13 ?
            <>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: 16,
                      // color: 'Red' ,
                    },
                  ]}>
                  Upload Aadhar Card
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    PickAadhar();
                    // console.log('submit');
                  }}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#f5f7fe',
                    padding: 8,
                    borderColor: '#043862',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 10,
                  }}>
                  {/* {PickedAadhar!=null?
            <Image source={{uri:PickedAadhar[0]?.uri}} style={{width:'100%',height:80,flex:1}}/>
            
            :<> */}
                  <Upload name="cloud-upload" size={28} color="#043862" />
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                    Upload Aadhar front & back side image
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: '#A0A0A0' }}>
                    Supports pdf only
                  </Text>

                  {/* </>} */}
                </TouchableOpacity>
                {PickedAadhar != null && (
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#008000' }}>
                    {' '}
                    Aadhar Uploaded
                  </Text>
                )}
              </View>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: 16,
                      // color: 'Red' ,
                    },
                  ]}>
                  Upload PAN Card
                </Text>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#f5f7fe',
                    padding: 10,
                    borderColor: '#043862',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    PickPan();
                  }}>
                  <Upload name="cloud-upload" size={28} color="#043862" />
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                    Upload pan card image here
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: '#A0A0A0' }}>
                    Supports JPG,JPEG,PNG & GIF
                  </Text>
                </TouchableOpacity>
                {PickedPan != null && (
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#008000' }}>
                    {' '}
                    Pan Card Uploaded
                  </Text>
                )}
              </View>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: 16,
                      // color: 'Red' ,
                    },
                  ]}>
                  Upload Cancelled Cheque
                </Text>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#f5f7fe',
                    padding: 10,
                    borderColor: '#043862',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    PickCheque();

                  }}>
                  <Upload name="cloud-upload" size={28} color="#043862" />
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                    Upload cancelled cheque image here
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: '#A0A0A0' }}>
                    Supports JPG,JPEG,PNG & GIF
                  </Text>
                </TouchableOpacity>
                {PickedCheque != null && (
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#008000' }}>
                    {' '}
                    Cancelled Cheque Uploaded
                  </Text>
                )}
              </View>
            </> :
            <>
              <View style={{ marginTop: 20 }}>
                <View style={styles.input}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      paddingLeft: 10,
                    }}>
                    <PinIconse name="account-balance" size={22} color="black" />
                    <TextInput
                      style={{ width: '100%', paddingLeft: 10, color: 'black' }}
                      placeholder=""
                      value={Account}
                      onChangeText={txt => {
                        setAccount(txt);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.labelContainer,
                    {
                      top: -(height * 0.01),
                    },
                  ]}>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: 16,
                      },
                    ]}>
                    Account Number
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 20 }}>
                <View style={styles.input}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      paddingLeft: 10,
                    }}>
                    <PinIconse name="account-balance" size={22} color="black" />
                    <TextInput
                      style={{ width: '100%', paddingLeft: 10, color: 'black' }}
                      placeholder=""
                      value={Bank}
                      onChangeText={txt => {
                        setBank(txt);
                      }}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.labelContainer,
                    {
                      top: -(height * 0.01),
                    },
                  ]}>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: 16,
                      },
                    ]}>
                    Bank Name & Branch
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: 16,
                      // color: 'Red' ,
                    },
                  ]}>
                  Upload Government Issued Photo ID
                </Text>
                <TouchableOpacity
                  onPress={() => {

                    PickAadhar();

                  }}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#f5f7fe',
                    padding: 8,
                    borderColor: '#043862',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 10,
                  }}>
                  {/* {PickedAadhar!=null?
             <Image source={{uri:PickedAadhar[0]?.uri}} style={{width:'100%',height:80,flex:1}}/>
             
             :<> */}
                  <Upload name="cloud-upload" size={28} color="#043862" />
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
                    Upload Government Issued Photo ID
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: '#A0A0A0' }}>
                    Supports pdf only
                  </Text>

                  {/* </>} */}
                </TouchableOpacity>
                {PickedAadhar != null && (
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#008000' }}>
                    {' '}
                    Government Issued Photo ID Uploaded
                  </Text>
                )}
              </View>
            </>

          }
          <TouchableOpacity
            onPress={() => {
              setLoader(true);
              handleProfileVerify();
            }}
            style={{
              alignItems: 'center',
              backgroundColor: '#043862',
              padding: 20,
              borderColor: '#043862',
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 30,
            }}>
            {loader == true ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={{ fontSize: 16, fontFamily: 'OpenSans-Bold', color: 'white' }}>
              Submit
            </Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
    //flex: 1,
    // overflow: 'hidden',
    //width: '100%',
  },
  labelContainer: {
    position: 'absolute',
    left: width * 0.04,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    // width: 110,
    // height: 110,
    width: width * 0.3,
    height: height * 0.16,
  },
});
