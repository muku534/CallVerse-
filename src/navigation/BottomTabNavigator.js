import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS } from '../../constants';
import { Chat, Contact, More } from '../screens';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.white,
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 60
        }
      }}>
      <Tab.Screen
        name='Contacts'
        component={Contact}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {
                  focused ? (
                    <>
                      <Feather
                        name='users'
                        size={25}
                        color={COLORS.black} />
                    </>
                  ) : (
                    <Feather
                      name='users'
                      size={19}
                      color={COLORS.secondaryBlack} />
                  )
                }
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name='Chat'
        component={Chat}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {
                  focused ? (
                    <>
                      <Ionicons
                        name='chatbubble-ellipses-outline'
                        size={25}
                        color={COLORS.black} />
                    </>
                  ) : (
                    <Ionicons
                      name='chatbubble-ellipses-outline'
                      size={19}
                      color={COLORS.secondaryBlack} />
                  )
                }
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name='More'
        component={More}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {
                  focused ? (
                    <>
                      <Feather
                        name='more-horizontal'
                        size={25}
                        color={COLORS.black} />
                    </>
                  ) : (
                    <Feather
                      name='more-horizontal'
                      size={19}
                      color={COLORS.secondaryBlack} />
                  )
                }
              </View>
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation;