import { useContext, useEffect, useRef, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import NavigationStack from './Screen/Navigation/NavigationStack';
import { AppContext, AppProvider } from './Screen/Context/AppContext';
import Video from 'react-native-video';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import store from './Screen/redux/store/store';
import DeepLinkHandler from './Screen/Services/DeepLinkHandler';
import analytics from '@react-native-firebase/analytics';
import installations from '@react-native-firebase/installations';
import inAppMessaging from '@react-native-firebase/in-app-messaging';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './Screen/component/NoInternet';

import codePush from "react-native-code-push";
import { updateFCMToken } from './Screen/Services/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

let options = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
};


export const navigationRef = createNavigationContainerRef();

const App = () => {
  const [firstTimeUser, setFirstTimeUser] = useState(true);
  const backgroundImage = require('./Screen/assets/Demovideo.mp4');

  const [isConnected, setIsConnected] = useState(true);
  const routeNameRef = useRef();
  // const {globalState} = useContext(AppContext);
  // const email = globalState?.userEmail;
  // const navigationRef = useRef();

  const checkConnection = () => {
    NetInfo.fetch().then(state => setIsConnected(state.isConnected));
  };

  useEffect(() => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: true,
      },
      (status) => {
        console.log("CODEPUSH STATUS:", status);
      },
      (progress) => {
        console.log("DOWNLOAD:", progress);
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('🔥 Foreground Message:', remoteMessage);

      Alert.alert(
        remoteMessage.notification?.title || "No Title",
        remoteMessage.notification?.body || "No Body"
      );
    });

    return unsubscribe;
  }, []);

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

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission denied");
    }
  };

  useEffect(() => {
    requestLocationPermission();
    setTimeout(() => setFirstTimeUser(false), 5000);
  }, []);

  useEffect(() => {
    const sendEvent = async () => {
      try {
        await analytics().logEvent('app_open_test');
        console.log('✅ Firebase event sent');
      } catch (e) {
        console.log('❌ Firebase error:', e);
      }
    };

    sendEvent();
  }, []);

  // useEffect(() => {
  //   installations().getId().then(id => {
  //     // console.log("🔥 Installation ID:", id);
  //   });
  // }, []);

  // useEffect(() => {
  //   // console.log("🔥 In-App Messaging initialized");

  //   inAppMessaging().setMessagesDisplaySuppressed(false);

  //   inAppMessaging().triggerEvent('app_open_test');

  // }, []);


  if (__DEV__) {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.log("🔥 GLOBAL ERROR:", error);
      console.log("🔥 IS FATAL:", isFatal);
    });
  }

  return (
    <>
      {firstTimeUser ? (
        <Video
          source={backgroundImage}
          hideShutterView
          style={styles.backgroundVideo}
        />
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <AppProvider>
              <DeepLinkHandler /> 
              <NavigationContainer 
                ref={navigationRef}
                onReady={() => {
                  routeNameRef.current = navigationRef.current.getCurrentRoute().name;
                }}
                onStateChange={async () => {
                  const previousRouteName = routeNameRef.current;
                  const currentRouteName = navigationRef.current.getCurrentRoute().name;

                  if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                      screen_name: currentRouteName,
                      screen_class: currentRouteName,
                    });
                  }

                  routeNameRef.current = currentRouteName;
                }}
              >
                {isConnected ? <NavigationStack /> : <NoInternet onRetry={checkConnection} />}
              </NavigationContainer>
            </AppProvider>
          </Provider>
        </GestureHandlerRootView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

// export default App;


export default codePush(options)(App);

