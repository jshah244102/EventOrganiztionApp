import React, { useState, useContext } from 'react';
import { View, ScrollView, Alert, StyleSheet, Text } from 'react-native';
import { createEvent, updateEvent } from '../config/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import DateTimePicker from '../components/DateTimePicker';

export default function CreateEditEventScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const existingEvent = route.params?.event;

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [category, setCategory] = useState(existingEvent?.category || 'General');
  const [location, setLocation] = useState(existingEvent?.location || '');
  const [date, setDate] = useState(
    existingEvent?.date 
      ? (existingEvent.date.toDate ? existingEvent.date.toDate() : new Date(existingEvent.date))
      : null
  );
  const [time, setTime] = useState(
    existingEvent?.time 
      ? (existingEvent.time.toDate ? existingEvent.time.toDate() : new Date(existingEvent.time))
      : null
  );
  const [maxAttendees, setMaxAttendees] = useState(existingEvent?.maxAttendees?.toString() || '');
  const [loading, setLoading] = useState(false);

  const categories = ['General', 'Conference', 'Workshop', 'Meetup', 'Social', 'Sports', 'Music', 'Food'];

  const validate = () => {
    if (!title.trim()) return 'Title is required';
    if (!description.trim()) return 'Description is required';
    if (!location.trim()) return 'Location is required';
    if (!date) return 'Date is required';
    if (!time) return 'Time is required';
    if (maxAttendees && isNaN(parseInt(maxAttendees))) return 'Max attendees must be a number';
    
    // Check if the event date is in the past
    const eventDateTime = new Date(date);
    eventDateTime.setHours(time.getHours(), time.getMinutes());
    if (eventDateTime < new Date()) {
      return 'Event date and time cannot be in the past';
    }
    
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) return Alert.alert('Validation Error', error);

    setLoading(true);
    try {
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        date: date,
        time: time,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        attendees: existingEvent?.attendees || [],
      };

      if (existingEvent) {
        await updateEvent(existingEvent.id, eventData);
      } else {
        await createEvent({ ...eventData, ownerId: user.uid });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySelector = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <Button
            key={cat}
            title={cat}
            variant={category === cat ? 'primary' : 'outline'}
            size="small"
            onPress={() => setCategory(cat)}
            style={styles.categoryButton}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {existingEvent ? 'Edit Event' : 'Create New Event'}
      </Text>

      <Input
        label="Event Title *"
        placeholder="Enter event title"
        value={title}
        onChangeText={setTitle}
      />

      <Input
        label="Description *"
        placeholder="Describe your event"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.textArea}
      />

      {renderCategorySelector()}

      <Input
        label="Location *"
        placeholder="Event location or venue"
        value={location}
        onChangeText={setLocation}
      />

      <View style={styles.row}>
        <DateTimePicker
          label="Event Date *"
          placeholder="Select date"
          value={date}
          onChange={setDate}
          mode="date"
          containerStyle={styles.halfWidth}
        />
        <DateTimePicker
          label="Event Time *"
          placeholder="Select time"
          value={time}
          onChange={setTime}
          mode="time"
          containerStyle={styles.halfWidth}
        />
      </View>

      <Input
        label="Max Attendees (Optional)"
        placeholder="Leave empty for unlimited"
        value={maxAttendees}
        onChangeText={setMaxAttendees}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        />
        <Button
          title={existingEvent ? 'Update Event' : 'Create Event'}
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryButton: {
    marginRight: spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 0.45,
  },
  saveButton: {
    flex: 0.45,
  },
});