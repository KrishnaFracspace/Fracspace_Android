import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import React, { useState } from 'react';
import Font from 'react-native-vector-icons/Fontisto';
import { UploadOwnerShipData } from './Services/UserApi';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CostumerDetail() {
  const navigation = useNavigation();
  const [Email, setEmail] = useState('');
  const [PropertyId, setPropertyId] = useState('');
  const [Fraction, setFraction] = useState(0);
  const [FractionOwner, setFractionOwner] = useState(0);
  const [FractionPrice, setFractionPrice] = useState('');
  const [InstallmentAmount, setInstallmentAmount] = useState('');
  const [InstallmentDate, setInstallmentDate] = useState('');

  const handleUploadData = async () => {
    let payload = JSON.stringify({
      email: Email,
      propertyId: PropertyId,
      fraction: Fraction,
      fractionPrice: FractionPrice,
      numberOfOwners: FractionOwner,
      installmentDate: InstallmentDate,
      installmentAmount: InstallmentAmount,
    });
    try {
      let { data: res } = await UploadOwnerShipData(payload);

      if (res?.success) {
        navigation.navigate('MyProfile');
      }
    } catch (error) {
      if (error.response) {

        Alert.alert('Response error:', `${error?.response?.data?.message}`);
      } else if (error.request) {

        Alert.alert('Request error:', 'Please Check Your Internet Connection');
        // Alert.alert('Request error:', `${JSON.stringify(error)}`);
      } else {

        Alert.alert('Error:', `${error?.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
      <ScrollView style={{ padding: 20, backgroundColor: 'white' }}>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <Font name="email" size={22} color="black" />
                <TextInput
                  //editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={Email}
                  onChangeText={txt => {
                    setEmail(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              Email
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <TextInput
                  // editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={Fraction}
                  onChangeText={txt => {
                    setFraction(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              No. Of Fraction
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <TextInput
                  // editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={FractionPrice}
                  onChangeText={txt => {
                    setFractionPrice(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              Fraction Price
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <TextInput
                  // editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={PropertyId}
                  onChangeText={txt => {
                    setPropertyId(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              PropertyId
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <TextInput
                  //editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={FractionOwner}
                  onChangeText={txt => {
                    setFractionOwner(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              No. of Owner
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <TextInput
                  //editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={InstallmentAmount}
                  onChangeText={txt => {
                    setInstallmentAmount(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                  // color: 'Red' ,
                },
              ]}>
              Installment Amount
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.input}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  paddingLeft: 10,
                }}>
                <TextInput
                  // editable={false}
                  style={{ width: '90%', paddingLeft: 10, color: 'black' }}
                  placeholder=""
                  placeholderTextColor={'#000'}
                  value={InstallmentDate}
                  onChangeText={txt => {
                    setInstallmentDate(txt);
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.labelContainer,
              {
                top: -(height * 0.01),
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 16,
                },
              ]}>
              Installment Date
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleUploadData();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#043862',
            padding: 20,
            borderColor: '#043862',
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 30,
            marginBottom: 20,
          }}>
          <Text style={{ fontSize: 16, fontFamily: "Montserrat-SemiBold", color: 'white' }}>
            Submit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MyProfile');
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#AEAEAE',
            padding: 20,
            borderColor: '#AEAEAE',
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 0,
            marginBottom: 30
          }}>
          <Text style={{ fontSize: 16, fontFamily: "Montserrat-SemiBold", color: 'white' }}>
            Skip
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
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
});
