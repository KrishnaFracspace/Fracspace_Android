import {View, Text, Image, StyleSheet,PermissionsAndroid,TouchableOpacity, Platform, Alert} from 'react-native';
import React, { useState } from 'react';
// import { PdfView } from 'react-native-pdf-light';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Ionicons';
import IconDown from 'react-native-vector-icons/MaterialIcons';
//import RNFetchBlob from 'rn-fetch-blob';
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
  // const handledownloadFile = () => {
  //   const {config, fs} = RNFetchBlob;
  //   const date = new Date();
  //   const fileDir = fs.dirs.DownloadDir;

  //   config({
  //     // add this option that makes response data to be stored as a file,
  //     // this is much more performant.
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true, // <-- this is the only thing required
  //       // Optional, override notification setting (default to true)
  //       notification: true,
  //       // Optional, but recommended since android DownloadManager will fail when
  //       // the url does not contains a file extension, by default the mime type will be text/plain
  //       path:
  //         fileDir +
  //         '/' +
  //         Math.floor(date.getDate() + date.getSeconds() / 2) +
  //         '.pdf',
  //       description: 'File downloaded by download manager.',
  //     },
  //   })
  //     .fetch(
  //       'GET',
  //       pdfLink,
  //       {
  //         //some headers ..
  //       },
  //     )
  //     .then(res => {
  //       // the temp file path
  //      // console.log('The file saved to ', res.path());
  //     });
  // };

//   const actualDownload = () => {
//     const { dirs } = RNFetchBlob.fs;
//     const dirToSave =
//       Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
//     const configfb = {
//       fileCache: true,
//       addAndroidDownloads: {
//         useDownloadManager: true,
//         notification: true,
//         mediaScannable: true,
//         title: `FOA.pdf`,
//         path: `${dirs.DownloadDir}/Invoice.pdf`,
//       },
//       useDownloadManager: true,
//       notification: true,
//       mediaScannable: true,
//       title: 'FOA.pdf',
//       path: `${dirToSave}/FOA.pdf`,
//     };
//     const configOptions = Platform.select({
//       ios: configfb,
//       android: configfb,
//     });
 
//     RNFetchBlob.config(configOptions || {})
//       .fetch('GET', invoiceUrl, {})
//       .then(res => {
 
//         if (Platform.OS === 'ios') {
//           RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
//           RNFetchBlob.ios.previewDocument(configfb.path);
//         }
//         if (Platform.OS === 'android') {
//           console.log("file downloaded")      
//  }
//       })
//       .catch(e => {
//         console.log('invoice Download==>', e);
//             });
//   };


  // const getPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     actualDownload();
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         actualDownload();
  //       } else {
  //         console.log("please grant permission");
  //       }
  //     } catch (err) {
  //       console.log("display error",err)    }
  //   }
  // };







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
          backgroundColor: '#1E2135',
        }}>
          <TouchableOpacity
          onPress={() => {
         
          //   if(props?.route?.params?.screen=="Doc"){
          //     navigation.navigate('Profile');

          //   }
          //   else if (props?.route?.params?.screen=="Rev"){
          //     navigation.navigate('Review');

          //   }else{
          //   navigation.navigate('Dashboard');
          // }
          navigation.goBack();
          }}>
        <Icon name="arrow-back-outline" size={30} color="#ffff" />
        </TouchableOpacity>
        {/* {props?.route?.params?.screen=="Doc" ||props?.route?.params?.screen=="Rev"  ?<></>:<TouchableOpacity
          onPress={() => {
            //getPermission();
            //requestStoragePermission();
            //console.log('hello');
        
          }}>
          <IconDown name={'download'} size={25} color={'#ffff'} />
        </TouchableOpacity>} */}
        {/* <Icon name={'cross'} size={30} color={'#ffff'} /> */}
      </View>
      <Pdf
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
      />
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
