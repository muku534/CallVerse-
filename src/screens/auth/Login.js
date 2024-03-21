import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../../constants';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const sendOtpEmail = async () => {
        try {
            // Send a request to the API to initiate the OTP email
            const response = await axios.post(`http://192.168.42.54:5000/signin`, {
                randomNumber: phoneNumber,
            });

            if (response.data.success) {
                // OTP email sent successfully
                setShowOtpInput(true);
                Alert.alert('OTP Sent', 'Please check your email for the OTP.');
            } else {
                // Handle API response indicating failure
                Alert.alert('Error', 'Failed to send OTP email. Please try again.');
            }
        } catch (error) {
            // Handle API call error
            console.error('Error sending OTP email:', error);
            Alert.alert('Error', 'Failed to send OTP email. Please try again.');
        }
    };

    const verifyOtp = async () => {
        try {
            // Send a request to the API to verify the OTP
            const response = await axios.post(`http://192.168.42.54:5000/verifyOTP`, {
                randomNumber: phoneNumber,
                otp: parseInt(otp),
            });


            // console.log('Response from OTP verification API:', response.data);


            if (response.data.success) {
                // OTP verification successful
                const { message, token, userData } = response.data;

                if (message === "verified") {
                    // Save authentication token to AsyncStorage
                    await AsyncStorage.setItem('authToken', token);

                    // Check if userData is defined before saving it
                    // console.log('userData to be stored:', userData, token);
                    if (userData) {
                        await AsyncStorage.setItem('userData', JSON.stringify(userData, token));
                        navigation.navigate('BottomTabNavigation', { randomNumber: phoneNumber });
                    } else {
                        // Handle if userData is null or undefined
                        console.error('userData is null or undefined');
                        Alert.alert('Error', 'Failed to store user data.');
                    }


                } else {
                    // Handle invalid OTP
                    Alert.alert('Error', 'Invalid OTP. Please try again.');
                }
            } else {
                // Handle OTP verification failure
                Alert.alert('Error', 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            // Handle API call error
            console.error('Error verifying OTP:', error);
            Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <View style={styles.imageContainer}>
                        <Image source={require('../../../assets/images/9233852_4112338.jpg')}
                            style={styles.image} />
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Hi Welcome Back! 👋</Text>
                            <Text style={styles.welcomeText2}>Hello again, you have been missed!</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.lable}>Phone Number</Text>
                            <View style={styles.TextInput}>
                                <TextInput
                                    maxLength={10}
                                    placeholder='Enter your Phone Number'
                                    placeholderTextColor={COLORS.black}
                                    keyboardType='numeric'
                                    style={{ width: '100%' }}
                                    value={phoneNumber}
                                    onChangeText={text => setPhoneNumber(text)}
                                />
                            </View>
                        </View>
                        {showOtpInput && (
                            <View style={styles.inputContainer}>
                                <Text style={styles.lable}>OTP</Text>
                                <View style={styles.TextInput}>
                                    <TextInput
                                        maxLength={6}
                                        placeholder='Enter OTP'
                                        placeholderTextColor={COLORS.black}
                                        keyboardType='numeric'
                                        style={{ width: '100%' }}
                                        value={otp}
                                        onChangeText={text => setOtp(text)}
                                    />
                                </View>
                            </View>
                        )}
                        {!showOtpInput ? (
                            <Button
                                title='Send OTP'
                                filled
                                onPress={sendOtpEmail}
                                style={styles.Button}
                            />
                        ) : (
                            <Button
                                title='Verify OTP'
                                filled
                                onPress={verifyOtp}
                                style={styles.Button}
                            />
                        )}
                        <View style={styles.linkContainer}>
                            <Text style={styles.linkText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.linkbutton}>
                                <Text style={styles.link}>Generate New Number</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        marginHorizontal: 22,
        height: '30%'
    },
    image: {
        width: SIZES.width * 0.8,
        height: SIZES.width * 0.8,
        marginVertical: 10
    },
    contentContainer: {
        flex: 1,
        marginHorizontal: 22
    },
    welcomeContainer: {
        marginVertical: 22
    },
    welcomeText: {
        fontSize: 22,
        // fontWeight: 'bold',
        marginVertical: 12,
        color: COLORS.black
    },
    welcomeText2: {
        fontSize: 16,
        color: COLORS.black
    },
    inputContainer: {
        marginBottom: 12
    },
    lable: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8
    },
    TextInput: {
        width: '100%',
        height: 48,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22
    },
    Button: {
        marginTop: 15,
        marginBottom: 4
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15
    },
    linkText: {
        fontSize: 16,
        color: COLORS.black
    },
    linkbutton: {
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    link: {
        ...FONTS.body4,
        color: COLORS.green
    }


})

export default Login;
