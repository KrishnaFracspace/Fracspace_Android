import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';
import CameraIcon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../CustomModal';
import Video, {VideoRef} from 'react-native-video';
import {ReviewData} from '../Services/UserApi';
import {AppContext} from '../Context/AppContext';
import {useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CustomersReview(props) {
  const navigation = useNavigation();
  const {globalState, setGlobalState} = useContext(AppContext);
  const [Review, setReview] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Star, setStar] = useState(0);
  const [PropertyName, setPropertyName] = useState(
    props?.route?.params?.PropertyName,
  );
  const [ReviewDataImage, setReviewDataImage] = useState(null);
  const [ReviewDisplay, setReviewDisplay] = useState(undefined);
  const launchGallery = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'mixed',
      selectionLimit: 1,
      quality: 0.2,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      console.log(response?.assets);
      if (response.didCancel != true) {
   
        setModalVisible(false);
        setReviewDataImage(response?.assets);
        setReviewDisplay(response?.assets[0]?.uri);

        // navigation.push(Screens.Post, {images:response.assets})
        //  return response.assets;
      } else {
      }
    });
  };
  const launchCamera = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'mixed',
      selectionLimit: 1,
      quality: 0.2,
    };
    ImagePicker.launchCamera(options, async response => {
      console.log('check response ', response);
      if (response.didCancel != true) {
     

        setModalVisible(false);
        setReviewDataImage(response.assets);
        setReviewDisplay(response?.assets[0]?.uri);
        // navigation.push(Screens.Post, {images:response.assets})
        //return response.assets;
      } else {
        Alert.alert('Error', 'Image not selected');
      }
    });
  };

  const handleReview = async ProfileData => {
    var form = new FormData();
    form.append('email', globalState?.userDetails?.email);
    // form.append("profile", Profile[0].uri,'profile.jpg');
    form.append('video', {
      uri: ProfileData[0].uri,
      type: ProfileData[0].type,
      name: ProfileData[0].fileName,
    });
    form.append('tags', 'Co-ownership');
    form.append('description', Review);
    form.append('propertyName', PropertyName);
    form.append('rating', Star);

    let payload = form;
    // console.log('payload',payload);

    try {
      let {data: res} = await ReviewData(payload);
     // console.log(res);

      if (res?.success) {
        Alert.alert(
          'Thank you for submitting!',
          'Your feedback is greatly appreciated, and we are happy to hear your thoughts. ',
        );
        navigation.navigate('HomePage');
        // setProfile(globalState?.userDetails?.profilePicture);
        // setIsLike(res?.pIds);
      }
    } catch (error) {
      if (error?.response) {
        // console.log(error);
        Alert.alert('Response Error', `${error?.response?.data?.message}`);
      } else if (error?.request) {
        //console.log(error);
        // Alert.alert('Request errordddddd:', 'Please Check Your Internet Connection');
      } else {
        // console.log(error);
        Alert.alert('Error:',`${error?.message}`);
      }
    }
  };
  useEffect(() => {
    if(props?.route?.params?.camera=='open'){
    launchCamera();
    }
   
  }, []);
  return (
   <SafeAreaView style={{ flex: 1 ,backgroundColor:"#0D2038"}}>
        <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 15,
                      width: '100%',
                      paddingHorizontal: 15,
                      borderBottomWidth:1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 1,
                      borderBottomColor:'#DDE1E5',
                      backgroundColor:'#021265'
                  }}>
                      <TouchableOpacity style={{ flex: 1 }}
                          onPress={() => {
                              navigation.navigate('Property');
    
                          }}>
                          <Icons name="chevron-back-outline" size={25} color={'#FFFFFF'} />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 18,
                              fontFamily: 'WorkSans-SemiBold',
                              color: '#FFFFFF',}}>
                               Review
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
      <ScrollView style={{backgroundColor: '#F4F4FF', width: '100%'}}>
        <View style={{flex:1,width:'100%'}}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            paddingVertical: 20,
            paddingHorizontal: 20,
            marginVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-SemiBold',
              color: '#1A1A1A',
              //letterSpacing:0.5
            }}>
            How was your experience with the property? Rate Us!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                setStar(1);
              }}>
              {Star > 0 ? (
                <Icon name="star" size={40} color="#ffdf00" />
              ) : (
                <Icon name="star" size={40} color="#DBDCDE" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStar(2);
              }}>
              {Star > 1 ? (
                <Icon name="star" size={40} color="#ffdf00" />
              ) : (
                <Icon name="star" size={40} color="#DBDCDE" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStar(3);
              }}>
              {Star > 2 ? (
                <Icon name="star" size={40} color="#ffdf00" />
              ) : (
                <Icon name="star" size={40} color="#DBDCDE" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStar(4);
              }}>
              {Star > 3 ? (
                <Icon name="star" size={40} color="#ffdf00" />
              ) : (
                <Icon name="star" size={40} color="#DBDCDE" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStar(5);
              }}>
              {Star > 4 ? (
                <Icon name="star" size={40} color="#ffdf00" />
              ) : (
                <Icon name="star" size={40} color="#DBDCDE" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-SemiBold',
              color: '#1A1A1A',
              marginBottom: 15,
              //letterSpacing:0.5
            }}>
            Tell others about your experience!
          </Text>
         

          <View style={styles.input}>
           
              <TextInput
                style={{
                  width: '100%',
                  //jhgfdghjheight: 60,
                  // paddingLeft: 30,
                  paddingHorizontal: 10,
                  paddingBottom: 70,
                  color: '#1E2135',
                  fontFamily: 'Poppins-Regular',
                }}
                placeholder="Write here ..."
                multiline
                maxLength={40}
               // keyboardType='default'
                placeholderTextColor={'#585858'}
                //value={Review}
                onChangeText={(txt) => {
                  // setPropertyType(tjxt);
                  //handlesetvalue()
                  console.log(txt);
                  setReview(txt)
                }
              }
              
             
                
              />
          
          </View>

          <Text
            style={{
              fontSize: 14,
              fontFamily: 'WorkSans-Medium',
              color: '#1A1A1A',
              paddingTop: 30,
              //letterSpacing:0.5
            }}>
            Upload Images & Video:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {ReviewDisplay != undefined && (
              <>
              {ReviewDataImage[0]?.type  ?<Image
                style={{width: 100, height: 100, borderRadius: 15}}
                resizeMode="cover"
                source={{uri: ReviewDisplay}}
              />:
              <Video
              source={{
                uri: 'https://duixj37yn5405.cloudfront.net/offers/Expo+Final+Video.Mp4+(2).mp4',
              }} // Use a URL or local file path
              style={styles.backgroundVideo}
              repeat={true} // Optional: Repeat the video
              muted={true} // Optional: Mute the video
              resizeMode="cover" // Optional: Choose the right resize mode
            />}
            </>
            )}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Image
                style={{width: 150, height: 150}}
                resizeMode="cover"
                source={{
                  uri: 'https://duixj37yn5405.cloudfront.net/appImages/Group+1261157034.png',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            //flexDirection: 'row',
            justifyContent: 'flex-end',
            
            //borderWidth:1,
            paddingHorizontal: 20,
            paddingVertical:80
            //flex: 1,
            //paddingVertical: 40,
            // opacity:0.4
          }}>
          <TouchableOpacity
            //disabled={!Terms}
            style={{
              backgroundColor: '#0424CB',
              //backgroundColor: '#021265',

              borderRadius: 10,
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderWidth: 1,
              borderColor: '#0424CB',
             // marginBottom:50,
              /// marginRight: 15,
            }}
            onPress={() => {
              handleReview(ReviewDataImage);
              // handleVisitor();
              //navigation.navigate('ExhibitorDetails');
            }}>
            <Text
              style={{
                // fontFamily: 'Roboto',
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
                color: '#FFFFFF',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalStyle={styles.customModal}>
        <View style={[styles.modal]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            <Text></Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'OpenSans-SemiBold',
                color: '#081F62',
                textAlign: 'center',
                paddingTop: 10,
              }}>
              {'  '}Profile Photo
            </Text>
            <Icons name="close" size={25} color="#808080" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View></View>
            <View style={{alignItems: 'center', margin: 20}}>
              <TouchableOpacity
                onPress={() => {
                  launchCamera();
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#081F62',
                  borderWidth: 1,
                  borderRadius: 60,
                  padding: 15,
                }}>
                <CameraIcon name="camera" size={35} color="#081F62" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#081F62',
                }}>
                {'  '}Camera
              </Text>
            </View>
            <View style={{alignItems: 'center', margin: 20}}>
              <TouchableOpacity
                onPress={() => {
                  launchGallery();
                }}
                style={{
                  alignItems: 'center',
                  //flexDirection: 'row',
                  justifyContent: 'center',
                  // backgroundColor: '#043862',
                  // padding: 0,
                  //margin: 20,
                  borderColor: '#081F62',
                  borderWidth: 1,
                  borderRadius: 60,
                  padding: 15,
                }}>
                <CameraIcon name="image-inverted" size={35} color="#081F62" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#081F62',
                }}>
                Gallery
              </Text>
            </View>
            <View></View>
          </View>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    borderColor: '#2955D2',
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    marginVertical: 10,
  },
  modal: {
    // paddingTop: hp(2),
    // height: hp(70),
    width: '100%',
    alignSelf: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: 'white',
    // marginBottom: hp(6),
    //  borderBottomWidth: 0,
    //borderColor:'red',
    // borderWidth:3,
    //paddingHorizontal: 25,
    //paddingVertical:hp(2),
  },
  backgroundVideo: {
    width: '40%',
    height: '70%',
    //borderRadius:10
  },
});