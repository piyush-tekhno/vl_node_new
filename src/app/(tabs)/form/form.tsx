import { 
  Platform, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image 
} from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDetpList } from "@/src/api/getDepartment";
import { useAuth } from "@/src/context/AuthContext";
import { Picker } from '@react-native-picker/picker';
import { addComplaint } from '@/src/api/complaints/addComplaints';
import { addVisitor } from '@/src/api/visitors/addVisitors';
import * as ImagePicker from 'expo-image-picker';


export default function Form() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'logEntry' | 'complaints'>('logEntry');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
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
// Log Entry Form Component
const LogEntryForm = () => {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    dept_id: "",
    visitor_name: "",
    email: "",
    mobile_no: "",
    city: "",
    reason: "",
    visit_date: new Date(),
    visitorPhoto: null as any,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptList = await getDetpList(token);
        if (deptList) {
          setDepartments(deptList);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('Failed to load departments');
      }
    };
    fetchDepartments();
  }, [token]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({...formData, visit_date: selectedDate});
    }
  };

  // Function to handle photo capture from camera
  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission is required to take photos');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        const photoFile = {
          uri: image.uri,
          type: 'image/jpeg',
          name: `visitor_photo_${Date.now()}.jpg`,
        };
        setFormData({...formData, visitorPhoto: photoFile});
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to capture photo');
    }
  };

  // Function to handle photo selection from gallery
  const chooseFromGallery = async () => {
    try {
      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        const photoFile = {
          uri: image.uri,
          type: image.mimeType || 'image/jpeg',
          name: image.fileName || `visitor_photo_${Date.now()}.jpg`,
        };
        setFormData({...formData, visitorPhoto: photoFile});
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      setError('Failed to select photo');
    }
  };

  // Function to remove selected photo
  const removePhoto = () => {
    setFormData({...formData, visitorPhoto: null});
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.visitor_name || 
        !formData.email || 
        !formData.mobile_no || 
        !formData.city || 
        !formData.reason || 
        !formData.dept_id) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.mobile_no.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.visitorPhoto) {
      setError('Please capture or select a visitor photo');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare data for API
      const apiData = {
        dept_id: parseInt(formData.dept_id),
        visitor_name: formData.visitor_name,
        email: formData.email,
        mobile_no: formData.mobile_no,
        city: formData.city,
        reason: formData.reason,
        visit_date: formData.visit_date.toISOString().split('T')[0],
        visitorPhoto: formData.visitorPhoto,
      };

      console.log('Submitting visitor entry:', apiData);
      
      // Call the API
      const result = await addVisitor(apiData, token);
      console.log('Visitor added successfully:', result);

      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          dept_id: "",
          visitor_name: "",
          email: "",
          mobile_no: "",
          city: "",
          reason: "",
          visit_date: new Date(),
          visitorPhoto: null,
        });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding visitor:', error);
      setError('Failed to submit visitor entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (isSubmitted) {
    return (
      <View style={[styles.successMessage, { backgroundColor: colors.surface }]}>
        <Text style={[styles.successText, { color: colors.accent }]}>✓ Visitor Log Entry Submitted Successfully!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.form, { backgroundColor: colors.surface }]}>
      <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Visitor Log Entry</Text>

      {/* Error Message */}
      {error ? (
        <View style={[styles.errorMessage, { backgroundColor: colors.error }]}>
          <Text style={[styles.errorText, { color: colors.surface }]}>{error}</Text>
        </View>
      ) : null}

      {/* Department Dropdown */}
      <View style={[styles.pickerContainer, { 
        backgroundColor: colors.background, 
        borderColor: colors.border 
      }]}>
        <Picker
          selectedValue={formData.dept_id}
          onValueChange={(value) => setFormData({ ...formData, dept_id: value })}
          style={{ color: colors.textPrimary }}
          dropdownIconColor={colors.textPrimary}
        >
          <Picker.Item label="Select Department" value="" />
          {departments.map((dept) => (
            <Picker.Item 
              key={dept.dept_id} 
              label={dept.dept_name} 
              value={dept.dept_id.toString()} 
            />
          ))}
        </Picker>
      </View>
      
      {/* Visitor Name */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Visitor Full Name"
        placeholderTextColor={colors.textSecondary}
        value={formData.visitor_name}
        onChangeText={(text) => setFormData({...formData, visitor_name: text})}
      />
      
      {/* Email */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Email Address"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
      />
      
      {/* Mobile Number */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Mobile Number"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        maxLength={10}
        value={formData.mobile_no}
        onChangeText={(text) => setFormData({...formData, mobile_no: text})}
      />
      
      {/* City */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="City"
        placeholderTextColor={colors.textSecondary}
        value={formData.city}
        onChangeText={(text) => setFormData({...formData, city: text})}
      />
      
      {/* Reason for Visit */}
      <TextInput
        style={[styles.input, styles.textArea, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Reason for Visit"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={3}
        value={formData.reason}
        onChangeText={(text) => setFormData({...formData, reason: text})}
      />
      
      {/* Visit Date Picker */}
      <TouchableOpacity 
        style={[styles.input, styles.dateButton, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          justifyContent: 'center',
        }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, { color: colors.textPrimary }]}>
          📅 Visit Date: {formatDate(formData.visit_date)}
        </Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={formData.visit_date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Photo Section */}
      <View style={styles.photoSection}>
        <Text style={[styles.photoLabel, { color: colors.textPrimary }]}>Visitor Photo *</Text>
        
        {formData.visitorPhoto ? (
          <View style={styles.photoPreviewContainer}>
            <Image 
              source={{ uri: formData.visitorPhoto.uri }} 
              style={styles.photoPreview}
            />
            <TouchableOpacity 
              style={[styles.removePhotoButton, { backgroundColor: colors.error }]}
              onPress={removePhoto}
            >
              <Text style={[styles.removePhotoText, { color: colors.surface }]}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity 
              style={[styles.photoButton, { backgroundColor: colors.primary }]}
              onPress={takePhoto}
            >
              <Text style={[styles.photoButtonText, { color: colors.surface }]}>📸 Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.photoButton, { backgroundColor: colors.secondary }]}
              onPress={chooseFromGallery}
            >
              <Text style={[styles.photoButtonText, { color: colors.surface }]}>🖼️ Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.submitButton, 
          { backgroundColor: loading ? colors.textSecondary : colors.primary },
          loading && styles.disabledButton
        ]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={[styles.submitButtonText, { color: colors.surface }]}>
          {loading ? 'Submitting...' : 'Submit Log Entry'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Complaints Form Component
const ComplaintsForm = () => {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  const [complaintData, setComplaintData] = useState({
    complainer_name: "", // Matches API: complainer_name
    complainer_mobile: "", // Matches API: complainer_mobile
    complainer_city: "", // Matches API: complainer_city
    complaint_reason: "", // Matches API: complaint_reason
    dept_id: "", // Matches API: dept_id
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptList = await getDetpList(token);
        if (deptList) {
          setDepartments(deptList);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('Failed to load departments');
      }
    };
    fetchDepartments();
  }, [token]);

  const handleSubmit = async () => {
    // Validation
    if (!complaintData.complainer_name || 
        !complaintData.complainer_mobile || 
        !complaintData.complainer_city || 
        !complaintData.complaint_reason || 
        !complaintData.dept_id) {
      setError('Please fill all fields');
      return;
    }

    if (complaintData.complainer_mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare data for API (convert dept_id to number)
      const apiData = {
        dept_id: parseInt(complaintData.dept_id),
        complainer_name: complaintData.complainer_name,
        complainer_mobile: complaintData.complainer_mobile,
        complainer_city: complaintData.complainer_city,
        complaint_reason: complaintData.complaint_reason,
      };

      console.log('Submitting complaint:', apiData);
      
      // Call the API
      const result = await addComplaint(apiData, token);
      console.log('Complaint submitted successfully:', result);

      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setComplaintData({
          complainer_name: "",
          complainer_mobile: "",
          complainer_city: "",
          complaint_reason: "",
          dept_id: "",
        });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <View style={[styles.successMessage, { backgroundColor: colors.surface }]}>
        <Text style={[styles.successText, { color: colors.accent }]}>
          ✓ Complaint Submitted Successfully!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.form, { backgroundColor: colors.surface }]}>
      <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Register Complaint</Text>

      {/* Error Message */}
      {error ? (
        <View style={[styles.errorMessage, { backgroundColor: colors.error }]}>
          <Text style={[styles.errorText, { color: colors.surface }]}>{error}</Text>
        </View>
      ) : null}

      {/* Complainer Name */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Your Full Name"
        placeholderTextColor={colors.textSecondary}
        value={complaintData.complainer_name}
        onChangeText={(text) => setComplaintData({ ...complaintData, complainer_name: text })}
      />

      {/* Complainer Mobile */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Mobile Number"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        maxLength={10}
        value={complaintData.complainer_mobile}
        onChangeText={(text) => setComplaintData({ ...complaintData, complainer_mobile: text })}
      />

      {/* Complainer City */}
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="City"
        placeholderTextColor={colors.textSecondary}
        value={complaintData.complainer_city}
        onChangeText={(text) => setComplaintData({ ...complaintData, complainer_city: text })}
      />

      {/* Department Dropdown */}
      <View style={[styles.pickerContainer, { 
        backgroundColor: colors.background, 
        borderColor: colors.border 
      }]}>
        <Picker
          selectedValue={complaintData.dept_id}
          onValueChange={(value) => setComplaintData({ ...complaintData, dept_id: value })}
          style={{ color: colors.textPrimary }}
          dropdownIconColor={colors.textPrimary}
        >
          <Picker.Item label="Select Department" value="" />
          {departments.map((dept) => (
            <Picker.Item 
              key={dept.dept_id} 
              label={dept.dept_name} 
              value={dept.dept_id.toString()} 
            />
          ))}
        </Picker>
      </View>

      {/* Complaint Reason */}
      <TextInput
        style={[styles.input, styles.textArea, { 
          backgroundColor: colors.background, 
          borderColor: colors.border,
          color: colors.textPrimary 
        }]}
        placeholder="Complaint Reason (Detailed Description)"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
        value={complaintData.complaint_reason}
        onChangeText={(text) => setComplaintData({ ...complaintData, complaint_reason: text })}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton, 
          { backgroundColor: loading ? colors.textSecondary : colors.error },
          loading && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={[styles.submitButtonText, { color: colors.surface }]}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </Text>
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
  //error styled code
  errorMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },

  //photo styles

  photoSection: {
    marginBottom: 16,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  removePhotoButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  removePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
});