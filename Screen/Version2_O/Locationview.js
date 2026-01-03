import { View, Text, Alert, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import { useContext, useEffect, useState, } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import IconF from 'react-native-vector-icons/FontAwesome6';
import { AppContext } from '../Context/AppContext';
import { useNavigation } from '@react-navigation/native';
export default function Locationview(props) {
    const { globalState, setGlobalState } = useContext(AppContext);


    const navigation = useNavigation();
    const [region, setRegion] = useState(null);
    const [Address, setAdress] = useState('');
    const [LivelocationAddress, setLivelocationAddress] = useState({ Address: '', Pincode: '', City: '' });

    const getLocation = () => {

        Geolocation.getCurrentPosition(
            (position) => {
                //openMap({ latitude: 78.42718862140957, longitude: 78.42718862140957 });
                const lon = position?.coords?.longitude;
                const lat = position?.coords?.latitude;
                // Alert.alert(lon);
                setRegion({
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                GetAddress(position?.coords?.latitude, position?.coords?.longitude);
            },
            (error) => {
                // See error code charts below.
                Alert.alert('Map address Error', `${error.message}`)
                //console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, }
        );
    }
    const GetAddress = (latitude, longitude) => {
        Geocoder.init("AIzaSyA3ZlDDtq14fvyne4xX1eXDWn9QKsIRsjw");
        Geocoder.from(latitude, longitude).then(json => {
            const addressComponents = json.results[0].address_components;

            const address = json.results[0].formatted_address;
            const city = addressComponents.find(component =>
                component.types.includes("locality")
            )?.long_name || "City not found";

            const pincode = addressComponents.find(component =>
                component.types.includes("postal_code")
            )?.long_name || "Pincode not found";
          //  console.log(address, pincode, city);
            setLivelocationAddress({ Address: address, Pincode: pincode, City: city });
            //  setLocation({ address, city, pincode });
            setAdress(address);

            //  Alert.alert('map addressError', JSON.stringify(city))
        })
            .catch(error => Alert.alert('map addressError', JSON.stringify(error)));

    }
    useEffect(() => {
        getLocation();
    }, []);
    return (
        <View style={styles.container}>
            {region && (
                <>
                    <MapView
                        style={styles.map}
                        region={region}
                        showsUserLocation={true} // Show the user's location on the map
                    >
                        <Marker draggable coordinate={region} title="You are here" onDragEnd={(e) => GetAddress(e?.nativeEvent?.coordinate?.latitude, e?.nativeEvent?.coordinate?.longitude)} />
                    </MapView>

                    <View style={{ height: '35%', padding: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
                            <IconF name={'location-dot'} color={"#021265"} size={22} />
                            <Text style={{ marginTop: -4, fontSize: 18, opacity: 0.75, fontFamily: 'WorkSans-Bold', color: '#000000', }}> {LivelocationAddress?.City}</Text>
                        </View>
                        <Text style={{  fontSize: 14, opacity: 0.75, fontFamily: 'WorkSans-Medium', color: '#979797', }}>{LivelocationAddress?.Address}</Text>
                        <TouchableOpacity style={{ marginTop: 30, backgroundColor: '#021265', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 }}
                            onPress={() => {
                                //  console.log(props?.route?.params?.screen);
                                if (props?.route?.params?.screen == 'PropertyList') {

                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        currentLocation: LivelocationAddress
                                    }));
                                    navigation.push('PropertyFormSec');
                                } else if(props?.route?.params?.screen == 'Commercial'){
                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        currentLocation: LivelocationAddress
                                    }));
                                    navigation.push('InteriorFormSec');
                                }else if(props?.route?.params?.screen == 'Residential'){
                                    setGlobalState(prevState => ({
                                        ...prevState,
                                        currentLocation: LivelocationAddress
                                    }));
                                    navigation.push('InteriorFormThird');
                                }
                                else {
                                    navigation.push('PropertyManagment', { Livelocation: LivelocationAddress });
                                }
                            }}>
                            <Text style={{ fontSize: 16, fontFamily: 'WorkSans-SemiBold', color: '#FFFFFF', }}>Confirm Location</Text>
                        </TouchableOpacity>


                     
                    </View>
                </>

            )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '75%',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});