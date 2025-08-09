import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { rsvpToEvent, getUserRSVPs, toggleFavorite, getUserFavorites, deleteEvent } from '../config/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing, borderRadius } from '../theme/colors';
import Button from '../components/Button';

export default function EventDetailsScreen({ route, navigation }) {
  const event = route.params?.event;
  const { user } = useContext(AuthContext);
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && event) {
      checkRSVPStatus();
      checkFavoriteStatus();
    }
  }, [user, event]);

  const checkRSVPStatus = async () => {
    try {
      const userRSVPs = await getUserRSVPs(user.uid);
      const hasRSVPed = userRSVPs.some(rsvp => rsvp.eventId === event.id);
      setIsRSVPed(hasRSVPed);
    } catch (error) {
      console.error('Error checking RSVP status:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await getUserFavorites(user.uid);
      setIsFavorite(favorites.includes(event.id));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleRSVP = async () => {
    setLoading(true);
    try {
      await rsvpToEvent(user.uid, event.id);
      setIsRSVPed(true);
      Alert.alert('Success', 'You have successfully RSVP\'d to this event!');
    } catch (error) {
      Alert.alert('Error', 'Failed to RSVP to event');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(user.uid, event.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleDeleteEvent = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone and all RSVPs will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event.id);
              Alert.alert('Success', 'Event deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event: ' + error.message);
            }
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Date not specified';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return 'Time not specified';
    const eventTime = time.toDate ? time.toDate() : new Date(time);
    return eventTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No event details available</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  const isOwner = event.ownerId === user?.uid;
  const attendeeCount = event.attendees?.length || 0;
  const maxAttendees = event.maxAttendees;
  const isFull = maxAttendees && attendeeCount >= maxAttendees;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category || 'General'}</Text>
        </View>
        <Button
          title={isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          variant="outline"
          size="small"
          onPress={handleFavorite}
        />
      </View>

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Date:</Text>
          <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕐 Time:</Text>
          <Text style={styles.detailValue}>{formatTime(event.time)}</Text>
        </View>
        
        {event.location && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Location:</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👥 Attendees:</Text>
          <Text style={styles.detailValue}>
            {attendeeCount}{maxAttendees ? ` / ${maxAttendees}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {!isOwner && (
          <>
            {!isRSVPed && !isFull && (
              <Button
                title="RSVP to Event"
                onPress={handleRSVP}
                loading={loading}
                style={styles.rsvpButton}
              />
            )}
            
            {isRSVPed && (
              <View style={styles.rsvpedContainer}>
                <Text style={styles.rsvpedText}>✅ You're attending this event!</Text>
              </View>
            )}
            
            {isFull && !isRSVPed && (
              <View style={styles.fullContainer}>
                <Text style={styles.fullText}>🚫 This event is full</Text>
              </View>
            )}
          </>
        )}

        {isOwner && (
          <View style={styles.ownerActions}>
            <View style={styles.ownerButtonsRow}>
              <Button
                title="Edit Event"
                onPress={() => navigation.navigate('CreateEditEvent', { event })}
                style={styles.editButton}
              />
              <Button
                title="Delete Event"
                variant="danger"
                onPress={handleDeleteEvent}
                style={styles.deleteButton}
              />
            </View>
            <Text style={styles.ownerText}>You are the organizer of this event</Text>
          </View>
        )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  categoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  detailsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  actionContainer: {
    marginTop: spacing.md,
  },
  rsvpButton: {
    marginBottom: spacing.md,
  },
  rsvpedContainer: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rsvpedText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  fullContainer: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fullText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  ownerActions: {
    alignItems: 'center',
  },
  ownerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.sm,
  },
  editButton: {
    flex: 0.48,
  },
  deleteButton: {
    flex: 0.48,
  },
  ownerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});