import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Video from 'react-native-video';
import IconDown from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function VideoDispay(props) {
    const navigation = useNavigation();
    const [pau, setpau] = useState(false)


    return (

  <SafeAreaView style={{ flex: 1, backgroundColor:'#021265'}}>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAFAFF',
                width: '100%',
                //    margin:20
            }}>
                <TouchableOpacity style={{ flex: 1, padding: 20, }}
                    onPress={() => {
                        navigation.navigate('Visitor');

                    }}>
                    <Icon name="chevron-back-outline" size={25} color={'#000'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, padding: 20, }}
                    onPress={() => {
                        navigation.navigate('HomePage');

                    }}>
                    <Text style={{
                        fontSize: 15,
                        fontFamily: 'WorkSans-SemiBold',
                        color: '#0424CB',
                        textAlign: 'right'
                    }}>EXIT</Text>
                </TouchableOpacity>
            </View>

            <Video
                source={{ uri: props?.route?.params?.vlink }}
                paused={pau}
                // fullscreen={true}
                resizeMode={'contain'}
                seekIncrementMS={10000}

                hideShutterView={true}
                hideNavigationBarOnFullScreenMode={false}
                style={styles.backgroundVideo}
            />

            <TouchableOpacity onPress={() => {

                setpau(!pau)

            }}
                style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '80%',
                    //  borderWidth:3,
                    marginTop: '30%'

                }}>
                {pau == true && <Icon name={'caret-forward'} size={40} color={'#AEAEAE'} />}
            </TouchableOpacity>
        </SafeAreaView>


    );
}
const styles = StyleSheet.create({
    active: {
        backgroundColor: '#000000',
    },

    backgroundVideo: {
        position: 'absolute',
        top: 20,
        left: 0,
        bottom: 0,
        right: 0,
    },
});