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
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerTitle: 'Welcome Home', headerShown: true }}  // Custom header title for Home
      />
      <Tab.Screen 
        name="Project" 
        component={ProjectScreen} 
        options={{ headerTitle: 'Your Projects', headerShown: true }}  // Custom header title for Project
      />
      {/* Add more screens as needed */}
    </Tab.Navigator>
  );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ProjectProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {user ? (
            <>
              <Stack.Screen 
                name='Main' 
                component={AuthenticatedTabs} 
                options={{ headerShown: false }}  // Hide header for tab navigator
              />
              <Stack.Screen name='Add Project' component={AddProjectScreen}/>
              <Stack.Screen name='Detail Project' component={ProjectDetailScreen}/>
              <Stack.Screen name='Update Project' component={UpdateProjectScreen}/>
            </>
          ) : (
            <>
              <Stack.Screen 
                name='Login' 
                component={LoginScreens}
                options={{ headerTitle: 'Login', headerShown: true }} // Custom header for Login
              />
              <Stack.Screen 
                name='Create account' 
                component={RegisterScreen}
                options={{ headerTitle: 'Register', headerShown: true }} // Custom header for Register
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      </ProjectProvider>
    </AuthContext.Provider>
  );
}
