// screens/ProfileDetails.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileItem from './ProfileItem';
import { useTheme } from '../constants/theme';

interface UserData {
  email: string;
  phone: string;
  location: string;
}

interface ProfileDetailsProps {
  userData: UserData;
  onEditPress: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userData, onEditPress }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.detailsCard, { backgroundColor: colors.surface, shadowColor: colors.textPrimary }]}>
      <ProfileItem 
        icon="mail-outline" 
        title="Email" 
        value={userData.email} 
        onPress={onEditPress}
      />
      <ProfileItem 
        icon="call-outline" 
        title="Phone" 
        value={userData.phone} 
        onPress={onEditPress}
      />
      <ProfileItem 
        icon="location-outline" 
        title="Location" 
        value={userData.location} 
        onPress={onEditPress}
        isLast={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  detailsCard: {
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default ProfileDetails;