import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, images } from '../../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../auth/Storage';

const Chat = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [allChatUsers, setAllChatUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getUserData();
                if (user) {
                    setUserData(user);
                    setAllChatUsers(user._id)
                } else {
                    console.error("User data not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchChatUsers = async () => {
            if (!userData) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://192.168.42.252:5000/AllChatRooms`, {
                    params: {
                        userId: userData._id
                    }
                });

                if (response.status === 200) {
                    setAllChatUsers(response.data.users);
                    console.log(response.data.users)
                    setFilteredUsers(response.data.users);
                } else {
                    console.error('Error fetching contact:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchChatUsers();
        }
    }, [userData]);

    const handleSearch = (text) => {
        setSearch(text);
        const filteredUsers = allChatUsers.filter((users) =>
            users.userName.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('PersonalChat', {
                    userName: item.name, imageUrl: item.imageUrl, recipientId: item._id,
                })
            }
            style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 22,
                borderBottomColor: COLORS.secondaryWhite,
                borderBottomWidth: 1,
                paddingVertical: 10,
            }}
        >
            <Image
                source={{ uri: item.imageUrl }}
                resizeMode="contain"
                style={{
                    height: 42,
                    width: 42,
                    borderRadius: 25,
                }}
            />
            <View style={{ flexDirection: 'column', marginHorizontal: 15 }}>
                <Text style={{ ...FONTS.h4, marginBottom: 4 }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: '#808080' }}>
                    {item.bio}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginHorizontal: 22,
                            marginTop: 15,
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>Chats</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => console.log('Add Contacts')}>
                                <MaterialCommunityIcons
                                    name="message-badge-outline"
                                    size={20}
                                    color={COLORS.secondaryBlack}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginLeft: 12 }}
                                onPress={() => console.log('Add Contacts')}
                            >
                                <MaterialCommunityIcons
                                    name="playlist-check"
                                    size={20}
                                    color={COLORS.secondaryBlack}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            marginHorizontal: 22,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: COLORS.secondaryWhite,
                            height: 48,
                            marginVertical: 22,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                        }}
                    >
                        <Ionicons name="ios-search-outline" size={24} color={COLORS.black} />
                        <TextInput
                            style={{
                                width: '100%',
                                height: '100%',
                                marginHorizontal: 12,
                            }}
                            placeholder="Search Contact..."
                            value={search}
                            onChangeText={handleSearch}
                        />
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    ) : filteredUsers.length === 0 ? (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 50
                        }}>
                            <Text style={{ ...FONTS.h4, color: COLORS.secondaryGray }}>
                                you dont have any chats
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id} // Assuming _id is a unique identifier
                        />
                    )}
                </View>
            </PageContainer>
        </SafeAreaView>
    );
};

export default Chat;
