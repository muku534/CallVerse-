import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
// import { Login, Signup, Welcome } from "./screens";
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import Login from './src/screens/auth/Login';
import Welcome from './src/screens/home/Welcome'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddProfile from './src/screens/home/AddProfile';
import BottomTabNavigation from './src/navigation/BottomTabNavigator';
import { AddContact, Contact, PersonalChat, Profile, VoiceCall } from './src/screens';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {

  //Load fonts
  const [fontsLoaded] = useFonts({
    black: require('./assets/fonts/Mulish-Black.ttf'),
    regular: require('./assets/fonts/Mulish-Regular.ttf'),
    bold: require('./assets/fonts/Mulish-Bold.ttf'),
    medium: require('./assets/fonts/Mulish-Medium.ttf'),
    meediumItalic: require('./assets/fonts/Mulish-MediumItalic.ttf'),
    semiBold: require('./assets/fonts/Mulish-SemiBold.ttf'),
    semiBoldItalic: require('./assets/fonts/Mulish-SemiBoldItalic.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Welcome'
        >
          <Stack.Screen name='BottomTabNavigation' component={BottomTabNavigation}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="AddProfile"
            component={AddProfile}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="PersonalChat"
            component={PersonalChat}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Contact"
            component={Contact}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="AddContact"
            component={AddContact}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="VoiceCall"
            component={VoiceCall}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}