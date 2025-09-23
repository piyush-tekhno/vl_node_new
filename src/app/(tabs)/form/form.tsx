import { Platform, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Form() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'logEntry' | 'complaints'>('logEntry');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        {/* <Text style={[styles.title, { color: colors.surface }]}>Explore</Text> */}
      </View>

      {/* Tab Buttons */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: colors.background },
            activeTab === 'logEntry' && [styles.activeTabButton, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('logEntry')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.textSecondary },
            activeTab === 'logEntry' && [styles.activeTabButtonText, { color: colors.surface }]
          ]}>
            Log Entry
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: colors.background },
            activeTab === 'complaints' && [styles.activeTabButton, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('complaints')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: colors.textSecondary },
            activeTab === 'complaints' && [styles.activeTabButtonText, { color: colors.surface }]
          ]}>
            Complaints
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forms */}
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'logEntry' ? <LogEntryForm /> : <ComplaintsForm />}
      </ScrollView>
    </SafeAreaView>
  );
}

// Log Entry Form Component
const LogEntryForm = () => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    reason: '',
    date: new Date(),
    purpose: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({...formData, date: selectedDate});
    }
  };

  const handleSubmit = () => {
    console.log('Log Entry Submitted:', {
      ...formData,
      date: formData.date.toISOString().split('T')[0]
    });
    
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        mobile: '',
        address: '',
        reason: '',
        date: new Date(),
        purpose: ''
      });
      setIsSubmitted(false);
    }, 2000);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (isSubmitted) {
    return (
      <View style={[styles.successMessage, { backgroundColor: colors.surface }]}>
        <Text style={[styles.successText, { color: colors.accent }]}>✓ Log Entry Submitted Successfully!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.form, { backgroundColor: colors.surface }]}>
      <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Visitor Log Entry</Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Full Name"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Mobile Number"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={(text) => setFormData({...formData, mobile: text})}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Address"
        placeholderTextColor={colors.textSecondary}
        value={formData.address}
        onChangeText={(text) => setFormData({...formData, address: text})}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Reason for Visit"
        placeholderTextColor={colors.textSecondary}
        value={formData.reason}
        onChangeText={(text) => setFormData({...formData, reason: text})}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Purpose"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={3}
        value={formData.purpose}
        onChangeText={(text) => setFormData({...formData, purpose: text})}
      />
      
      {/* Date Picker */}
      <TouchableOpacity 
        style={[styles.dateButton, { 
          backgroundColor: colors.background, 
          borderColor: colors.border 
        }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, { color: colors.textPrimary }]}>
          📅 {formatDate(formData.date)}
        </Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      <TouchableOpacity 
        style={[styles.submitButton, { backgroundColor: colors.primary }]} 
        onPress={handleSubmit}
      >
        <Text style={[styles.submitButtonText, { color: colors.surface }]}>Submit Log Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

// Complaints Form Component
const ComplaintsForm = () => {
  const { colors } = useTheme();
  const [complaintData, setComplaintData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'Medium',
    contact: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log('Complaint Submitted:', complaintData);
    
    setIsSubmitted(true);
    setTimeout(() => {
      setComplaintData({
        title: '',
        category: '',
        description: '',
        priority: 'Medium',
        contact: ''
      });
      setIsSubmitted(false);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <View style={[styles.successMessage, { backgroundColor: colors.surface }]}>
        <Text style={[styles.successText, { color: colors.accent }]}>✓ Complaint Submitted Successfully!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.form, { backgroundColor: colors.surface }]}>
      <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Register Complaint</Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Complaint Title"
        placeholderTextColor={colors.textSecondary}
        value={complaintData.title}
        onChangeText={(text) => setComplaintData({...complaintData, title: text})}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Category (e.g., Security, Maintenance)"
        placeholderTextColor={colors.textSecondary}
        value={complaintData.category}
        onChangeText={(text) => setComplaintData({...complaintData, category: text})}
      />
      
      <View style={styles.priorityContainer}>
        <Text style={[styles.priorityLabel, { color: colors.textPrimary }]}>Priority:</Text>
        <View style={styles.priorityButtons}>
          {['Low', 'Medium', 'High'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border
                },
                complaintData.priority === priority && [
                  styles.activePriorityButton, 
                  { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }
                ]
              ]}
              onPress={() => setComplaintData({...complaintData, priority})}
            >
              <Text style={[
                styles.priorityButtonText,
                { color: colors.textSecondary },
                complaintData.priority === priority && [
                  styles.activePriorityButtonText,
                  { color: colors.surface }
                ]
              ]}>
                {priority}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TextInput
        style={[styles.input, styles.textArea, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Detailed Description"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
        value={complaintData.description}
        onChangeText={(text) => setComplaintData({...complaintData, description: text})}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Contact Information"
        placeholderTextColor={colors.textSecondary}
        value={complaintData.contact}
        onChangeText={(text) => setComplaintData({...complaintData, contact: text})}
      />
      
      <TouchableOpacity 
        style={[styles.submitButton, styles.complaintButton, { backgroundColor: colors.error }]} 
        onPress={handleSubmit}
      >
        <Text style={[styles.submitButtonText, { color: colors.surface }]}>Submit Complaint</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    // backgroundColor handled by theme
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabButtonText: {
    // color handled by theme
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  form: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 15,
    width: 80,
  },
  priorityButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  priorityButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  activePriorityButton: {
    // backgroundColor and borderColor handled by theme
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activePriorityButtonText: {
    // color handled by theme
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  complaintButton: {
    // backgroundColor handled by theme
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  successMessage: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});