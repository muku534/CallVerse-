import { View, Text, TouchableOpacity, Modal, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import PageContainer from '../../components/PageContainer';
import PageTitle from '../../components/PageTitle';
import { COLORS, FONTS, SIZES, } from '../../../constants';
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../auth/Storage'
import axios from "axios"

const AddContact = ({ navigation }) => {
    const [contactName, setContactName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUserData();
            if (user) {
                setUserData(user);
                console.log("This is the userData:",)
            }
        }

        fetchUserData();
    }, []);


    const handleSaveContact = async () => {
        setIsLoading(true);

        try {

            // User exists, proceed to add the contact
            const Response = await axios.post(`http://192.168.42.252:5000/AddContacts`, {
                randomNumber: phoneNumber,
                userRandomNumber: userData.randomNumber,
                contactName
            });

            console.log(Response.data)
            // Clear input fields after successful contact addition
            setContactName('');
            setPhoneNumber('');

            // Trigger a refresh of the Contact screen
            setShouldRefresh(true);


            // Navigate to the BottomTabNavigation screen
            navigation.navigate('BottomTabNavigation');
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
        }
    }


    return (
        <SafeAreaView >
            <PageContainer>
                <PageTitle title="New Contact" onPress={() => navigation.navigate("BottomTabNavigation")} />
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        {/* <Text style={{
                            fontSize: 16,
                            fontWeight: '400',
                            marginTop: 22,
                        }}>Display name</Text> */}

                        <View style={styles.inputContainer}>
                            <AntDesign name="user" size={26} color="#111" style={{ marginHorizontal: 10 }} />
                            <TextInput
                                placeholder='Name'
                                placeholderTextColor={COLORS.secondaryGray}
                                keyboardType='default'
                                style={styles.TextInput}
                                value={contactName}
                                onChangeText={setContactName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="md-call-outline" size={26} color="#111" style={{ marginHorizontal: 10 }} />

                            <TextInput
                                placeholder='Enter the Number '
                                placeholderTextColor={COLORS.secondaryGray}
                                keyboardType='numeric'
                                style={styles.TextInput}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>

                        <Button
                            title="Save"
                            filled
                            onPress={handleSaveContact}
                            isLoading={isLoading}
                            style={{
                                marginTop: 15,
                                // marginVertical: 55,
                                marginBottom: 4,
                            }}
                        />
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 22,
        paddingVertical: 0,
    },
    inputContainer: {
        width: "100%",
        height: 48,
        marginVertical: 12,
        // borderColor: COLORS.black,
        // borderWidth: 1,
        // borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        marginBottom: 26,
        // marginHorizontal: 12
    },
    TextInput: {
        width: "90%",
        height: 54,
        fontSize: 14,
        backgroundColor: COLORS.secondaryWhite,
        paddingLeft: 22,
        borderRadius: SIZES.padding,
        paddingLeft: SIZES.padding,
        color: '#111'
    },

})

export default AddContact