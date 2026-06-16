import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import IconCheck from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
export default function SiteHistory(props) {
  const navigation = useNavigation();
  const [SiteData, setSiteData] = useState(props.route?.params?.site || []);
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
    
     
        <ScrollView style={{flex:1, backgroundColor: '#f5f7fe' }}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#021265',padding:20}}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
              <IconCheck name={'angle-left'} size={20} color={'#FFF'}/>
            </TouchableOpacity>
            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:18,color:'#FFF'}}>SiteVisit History</Text>
            <View style={{width:30}}/>
          </View>
          {SiteData.length != 0 ?
            <>
              {SiteData.map((item, index) => (<View
                key={index}
                style={{
                  width: '100%',
                  flex: 1,
                  borderBlockColor: '#DADADA',
                  borderBottomWidth: 1,
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  //  marginBottom: 20,
                }}>
                <Image
                  style={{
                    width: width * 0.3,
                    height: 100,
                    borderRadius: 15,
                  }}
                  source={item?.propertyDetails?.image?.Image1 ? { uri: item?.propertyDetails?.image?.Image1 } : require('./assets/Commingsoon.png')}
                // source={require('./assets/Commingsoon.png')}
                />

                <View style={{ paddingLeft: 10, flex: 1 }}>
                  <Text
                    style={{
                      color: '#1E2135',
                      fontSize: 16,
                      fontFamily: "OpenSans-Bold",
                      letterSpacing: 0.1,
                      paddingVertical: 2,
                      //textAlign:'center'
                      //flex:1
                    }}>
                    {item?.propertyDetails?.name}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text
                      style={{
                        color: '#1E2135',
                        fontSize: 14,
                        //fontWeight: 400,
                        fontFamily: "Poppins-Regular",
                        paddingVertical: 2,
                      }}>
                      Status :-
                    </Text>

                    <Text
                      style={{
                        color: item?.status == 'Visited' ? '#008000' : '#FF0000',
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        paddingVertical: 2,
                      }}>
                      {item?.status}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: item?.status == 'Visited' ? '#008000' : '#FF0000',
                      fontSize: 14,
                      fontFamily: "Poppins-Regular",
                      paddingVertical: 2,
                    }}>
                    {item?.time}
                  </Text>
                </View>
                {/* </View> */}
              </View>))}
            </>
            :
            <Text style={{ color: '#043862', fontSize: 20, fontFamily: "Poppins-SemiBold", textAlign: 'center', paddingTop: 10 }}>
              No site visit is scheduled; kindly arrange your preferred time for the visit.</Text>
          }


        </ScrollView>

     </SafeAreaView>
  );
}
