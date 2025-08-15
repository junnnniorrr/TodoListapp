# 🌿 EcoDo - Smart Todo List App

A modern, feature-rich Todo List application built with React Native and Expo, designed to help you stay organized and productive with an intuitive interface and powerful task management capabilities.

## ✨ Features

### 🏠 **Home Dashboard**
- **Smart Greetings**: Time-based personalized greetings (Good morning/afternoon/evening)
- **Motivational Quotes**: Daily inspirational quotes to boost productivity
- **Quick Actions**: Easy access to key features (New Task, Calendar, Statistics, Settings)
- **Today's Tasks Preview**: Quick overview of your daily tasks

### 📝 **Task Management**
- **Create Tasks**: Add new tasks with descriptions, due dates, and categories
- **Edit & Update**: Modify existing tasks anytime
- **Mark Complete**: Check off completed tasks
- **Delete Tasks**: Remove tasks with confirmation
- **Categories**: Organize tasks by Personal, Work, Shopping, Health, etc.

### 📅 **Calendar Integration**
- **Date Picker**: Set due dates for tasks
- **Calendar View**: Visual calendar interface for task planning
- **Due Date Tracking**: Never miss important deadlines

### 📊 **Statistics & Analytics**
- **Task Completion Rates**: Track your productivity
- **Category Breakdown**: See how you spend your time
- **Progress Visualization**: Charts and graphs for insights
- **Performance Metrics**: Monitor your task management efficiency

### ⚙️ **Settings & Customization**
- **App Preferences**: Customize your experience
- **Theme Options**: Personalize the interface
- **Notification Settings**: Configure reminders and alerts

### 🔍 **Advanced Features**
- **Search & Filter**: Find tasks quickly by category or status
- **Sort Options**: Organize tasks by due date, creation date, or priority
- **Data Persistence**: Tasks saved locally using AsyncStorage
- **Responsive Design**: Works seamlessly on mobile and web

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TodoListapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - **Mobile**: Scan the QR code with Expo Go app
   - **Web**: Press `w` in the terminal or navigate to `http://localhost:8081`
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal

## 📱 App Structure

### Navigation
The app uses a **Drawer Navigator** with the following screens:

- **🏠 Home**: Dashboard with quick actions and task overview
- **📝 To-Do List**: Main task management interface
- **➕ New Task**: Create and add new tasks
- **📅 Calendar**: Calendar view for task planning
- **📊 Statistics**: Analytics and progress tracking
- **⚙️ Settings**: App configuration and preferences

### Key Components

#### **HomeScreen** (`screens/HomeScreen.jsx`)
- Welcome interface with time-based greetings
- Motivational quotes
- Quick action buttons
- Today's tasks preview

#### **TodoListScreen** (`screens/TodoListScreen.jsx`)
- Task creation and management
- CRUD operations (Create, Read, Update, Delete)
- Category filtering and sorting
- Search functionality

#### **TaskScreen** (`screens/TaskScreen.jsx`)
- Detailed task creation form
- Date and category selection
- Task validation

#### **StatisticsScreen** (`screens/StatisticsScreen.jsx`)
- Productivity analytics
- Task completion charts
- Performance metrics

#### **CalenderScreen** (`screens/CalenderScreen.jsx`)
- Calendar interface
- Task scheduling
- Date-based task viewing

#### **SettingsScreen** (`screens/SettingsScreen.jsx`)
- App preferences
- User settings
- Configuration options

## 🛠️ Technology Stack

- **Frontend**: React Native
- **Navigation**: React Navigation (Drawer Navigator)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: React Native built-in components
- **Icons**: Expo Vector Icons (Ionicons)
- **Date Handling**: React Native Community DateTimePicker
- **Charts**: React Native Chart Kit
- **Platform**: Expo SDK 53

## 📦 Dependencies

### Core Dependencies
```json
{
  "expo": "^53.0.20",
  "react": "19.0.0",
  "react-native": "0.79.5",
  "@react-navigation/drawer": "^7.1.1",
  "@react-navigation/native": "^7.0.14",
  "@react-native-async-storage/async-storage": "2.1.2"
}
```

### UI & Navigation
```json
{
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/stack": "^7.1.1",
  "react-native-gesture-handler": "~2.24.0",
  "react-native-reanimated": "~3.17.4",
  "react-native-safe-area-context": "5.4.0",
  "react-native-screens": "~4.11.1"
}
```

### Additional Features
```json
{
  "@react-native-community/datetimepicker": "8.4.1",
  "@react-native-picker/picker": "2.11.1",
  "react-native-calendars": "^1.1310.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "15.11.2",
  "expo-haptics": "~14.1.4"
}
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Green (#008000, #1B5E20)
- **Background**: Light green (#E8F5E9)
- **Text**: Dark content for readability
- **Accents**: Blue for interactive elements

### UI Elements
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Touch-friendly with clear visual feedback
- **Icons**: Consistent Ionicons throughout the interface
- **Typography**: Clear hierarchy with readable fonts

## 📊 Data Management

### Local Storage
- Tasks are stored locally using AsyncStorage
- Data persists between app sessions
- No external database required

### Task Structure
```javascript
{
  id: "unique_identifier",
  text: "Task description",
  completed: false,
  dueDate: "2024-01-01T00:00:00.000Z",
  category: "Personal",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Development

### Project Structure
```
TodoListapp/
├── App.jsx                 # Main app component with navigation
├── screens/                # Screen components
│   ├── HomeScreen.jsx      # Dashboard
│   ├── TodoListScreen.jsx  # Task management
│   ├── TaskScreen.jsx      # Task creation
│   ├── StatisticsScreen.jsx # Analytics
│   ├── CalenderScreen.jsx  # Calendar view
│   └── SettingsScreen.jsx  # App settings
├── package.json            # Dependencies and scripts
├── app.json               # Expo configuration
└── README.md              # This file
```

### Available Scripts
```bash
npm start          # Start the development server
npx expo start     # Start Expo development server
npx expo start --web  # Start with web support
npx expo start --clear  # Clear cache and restart
```

## 🚀 Deployment

### Building for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Build for web
npx expo export:web
```

### Publishing to Expo
```bash
npx expo publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for excellent libraries and tools
- **Ionicons** for beautiful and consistent icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review [React Native documentation](https://reactnative.dev/)
3. Open an issue in this repository
4. Contact the development team

---

**Made with ❤️ using React Native and Expo**

*Stay organized, stay productive! 🌿*
