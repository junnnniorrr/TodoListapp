import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';



import HomeScreen from './screens/HomeScreen';
import TodoListScreen from './screens/TodoListScreen';
import SettingsScreen from './screens/SettingsScreen';
import TaskScreen from './screens/TaskScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import CalenderScreen from './screens/CalenderScreen';




const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'To-Do List') iconName = 'list';
            else if (route.name === 'Settings') iconName = 'settings';
            else if (route.name === 'New Task') iconName = 'add';
            else if (route.name === 'Statistics') iconName = 'stats-chart';
            else if (route.name === 'Calender') iconName = 'calendar';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          drawerActiveTintColor: '#008000', // Green
          drawerInactiveTintColor: 'gray',
        })}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="To-Do List" component={TodoListScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="New Task" component={TaskScreen} />
        <Drawer.Screen name="Statistics" component={StatisticsScreen} />
        <Drawer.Screen name="Calender" component={CalenderScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
