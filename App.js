import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, PermissionsAndroid } from 'react-native';
import NavigationStack from './Screen/Navigation/NavigationStack';
import { AppProvider } from './Screen/Context/AppContext';
import Video from 'react-native-video';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [firstTimeUser, setFirstTimeUser] = useState(true);
  const backgroundImage = require('./Screen/assets/Demovideo.mp4');
  const getDeviceToken = async () => {
    let Dtoken = await messaging().getToken();
  }
  const requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location.",
        buttonPositive: "OK",
        buttonNegative: "Cancel"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //  getLocation();
    } else {
      console.log("Location permission denied");
    }
  };

  useEffect(() => {
    // requestUserPermission();
    requestLocationPermission();
    setTimeout(() => setFirstTimeUser(false), 5000);
    getDeviceToken();
  }, []);

  return (
    <>
      {firstTimeUser ? (
        <Video
          source={backgroundImage}
          // fullscreen={true}
          hideShutterView={true}
          style={styles.backgroundVideo}
        />

      ) : (
        <AppProvider>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </AppProvider>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  active: {
    backgroundColor: '#000000',
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default App;


