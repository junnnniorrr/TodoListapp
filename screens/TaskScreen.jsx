"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Haptics from "expo-haptics"

export default function AddTask({ navigation, route }) {
  // State management
  const [task, setTask] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerMode, setDatePickerMode] = useState("date")
  const [category, setCategory] = useState("Personal")
  const [priority, setPriority] = useState("Medium")
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskCharCount, setTaskCharCount] = useState(0)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // Categories with icons
  const categories = [
    { label: "Personal", value: "Personal", icon: "person-outline" },
    { label: "Work", value: "Work", icon: "briefcase-outline" },
    { label: "Education", value: "Education", icon: "school-outline" },
    { label: "Health", value: "Health", icon: "fitness-outline" },
    { label: "Finance", value: "Finance", icon: "cash-outline" },
    { label: "Shopping", value: "Shopping", icon: "cart-outline" },
    { label: "Other", value: "Other", icon: "ellipsis-horizontal-outline" },
  ]

  // Get category color
  const getCategoryColor = (categoryName) => {
    switch (categoryName) {
      case "Personal":
        return "#4CAF50"
      case "Work":
        return "#2196F3"
      case "Education":
        return "#9C27B0"
      case "Health":
        return "#F44336"
      case "Finance":
        return "#FF9800"
      case "Shopping":
        return "#00BCD4"
      case "Other":
        return "#607D8B"
      default:
        return "#4CAF50"
    }
  }

  // Get priority color
  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
      case "Low":
        return "#2196F3"
      case "Medium":
        return "#FF9800"
      case "High":
        return "#F44336"
      default:
        return "#FF9800"
    }
  }

  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true))
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false))

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // Update character count
  useEffect(() => {
    setTaskCharCount(task.length)
  }, [task])

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle date/time picker
  const showDateTimePicker = (mode) => {
    setDatePickerMode(mode)
    setShowDatePicker(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handleDateTimeChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      setDueDate(selectedDate)
    }
  }

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // Select category
  const selectCategory = (selectedCategory) => {
    setCategory(selectedCategory)
    setShowCategoryDropdown(false)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  // Select priority
  const selectPriority = (selectedPriority) => {
    setPriority(selectedPriority)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  // Validate and add task
  const handleAddTask = async () => {
    if (task.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setIsSubmitting(true)

      const newTask = {
        id: Date.now().toString(),
        text: task,
        description: description,
        completed: false,
        dueDate: dueDate.toISOString(),
        category,
        priority,
        createdAt: new Date().toISOString(),
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Pass new task back to the previous screen
      if (route.params?.addTask) {
        route.params.addTask(newTask)
        Alert.alert("Success", "Task added successfully!")
      }

      setIsSubmitting(false)
      navigation.goBack() // Go back to the previous screen
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert("Error", "Task title cannot be empty!")
    }
  }

  // Reset form
  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert("Reset Form", "Are you sure you want to clear all fields?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        onPress: () => {
          setTask("")
          setDescription("")
          setDueDate(new Date())
          setCategory("Personal")
          setPriority("Medium")
        },
        style: "destructive",
      },
    ])
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.title}>Add a New Task</Text>
          <View style={{ width: 24 }} />
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Task Title */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>Task Title</Text>
                <Text style={styles.required}>*</Text>
                <Text style={styles.charCount}>{taskCharCount}/100</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="What needs to be done?"
                placeholderTextColor="#888"
                value={task}
                onChangeText={setTask}
                maxLength={100}
              />
            </View>

            {/* Task Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Description <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details about your task"
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Due Date Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Due Date & Time</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  onPress={() => showDateTimePicker("date")}
                  style={styles.dateTimeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
                  <Text style={styles.dateTimeText}>{formatDate(dueDate)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => showDateTimePicker("time")}
                  style={styles.dateTimeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="time-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
                  <Text style={styles.dateTimeText}>{formatTime(dueDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Time Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode={datePickerMode}
                display="default"
                onChange={handleDateTimeChange}
                minimumDate={new Date()}
              />
            )}

            {/* Category Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <TouchableOpacity
                style={[styles.categoryButton, { borderColor: getCategoryColor(category) }]}
                onPress={toggleCategoryDropdown}
                activeOpacity={0.7}
              >
                <View style={styles.selectedCategory}>
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) }]}>
                    <Ionicons
                      name={categories.find((c) => c.value === category)?.icon || "person-outline"}
                      size={18}
                      color="white"
                    />
                  </View>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
                <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color="#555" />
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.dropdownContainer}>
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.dropdownItem, category === item.value && styles.selectedDropdownItem]}
                      onPress={() => selectCategory(item.value)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.value) }]}>
                        <Ionicons name={item.icon} size={18} color="white" />
                      </View>
                      <Text style={[styles.dropdownItemText, category === item.value && styles.selectedItemText]}>
                        {item.label}
                      </Text>
                      {category === item.value && <Ionicons name="checkmark" size={18} color="#2E7D32" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Priority Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityContainer}>
                {["Low", "Medium", "High"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.priorityButton,
                      priority === item && {
                        backgroundColor: `${getPriorityColor(item)}20`,
                        borderColor: getPriorityColor(item),
                      },
                    ]}
                    onPress={() => selectPriority(item)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item) }]} />
                    <Text
                      style={[
                        styles.priorityText,
                        priority === item && {
                          color: getPriorityColor(item),
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Ionicons name="refresh-outline" size={20} color="#555" style={{ marginRight: 8 }} />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
                onPress={handleAddTask}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Add Task</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  required: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  optional: {
    fontSize: 14,
    color: "#888",
    fontWeight: "normal",
  },
  charCount: {
    fontSize: 12,
    color: "#888",
    marginLeft: "auto",
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderColor: "#DDE3F0",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeButton: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDE3F0",
    flexDirection: "row",
    justifyContent: "center",
  },
  dateTimeText: {
    color: "#333",
    fontSize: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE3F0",
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE3F0",
    marginTop: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedDropdownItem: {
    backgroundColor: "#F1F8E9",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedItemText: {
    fontWeight: "bold",
    color: "#2E7D32",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 0.3,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F1F4FA",
    borderWidth: 1,
    borderColor: "#DDE3F0",
    flexDirection: "row",
    justifyContent: "center",
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  priorityText: {
    color: "#666",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    flex: 0.3,
    borderWidth: 1,
    borderColor: "#DDE3F0",
    flexDirection: "row",
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    flex: 0.65,
    flexDirection: "row",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})

