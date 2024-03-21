import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images, FONTS, COLORS } from '../../../constants'
import { Fontisto, Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'

const VoiceCall = () => {
    return (
        <ImageBackground source={require('../../../assets/images/ChatBg.jpg')}
            style={{ flex: 1, resizeMode: 'cover' }}>

            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{
                        marginTop: 110,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Image source={images.user4}
                            resizeMode='cover'
                            style={{
                                height: 140,
                                width: 140,
                                borderRadius: 100,
                                // marginLeft: 5,
                            }} />
                    </View>
                    <View style={{
                        alignItems: 'center',
                        marginVertical: 18,
                        paddingTop: 18
                    }}>
                        <Text style={{ fontSize: 18, color: COLORS.gray, }}>Calling</Text>
                    </View>
                    <View style={{
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 28, color: COLORS.gray, fontWeight: 'bold' }}>Naresh Sharma</Text>
                    </View>

                    {/* <View style={{ flexDirection: 'row',
                     justifyContent: 'space-evenly',
                      alignItems: 'center', 
                      backgroundColor: COLORS.secondaryGray, 
                      borderRadius: 50, 
                      marginHorizontal:55,
                      marginTop:120,
                      padding:8 }}>

                        <Ionicons name="videocam" size={30} color="white" />

                        <Ionicons name="person-add" size={25} color="white" />

                        <Ionicons name="recording" size={30} color="white" />

                        <FontAwesome name="wechat" size={30} color="white" />
                    </View> */}

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginTop: 150,
                        paddingTop: 55
                    }}>
                        <View style={{
                            height: 50,
                            width: 50,
                            backgroundColor: COLORS.secondaryGray,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Fontisto name="volume-up" size={20} color="white" />
                        </View>
                        <View style={{
                            height: 70,
                            width: 70,
                            backgroundColor: 'red',
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <MaterialIcons name="call-end" size={43} color="white" />
                        </View>
                        <View style={{
                            height: 50,
                            width: 50,
                            backgroundColor: COLORS.secondaryGray,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ionicons name="mic-off" size={32} color="white" />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground >
    )
}

export default VoiceCall