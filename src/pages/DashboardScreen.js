import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { subscribeToEvents, deleteEvent, toggleFavorite, getUserFavorites } from '../config/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { colors, spacing } from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import EventCard from '../components/EventCard';

export default function DashboardScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const categories = ['All', 'Conference', 'Workshop', 'Meetup', 'Social', 'Sports', 'Music', 'Food'];

  useEffect(() => {
    const unsubscribe = subscribeToEvents(setEvents);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserFavorites();
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedCategory]);

  const loadUserFavorites = async () => {
    try {
      const userFavorites = await getUserFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const handleFavorite = async (eventId) => {
    try {
      await toggleFavorite(user.uid, eventId);
      await loadUserFavorites();
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this event?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => {
          try {
            await deleteEvent(id);
          } catch(e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserFavorites();
    setRefreshing(false);
  };

  const renderCategoryFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      {categories.map((category) => (
        <Button
          key={category}
          title={category}
          variant={selectedCategory === category ? 'primary' : 'outline'}
          size="small"
          onPress={() => setSelectedCategory(category)}
          style={styles.categoryButton}
        />
      ))}
    </ScrollView>
  );

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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
        </View>
        <Button
          title="Logout"
          variant="outline"
          size="small"
          onPress={() => logout()}
        />
      </View>
      
      <Input
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      
      {renderCategoryFilter()}
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredEvents.length} events found
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No events found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedCategory !== 'All' 
          ? 'Try adjusting your search or filters'
          : 'Be the first to create an event!'
        }
      </Text>
      <Button
        title="Create Event"
        onPress={() => navigation.navigate('CreateEditEvent')}
        style={styles.createButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={renderEventItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.fab}>
        <Button
          title="+ Create Event"
          onPress={() => navigation.navigate('CreateEditEvent')}
          style={styles.fabButton}
        />
      </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchInput: {
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    marginBottom: spacing.sm,
  },
  categoryButton: {
    marginRight: spacing.sm,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.md,
    left: spacing.md,
  },
  fabButton: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});