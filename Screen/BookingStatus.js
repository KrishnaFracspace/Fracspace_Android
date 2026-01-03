import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native-animatable';
const {width, height} = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BookingStatus(props) {
 ////image display
  const [ImageData, setImageData] = useState(props?.route?.params?.Image);
  const [CountDis, setCountDis] = useState(0);
  const [Imagedis, setImagedis] = useState(props?.route?.params?.Image?.Image1);
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
     
      <View style={{flex: 5}}>
        
        <Image
          resizeMode='contain'
          style={{width, height,}}
          source={{uri: Imagedis}}
        />
      
      </View>
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <ScrollView horizontal={true}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                setImagedis(ImageData?.Image1);
                setCountDis(0);
              }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderColor: CountDis == 0 ? '#043862' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 5,
                  margin: 5,
                }}
                source={{uri: ImageData?.Image1}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImagedis(ImageData?.Image2);
                setCountDis(1);
              }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderColor: CountDis == 1 ? '#043862' : '#FFFFFF',
                borderRadius: 10,
                borderWidth: 5,
                margin: 5,
              }}
              source={{uri: ImageData?.Image2}}
            />
             </TouchableOpacity>
             <TouchableOpacity
              onPress={() => {
                setImagedis(ImageData?.Image3);
                setCountDis(2);
              }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderColor: CountDis == 2 ? '#043862' : '#FFFFFF',
                borderRadius: 10,
                borderWidth: 5,
                margin: 5,
              }}
              source={{uri: ImageData?.Image3}}
            />
               </TouchableOpacity>
               <TouchableOpacity
              onPress={() => {
                setImagedis(ImageData?.Image4);
                setCountDis(3);
              }}>

            <Image
              style={{
                width: 100,
                height: 100,
                borderColor: CountDis == 3 ? '#043862' : '#FFFFFF',
                borderRadius: 10,
                borderWidth: 5,
                margin: 5,
              }}
              source={{uri: ImageData?.Image4}}
            />
              </TouchableOpacity>

            {ImageData?.Image5 && (
              <TouchableOpacity
              onPress={() => {
                setImagedis(ImageData?.Image5);
                setCountDis(4);
              }}>

              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderColor: CountDis == 4 ? '#043862' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 5,
                  margin: 5,
                }}
                source={{uri: ImageData?.Image5}}
              />
              </TouchableOpacity>
            )}
            {ImageData?.Image6 && (
               <TouchableOpacity
               onPress={() => {
                 setImagedis(ImageData?.Image6);
                 setCountDis(5);
               }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderColor: CountDis == 5 ? '#043862' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 5,
                  margin: 5,
                }}
                source={{uri: ImageData?.Image6}}
              />
              </TouchableOpacity>
            )}
            {ImageData?.Image7 && (
                 <TouchableOpacity
                 onPress={() => {
                   setImagedis(ImageData?.Image7);
                   setCountDis(6);
                 }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderColor: CountDis == 6 ? '#043862' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 5,
                  margin: 5,
                }}
                source={{uri: ImageData?.Image7}}
              />
               </TouchableOpacity>
            )}
            {ImageData?.Image8 && (
                 <TouchableOpacity
                 onPress={() => {
                   setImagedis(ImageData?.Image8);
                   setCountDis(7);
                 }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderColor: CountDis == 7 ? '#043862' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 5,
                  margin: 5,
                }}
                source={{uri: ImageData?.Image8}}
              />
               </TouchableOpacity>
            )}
            {ImageData?.Image9 && (
                 <TouchableOpacity
                 onPress={() => {
                   setImagedis(ImageData?.Image9);
                   setCountDis(8);
                 }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderColor: CountDis == 8 ? '#043862' : '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 5,
                  margin: 5,
                }}
                source={{uri: ImageData?.Image9}}
              />
               </TouchableOpacity>
            )}
          </View>
        </ScrollView>
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
  wrapper: {flex: 2},
  container: {
    flex: 1,
  },
});
