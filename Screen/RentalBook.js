import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
const { width, height } = Dimensions.get('window');
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function RentalBook(props) {

  const [property, setProperty] = useState(props?.route?.params?.property);
  const [Terms, setTerms] = useState(false);
  const [Available, setAvailable] = useState(
    props?.route?.params?.property?.AvailableFractions,
  );
  const [checkout, setCheckout] = useState('05/16/2024');
  const [checkin, setCheckin] = useState('05/16/2024');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [Number, setNumber] = useState(
    props?.route?.params?.property?.Type == '4 Cottages' ? 4 : 1,
  );
  const IncrementCount = () => {
    if (Number < Available) {
      setNumber(Number + 1);
    }
  };

  const DecrementCount = () => {
    if (Number > 1) {
      setNumber(Number - 1);
    }
  };
  const hideDatePicker = () => {
    setOpen(false);
    setOpen1(false);
  };

  const handleConfirm = date => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Month is zero-indexed, so add 1
    var day = date.getDate();
    var formattedDate = year + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

    setCheckin(formattedDate);
    hideDatePicker();
  };
  const handleConfirmOut = date => {

    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Month is zero-indexed, so add 1
    var day = date.getDate();
    var formattedDate = year + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

    //  handleSiteVist(new Date(date).toLocaleString());
    setCheckout(formattedDate);
    hideDatePicker();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>

      <View
        style={{ backgroundColor: 'white', padding: 20, width: '100%', flex: 1 }}>
        <Text
          style={{ color: '#252B5C', fontSize: 20, fontFamily: 'OpenSans-Bold' }}>
          Hurry ! Book property for Rent
        </Text>
        <View
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 20,
            marginVertical: 20,
            padding: 20,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Property Name
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {property?.name}
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                  marginTop: 10,
                }}>
                Property Amount
              </Text>

              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Booking Amount for {property?.Type}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                  marginTop: 10,
                }}>
                {'\u20B9'} {property?.Price}
              </Text>

              <Text
                style={{
                  color: '#1E2135',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {property?.Type == '4 Cottages'
                  ? `${'\u20B9' + '' + 40000}`
                  : `${'\u20B9' + '' + 10000}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', marginVertical: 20 }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              // backgroundColor: '#0B0B45',
              backgroundColor: '#F5F5F5',
              paddingVertical: 5,
            }}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 14,
                  /// marginTop: 20
                },
              ]}>
              {' '}
              No of Nights
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 2 }}>
            <TouchableOpacity
              onPress={() => {
                DecrementCount();
              }}
              style={{
                alignItems: 'center',
                // backgroundColor: '#0B0B45',
                backgroundColor: '#043862',
                // borderRadius: 12,
                // padding: 5,
                // marginVertical: 8,
                flex: 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  fontFamily: 'Poppins-ExtraBold',
                }}>
                -
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                // backgroundColor: '#0B0B45',
                backgroundColor: '#F5F5F5',
                // borderRadius: 12,
                //padding: 5,
                //marginVertical: 8,
                flex: 1,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {Number}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                IncrementCount();
              }}
              style={{
                alignItems: 'center',
                // backgroundColor: '#0B0B45',
                backgroundColor: '#043862',
                // borderRadius: 12,
                // padding: 5,
                // marginVertical: 8,
                flex: 1,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          marginVertical: 20,
          justifyContent: 'space-between',
        }}>
          <Text
            style={[
              styles.label,
              {
                fontSize: 14,
                /// marginTop: 20
              },
            ]}>
            {' '}
            Check In Date
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 30, paddingVertical: 5 }}
            onPress={() => {
              setOpen1(true);
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
              }}>
              {checkout}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginVertical: 20,
            justifyContent: 'space-between',
          }}>
          <Text
            style={[
              styles.label,
              {
                fontSize: 14,
                /// marginTop: 20
              },
            ]}>
            {' '}
            Check Out Date
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 30, paddingVertical: 5 }}
            onPress={() => {
              setOpen(true);
            }}>
            <Text
              style={{
                color: '#1E2135',
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
              }}>
              {checkin}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 20,
            marginTop: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 20,
          }}>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 15,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Total Booking Amount
          </Text>
          <Text
            style={{
              color: '#1E2135',
              fontSize: 15,
              fontFamily: 'Poppins-SemiBold',
            }}>
            {'\u20B9'}
            {Number * property?.BookingAmount || property?.BookingAmount}
          </Text>
        </View>
        <TouchableOpacity
          // disabled={!Terms}
          onPress={() => { }}
          style={{
            alignItems: 'center',
            backgroundColor: '#043862',
            padding: 20,

            borderRadius: 10,
            marginTop: 30,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-SemiBold',
              color: 'white',
            }}>
            Pay Now
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={open}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          isVisible={open1}
          mode="datetime"
          onConfirm={handleConfirmOut}
          onCancel={hideDatePicker}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  iphone13Mini9: {
    backgroundColor: '#f5f7fe',
    //flex: 1,
    // overflow: 'hidden',
    //width: '100%',
  },
  labelContainer: {
    position: 'absolute',
    left: width * 0.04,
    // top: -(height*0.2),
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',

    // color: 'black'
  },
  input: {
    // marginTop:20,
    padding: 10,
    borderColor: '#B9C4CA',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },

  maskGroupIconLayout: {
    // width: 110,
    // height: 110,
    width: width * 0.3,
    height: height * 0.16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 18,
    width: 18,
    borderColor: '#043862',
    borderWidth: 2,
    backgroundColor: '#ffff',
    borderRadius: 2,
    alignItems: 'center',
  },
});
