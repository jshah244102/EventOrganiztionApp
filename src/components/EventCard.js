import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function EventCard({ event, onPress, onFavorite, isFavorite, onDelete, currentUserId, showActions = true }) {
  const formatDate = (date) => {
    if (!date) return '';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date) return '';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isOwner = event.ownerId === currentUserId;

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete && onDelete(event.id)
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category || 'General'}</Text>
        </View>
        <View style={styles.actionButtons}>
          {showActions && (
            <TouchableOpacity onPress={onFavorite} style={styles.actionButton}>
              <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          )}
          {isOwner && onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
      <Text style={styles.description} numberOfLines={3}>{event.description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.dateTimeContainer}>
          {event.date && (
            <Text style={styles.dateText}>📅 {formatDate(event.date)}</Text>
          )}
          {event.time && (
            <Text style={styles.timeText}>🕐 {formatTime(event.time)}</Text>
          )}
        </View>
        {event.location && (
          <Text style={styles.locationText} numberOfLines={1}>📍 {event.location}</Text>
        )}
      </View>
      
      {event.attendees && (
        <View style={styles.attendeesContainer}>
          <Text style={styles.attendeesText}>
            {event.attendees.length} attending
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteActive: {
    transform: [{ scale: 1.1 }],
  },
  deleteIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  footer: {
    marginBottom: spacing.xs,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  attendeesContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
  },
  attendeesText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});