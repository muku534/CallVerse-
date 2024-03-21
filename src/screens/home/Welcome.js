import { View, Text, Pressable, Image, Alert, SafeAreaView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../../../constants/colors';
import { FONTS, SIZES, images } from '../../../constants';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const Welcome = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [randomNumber, setRandomNumber] = useState(null);
    const [generatedNumber, setGeneratedNumber] = useState(false);

    const checkIfNumberGenerated = async () => {
        try {
            const flag = await AsyncStorage.getItem('generatedNumber');
            if (flag === 'true') {
                const storedNumber = await AsyncStorage.getItem('randomNumber');
                setRandomNumber(storedNumber);
                setGeneratedNumber(true);
            }
        } catch (error) {
            console.log('Error checking if number is generated:', error);
        }
    };

    const handleGenerateNumber = async () => {
        if (!generatedNumber) {
            try {
                const response = await axios.post(`http://192.168.42.252:5000/GenerateNumber`);
                const newNumber = response.data.randomNumber;

                // Store the number in AsyncStorage on the user's device
                await AsyncStorage.setItem('randomNumber', newNumber);
                await AsyncStorage.setItem('generatedNumber', 'true');

                setRandomNumber(newNumber);
                setGeneratedNumber(true);
                console.log('Number stored successfully.');

                // Now, show the new number in an Alert
                Alert.alert('Your Random Number', newNumber, [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('AddProfile', { randomNumber: newNumber });
                        },
                    },
                ]);
            } catch (error) {
                console.log('Error generating or storing number:', error);
                Alert.alert('Error', 'Failed to generate or store number.');
            }
        } else {
            Alert.alert('Number Already Generated', 'You have already generated a number.');
        }
    };

    const deleteNumber = async () => {
        try {
            await AsyncStorage.removeItem('randomNumber');
            await AsyncStorage.removeItem('generatedNumber');
            console.log('Number deleted successfully.');
            setRandomNumber(null);
            setGeneratedNumber(false);
        } catch (error) {
            console.log('Error deleting number:', error);
        }
    };

    const handleDeleteNumber = () => {
        Alert.alert('Delete Number', 'Are you sure you want to delete the number?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: deleteNumber,
            },
        ]);
    };

    useEffect(() => {
        checkIfNumberGenerated();
    }, []);


    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.primary]}
        >
            <SafeAreaView >
                <View style={styles.container}>
                    <View>
                        <Image
                            source={require("../../../assets/images/hero1.jpg")}
                            style={styles.image1}
                        />

                        <Image
                            source={require("../../../assets/images/hero3.jpg")}
                            style={styles.images2}
                        />

                        <Image
                            source={require("../../../assets/images/hero3.jpg")}
                            style={styles.images3}
                        />

                        <Image
                            source={require("../../../assets/images/hero2.jpg")}
                            style={styles.image4}
                        />
                    </View>

                    {/* content  */}

                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>Let's Get</Text>
                        <Text style={styles.text2}>Started</Text>

                        <View style={styles.sloganContainer}>
                            <Text style={styles.sloganText}>Connect with each other with chatting</Text>
                            <Text style={styles.sloganText}>Calling, Enjoy Safe and private texting</Text>
                        </View>

                        <Button
                            title="Join Now"
                            onPress={handleGenerateNumber}
                            style={styles.Button}
                        />

                        {/* <Button onPress={handleDeleteNumber} title="Delete Number" /> */}

                        <View style={styles.linkContainer}>
                            <Text style={styles.lnikText}>Already have an account ?</Text>
                            <Pressable
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={styles.link}>Login</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: COLORS.secondaryWhite
    },
    image1: {
        height: 100,
        width: 100,
        borderRadius: 20,
        position: "absolute",
        top: 10,
        transform: [
            { translateX: 20 },
            { translateY: 50 },
            { rotate: "-15deg" }
        ]
    },
    images2: {
        height: 100,
        width: 100,
        borderRadius: 20,
        position: "absolute",
        top: -30,
        left: 100,
        transform: [
            { translateX: 50 },
            { translateY: 50 },
            { rotate: "-5deg" }
        ]
    },
    images3: {
        width: 100,
        height: 100,
        borderRadius: 20,
        position: "absolute",
        top: 130,
        left: -50,
        transform: [
            { translateX: 50 },
            { translateY: 50 },
            { rotate: "15deg" }
        ]
    },
    image4: {
        height: 200,
        width: 200,
        borderRadius: 20,
        position: "absolute",
        top: 110,
        left: 100,
        transform: [
            { translateX: 50 },
            { translateY: 50 },
            { rotate: "-15deg" }
        ]
    },

    contentContainer: {
        paddingHorizontal: 22,
        position: "absolute",
        top: 400,
        width: "100%"
    },
    text: {
        fontSize: 50,
        fontWeight: '800',
        color: COLORS.white
    },
    text2: {
        fontSize: 46,
        fontWeight:'800',
        // fontWeight: 800,
        color: COLORS.white
    },
    sloganContainer: {
        marginVertical: 12
    },
    sloganText: {
        fontSize: 16,
        color: COLORS.white,
        marginVertical: 4
    },
    Button: {
        marginTop: 5,
        width: "100%"
    },
    linkContainer: {
        flexDirection: "row",
        marginTop: 5,
        justifyContent: "center"
    },
    lnikText: {
        fontSize: 16,
        color: COLORS.white
    },
    link: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight:'bold',
        // fontWeight: "bold",
        marginLeft: 4
    }
})

export default Welcome