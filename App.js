import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreens from './screens/LoginScreens';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProjectScreen from './screens/ProjectScreen';
import AuthContext from './context/AuthContext';
import { loadUser } from './services/AuthService';
import { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import AddProjectScreen from './screens/AddProjectScreen';
import ProjectDetailScreen from './screens/ProjectDetailScreen';
import { createAppContainer } from 'react-navigation';
import { ProjectProvide, ProjectProvider } from './context/ProjectContext';
import UpdateProjectScreen from './screens/UpdateProjectScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Use createNativeStackNavigator from @react-navigation/native-stack
const Stack = createNativeStackNavigator();
const appContainer = createAppContainer(navigator)
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function runEffect() {
      try {
        const user = await loadUser();
        setUser(user);
      } catch (e) {
        console.log("Failed to load user");
      }
      setStatus("idle");
    }

    runEffect();
  }, []);

  if (status === "loading") {
    return <SplashScreen />;
  }

  const AuthenticatedTabs = () => (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Reports') {
          iconName = 'document-text';
        } else if (route.name == 'Add Project') {
          iconName = 'add-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#004d40',
      tabBarInactiveTintColor: '#90a4ae',
      tabBarLabelStyle: { fontSize: 12 },
      tabBarStyle: {
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#f0f4f8',
        position: 'absolute',
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerTitle: 'Reports', headerShown: true }}
    />
    <Tab.Screen
      name="Add Project"
      component={AddProjectScreen}  // Make sure this is the correct component
      options={{ headerTitle: 'Add Project', headerShown: true }}
    />
    <Tab.Screen
      name="Reports"
      component={ProjectScreen}
      options={{ headerTitle: 'Reports', headerShown: true }}
    />
  </Tab.Navigator>
  );
  

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ProjectProvider>
      <NavigationContainer>
        <Stack.Navigator>
  {user ? (
    <>
      <Stack.Screen
        name="Main"
        component={AuthenticatedTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Update Reports"
        component={UpdateProjectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail Reports"
        component={ProjectDetailScreen}
        options={{ headerShown: false }}
      />
    </>

  ) : (
    <>
      <Stack.Screen 
        name='Login' 
        component={LoginScreens} 
        options={{ headerTitle: 'Login', headerShown: true }}
      />
      <Stack.Screen 
        name='Create account' 
        component={RegisterScreen} 
        options={{ headerTitle: 'Register', headerShown: true }}
      />
    </>
  )}
</Stack.Navigator>
      </NavigationContainer>
      </ProjectProvider>
    </AuthContext.Provider>
  );
}
