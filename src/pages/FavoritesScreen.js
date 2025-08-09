import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { getUserFavorites, subscribeToEvents, toggleFavorite, deleteEvent } from '../config/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/colors';
import EventCard from '../components/EventCard';
import Button from '../components/Button';

export default function FavoritesScreen({ navigation }) {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(setAllEvents);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (allEvents.length > 0 && favorites.length > 0) {
      const filteredFavorites = allEvents.filter(event => favorites.includes(event.id));
      setFavoriteEvents(filteredFavorites);
    } else {
      setFavoriteEvents([]);
    }
    setLoading(false);
  }, [allEvents, favorites]);

  const loadFavorites = async () => {
    try {
      const userFavorites = await getUserFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleFavorite = async (eventId) => {
    try {
      await toggleFavorite(user.uid, eventId);
      await loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      Alert.alert('Success', 'Event deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event: ' + error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const renderEventItem = ({ item }) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
      onFavorite={() => handleFavorite(item.id)}
      isFavorite={true}
      onDelete={handleDelete}
      currentUserId={user?.uid}
      showActions={true}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>No Favorite Events</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring events and add them to your favorites!
      </Text>
      <Button
        title="Explore Events"
        onPress={() => navigation.navigate('Home')}
        style={styles.exploreButton}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorite Events</Text>
        <Text style={styles.subtitle}>
          {favoriteEvents.length} event{favoriteEvents.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      <FlatList
        data={favoriteEvents}
        keyExtractor={item => item.id}
        renderItem={renderEventItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  exploreButton: {
    marginTop: spacing.md,
  },
});
