// import { useNavigation } from '@react-navigation/native';
// import React, { useRef, useEffect, useState } from 'react';
// import {View,FlatList,Image,Animated,Dimensions,StyleSheet,TouchableOpacity,} from 'react-native';

// const { width } = Dimensions.get('window');

// export default function CustomSwiper({ data = [], height = 245 }) {
//   const flatListRef = useRef(null);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const currentIndexRef = useRef(0);
//   const intervalRef = useRef(null);
//   const navigation = useNavigation();

//   const [currentIndex, setCurrentIndex] = useState(0);

//   // 🔁 Auto slide every 3 sec
//   useEffect(() => {
//     startAutoSlide();
//     return () => stopAutoSlide();
//   }, []);

//   const startAutoSlide = () => {
//     stopAutoSlide();
//     intervalRef.current = setInterval(() => {
//       let nextIndex = currentIndexRef.current + 1;
//       if (nextIndex >= data.length) {
//         nextIndex = 0;
//       }

//       flatListRef.current?.scrollToIndex({
//         index: nextIndex,
//         animated: true,
//       });

//       currentIndexRef.current = nextIndex;
//       setCurrentIndex(nextIndex);
//     }, 3000);
//   };

//   const stopAutoSlide = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   };

//   const onMomentumScrollEnd = (event) => {
//     const index = Math.round(
//       event.nativeEvent.contentOffset.x / width
//     );

//     currentIndexRef.current = index;
//     setCurrentIndex(index);
//     startAutoSlide();
//   };

//   return (
//     <View style={{ height, }}>
//       <Animated.FlatList
//         ref={flatListRef}
//         data={data}
//         keyExtractor={(_, i) => i.toString()}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScrollBeginDrag={stopAutoSlide}
//         onMomentumScrollEnd={onMomentumScrollEnd}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => {navigation.navigate(item?.screen, item?.params)}}>
//                 <Image source={{ uri: item?.image }} style={{ width, height: 210 }} resizeMode="contain"/>
//           </TouchableOpacity>
//         )}
//       />

//       {/* Pagination */}
//       <View style={styles.pagination}>
//         {data.map((_, index) => {
//           const isActive = index === currentIndex;
//           return (
//             <View
//               key={index}
//               style={[
//                 styles.dot,
//                 isActive && styles.activeDot,
//               ]}
//             />
//           );
//         })}
//       </View>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   pagination: {
//     position: 'absolute',
//     bottom: 8,
//     flexDirection: 'row',
//     alignSelf: 'center',
//   },
//   dot: {
//     backgroundColor: '#081F6247',
//     width: 10,
//     height: 6,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     backgroundColor: '#081F62',
//     width: 30,
//   },
// });



import { useNavigation } from '@react-navigation/native';
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import CountdownTimer from './CountdownTimer/CountdownTimer';

const { width } = Dimensions.get('window');

export default function CustomSwiper({
  data = [],
  height = 210,
  autoplay = false,
  autoplayInterval = 5000,
}) {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(0);
  const intervalRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const canLoop = data.length > 1;
  


  /* ---------------- AUTOPLAY ---------------- */
  useEffect(() => {
    if (autoplay && canLoop) {
      startAutoSlide();
    }
    return stopAutoSlide;
  }, [autoplay, data.length]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      let nextIndex = currentIndexRef.current + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, autoplayInterval);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onMomentumScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    currentIndexRef.current = index;
    setCurrentIndex(index);

    if (autoplay && canLoop) {
      startAutoSlide();
    }
  };

  if (!data.length) return null;

  const [now, setNow] = useState(Date.now());

useEffect(() => {
  const timer = setInterval(() => {
    setNow(Date.now());
  }, 1000);

  return () => clearInterval(timer);
}, []);


  const renderItem = ({ item }) => {
  if (item.type !== 'COUNTDOWN') {
    // console.log("Ittttt:" ,item);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          item?.screen && navigation.navigate(item.screen, item.params)
        }
        style={{ width,paddingHorizontal:10,}}
      >
        <Image
          resizeMode="contain"
          source={{ uri: item.image }}
          style={{ width: '100%', height,borderRadius:10 }}
        />
      </TouchableOpacity>
    );
  }
  // console.log("Item: ",item);

  const endTimeMs = item?.endTime
    ? new Date(item.endTime).getTime()
    : null;
  // console.log("EndTime: ",endTimeMs);
  const isExpired = endTimeMs ? now >= endTimeMs : true;
  // console.log("IsExpre", isExpired)

  const imageToShow = isExpired
    ? item?.watchLiveStreamImage
    : item?.image;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (isExpired && item?.nav) {
          navigation.navigate(item.screen, {
            liveStreamUrl: item.liveStreamUrl,
          });
        }
      }}
      style={{ width, paddingHorizontal:10}}
    >
      <Image
        resizeMode="stretch"
        source={{ uri: imageToShow }}
        style={{ width:'100%', height,borderRadius:15 }}
      />

      {/* Countdown overlay only BEFORE expiry */}
      {!isExpired && endTimeMs && (
        <View style={styles.overlay}>
          <Text style={styles.offerTitle}>{item.title}</Text>
          <CountdownTimer endTime={item.endTime} />
        </View>
      )}
    </TouchableOpacity>
  );
};


  return (
    <View style={{ height }}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        onScrollBeginDrag={stopAutoSlide}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Pagination */}
      {canLoop && (
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    backgroundColor: '#ffffff7e',
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 8,
  },
  overlay: {
    position: 'absolute',
    // bottom: 20,
    // left: 16,
    // right: 16,
    alignItems:'center',justifyContent:'center',top:45,left:38
  },
  offerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    paddingBottom:10
  },
});
