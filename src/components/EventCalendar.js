import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function EventCalendar({ events, onDateSelect, onEventPress, onEventDelete, currentUserId }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    generateMarkedDates();
  }, [events]);

  useEffect(() => {
    if (selectedDate) {
      const eventsForDay = getEventsForDate(selectedDate);
      setDayEvents(eventsForDay);
    }
  }, [selectedDate, events]);

  const generateMarkedDates = () => {
    const marked = {};
    
    events.forEach(event => {
      if (event.date) {
        const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
        const dateString = eventDate.toISOString().split('T')[0];
        
        if (!marked[dateString]) {
          marked[dateString] = {
            marked: true,
            dotColor: colors.primary,
            events: []
          };
        }
        marked[dateString].events.push(event);
      }
    });

    // Add selection styling
    if (selectedDate && marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = colors.primary;
    } else if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        events: []
      };
    }

    setMarkedDates(marked);
  };

  const getEventsForDate = (dateString) => {
    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
      const eventDateString = eventDate.toISOString().split('T')[0];
      return eventDateString === dateString;
    });
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const eventTime = date.toDate ? date.toDate() : new Date(date);
    return eventTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onEventDelete && onEventDelete(eventId)
        }
      ]
    );
  };

  const renderEventItem = (event) => {
    const isOwner = event.ownerId === currentUserId;
    
    return (
      <TouchableOpacity
        key={event.id}
        style={styles.eventItem}
        onPress={() => onEventPress && onEventPress(event)}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.eventHeaderRight}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
              <Text style={styles.categoryText}>{event.category || 'General'}</Text>
            </View>
            {isOwner && onEventDelete && (
              <TouchableOpacity 
                onPress={() => handleDeleteEvent(event.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
        
        <View style={styles.eventFooter}>
          {event.time && (
            <Text style={styles.eventTime}>🕐 {formatTime(event.time)}</Text>
          )}
          {event.location && (
            <Text style={styles.eventLocation} numberOfLines={1}>📍 {event.location}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Conference': colors.primary,
      'Workshop': colors.secondary,
      'Meetup': colors.accent,
      'Social': colors.success,
      'Sports': colors.info,
      'Music': colors.warning,
      'Food': colors.error,
      'General': colors.textSecondary,
    };
    return categoryColors[category] || categoryColors['General'];
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: colors.surface,
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.text,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.surface,
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.textLight,
          dotColor: colors.primary,
          selectedDotColor: colors.surface,
          arrowColor: colors.primary,
          monthTextColor: colors.text,
          indicatorColor: colors.primary,
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      {selectedDate && (
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>
            Events on {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          
          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {dayEvents.length > 0 ? (
              dayEvents.map(renderEventItem)
            ) : (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events scheduled for this day</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventsContainer: {
    flex: 1,
    padding: spacing.md,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  eventHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.surface,
  },
  deleteButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  deleteIcon: {
    fontSize: 16,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  eventLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});