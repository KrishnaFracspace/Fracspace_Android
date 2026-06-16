import {View, Text, Image, StyleSheet,PermissionsAndroid,TouchableOpacity, Platform, Alert} from 'react-native';
import React, { useState } from 'react';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DisplayDoc(props) {
  //console.log(props?.route?.params);
  const [pdfLink,setPdfLink]=useState(props?.route?.params?.Link);
  const navigation = useNavigation();
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
            'Download App needs access to your Storage' +
            'so you can download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       // console.log('You can use the Storage');
        handledownloadFile();
      } else {
       // console.log('Storage permission denied');
      }
    } catch (err) {
      Alert.alert('Error',err);
    }
  };

  if (!pdfLink) {
    return (
      <View>
        <Text>Invalid PDF link</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: 15,
            paddingVertical: 20,
            backgroundColor: '#021265',
          }}>
            <TouchableOpacity onPress={() => {navigation.goBack();}}>
              <Icon name="arrow-back-outline" size={30} color="#ffff" />
            </TouchableOpacity>
        </View>
        {/* <Pdf
          trustAllCerts={false}
          source={{
            uri: pdfLink,
            cache: true,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
          
          }}
          onPageChanged={(page, numberOfPages) => {
          
          }}
          onError={error => {
          
          }}
          onPressLink={uri => {
          
          }}
          style={styles.pdf}
        /> */}
        {Pdf ? (
          <Pdf
            trustAllCerts={false}
            source={{
              uri: pdfLink,
              cache: true,
            }}
            style={styles.pdf}
          />
        ) : (
          <Text>PDF not supported on this device</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ffffff'
  },
  pdfViewstyle: {
    flex: 1,
    width: '100%',
  },
  title: {
    color: '#252b5d',
    fontFamily: "Montserrat-ExtraBold",
    fontSize: 18,
    paddingBottom: 10,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    //alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2E2E2E',
    // opacity: 0.9,
  },
  cardTypo: {
    left: 10,
    color: '#1e2135',
   // fontFamily: 'Inter-Regular',
    textAlign: 'left',
    fontSize: 16,
    fontFamily: "Montserrat-ExtraBold",
    flex: 1,
  },
  reviewChildLayout: {
    height: 50,
    width: 90,
    borderRadius: 5,
    // left: 32,
    //position: 'absolute',
  },
});
