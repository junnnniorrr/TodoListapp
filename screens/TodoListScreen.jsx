"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"

export default function TodoListApp() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const [dueDate, setDueDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [category, setCategory] = useState("Personal")
  const [editTask, setEditTask] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editText, setEditText] = useState("")
  const [editCategory, setEditCategory] = useState("Personal")
  const [editDueDate, setEditDueDate] = useState(new Date())
  const [showEditDatePicker, setShowEditDatePicker] = useState(false)
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("dueDate")

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    saveTasks()
  }, [tasks])

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks:", error)
    }
  }

  const addTask = () => {
    if (task.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: task,
          completed: false,
          dueDate: dueDate.toISOString(),
          category,
          createdAt: new Date().toISOString(),
        },
      ])
      setTask("")
      setDueDate(new Date())
      setCategory("Personal")
    } else {
      Alert.alert("Error", "Task cannot be empty!")
    }
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => setTasks(tasks.filter((task) => task.id !== taskId)), style: "destructive" },
    ])
  }

  const openEditModal = (task) => {
    setEditTask(task)
    setEditText(task.text)
    setEditCategory(task.category)
    setEditDueDate(new Date(task.dueDate))
    setEditModalVisible(true)
  }

  const saveEditTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editTask.id
          ? {
              ...task,
              text: editText,
              category: editCategory,
              dueDate: editDueDate.toISOString(),
            }
          : task,
      ),
    )
    setEditModalVisible(false)
    setEditTask(null)
    setEditText("")
    setEditCategory("Personal")
  }

  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = filterCategory === "All" || task.category === filterCategory
    let statusMatch = true
    if (filterStatus === "Completed") {
      statusMatch = task.completed
    } else if (filterStatus === "Active") {
      statusMatch = !task.completed
    }
    return categoryMatch && statusMatch
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate)
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category)
    } else if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0
  })

  const getCategoryColor = (category) => {
    switch (category) {
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
      default:
        return "#4CAF50"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        `, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      )
    }
  }

  const isOverdue = (dateString) => {
    return new Date(dateString) < new Date() ? styles.overdueText : null
  }

  const renderCategoryBadge = (category) => {
    return (
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
    )
  }

  // Enhanced dropdown component with improved UI
  const CategoryDropdown = ({ value, onChange, style }) => {
    const categories = ["Personal", "Education", "Work", "Health", "Finance"]
    const [showOptions, setShowOptions] = useState(false)

    return (
      <View style={[styles.dropdownContainer, style]}>
        <TouchableOpacity
          style={[styles.dropdownButton, { borderColor: getCategoryColor(value) }]}
          onPress={() => setShowOptions(!showOptions)}
          activeOpacity={0.7}
        >
          <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(value) }]} />
          <Text style={styles.dropdownButtonText}>{value}</Text>
          <Ionicons name={showOptions ? "chevron-up" : "chevron-down"} size={18} color="#424242" />
        </TouchableOpacity>

        {showOptions && (
          <View style={styles.dropdownOptions}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.dropdownItem, category === value && styles.selectedDropdownItem]}
                onPress={() => {
                  onChange(category)
                  setShowOptions(false)
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
                <Text style={[styles.dropdownItemText, category === value && styles.selectedItemText]}>{category}</Text>
                {category === value && <Ionicons name="checkmark" size={18} color="#1B5E20" />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    )
  }

  // Enhanced filter dropdown with improved UI
  const FilterDropdown = ({ label, value, options, onChange }) => {
    const [showOptions, setShowOptions] = useState(false)

    return (
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>{label}:</Text>
        <View style={styles.filterDropdownContainer}>
          <TouchableOpacity
            style={styles.filterDropdownButton}
            onPress={() => setShowOptions(!showOptions)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterDropdownButtonText}>{value}</Text>
            <Ionicons name={showOptions ? "chevron-up" : "chevron-down"} size={18} color="#424242" />
          </TouchableOpacity>

          {showOptions && (
            <View style={styles.filterDropdownOptions}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.filterDropdownItem, option === value && styles.selectedFilterItem]}
                  onPress={() => {
                    onChange(option)
                    setShowOptions(false)
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterDropdownItemText, option === value && styles.selectedItemText]}>
                    {option}
                  </Text>
                  {option === value && <Ionicons name="checkmark" size={18} color="#1B5E20" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>EcoDo List</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
          >
            <Ionicons name={showFilters ? "filter-outline" : "filter"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <FilterDropdown
              label="Category"
              value={filterCategory}
              options={["All", "Personal", "Education", "Work", "Health", "Finance"]}
              onChange={setFilterCategory}
            />

            <FilterDropdown
              label="Status"
              value={filterStatus}
              options={["All", "Active", "Completed"]}
              onChange={setFilterStatus}
            />

            <FilterDropdown
              label="Sort by"
              value={sortBy === "dueDate" ? "Due Date" : sortBy === "category" ? "Category" : "Most Recent"}
              options={["Due Date", "Category", "Most Recent"]}
              onChange={(value) => {
                if (value === "Due Date") setSortBy("dueDate")
                else if (value === "Category") setSortBy("category")
                else setSortBy("createdAt")
              }}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task"
            placeholderTextColor="#757575"
            value={task}
            onChangeText={setTask}
          />

          <View style={styles.inputRow}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton} activeOpacity={0.7}>
              <Ionicons name="calendar" size={18} color="#1B5E20" />
              <Text style={styles.dateButtonText}>{formatDate(dueDate.toISOString())}</Text>
            </TouchableOpacity>

            <CategoryDropdown value={category} onChange={setCategory} style={styles.categoryDropdown} />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === "ios")
                if (date) setDueDate(date)
              }}
            />
          )}

          <TouchableOpacity style={styles.addButton} onPress={addTask} activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={20} color="white" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskCounterContainer}>
          <Text style={styles.taskCounter}>
            {sortedTasks.length} tasks • {tasks.filter((t) => t.completed).length} completed
          </Text>
        </View>

        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.taskItem, { borderLeftColor: getCategoryColor(item.category), borderLeftWidth: 5 }]}>
              <View style={styles.taskHeader}>
                {renderCategoryBadge(item.category)}
                <View style={styles.taskActions}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(item)} activeOpacity={0.7}>
                    <Ionicons name="pencil" size={22} color="#00695C" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton} onPress={() => deleteTask(item.id)} activeOpacity={0.7}>
                    <Ionicons name="trash" size={22} color="#B71C1C" />
                  </TouchableOpacity>
                </View>
              </View>

              <Pressable
                style={styles.taskContent}
                onPress={() => toggleComplete(item.id)}
                android_ripple={{ color: "#f0f0f0" }}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                    {item.completed && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </View>
                <View style={styles.taskTextContainer}>
                  <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.text}</Text>
                  <View style={styles.taskMeta}>
                    <View style={styles.dueDateContainer}>
                      <Ionicons name="time-outline" size={14} color="#555" />
                      <Text style={[styles.dueDate, isOverdue(item.dueDate)]}>{formatDate(item.dueDate)}</Text>
                    </View>
                    <Text style={styles.createdAt}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle" size={64} color="#A5D6A7" />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubText}>
                {filterCategory !== "All" || filterStatus !== "All"
                  ? "Try changing your filters"
                  : "Add a task to get started"}
              </Text>
            </View>
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>

              <TextInput style={styles.modalInput} value={editText} onChangeText={setEditText} multiline />

              <Text style={styles.modalLabel}>Category:</Text>
              <CategoryDropdown value={editCategory} onChange={setEditCategory} />

              <Text style={styles.modalLabel}>Due Date:</Text>
              <TouchableOpacity
                onPress={() => setShowEditDatePicker(true)}
                style={styles.modalDateButton}
                activeOpacity={0.7}
              >
                <Text style={styles.modalDateButtonText}>{formatDate(editDueDate.toISOString())}</Text>
                <Ionicons name="calendar" size={24} color="#1B5E20" />
              </TouchableOpacity>

              {showEditDatePicker && (
                <DateTimePicker
                  value={editDueDate}
                  mode="datetime"
                  display="default"
                  onChange={(event, date) => {
                    setShowEditDatePicker(Platform.OS === "ios")
                    if (date) setEditDueDate(date)
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveEditTask}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B5E20",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#1B5E20",
    padding: 16,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
  },
  filtersContainer: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DCEDC8",
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    zIndex: 5,
  },
  filterLabel: {
    width: 80,
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "500",
  },
  filterDropdownContainer: {
    flex: 1,
    position: "relative",
    zIndex: 5,
  },
  filterDropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 40,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterDropdownButtonText: {
    fontSize: 14,
    color: "#424242",
  },
  filterDropdownOptions: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedFilterItem: {
    backgroundColor: "#E8F5E9",
  },
  filterDropdownItemText: {
    fontSize: 14,
    color: "#424242",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "#E8F5E9",
    zIndex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    fontSize: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
    zIndex: 5,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  dateButtonText: {
    marginLeft: 8,
    color: "#333",
    fontSize: 14,
  },
  categoryDropdown: {
    flex: 1,
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 5,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 10,
    height: 40,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  dropdownButtonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  dropdownOptions: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    paddingVertical: 4,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectedDropdownItem: {
    backgroundColor: "#E8F5E9",
  },
  dropdownItemText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#424242",
  },
  selectedItemText: {
    color: "#1B5E20",
    fontWeight: "bold",
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskCounterContainer: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  taskCounter: {
    color: "#757575",
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  taskActions: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
  },
  taskContent: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 8,
  },
  checkboxContainer: {
    justifyContent: "flex-start",
    paddingTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1B5E20",
    borderColor: "#1B5E20",
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  taskText: {
    fontSize: 16,
    color: "#212121",
    marginBottom: 6,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#9E9E9E",
  },
  taskMeta: {
    marginTop: 4,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  dueDate: {
    marginLeft: 4,
    fontSize: 13,
    color: "#555",
  },
  overdueText: {
    color: "#D32F2F",
    fontWeight: "500",
  },
  createdAt: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#757575",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9E9E9E",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1B5E20",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#424242",
    fontWeight: "500",
  },
  modalDateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "white",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  modalDateButtonText: {
    fontSize: 16,
    color: "#424242",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#EEEEEE",
  },
  cancelButtonText: {
    color: "#424242",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#1B5E20",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

