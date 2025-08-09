import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { subscribeToEvents, toggleFavorite, getUserFavorites, deleteEvent } from '../config/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import EventCalendar from '../components/EventCalendar';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(setEvents);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const userFavorites = await getUserFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const handleDateSelect = (dateString) => {
    // Optional: You can add additional logic when a date is selected
    console.log('Selected date:', dateString);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      Alert.alert('Success', 'Event deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <EventCalendar
        events={events}
        onEventPress={handleEventPress}
        onDateSelect={handleDateSelect}
        onEventDelete={handleDeleteEvent}
        currentUserId={user?.uid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});