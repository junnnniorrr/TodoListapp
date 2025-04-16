import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState({
    '2025-02-25': [{ id: '1', task: 'Meeting with team', completed: false }],
    '2025-02-26': [{ id: '2', task: 'Submit report', completed: false }],
    '2025-02-27': [{ id: '3', task: 'Workout session', completed: true }],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });

  // Calculate task statistics whenever tasks change
  useEffect(() => {
    let total = 0;
    let completed = 0;
    
    Object.values(tasks).forEach(dayTasks => {
      total += dayTasks.length;
      completed += dayTasks.filter(task => task.completed).length;
    });
    
    setTaskStats({ total, completed });
  }, [tasks]);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set today as default selected date when component mounts
  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
  }, []);

  const handleAddTask = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }
    
    if (newTask.trim() === '') {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }

    const updatedTasks = { ...tasks };
    const newId = Date.now().toString();
    
    if (!updatedTasks[selectedDate]) {
      updatedTasks[selectedDate] = [];
    }
    
    if (editTask) {
      // Edit existing task
      updatedTasks[selectedDate] = updatedTasks[selectedDate].map(item => 
        item.id === editTask.id ? { ...item, task: newTask } : item
      );
    } else {
      // Add new task
      updatedTasks[selectedDate].push({ id: newId, task: newTask, completed: false });
    }
    
    setTasks(updatedTasks);
    setNewTask('');
    setEditTask(null);
    setModalVisible(false);
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedTasks = { ...tasks };
            updatedTasks[selectedDate] = updatedTasks[selectedDate].filter(
              item => item.id !== taskId
            );
            
            // Remove the date key if no tasks remain for that date
            if (updatedTasks[selectedDate].length === 0) {
              delete updatedTasks[selectedDate];
            }
            
            setTasks(updatedTasks);
          }
        }
      ]
    );
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = { ...tasks };
    updatedTasks[selectedDate] = updatedTasks[selectedDate].map(item => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    
    setTasks(updatedTasks);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setNewTask(task.task);
    setModalVisible(true);
  };

  // Generate marked dates for the calendar
  const getMarkedDates = () => {
    const markedDates = {};
    
    Object.keys(tasks).forEach(date => {
      // Check if the date has any completed tasks
      const hasCompletedTasks = tasks[date].some(task => task.completed);
      const allTasksCompleted = tasks[date].every(task => task.completed) && tasks[date].length > 0;
      
      markedDates[date] = { 
        marked: true, 
        dotColor: allTasksCompleted ? 'green' : hasCompletedTasks ? 'orange' : 'red'
      };
    });
    
    // Add selected date marker (will override the above if same date)
    if (selectedDate) {
      markedDates[selectedDate] = {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: '#2E7D32',
      };
    }
    
    return markedDates;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Task Calendar</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {taskStats.completed}/{taskStats.total} completed
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${taskStats.total ? (taskStats.completed / taskStats.total) * 100 : 0}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <Calendar
          theme={{
            calendarBackground: '#fff',
            textSectionTitleColor: '#2E7D32',
            selectedDayBackgroundColor: '#2E7D32',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#2E7D32',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#2E7D32',
            selectedDotColor: '#FFFFFF',
            arrowColor: '#2E7D32',
            monthTextColor: '#2E7D32',
            indicatorColor: '#2E7D32',
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates()}
          enableSwipeMonths={true}
        />

        <View style={styles.taskSection}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskHeaderText}>
              Tasks for {selectedDate ? new Date(selectedDate).toDateString() : 'Select a date'}
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setEditTask(null);
                setNewTask('');
                setModalVisible(true);
              }}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedDate && (!tasks[selectedDate] || tasks[selectedDate].length === 0) ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={50} color="#BDBDBD" />
              <Text style={styles.emptyText}>No tasks for this day</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add a task</Text>
            </View>
          ) : (
            <FlatList
              data={tasks[selectedDate] || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => toggleTaskCompletion(item.id)}
                  >
                    <View style={[
                      styles.checkbox,
                      item.completed && styles.checkboxChecked
                    ]}>
                      {item.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                  
                  <Text style={[
                    styles.taskText,
                    item.completed && styles.taskTextCompleted
                  ]}>
                    {item.task}
                  </Text>
                  
                  <View style={styles.taskActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditTask(item)}
                    >
                      <Ionicons name="pencil" size={20} color="#757575" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTask(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.taskList}
              ListEmptyComponent={
                !selectedDate && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Select a date to view tasks</Text>
                  </View>
                )
              }
            />
          )}
        </View>

        {/* Add/Edit Task Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editTask ? 'Edit Task' : 'Add New Task'}
              </Text>
              
              <Text style={styles.modalSubtitle}>
                {selectedDate ? new Date(selectedDate).toDateString() : 'Select a date first'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Enter task..."
                value={newTask}
                onChangeText={setNewTask}
                autoFocus
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setEditTask(null);
                    setNewTask('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddTask}
                >
                  <Text style={styles.saveButtonText}>
                    {editTask ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  headerContainer: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 10, // Reduced since we now use SafeAreaView
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statsContainer: {
    marginTop: 5,
  },
  statsText: {
    color: '#fff',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  taskSection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  taskHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addButton: {
    backgroundColor: '#2E7D32',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  taskList: {
    padding: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E7D32',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  taskActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;