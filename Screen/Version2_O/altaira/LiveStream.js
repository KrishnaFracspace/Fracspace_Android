// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Modal,
//   useWindowDimensions,
//   StatusBar,
// } from 'react-native';
// import Video from 'react-native-video';
// import Orientation from 'react-native-orientation-locker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// const RESOLUTIONS = ['360p', '480p', '720p', '1080p', '2160p'];

// export default function LiveStream({ route, navigation }) {
//   const { liveStreamUrl } = route.params;
//   // const liveStreamUrl = "https://7ebd-183-82-111-142.ngrok-free.app/hls/3e990b3c-7bf0-4f07-a386-960c6979b861/index.m3u8";

//   const videoRef = useRef(null);
//   const { width, height } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   const isLandscape = width > height;

//   const [paused, setPaused] = useState(false);
//   const [quality, setQuality] = useState('720p');
//   const [showQualityModal, setShowQualityModal] = useState(false);

//   const streamUrl = `${liveStreamUrl}?max_resolution=${quality}`;

//   useEffect(() => {
//     Orientation.unlockAllOrientations();
//     return () => Orientation.lockToPortrait();
//   }, []);

//   return (
//     <SafeAreaView style={{flex:1}}>
//     <View style={styles.container}>
//       <StatusBar hidden />

//       {/* 🎥 VIDEO */}
//       <Video
//         ref={videoRef}
//         key={streamUrl}
//         source={{ uri: streamUrl }}
//         style={StyleSheet.absoluteFill}
//         resizeMode="contain"
//         controls
//         paused={paused}
//         onError={(e) => console.log('Video error:', e)}
//       />

//       {/* 🔝 TOP BAR */}
//       <View
//         style={[
//           styles.topBar,
//           {
//             paddingTop: insets.top + 8,
//             paddingHorizontal: 16,
//           },
//         ]}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={26} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.title}>Live Stream</Text>

//         <View style={styles.topActions}>
//           {/* <TouchableOpacity onPress={() => setShowQualityModal(true)}>
//             <Text style={styles.qualityText}>{quality}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{ marginLeft: 12 }}
//             onPress={() =>
//               isLandscape
//                 ? Orientation.lockToPortrait()
//                 : Orientation.lockToLandscape()
//             }
//           >
//             <Icon name="screen-rotation" size={24} color="#fff" />
//           </TouchableOpacity> */}
//         </View>
//       </View>

//       <View style={{position:'absolute',top:50,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop: insets.top + 8,paddingHorizontal:16,left:0, right:0}}>
//         <View style={{backgroundColor:'red',paddingHorizontal:10,paddingVertical:5,borderRadius:5,flexDirection:'row',alignItems:'center'}}>
//             <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#fff'}}/>
//             <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#fff',marginLeft:5}}>Live</Text>
//         </View>
//         <View style={{flexDirection:'row',alignItems:'center'}}>
//             <TouchableOpacity onPress={() => setShowQualityModal(true)}>
//                 <Text style={styles.qualityText}>{quality}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={{ marginLeft: 15,marginRight:5 }}
//                 onPress={() =>
//                 isLandscape
//                     ? Orientation.lockToPortrait()
//                     : Orientation.lockToLandscape()
//                 }
//             >
//                 <Icon name="screen-rotation" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>
//       </View>

//       {/* 📋 QUALITY MODAL */}
//       <Modal
//         transparent
//         animationType="fade"
//         visible={showQualityModal}
//         onRequestClose={() => setShowQualityModal(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowQualityModal(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Video Quality</Text>

//             {RESOLUTIONS.map((res) => (
//               <TouchableOpacity
//                 key={res}
//                 style={styles.qualityOption}
//                 onPress={() => {
//                   setQuality(res);
//                   setShowQualityModal(false);
//                 }}
//               >
//                 <Text
//                   style={[
//                     styles.qualityOptionText,
//                     quality === res && styles.activeQuality,
//                   ]}
//                 >
//                   {res}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* 🔽 SAFE BOTTOM SPACER */}
//       <View style={{ height: insets.bottom }} />
//     </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },

//   topBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },

//   title: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   topActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   qualityText: {
//     color: '#fff',
//     fontSize: 13,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 6,
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   modalContent: {
//     backgroundColor: '#111',
//     borderRadius: 10,
//     padding: 20,
//     width: 220,
//   },

//   modalTitle: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },

//   qualityOption: {
//     paddingVertical: 10,
//   },

//   qualityOptionText: {
//     color: '#bbb',
//     fontSize: 14,
//     textAlign: 'center',
//   },

//   activeQuality: {
//     color: '#fff',
//     fontWeight: '700',
//   },
// });

// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   StatusBar,
//   useWindowDimensions,
// } from 'react-native';
// import Video from 'react-native-video';
// import Orientation from 'react-native-orientation-locker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function LiveStreamScreen() {
// //   const { streamUrl, title } = route.params;
//   const url = "https://stream.mux.com/NZ6URzlygUPsLCVzPYP878a5bbowrH6SZfW5xSKZOCI.m3u8?max_resolution=2160p"
//   const videoRef = useRef(null);

//   const { width, height } = useWindowDimensions(); // 🔥 auto updates
//   const isLandscape = width > height;

//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     // Lock landscape when entering
//     Orientation.unlockAllOrientations();

//     return () => {
//       // Restore portrait on exit
//       Orientation.lockToPortrait();
//     };
//   }, []);

//   return (
//     <SafeAreaView style={{flex:1}}>
//         <View style={styles.container}>
//             <StatusBar hidden={isLandscape} />

//             <Video
//                 ref={videoRef}
//                 source={{ uri: url }}
//                 style={{
//                     width,
//                     height: isLandscape ? height : width * 0.56, // 16:9 in portrait
//                 }}
//                 resizeMode="contain"
//                 paused={paused}
//                 controls
//                 onError={(e) => console.log('Video error', e)}
//             />

//             {/* Top Bar */}
//             {!isLandscape && (
//                 <View style={styles.topBar}>
//                     <TouchableOpacity
//                         onPress={() => {
//                         Orientation.lockToPortrait();
//                         navigation.goBack();
//                         }}
//                     >
//                         <Icon name="arrow-back" size={26} color="#fff" />
//                     </TouchableOpacity>

//                     <Text style={styles.title}>Live Stream</Text>
//                 </View>
//             )}

//             {/* Bottom Controls */}
//             <View style={styles.bottomBar}>
//                 <TouchableOpacity onPress={() => setPaused(!paused)}>
//                     <Icon
//                         name={paused ? 'play-arrow' : 'pause'}
//                         size={32}
//                         color="#fff"
//                     />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                 onPress={() =>
//                     isLandscape
//                     ? Orientation.lockToPortrait()
//                     : Orientation.lockToLandscape()
//                 }
//                 >
//                     <Icon name="screen-rotation" size={26} color="#fff" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   topBar: {
//     position: 'absolute',
//     top: 40,
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 12,
//     fontWeight: '600',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });




// import React, { useRef, useState, useEffect } from 'react';
// import {View,StyleSheet,TouchableOpacity,Text,Modal,useWindowDimensions,StatusBar,} from 'react-native';
// import Video from 'react-native-video';
// import Orientation from 'react-native-orientation-locker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const RESOLUTIONS = ['360p', '480p', '720p', '1080p', '2160p'];

// export default function LiveStreamScreen({route, navigation}) {
//   const { liveStreamUrl } = route.params;
//   console.log("Lice: ",liveStreamUrl);

//   const videoRef = useRef(null);
//   const { width, height } = useWindowDimensions();
//   const isLandscape = width > height;

//   const [paused, setPaused] = useState(false);
//   const [quality, setQuality] = useState('720p'); // ✅ default
//   const [showQualityModal, setShowQualityModal] = useState(false);

//   const streamUrl = `${liveStreamUrl}?max_resolution=${quality}`;

//   useEffect(() => {
//     Orientation.unlockAllOrientations();
//     return () => Orientation.lockToPortrait();
//   }, []);
// //
//   return (
//     <SafeAreaView style={{flex:1}}>
//     <View style={styles.container}>
//       <StatusBar hidden={isLandscape} />

//       {/* 🎥 Video */}
//       <Video
//         ref={videoRef}
//         key={streamUrl} // 🔥 forces reload on quality change
//         source={{ uri: streamUrl }}
//         style={{
//           width,
//           height: isLandscape ? height : height,
//         }}
//         resizeMode="contain"
//         controls
//         paused={paused}
//         onError={(e) => console.log('Video error:', e)}
//       />

//       {/* 🔙 Top Bar */}
//       {!isLandscape && (
//         <View style={styles.topBar}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={26} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Live Stream</Text>
//         </View>
//       )}

//       {/* 🎛 Bottom Controls */}
//       <View style={styles.bottomBar}>
//         {/* <TouchableOpacity onPress={() => setPaused(!paused)}>
//           <Icon
//             name={paused ? 'play-arrow' : 'pause'}
//             size={32}
//             color="#fff"
//           />
//         </TouchableOpacity> */}

//         {/* ⚙ Quality Button */}
//         <TouchableOpacity onPress={() => setShowQualityModal(true)}>
//           <Text style={styles.qualityText}>{quality}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() =>
//             isLandscape
//               ? Orientation.lockToPortrait()
//               : Orientation.lockToLandscape()
//           }
//         >
//           <Icon name="screen-rotation" size={26} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* 📋 Quality Dropdown */}
//       <Modal
//         transparent
//         animationType="fade"
//         visible={showQualityModal}
//         onRequestClose={() => setShowQualityModal(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowQualityModal(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Video Quality</Text>

//             {RESOLUTIONS.map((res) => (
//               <TouchableOpacity
//                 key={res}
//                 style={styles.qualityOption}
//                 onPress={() => {
//                   setQuality(res);
//                   setShowQualityModal(false);
//                 }}
//               >
//                 <Text
//                   style={[
//                     styles.qualityOptionText,
//                     quality === res && styles.activeQuality,
//                   ]}
//                 >
//                   {res}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // paddingBottom:80,
//     paddingHorizontal:15,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   topBar: {
//     position: 'absolute',
//     top: 40,
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 12,
//     fontWeight: '600',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   qualityText: {
//     color: '#fff',
//     fontSize: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 6,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#111',
//     borderRadius: 10,
//     padding: 20,
//     width: 220,
//   },
//   modalTitle: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   qualityOption: {
//     paddingVertical: 10,
//   },
//   qualityOptionText: {
//     color: '#bbb',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   activeQuality: {
//     color: '#fff',
//     fontWeight: '700',
//   },
// });



import React, { useRef, useState, useEffect } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,Modal,useWindowDimensions,StatusBar,Platform, LogBox} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import RNScreenshotPrevent from 'react-native-screenshot-prevent';
// import { useCaptureProtection } from 'react-native-capture-protection';

const RESOLUTIONS = ['360p', '480p', '720p', '1080p', '2160p'];

export default function LiveStream({ route, navigation }) {
  const { liveStreamUrl } = route.params;
  // const liveStreamUrl = "https://7ebd-183-82-111-142.ngrok-free.app/hls/3e990b3c-7bf0-4f07-a386-960c6979b861/index.m3u8";

  const videoRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLandscape = width > height;

  const [paused, setPaused] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [showQualityModal, setShowQualityModal] = useState(false);

  const streamUrl = `${liveStreamUrl}?max_resolution=${quality}`;

  // useEffect(() => {
  //   // Enable screenshot protection
  //   RNScreenshotPrevent.enabled(true);
  //   if (Platform.OS === 'ios') {
  //     RNScreenshotPrevent.enableSecureView();
  //   }

  //   Orientation.unlockAllOrientations();

  //   return () => {
  //     // Disable screenshot protection when leaving
  //     RNScreenshotPrevent.enabled(false);
  //     if (Platform.OS === 'ios') {
  //       RNScreenshotPrevent.disableSecureView();
  //     }
  //     Orientation.lockToPortrait();
  //   };
  // }, []);

  // LogBox.ignoreLogs([
  //   'new NativeEventEmitter',
  // ]);

  useEffect(() => {
    Orientation.unlockAllOrientations();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <StatusBar hidden />

        {/* 🎥 VIDEO */}
        <Video
          ref={videoRef}
          key={streamUrl}
          source={{ uri: streamUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
          muted
          controls
          paused={paused}
          onError={(e) => console.log('Video error:', e)}
        />

        {/* 🔝 TOP BAR */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: insets.top + 8,
              paddingHorizontal: 16,
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Live Stream</Text>

          <View style={styles.topActions}>
          </View>
        </View>

        <View style={{position:'absolute',top:50,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop: insets.top + 8,paddingHorizontal:16,left:0, right:0}}>
          <View style={{backgroundColor:'red',paddingHorizontal:10,paddingVertical:5,borderRadius:5,flexDirection:'row',alignItems:'center'}}>
              <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#fff'}}/>
              <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#fff',marginLeft:5}}>Live</Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity onPress={() => setShowQualityModal(true)}>
                  <Text style={styles.qualityText}>{quality}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={{ marginLeft: 15,marginRight:5 }}
                  onPress={() =>
                  isLandscape
                      ? Orientation.lockToPortrait()
                      : Orientation.lockToLandscape()
                  }
              >
                  <Icon name="screen-rotation" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
        </View>

        {/* 📋 QUALITY MODAL */}
        <Modal
          transparent
          animationType="fade"
          visible={showQualityModal}
          onRequestClose={() => setShowQualityModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowQualityModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Video Quality</Text>

              {RESOLUTIONS?.map((res) => (
                <TouchableOpacity
                  key={res}
                  style={styles.qualityOption}
                  onPress={() => {
                    setQuality(res);
                    setShowQualityModal(false);
                  }}
                >
                  <Text style={[styles.qualityOptionText,quality === res && styles.activeQuality, ]}>{res}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* 🔽 SAFE BOTTOM SPACER */}
        <View style={{ height: insets.bottom }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qualityText: {
    color: '#fff',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 20,
    width: 220,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  qualityOption: {
    paddingVertical: 10,
  },

  qualityOptionText: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
  },

  activeQuality: {
    color: '#fff',
    fontWeight: '700',
  },
});

