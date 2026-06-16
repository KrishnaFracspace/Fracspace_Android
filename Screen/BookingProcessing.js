import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  PayUPaymentVerify,
  CoOwnerBookingverification,
} from './Services/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingProcessing({ route }) {
  const navigation = useNavigation();
  const { txnId, property } = route.params;
  console.log("Property from prop: ",property);
  console.log("TxnId from prop: ",txnId);

  const hasProcessedRef = useRef(false);
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));  

  useEffect(() => {
    verifyAndBook();
  }, []);

  /* ---------------- VERIFY + BOOK ---------------- */
//   const verifyAndBook = async () => {
//     if (hasProcessedRef.current) return;
//     hasProcessedRef.current = true;

//     try {
//       /* ---------- VERIFY PAYMENT ---------- */
//       const { data: res } = await PayUPaymentVerify({ txnID: txnId });

//       if (res?.payment?.responseDetails?.status !== 'success') {
//         await AsyncStorage.removeItem('PENDING_TXN_ID');
//         navigation.replace('BookingFailure');
//         return;
//       }

//       /* ---------- BOOK FRACTION ---------- */
//       const bookingData = await bookFraction(res.payment);
//       await AsyncStorage.removeItem('PENDING_TXN_ID');

//       navigation.replace('BookingSuccess', {
//         bookingData,
//         paymentData: res.payment,
//         property,
//       });
//     } catch (error) {
//       Alert.alert(
//         'Payment Error',
//         'Unable to complete booking. Please contact support.'
//       );
//       await AsyncStorage.removeItem('PENDING_TXN_ID');
//       navigation.replace('BookingFailure');
//     }
//   };

//   const verifyAndBook = async () => {
//         if (hasProcessedRef.current) return;
//         hasProcessedRef.current = true;

//         try {
//             /* ---------- VERIFY PAYMENT ---------- */
//             const { data: res } = await PayUPaymentVerify({ txnID: txnId });

//             if (res?.payment?.responseDetails?.status !== 'success') {
//                 navigation.replace('BookingFailure');
//                 return;
//             }

//             /* ---------- BOOK FRACTION ---------- */
//             const bookingData = await bookFraction(res.payment);

//             navigation.replace('BookingSuccess', {
//                 bookingData,
//                 paymentData: res.payment,
//                 property,
//             });
//         } catch (error) {
//             Alert.alert(
//                 'Payment Error',
//                 'Unable to complete booking. Please contact support.'
//             );
//             navigation.replace('BookingFailure');
//         } finally {
//             // ✅ ALWAYS clear pending txn
//             await AsyncStorage.removeItem('PENDING_TXN_ID');
//         }
//     };

    const verifyAndBook = async () => {
        if (hasProcessedRef.current) return;
        hasProcessedRef.current = true;

        let attempts = 0;
        let verifiedPayment = null;

        while (attempts < 3 && !verifiedPayment) {
            try {
                attempts += 1;

                const { data: res } = await PayUPaymentVerify({ txnID: txnId });

                if (res?.payment?.responseDetails?.status === 'success') {
                    verifiedPayment = res.payment;
                    console.log("Response of Verify Payment api: ",res?.payment);
                    break;
                }

                // Payment not confirmed yet → wait & retry
                await delay(2000);
            } catch (error) {
                await delay(2000);
            }
        }

        if (!verifiedPayment) {
            console.log("Going to failure from booking processing (!verifiedPayment)")
            navigation.replace('BookingFailure', {txnId: txnId, property: property});
            return;
        }

        try {
            console.log("COmes to book fraction");
            const bookingData = await bookFraction(verifiedPayment);
            console.log("Goes tot booking success");
            navigation.replace('BookingSuccess', {
                bookingData,
                paymentData: verifiedPayment,
                property,
            });
        } catch (error) {
            Alert.alert(
                'Booking Failed',
                'Payment was successful but booking failed. Please contact support.'
            );
            console.log("Error in Verify and book: ",error?.response?.data || error?.response?.message);
            navigation.replace('BookingFailure', {txnId: txnId, property: property});
        } finally {
            // ✅ ALWAYS clear pending txn
            await AsyncStorage.removeItem('PENDING_TXN_ID');
        }
    };



  /* ---------------- BOOK FRACTION ---------------- */
//   const bookFraction = async (paymentData) => {
//     const amountInt = Math.round(Number(paymentData.amount));
//     const amountString = property.FC_Price;

//     const fracValue = parseInt(amountString.replace(/,/g, ""), 10);
    

//     const payload = {
//       propertyName: property.propertyName,
//       propertyId: property.propertyId,
//       email: property.email,
//       fractionValue: fracValue,
//       numberOfFractions: property.numberOfFractions,
//       totalBookingAmount: amountInt,
//       Price: property.Price,
//       FC_Price: property.FC_Price,
//       termsAndConditions: true,
//       payUpayment: [
//         {
//           txnId: paymentData.txnId,
//           amount: amountInt,
//           username: 'Test',
//           status: paymentData.responseDetails.status,
//           mihpayid: paymentData.responseDetails.mihpayid,
//         },
//       ],
//       bookingStatus: 'Success',
//       statusKey: 'BOOK12345',
//     };
//     console.log('Payload of Book Fraction: ',payload);

//     try{
//         const { data:res } = await CoOwnerBookingverification(payload);
//         console.log("Response from BookFraction: ",res);
//         return res?.data;
//     }catch(error){
//         console.log('Error in booking fraction : ',error?.response?.data || error?.response?.message);
//     }
//   };

    const bookFraction = async (paymentData) => {

        const amountInt = paymentData?.amount
            ? Math.round(Number(paymentData.amount.toString().replace(/,/g, "")))
            : 0;

        const fracValue = property?.FC_Price
            ? parseInt(property.FC_Price.replace(/,/g, ""), 10)
            : 0;

        const payload = {
            propertyName: property?.propertyName,
            propertyId: property?.propertyId,
            email: property?.email,
            fractionValue: fracValue,
            numberOfFractions: property?.numberOfFractions,
            totalBookingAmount: amountInt,
            Price: property?.Price,
            FC_Price: property?.FC_Price,
            termsAndConditions: true,
            payUpayment: [
            {
                txnId: paymentData?.txnId,
                amount: amountInt,
                username: 'Test',
                status: paymentData?.responseDetails?.status,
                mihpayid: paymentData?.responseDetails?.mihpayid,
            },
            ],
            bookingStatus: 'Success',
            statusKey: 'BOOK12345',
        };

        console.log('Payload of Book Fraction: ', payload);

        try {
            const { data: res } = await CoOwnerBookingverification(payload);
            console.log("Response from BookFraction: ", res);
            return res?.data;
        } catch (error) {
            console.log(
            'Error in booking fraction:',
            error?.response?.data || error?.response?.message
            );
        }
    };

    
  /* ---------------- UI ---------------- */
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
