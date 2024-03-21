import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native'
import PageContainer from '../../components/PageContainer'
import { COLORS, FONTS, images } from '../../../constants'
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { getUserData } from '../auth/Storage'

const More = ({ navigation }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUserData();
            if (user) {
                setUserData(user);
                console.log("This is the userData:", user)
            }
        }

        fetchUserData();
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuOption = (option) => {
        if (option === 'viewProfile') {
            console.log('View Profile');
        } else if (option === 'removeProfile') {
            console.log('Remove Profile');
        }
        toggleMenu();
    };



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={{ ...FONTS.h4 }}>Settings</Text>
                    </View>

                    <View style={styles.userInformation}>

                        <View style={styles.imageContainer}>
                            <Image source={{ uri: userData?.imageUrl }} style={styles.userImage} />
                        </View>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.nameText}>
                                {userData?.name}
                            </Text>
                            <Text style={styles.randomNumber}> {userData?.randomNumber} </Text>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate("AddProfile")} style={styles.rightArrow}>
                            <MaterialIcons name='keyboard-arrow-right' size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("AddProfile")}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <AntDesign name='user'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Account
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Chat')}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <Ionicons
                                    name='chatbubble-ellipses-outline'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Chat
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleMenu}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <Entypo name='light-down'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Appearance
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <Modal visible={showMenu} transparent animationType="fade">
                            <TouchableOpacity
                                style={styles.model}
                                onPress={toggleMenu}
                            >
                                <View style={{
                                    backgroundColor: COLORS.white, borderRadius: 8, padding: 16, width: 250,
                                    height: 150,
                                }}>
                                    <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => handleMenuOption('viewProfile')}>
                                        <Text style={{ ...FONTS.body3 }}>Light</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => handleMenuOption('removeProfile')}>
                                        <Text style={{ ...FONTS.body3 }}>Dark</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        {/* <TouchableOpacity onPress={() => {
                            console.log("presser")
                        }}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <Ionicons name='notifications-outline'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Notifications
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            console.log("presser")
                        }}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <MaterialCommunityIcons name='shield-lock-open-outline'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Privacy
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            console.log("presser")
                        }}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <AntDesign name='folder1'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Data usage
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            console.log("presser")
                        }}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <Ionicons name='help-circle-outline'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Help
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            console.log("presser")
                        }}
                            style={styles.TouchableOpacity}
                        >
                            <View style={styles.menuItems}>
                                <MaterialCommunityIcons name='email-outline'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={styles.menuText}>
                                    Invite Your Friends
                                </Text>
                            </View>
                            <MaterialIcons
                                name='keyboard-arrow-right'
                                size={24}
                                color={COLORS.black} />
                        </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}
                            style={styles.logOutContainer}
                        >
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 22
                            }}>
                                <MaterialCommunityIcons name='logout-variant'
                                    size={24}
                                    color={COLORS.black} />
                                <Text style={{ ...FONTS.h4, marginLeft: 12, color: 'red' }}>
                                    Logout
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 22,
        marginVertical: 22,
        marginTop: 15,
    },
    userInformation: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 28
    },
    imageContainer: {
        height: 40,
        width: 40,
        borderRadius: 34,
        backgroundColor: COLORS.secondaryWhite,
        alignItems: "center",
        justifyContent: "center"
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
        marginVertical: 48
    },
    userNameContainer: {
        flexDirection: "column",
        marginHorizontal: 22
    },
    nameText: {
        ...FONTS.h4,
        marginVertical: 6
    },
    randomNumber: {
        ...FONTS.body3,
        color: COLORS.gray
    },
    rightArrow: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        marginLeft: 55
    },
    menuContainer: {
        marginTop: 32
    },
    TouchableOpacity: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 22,
        paddingVertical: 12
    },
    menuItems: {
        flexDirection: "row",
        alignItems: "center"
    },
    menuText: {
        ...FONTS.h4,
        marginLeft: 12
    },
    model: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    logOutContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginHorizontal: 22,
        paddingVertical: 12,
        alignItems: "center"
    }
})

export default More