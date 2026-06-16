import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const digitAnimations = {
  enter: {
    from: { opacity: 0, translateY: 8 },
    to: { opacity: 1, translateY: 0 },
  },
  exit: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: -8 },
  },
};

// const AnimatedDigit = ({ digit }) => {
//   return (
//     <Animatable.View
//       animation={digitAnimations.enter}
//       duration={260}
//       easing="ease-out-cubic"
//       useNativeDriver
//       style={{
//         width: 26,
//         height: 48, // 👈 LOCK HEIGHT
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <Animatable.Text
//         animation={digitAnimations.exit}
//         duration={260}
//         easing="ease-out-cubic"
//         useNativeDriver
//         style={{
//           fontSize: 42,
//           fontWeight: '700',
//           color: '#111',
//         }}
//       >
//         {digit}
//       </Animatable.Text>
//     </Animatable.View>
//   );
// };


const AnimatedDigit = ({ digit }) => {
  return (
    <View
      style={{
        width: 26,
        height: 48,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Incoming digit */}
      <Animatable.Text
        key={`in-${digit}`}
        animation={{
          from: { opacity: 0, translateY: 8 },
          to: { opacity: 1, translateY: 0 },
        }}
        duration={300}
        easing="ease-out-cubic"
        useNativeDriver
        style={{
          position: 'absolute',
          fontSize: 38,
          fontFamily:"Montserrat-SemiBold",
        //   fontWeight: '700',
          color: '#FFF',
        }}
      >
        {digit}
      </Animatable.Text>
    </View>
  );
};



// const AnimatedDigit = ({ digit }) => {
//   return (
//     <Animatable.Text
//       animation="slideInUp"
//       duration={300}
//       easing="ease-out"
//       style={{
//         fontSize: 42,
//         fontWeight: '700',
//         color: '#111',
//         width: 26,
//         textAlign: 'center',
//       }}
//     >
//       {digit}
//     </Animatable.Text>
//   );
// };

export default AnimatedDigit;
