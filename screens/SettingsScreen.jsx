import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  const SettingItem = ({ icon, title, description, isSwitch, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={darkMode ? "#32CD32" : "#008000"} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingTitle, darkMode && styles.darkText]}>{title}</Text>
          <Text style={[styles.settingDescription, darkMode && styles.darkSubText]}>{description}</Text>
        </View>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: "#32CD32" }}
          thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#767577" />
      )}
    </View>
  );

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, darkMode && styles.darkText]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSubText]}>Preferences</Text>
          
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            description="Receive alerts and notifications"
            isSwitch={true}
            value={notifications}
            onValueChange={() => setNotifications(!notifications)}
          />
          
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            description="Enable dark theme"
            isSwitch={true}
            value={darkMode}
            onValueChange={() => setDarkMode(!darkMode)}
          />
          
          <SettingItem
            icon="location-outline"
            title="Location Services"
            description="Allow app to access your location"
            isSwitch={true}
            value={locationServices}
            onValueChange={() => setLocationServices(!locationServices)}
          />
          
          <SettingItem
            icon="sync-outline"
            title="Data Synchronization"
            description="Sync data across devices"
            isSwitch={true}
            value={dataSync}
            onValueChange={() => setDataSync(!dataSync)}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSubText]}>Account</Text>
          
          <TouchableOpacity>
            <SettingItem
              icon="person-outline"
              title="Profile Information"
              description="Update your personal details"
              isSwitch={false}
            />
          </TouchableOpacity>
          
          <TouchableOpacity>
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy Settings"
              description="Manage your privacy preferences"
              isSwitch={false}
            />
          </TouchableOpacity>
          
          <TouchableOpacity>
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              description="Get assistance and contact support"
              isSwitch={false}
            />
          </TouchableOpacity>
          
          <TouchableOpacity>
            <SettingItem
              icon="information-circle-outline"
              title="About"
              description="App version and information"
              isSwitch={false}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008000',
  },
  darkText: {
    color: '#32CD32',
  },
  darkSubText: {
    color: '#a0a0a0',
  },
  section: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
  },
});