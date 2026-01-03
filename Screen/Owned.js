
import React, { useContext, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, Image, Dimensions, ScrollView, } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from './Context/AppContext';
import Svg, { Text as SvgText } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import Footer from './Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Owned() {
  const { globalState, setGlobalState } = useContext(AppContext);
  const [value, setValue] = useState(null);
  const { width } = Dimensions.get('window');

  const [OwnedData, setOwnedData] = useState(globalState?.userDetails?.ownedProperties || [])
  const navigation = useNavigation();

  const investedAmount = 1500000;
  const data = globalState?.userDetails?.addProfit.map(change => investedAmount + change);


  const monthLabels = globalState?.userDetails?.QPaymentInfo.map(item => item.lable);
  const extendedMonths = monthLabels.length == 0 ? [] : ['', ...monthLabels, ''];
  const screenWidth = Math.max(data.length * 100, Dimensions.get('window').width);



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <View style={{ flex: 1, width: '100%' }}>
        {globalState?.userDetails?.verification ? <ScrollView style={{ flex: 1, width: '100%', padding: 20, backgroundColor: '#F6F6F6' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
           
              navigation.navigate('Home',{details:globalState?.ProDetails}); 
            }} style={{ borderColor: '#BFBFC0', borderWidth: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 17, borderRadius: 15 }}>
              <Icon name={'left'} size={20} color={'#000088'} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 24, color: '#021265', marginLeft: 20 }}>Properties' Portfolio </Text>
          </View>
          {OwnedData.length != 0 ?
            <View style={{ flex: 1, width: '100%' }}>
              <View style={{  backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginVertical: 30, }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#F6F6F6', borderRadius: 10, padding: 10, }}>
                      <Ico name={'dollar'} size={20} color={'#081F62'} />
                    </View>
                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 13, color: '#000000', marginLeft: 10 }}>P/L Summary</Text>
                  </View>

                </View>

                <View style={{ height: 320, width: '100%', }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                    <View style={{ backgroundColor: '#FFFFFF' }}>
                      {/* {extendedMonths.length > 2 &&  */}
                      <LineChart
                        data={{
                          labels: extendedMonths,
                          datasets: [{ data }]
                        }}
                        width={screenWidth}
                        height={280}
                        withDots={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        withShadow={true}
                        withVerticalLabels={true}
                        withHorizontalLabels={false}
                        bezier
                        style={{ marginLeft: -40, paddingTop: 30, width: '100%' }}
                        chartConfig={{
                          backgroundGradientFrom: '#ffffff',
                          backgroundGradientTo: '#ffffff',
                          decimalPlaces: 0,
                          color: () => '#4169E1',
                          labelColor: () => '#000',
                          fillShadowGradient: '#4A90E2',
                          fillShadowGradientOpacity: 0.25,
                          strokeWidth: 2,
                          propsForBackgroundLines: {
                            stroke: 'transparent',

                          },
                        }}
                        decorator={() => (
                          <Svg>
                            {
                              data.map((value, index) => {
                                if (index === 0 || index === data.length - 1) return null;
                                const diff = value - investedAmount;
                                const color = diff >= 0 ? '#000088' : 'red';
                                const x = (index) * (screenWidth / data.length) + 30;
                                const y = 280 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 200;

                                return (
                                  <SvgText
                                    key={`pl-${index}`}
                                    x={x - 20}
                                    y={y - 58}
                                    fontSize="12"
                                    fontFamily="Poppins-SemiBold"
                                    fill={color}
                                    textAnchor="start"
                                  >
                                    {`${diff >= 0 ? '+' : ''}₹${Math.abs(diff).toLocaleString()}`}
                                  </SvgText>
                                );
                              })
                            }

                            {globalState?.userDetails?.investmentEvents.map((event, i) => {
                              const x = (event.index) * (screenWidth / data.length) + 30;
                              const y = 280 - ((data[event.index] - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 200;
                              const color = (event.type === 'initial' || event.type === 'deposit') ? 'green' : 'red';
                              const symbol = (event.type === 'initial' || event.type === 'deposit') ? '+' : '-';

                              return (
                                <SvgText
                                  key={`event-${i}`}
                                  x={x - 24}
                                  y={y - 72}
                                  fontSize="12"
                                  fontFamily="Poppins-Medium"
                                  fill={color}
                                  textAnchor="start"
                                >
                                  ({symbol}{event.amount.toLocaleString()})
                                </SvgText>
                              );
                            })
                            }
                          </Svg>
                        )}
                      />
                      {/* // } */}
                    </View>
                  </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10 }}>
                  <View>
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Capital Invested</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{globalState?.userDetails?.investedAmount}</Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#000000B3' }}>Earnings Received</Text>
                    <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000' }}>{globalState?.userDetails?.currentAmount}</Text>
                  </View>
                </View>
              </View>

              <View style={{ marginBottom: 80 }}>
                {OwnedData.map((item, index) => (<TouchableOpacity key={index} onPress={() => {
                  //console.log(item?.propertyDetails?.location);
                  navigation.navigate('Dashboard', { ownedProDetails: item });
                  // navigation.navigate('PropertyDetails');
                }} style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, flexDirection: 'row', marginBottom: 20, width: '100%', flex: 1 }}>
                  <View>
                    <Image resizeMode='cover' source={{ uri: item?.propertyDetails?.image?.Image1 }} style={{ width: width * 0.32, height: 150, borderRadius: 8 }} />
                  </View>
                  <View style={{ width: '60%', justifyContent: 'space-between', marginLeft: 10 }}>
                    <View style={{ gap: 5, width: '100%' }}>
                      <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 15, color: '#5C5CB1', flexShrink: 1 }}>{item?.propertyDetails?.name}</Text>
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#7E7A7A' }}>{item?.propertyDetails?.location}</Text>
                    </View>
                    <View style={{ borderColor: '#EFE8E8', borderWidth: 0.7 }}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>Collective cost </Text>
                      <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088', textAlign: 'right' }}>₹{item?.propertyDetails?.Price}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#000000' }}>Investment</Text>
                      <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#000088', textAlign: 'right' }}>₹{item?.totalInvestment}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 13, color: '#000000' }}>{item?.numberOfOwners} Fracs</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('./assets/NewProfileImage.jpg')} style={{ width: 30, height: 30, borderRadius: 30 }} />
                        <Image source={require('./assets/NewProfileImage.jpg')} style={{ width: 30, height: 30, borderRadius: 30, marginLeft: -15 }} />
                        <Image source={require('./assets/NewProfileImage.jpg')} style={{ width: 30, height: 30, borderRadius: 30, marginLeft: -15 }} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>))}

              </View>
               {/* <Footer navigation={navigation} activeFooterTab={'owned'} /> */}
            </View> :
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 4 }}>
              <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
                <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/empty.png' }} style={{ width: width * 0.5, height: 180 }} />
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center' }}>Your property portfolio is empty.</Text>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
                  Start exploring exclusive properties and grow your real estate assets with shared ownership
                </Text>
                <TouchableOpacity onPress={() => {
                  //  GgoToYosemite(PropertiesArray?.Location);
                  navigation.navigate('Home',{details:globalState?.ProDetails});

                }} style={{ backgroundColor: '#2A61DF', borderRadius: 30, paddingHorizontal: 50, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
                  <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </ScrollView> : <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
          
              navigation.navigate('Home',{details:globalState?.ProDetails}); 
            }} style={{ borderColor: '#BFBFC0', borderWidth: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 17, borderRadius: 15 }}>
              <Icon name={'left'} size={20} color={'#000088'} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 24, color: '#021265', marginLeft: 20 }}>Properties' Portfolio </Text>
          </View>
          <View style={{ backgroundColor: '#FCFCFC', alignItems: 'center', justifyContent: 'center', flex: 4 }}>
            <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
              <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/empty.png' }} style={{ width: width * 0.5, height: 180 }} />
              <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#0F1130', textAlign: 'center' }}>Your property portfolio is empty.</Text>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#00000070', textAlign: 'center', marginVertical: 15 }}>
                Start exploring exclusive properties and grow your real estate assets with shared ownership
              </Text>
              <TouchableOpacity onPress={() => {
                //  GgoToYosemite(PropertiesArray?.Location);
                navigation.navigate('Home',{details:globalState?.ProDetails});

              }} style={{ backgroundColor: '#2A61DF', borderRadius: 30, paddingHorizontal: 50, paddingVertical: 10, borderColor: '#C0D5F3', borderWidth: 1 }}>
                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 16, color: '#FFFFFF' }}>Explore </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
        }
        <Footer navigation={navigation} activeFooterTab={'owned'} />
      </View>

    </SafeAreaView>






  );
};