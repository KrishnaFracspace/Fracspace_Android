import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import WalletAmount from './WalletAmount';
// import PaidSuccessfully from './PaidSuccessfully';
import WalletAmount from '../Version2_O/WalletAmount';
import PaidSuccessfully from '../Version2_O/PaidSuccessfully';
import Property from '../Property';
import Book from '../Book';
import Enquirenew from '../Enquirenew';
import Review from '../Review';


const Stack = createNativeStackNavigator();

export default function WalletStack() {
  return (
    <Stack.Navigator initialRouteName='WalletAmount' screenOptions={{headerShown: false}}>
      <Stack.Screen name="WalletAmount" component={WalletAmount} />
      <Stack.Screen name="PaidSuccessfully" component={PaidSuccessfully} />

      {/* <Stack.Screen name="Property" component={Property} />
      <Stack.Screen name="Book" component={Book} />
      <Stack.Screen name="Enquirenew" component={Enquirenew} />
      <Stack.Screen name="Review" component={Review} /> */}
    </Stack.Navigator>
  );
}