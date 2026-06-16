// import { View, Text, TouchableOpacity, Image, Modal, Dimensions } from 'react-native'
// import React, { useState } from 'react'
// import Icon from 'react-native-vector-icons/Entypo';
// import StaggeredList from '@mindinventory/react-native-stagger-view';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function PropertyImages(props) {

//     const [images, setImages] = useState(props?.route?.params?.data);
//     const { width, height } = Dimensions.get('window');
//     const [viewImg, setViewImg] = useState('');
//     const [fullImg, setFullImg] = useState(false);

//     const navigation = useNavigation();

//   return (
//      <SafeAreaView style={{flex:1}}>
//         <View style={{flex:1,backgroundColor:'#FFF',padding:20}}>
//             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
//                 <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000'}}>Property Gallery</Text>
//                 <TouchableOpacity onPress={() => {
//                     navigation.goBack();
//                 }} style={{backgroundColor:'#D9D9D9AB',width:25,height:25,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
//                     <Icon name={'cross'} size={20} color={'#000'}/>
//                 </TouchableOpacity>
//             </View>

//             <View style={{flex:1,marginTop:20}}>
//                 <StaggeredList
//                     data={images}
//                     numColumns={2}
//                     key={(item) => item.id}
//                     renderItem={({item}) => {
//                         const randomHeight = Math.floor(Math.random() * 100) + 180;
//                         return (
//                             <TouchableOpacity onPress={() => {
//                                 setViewImg(item);
//                                 setFullImg(true);
//                             }} style={{margin:10,borderRadius:10,overflow:'hidden'}}>
//                                 <Image source={{uri: item}} style={{width:'100%',height:randomHeight}}/>
//                             </TouchableOpacity>
//                         )
//                     }}
//                 />
//             </View>

//             <Modal visible={fullImg} transparent animationType='fade'>
//                 <TouchableOpacity onPress={() => {
//                     setFullImg(false);
//                 }} style={{backgroundColor:'#000000b3',flex:1,alignItems:'center',justifyContent:'center'}}>
//                     <View style={{borderWidth:2,borderColor:'#fff',borderRadius:10}}>
//                         <Image source={{uri: viewImg}} style={{width: width*0.8,height:height*0.5,borderRadius:10}}/>
//                     </View>
//                 </TouchableOpacity>
//             </Modal>
//         </View>
//     </SafeAreaView> 
//   )
// }

import { View, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated';

export default function PropertyImages(props) {

    const [images] = useState(props?.route?.params?.data);
    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation();

    const ITEM_WIDTH = 100;
    const SPACING = 10;


    const [selectedImage, setSelectedImage] = useState(images?.[0]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fafafa' }}>

                {/* Back Button */}
                <View style={{ padding: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name={'chevron-left'} size={20} color={'#000'} />
                    </TouchableOpacity>
                </View>

                {/* Main Big Image */}
                {/* <View style={{ width: width, height: height * 0.65 }}>
                    <Image
                        resizeMode='cover'
                        source={{ uri: images[0] }}
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <FlatList
                        data={images}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, i) => i.toString()}
                        snapToInterval={ITEM_WIDTH + SPACING}
                        contentContainerStyle={{
                            paddingHorizontal: width / 2 - ITEM_WIDTH / 2,
                        }}
                        snapToAlignment="center"
                        renderItem={({ item, index }) => (
                            <Image source={{uri: item}} style={{
                                width: ITEM_WIDTH,
                                height: 70,
                                marginHorizontal: SPACING / 2,
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}/>
                        )}
                    />
                </View> */}

                {/* Main Big Image */}
            <View style={{ width: width, height: height * 0.65 }}>
                <Image
                    resizeMode='contain'
                    source={{ uri: selectedImage }}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>

            <View style={{ marginTop: 0 }}>
                <FlatList
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => i.toString()}
                    // snapToInterval={ITEM_WIDTH + SPACING}
                    contentContainerStyle={{
                        paddingHorizontal: width / 2 - ITEM_WIDTH / 2,
                    }}
                    snapToAlignment="center"
                    renderItem={({ item, index }) => {
                        const isSelected = selectedImage === item;

                        return (
                            <TouchableOpacity onPress={() => setSelectedImage(item)}>
                                <Image
                                    source={{ uri: item }}
                                    style={{
                                        width: ITEM_WIDTH,
                                        height: 90,
                                        marginHorizontal: SPACING / 2,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        borderWidth: isSelected ? 2 : 0,
                                        borderColor: '#021265',
                                    }}
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            </View>
        </SafeAreaView>
    )
}