import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const StatisticsScreen = ({ route, navigation }) => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    categoryBreakdown: {},
    mostProductiveDay: { day: 'N/A', count: 0 },
    isLoading: true,
  });

  // Memoize the data processing to avoid unnecessary recalculations
  const processTaskData = useMemo(() => (taskData) => {
    if (!taskData || !taskData.length) return null;
    
    const completedTasks = taskData.filter(task => task.completed).length;
    const totalTasks = taskData.length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Process categories
    const categoryBreakdown = {};
    taskData.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { total: 0, completed: 0 };
      }
      categoryBreakdown[category].total += 1;
      if (task.completed) {
        categoryBreakdown[category].completed += 1;
      }
    });
    
    // Find most productive day based on completion dates
    const completionsByDay = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    taskData.forEach(task => {
      if (task.completed && task.completedAt) {
        const day = daysOfWeek[new Date(task.completedAt).getDay()];
        completionsByDay[day] = (completionsByDay[day] || 0) + 1;
      }
    });
    
    let mostProductiveDay = { day: 'N/A', count: 0 };
    Object.entries(completionsByDay).forEach(([day, count]) => {
      if (count > mostProductiveDay.count) {
        mostProductiveDay = { day, count };
      }
    });
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      categoryBreakdown,
      mostProductiveDay,
      isLoading: false,
    };
  }, []);

  useEffect(() => {
    // Set navigation title
    if (navigation) {
      navigation.setOptions({
        title: 'Task Statistics',
      });
    }

    // Fetch and process statistics
    if (route.params && route.params.taskData) {
      const processedStats = processTaskData(route.params.taskData);
      if (processedStats) {
        setStats(processedStats);
      } else {
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      // Set loading to false if no data is available
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  }, [route.params, navigation, processTaskData]);

  // Prepare chart data
  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [stats.completedTasks, stats.pendingTasks]
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  // Create category chart data
  const categoryData = {
    labels: Object.keys(stats.categoryBreakdown).slice(0, 4),
    datasets: [{
      data: Object.values(stats.categoryBreakdown).slice(0, 4).map(cat => cat.total)
    }]
  };

  if (stats.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008000" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Task Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTasks}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#008000' }]}>{stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FFA500' }]}>{stats.pendingTasks}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Completion Status</Text>
          {stats.totalTasks > 0 ? (
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
              showValuesOnTopOfBars
            />
          ) : (
            <Text style={styles.noDataText}>No tasks available</Text>
          )}
          <View style={styles.completionRateContainer}>
            <Text style={styles.completionRateLabel}>Completion Rate</Text>
            <Text style={styles.completionRateValue}>{stats.completionRate}%</Text>
          </View>
        </View>

        {Object.keys(stats.categoryBreakdown).length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Categories</Text>
            <BarChart
              data={categoryData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(75, 105, 192, ${opacity})`,
              }}
              verticalLabelRotation={30}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        )}

        <View style={styles.insightContainer}>
          <Text style={styles.insightTitle}>Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Most Productive Day:</Text>
            <Text style={styles.insightValue}>
              {stats.mostProductiveDay.day} ({stats.mostProductiveDay.count} tasks)
            </Text>
          </View>
          
          {Object.entries(stats.categoryBreakdown).length > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Top Category:</Text>
              <Text style={styles.insightValue}>
                {Object.entries(stats.categoryBreakdown)
                  .sort((a, b) => b[1].total - a[1].total)[0][0]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
    marginVertical: 30,
    fontStyle: 'italic',
  },
  completionRateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F0F8F0',
    borderRadius: 20,
  },
  completionRateLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  completionRateValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008000',
  },
  insightContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  insightLabel: {
    fontSize: 16,
    color: '#666',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default StatisticsScreen;