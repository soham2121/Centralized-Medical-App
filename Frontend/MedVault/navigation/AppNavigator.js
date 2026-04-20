import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../theme/Themecontext";

import HomeScreen        from "../screens/HomeScreen";
import LoginScreen       from "../screens/LoginScreen";
import RegisterScreen    from "../screens/RegisterScreen";
import PatientScreen     from "../screens/PatientScreen";
import DoctorScreen      from "../screens/DoctorScreen";
import AdminScreen       from "../screens/AdminScreen";
import ViewRecordsScreen from "../screens/ViewRecordsScreen";
import SettingsScreen    from "../screens/SettingsScreen";
import EmergencyScreen   from "../screens/EmergencyScreen";
import ProfileScreen     from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

function SettingsButton({ navigation }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Settings")}
      style={{ padding: 6, marginRight: 4 }}
    >
      <Text style={{ fontSize: 20 }}>⚙️</Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();

  const screenOptions = (navigation) => ({
    headerStyle: { backgroundColor: theme.surface },
    headerTintColor: theme.text,
    headerTitleStyle: { color: theme.text, fontWeight: '600' },
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    headerRight: () => <SettingsButton navigation={navigation} />,
  });

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Sign In",
          headerRight: undefined,
        })}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Create Account",
          headerRight: undefined,
        })}
      />
      <Stack.Screen
        name="Patient"
        component={PatientScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Patient Dashboard",
          headerRight: () => <SettingsButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Doctor"
        component={DoctorScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Add Record",
          headerRight: () => <SettingsButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Admin Panel",
          headerRight: () => <SettingsButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Records"
        component={ViewRecordsScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "My Records",
          headerRight: () => <SettingsButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Settings",
          headerRight: undefined,
        })}
      />
      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Emergency Profile 🚨",
          headerRight: undefined,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          ...screenOptions(navigation),
          title: "Profile",
        })}
      />
    </Stack.Navigator>
  );
}