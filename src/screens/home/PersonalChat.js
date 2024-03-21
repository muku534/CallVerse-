import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, } from 'react-native';
import { COLORS, FONTS } from '../../../constants';
import { StatusBar } from 'expo-status-bar';
import { Feather, Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Bubble, GiftedChat, Send, Actions, InputToolbar, Composer } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../auth/Storage';
import * as ImagePicker from 'expo-image-picker';
import messaging from '@react-native-firebase/messaging';

const PersonalChat = ({ route, navigation }) => {
    const { userName, imageUrl, recipientId } = route.params;

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [chatRoom, setChatRoom] = useState(null);

    const socket = useMemo(() => io('http://192.168.42.252:5000'), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userData && chatRoom) {
                    // Retrieve messages from AsyncStorage
                    const storedMessages = await AsyncStorage.getItem(`chatMessages_${chatRoom}`);
                    const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];

                    // Sort the messages by timestamp in ascending order (oldest to newest)
                    const sortedMessages = existingMessages.sort((a, b) => a.createdAt - b.createdAt);

                    // Reverse the order to display them in descending order (newest to oldest)
                    const reversedMessages = sortedMessages.reverse();

                    // Update the state with sorted messages
                    setMessages(reversedMessages);

                    // Emit a 'getMessages' event to request existing messages from the server
                    socket.emit('getMessages', { sender: userData._id, recipient: recipientId });
                }
            } catch (error) {
                console.error('Error fetching and storing messages:', error);
            }
        };

        fetchData();
    }, [userData, chatRoom, recipientId, socket]);


    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUserData();
            if (user) {
                setUserData(user);
            }
        };
        fetchUserData();
    }, []);


    useEffect(() => {
        // Generate or retrieve the chat room name
        if (userData) {
            const room = generateChatRoomName(userData._id, recipientId);
            setChatRoom(room);
            socket.emit('joinRoom', { sender: userData._id, recipient: recipientId });
        }

    }, [userData, recipientId, socket]);

    useEffect(() => {
        if (userData) {
            socket.on('message', (newMessage) => {
                if (newMessage.room === chatRoom) {

                    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));

                    // // Store the updated messages in local storage
                    // storeChatMessages(chatRoom, messages.concat(newMessage));
                }
            });
        }
    }, [chatRoom, userData, messages, socket]);

    // Function to handle image selection
    const pickImage = async () => {
        try {
            const options = {
                title: 'Select Image',
                mediaType: 'photo', // Allow selecting images only
                maxWidth: 800,
                maxHeight: 600,
                quality: 1,
            };

            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && !result.error && result.assets && result.assets.length > 0) {
                const selectedAsset = result.assets[0];
                const { uri } = selectedAsset;

                // Convert the selected image to base64
                const base64Image = await fetch(uri)
                    .then((response) => response.blob())
                    .then((blob) => new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    }));

                setSelectedImage(base64Image); // Set the selected image URI
                // Send the selected image to the server
                socket.emit('send', {
                    sender: userData._id,
                    recipient: recipientId,
                    image: base64Image,
                });
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };

    const onSend = useCallback(async (newMessages = []) => {
        if (userData) {
            const room = chatRoom;

            const currentUser = {
                _id: userData._id,
            };

            const newMessage = {
                ...newMessages[0],
                user: currentUser,
            };

            // // Optimistically append the new message to the state
            // setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
            setMessages((previousMessages) => [...previousMessages, newMessage]);

            // Check if the message contains an image URL (for image messages)
            const isImageMessage = newMessages[0].image !== undefined;

            if (isImageMessage) {
                // If it's an image message, set the `image` property
                newMessage.image = selectedImage;

                // Reset the selected image after sending
                setSelectedImage(null);
            }

            // Send the new message to the server
            socket.emit('send', {
                sender: userData._id,
                recipient: recipientId,
                message: isImageMessage ? '' : newMessages[0].text,
                room,
                image: isImageMessage ? newMessages[0].image : null,
            });

            // Send a push notification to the recipient
            sendPushNotificationToRecipient(newMessages[0].text, recipientId);

            // Store the updated messages in AsyncStorage
            await storeChatMessages(chatRoom, [...messages, newMessage]);
        }
    }, [userData, recipientId, chatRoom, messages, socket, selectedImage]);

    const sendPushNotificationToRecipient = async (messageText, recipientId) => {
        try {
            // Retrieve the recipient's FCM token from the server
            const response = await fetch('http://192.168.42.252:5000/getFcmToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientId }), // Send recipientId to the server to fetch the FCM token
            });

            if (!response.ok) {
                console.error('Failed to fetch recipient FCM token');
                return;
            }

            const recipientFcmToken = await response.json();

            if (recipientFcmToken) {
                const messagePayload = {
                    notification: {
                        title: 'New Message',
                        body: `You have received a new message from ${userData.userName}`,
                    },
                    data: {
                        sender: userData._id,
                        message: messageText, // You can include any additional data you want to send with the notification
                    },
                    token: recipientFcmToken,
                };

                // Send the push notification
                const notificationResponse = await admin.messaging().send(messagePayload);
                console.log('Notification sent successfully:', notificationResponse);
            } else {
                console.log('Recipient FCM token not found.');
            }
        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    };


    const clearChatRoomAndMessages = async () => {
        try {
            // Remove chat messages
            await AsyncStorage.removeItem(`chatMessages_${chatRoom}`);

            // Optionally, you can remove the chat room entry as well
            // await AsyncStorage.removeItem(`chatRoom_${chatRoom}`);

            // Clear the messages in the state
            setMessages([]);

            console.log(`Chat room and messages for room ${chatRoom} deleted.`);
        } catch (error) {
            console.error(`Error deleting chat room and messages for room ${chatRoom}:`, error);
        }
    };

    const renderSend = (props) => (
        <TouchableOpacity onPress={() => onSend(props)}>
            <Send {...props}>
                <View style={{ borderRadius: 30 }}>
                    <View
                        style={{
                            height: 42,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 45,
                            borderRadius: 30,
                            borderWidth: 1,
                            borderColor: COLORS.gray,
                            backgroundColor: COLORS.darkGreeen,
                            marginRight: 10,
                            // marginBottom: 5,
                        }}
                    >
                        <FontAwesome name="send" size={18} color={COLORS.white} />
                    </View>
                </View>
            </Send>
        </TouchableOpacity>
    );


    const renderInputToolbar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    marginBottom: 5,
                }}
                primaryStyle={{ justifyContent: 'center' }}
            >
                <Composer
                    {...props}
                    textInputStyle={{
                        backgroundColor: COLORS.black,
                        color: COLORS.secondaryBlack,
                        borderRadius: 22,
                        borderWidth: 1,
                        borderColor: COLORS.gray,
                        marginRight: 6,
                        paddingHorizontal: 12,
                    }}
                />
                <Send {...props} />
                <renderActions {...props} />
            </InputToolbar>
        );
    };

    const CustomActions = (props) => {
        return (
            <FontAwesome name="camera" size={24} color="black" />
        );
    };

    const renderActions = (props) => (
        <Actions
            {...props}
            options={{
                'Choose From Library': () => pickImage(),
            }}
            icon={() => <CustomActions />}
        />
    );


    // Inside the renderMessageImage function:
    const renderMessageImage = (props) => {
        const { currentMessage } = props;

        if (currentMessage.image) {
            console.log('Current Message Image URI:', currentMessage.image); // Debugging
            return (
                <Image
                    {...props}
                    resizeMode="contain"
                    style={{ width: 200, height: 150, borderRadius: 8 }}
                    source={{ uri: `data:image/jpeg;base64,${currentMessage.image}` }} // Render base64 image
                />
            );
        } else if (selectedImage) {
            console.log('Selected Image URI:', selectedImage); // Debugging
            // Display the locally selected base64 image
            return (
                <Image
                    {...props}
                    resizeMode="contain"
                    style={{ width: 200, height: 150, borderRadius: 8 }}
                    source={{ uri: selectedImage }} // Render base64 image
                />
            );
        }

    };


    const renderBubble = (props) => {
        const { currentMessage } = props;
        // Add debugging logs if needed
        console.log('Rendering bubble for currentMessage:', currentMessage.image);

        const bubbleStyle = {
            right: {
                backgroundColor: COLORS.green,
            },
        };

        const textStyle = {
            right: {
                color: COLORS.black,

            },
        };

        return (
            <Bubble
                {...props}
                wrapperStyle={bubbleStyle}
                textStyle={textStyle}
            >
                {currentMessage.image ? ( // Check if the message contains an image
                    <Image
                        source={{ uri: currentMessage.image }}
                        style={{ width: 200, height: 200 }} // Adjust the size as needed
                    />
                ) : null}
                {renderMessageImage({ currentMessage })}

            </Bubble>
        );
    };


    const storeChatMessages = async (room, messagesToStore) => {
        try {
            await AsyncStorage.setItem(`chatMessages_${room}`, JSON.stringify(messagesToStore));
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
        }
    };

    const generateChatRoomName = (userId1, userId2) => {
        const sortedUserIds = [userId1, userId2].sort();
        return `${sortedUserIds[0]}-${sortedUserIds[1]}`;
    };

    return (
        <ImageBackground
            source={require('../../../assets/images/wallpaper.webp')}
            style={{ flex: 1 }} resizeMode='cover'
        >
            <SafeAreaView style={{ flex: 1, color: COLORS.secondaryWhite }}>
                <StatusBar style="light" backgroundColor={COLORS.darkGreeen} />
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 22,
                            backgroundColor: COLORS.darkGreeen,
                            marginVertical: 22,
                            height: 60,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Contacts')}
                                style={{ marginLeft: -10 }}
                            >
                                <MaterialIcons
                                    name="keyboard-arrow-left"
                                    size={32}
                                    style={{ color: COLORS.secondaryWhite }}
                                />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: imageUrl }}
                                resizeMode="contain"
                                style={{
                                    height: 35,
                                    width: 35,
                                    borderRadius: 25,
                                    marginLeft: 5,
                                }}
                            />
                            <Text style={{ ...FONTS.h4, marginLeft: 8, color: COLORS.secondaryWhite }}>{userName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TouchableOpacity onPress={clearChatRoomAndMessages}>
                                <Entypo name="dots-three-vertical" size={18} style={{ color: COLORS.secondaryWhite }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <GiftedChat
                        messages={messages}
                        onSend={(newMessages) => onSend(newMessages)}
                        user={{
                            _id: userData ? userData._id : 1,
                        }}
                        renderBubble={renderBubble}
                        alwaysShowSend
                        renderSend={renderSend}
                        renderInputToolbar={renderInputToolbar}
                        renderActions={renderActions}
                        renderMessageImage={renderMessageImage}
                        renderUsernameOnMessage={true}
                        imageProps={{ resizeMode: 'contain' }}
                        scrollToBottom
                        textInputStyle={{
                            borderRadius: 22,
                            borderWidth: 1,
                            borderColor: COLORS.gray,
                            marginRight: 6,
                            paddingHorizontal: 12,
                            backgroundColor: COLORS.white,
                            color: COLORS.black,
                        }}
                        timeTextStyle={{ left: { color: COLORS.secondaryBlack }, right: { color: COLORS.secondaryBlack } }}
                        style={{ backgroundColor: COLORS.secondaryBlack }}
                    />
                    {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />}
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default PersonalChat;
