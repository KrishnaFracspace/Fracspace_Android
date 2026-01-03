import { View, Text,TouchableOpacity, } from 'react-native';
import openMap from 'react-native-open-maps';
import React from 'react';

export default function Location() {
    const GgoToYosemite=()=>{
    openMap({latitude: 16.82599, longitude: 78.520231});
    }
  return (
    <View>
      <TouchableOpacity
          onPress={() => {
            GgoToYosemite();
            //navigation.navigate('Contact');
          }}
          style={{
            alignItems: 'center',
            // backgroundColor: '#0B0B45',
            backgroundColor: '#043862',
            borderRadius: 12,
            padding: 20,
            marginVertical: 8,
          }}>
          <Text style={{color: 'white', fontSize: 16, fontFamily:"Montserrat-SemiBold"}}>
          Submit
          </Text>
        </TouchableOpacity>
    </View>
  )
}