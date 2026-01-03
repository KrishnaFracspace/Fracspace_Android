// import { useNavigation } from '@react-navigation/native';
// import React, { useRef, useState } from 'react';
// import { View, Text, Dimensions, Image, TouchableOpacity, ImageBackground } from 'react-native';
// import Carousel from 'react-native-reanimated-carousel';

// const { width, height } = Dimensions.get('window');

// const DATA = [
//   {
//     id: '1',
//     title: 'Co-Own',
//     titleStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 35, color: '#081F62CC' },
//     description: 'Experience effortless ownership \n - Redefined by Fracspace innovation',
//     image: require('./assets/bg1.png'),
//     imageCard: require('./assets/CoOwn.png'),
//     imageTop: require('./assets/Header1.png'),
//     imageStyle: {resizeMode: 'contain', marginTop: 70, width: width * 0.7, height: height * 0.15}
//   },
//   {
//     id: '2',
//     title: 'Interiors ',
//     titleStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 35, color: '#081F62CC' },
//     description: 'Where Elegance Meets Innovation\n — Interiors by Fracspace.' ,
//     image: require('./assets/bg2.png'),
//     imageCard: require('./assets/Interior.png'),
//     imageTop: require('./assets/Header2.png'),
//     imageStyle: {resizeMode: 'contain', marginTop: 70, width: width * 0.7, height: height * 0.15}
//   },
//   {
//     id: '3',
//     title: 'Dreamscape',
//     titleStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 35, color: '#081F62CC' },
//     description: 'Escape to Dreamscape — where every stay is a statement of refined living.',
//     image: require('./assets/bg3.png'),
//     imageCard: require('./assets/Dreamscapei.png'),
//     imageTop: require('./assets/Dreamscapee.png'),
//     imageStyle: {resizeMode: 'cover', marginTop: 60, width: width * 0.7, height: height * 0.15}
//   },
// ];

// export default function BoardingScreen() {
//     const carouselRef = useRef(null);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const navigation = useNavigation();

//     const handleNext = () => {
//         const newIndex = activeIndex + 1;
//         if (newIndex < DATA.length) {
//             carouselRef.current?.scrollTo({ index: newIndex, animated: true });
//         }
//         if(newIndex === 3){
//             navigation.navigate('LoginScreen');
//         }
//     };

//     const renderItem = ({ item }) => {
//         return (
//             <View style={{ backgroundColor: '#ffffff', borderRadius: 40, padding: 30, height: height * 0.9, gap: 10 }}>
                
//                 <View style={{elevation: 10}}>
//                     <Image
//                         source={item.imageCard}
//                         style={{ width: '100%', height: height * 0.48, resizeMode: 'cover', borderRadius: 30, }}
//                     />
//                 </View>
//                 <View style={{justifyContent:'space-around',gap:30}}>
//                     <View style={{ alignSelf:'center',alignItems:'center',marginHorizontal:20 }}>
//                         <Text style={item?.titleStyle}>{item.title}</Text>
//                         <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#081F62C2',textAlign:'center', marginTop:3}}>{item.description}</Text>
//                     </View>
//                     <TouchableOpacity
//                         onPress={handleNext}
//                         style={{ padding: 12, borderRadius: 10, backgroundColor: '#FFFFFF', borderColor: '#2F3596', borderWidth: 1, alignItems: 'center', marginHorizontal: 30 }}
//                     >
//                         <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#000000' }}>Next</Text>
//                     </TouchableOpacity>

//                     <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//                         {DATA.map((_, index) => (
//                         <View
//                             key={index}
//                             style={{width: 10,height: 10,borderRadius: 5,marginHorizontal: 5,backgroundColor: activeIndex === index ? '#0F1130' : '#D9D9D9',}}
//                         />
//                         ))}
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     return (
//         <View style={{ flex: 1 }}>
//             <ImageBackground
//                 source={DATA[activeIndex].image}
//                 style={{ flex: 1, resizeMode: 'cover' }}
//             >
//                 <TouchableOpacity style={{paddingHorizontal:20,paddingVertical:7,borderRadius:10,backgroundColor:'#EFF3F9',alignItems:'center',position:'absolute',top:20,right:20}}>
//                     <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:12,color:'#160D1F'}}>Skip</Text>
//                 </TouchableOpacity>
//                 <View style={{ alignItems: 'center', }}>
//                     <Image
//                         source={DATA[activeIndex].imageTop}
//                         style={DATA[activeIndex].imageStyle}
//                     />
//                 </View>

//                 <View style={{ flex: 1, justifyContent: 'flex-end'}}>
//                     <Carousel
//                         ref={carouselRef}
//                         loop={false}
//                         width={width}
//                         height={height * 0.8}
//                         autoPlay={false}
//                         data={DATA}
//                         scrollAnimationDuration={100}
//                         onSnapToItem={(index) => setActiveIndex(index)}
//                         renderItem={renderItem}
//                         mode="parallax"
//                         modeConfig={{
//                             parallaxScrollingScale: 0.7,
//                             parallaxScrollingOffset: 120,
//                             parallaxAdjacentItemScale: 0.5,
//                         }}
//                         style={{ alignSelf: 'center' }}
//                     />
//                 </View>
//             </ImageBackground>
//         </View>
//     );
// }
import { View, Text } from 'react-native'
import React from 'react'

export default function BoardingScreen() {
  return (
    <View>
      <Text>BoardingScreen</Text>
    </View>
  )
}
