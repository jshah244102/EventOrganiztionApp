import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { getRecommendedEvents, toggleFavorite, getUserFavorites, deleteEvent } from '../config/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/colors';
import EventCard from '../components/EventCard';
import Button from '../components/Button';

export default function RecommendationsScreen({ navigation }) {
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      loadRecommendations();
      loadFavorites();
    }
  }, [user]);

  const loadRecommendations = async () => {
    try {
      const recommendations = await getRecommendedEvents(user.uid);
      setRecommendedEvents(recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

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
      // Refresh recommendations after deletion
      await loadRecommendations();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event: ' + error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    await loadFavorites();
    setRefreshing(false);
  };

  const renderEventItem = ({ item }) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
      onFavorite={() => handleFavorite(item.id)}
      isFavorite={favorites.includes(item.id)}
      onDelete={handleDelete}
      currentUserId={user?.uid}
      showActions={true}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🤖</Text>
      <Text style={styles.emptyTitle}>No Recommendations Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring and favoriting events to get personalized recommendations!
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
        <Text style={styles.loadingText}>Finding events you might like...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended for You</Text>
        <Text style={styles.subtitle}>
          Based on your interests and activity
        </Text>
      </View>

      <FlatList
        data={recommendedEvents}
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