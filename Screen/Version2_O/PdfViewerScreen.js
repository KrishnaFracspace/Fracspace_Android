import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text
} from 'react-native';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

export default function PdfViewerScreen(props) {
  const navigation = useNavigation();

  const url = props?.route?.params?.url;

  const source = {
    uri: 'https://d1nj26fz89n9xw.cloudfront.net/fracspace_properties_images/altaira/Altaira++-+Concept+Proposal+(28th+Nov+2025)_compressed_compressed.pdf',
    cache: true,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={{flexDirection:'row',backgroundColor:'#FFF',padding:20,alignItems:"center",justifyContent:"space-between"}}>
          <View>
            <TouchableOpacity
                   style={styles.backBtn}
                   onPress={() => navigation.goBack()}
                   activeOpacity={0.7}>
                   <Icon1 name="chevron-left" size={20} color="#fff" />
                 </TouchableOpacity>
          </View>

         <View>
            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Project Concept Overview</Text>
        </View>
        <View style={{width:20}}/>
      </View>

      {/* PDF VIEW */}
      {/* <Pdf
        source={source}
        style={styles.pdf}
        onLoadComplete={(pages) => {
          console.log(`Loaded ${pages} pages`);
        }}
        onError={(error) => {
          console.log('PDF error:', error);
        }}
        renderActivityIndicator={() => (
          <ActivityIndicator size="large" color="#6200EE" />
        )}
      /> */}

      <Pdf
        trustAllCerts={false}
        source={{
          uri: url,
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
        style={{flex:1, width:'100%'}}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },

  backBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
     borderRadius: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,

  },

  pdf: {
    flex: 1,
  },
    backBtn1: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});