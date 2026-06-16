import React, { useContext } from 'react';
import WalletStack from './WalletStack';
import ProfileVerification from '../Version2_O/ProfileVerification';
import { AppContext } from '../Context/AppContext';

export default function VerificationOrWallet({ navigation }) {
  const {globalState} = useContext(AppContext); 

  if (globalState?.userDetails?.verification) {
    return <WalletStack />;
  }

  return <ProfileVerification />;
}