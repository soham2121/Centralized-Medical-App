import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import PatientScreen from "../screens/PatientScreen";
import DoctorScreen from "../screens/DoctorScreen";
import AdminScreen from "../screens/AdminScreen";
import ViewRecordsScreen from "../screens/ViewRecordsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Patient" component={PatientScreen} />
      <Stack.Screen name="Doctor" component={DoctorScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="Records" component={ViewRecordsScreen} />
    </Stack.Navigator>
  );
}