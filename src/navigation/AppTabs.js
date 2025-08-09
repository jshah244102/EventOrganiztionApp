import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../pages/DashboardScreen';
import FavoritesScreen from '../pages/FavoritesScreen';
import CreateEditEventScreen from '../pages/CreateEditEventScreen';
import EventDetailsScreen from '../pages/EventDetailsScreen';
import RecommendationsScreen from '../pages/RecommendationsScreen';
import CalendarScreen from '../pages/CalendarScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack(){
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Events' }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen 
        name="CreateEditEvent" 
        component={CreateEditEventScreen}
        options={({ route }) => ({
          title: route.params?.event ? 'Edit Event' : 'Create Event'
        })}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack(){
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="FavoritesList" 
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen 
        name="CreateEditEvent" 
        component={CreateEditEventScreen}
        options={({ route }) => ({
          title: route.params?.event ? 'Edit Event' : 'Create Event'
        })}
      />
    </Stack.Navigator>
  );
}

function CreateStack(){
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CreateEvent" 
        component={CreateEditEventScreen}
        options={{ title: 'Create Event' }}
      />
    </Stack.Navigator>
  );
}

function RecommendationsStack(){
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="RecommendationsList" 
        component={RecommendationsScreen}
        options={{ title: 'Recommendations' }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen 
        name="CreateEditEvent" 
        component={CreateEditEventScreen}
        options={({ route }) => ({
          title: route.params?.event ? 'Edit Event' : 'Create Event'
        })}
      />
    </Stack.Navigator>
  );
}

function CalendarStack(){
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CalendarView" 
        component={CalendarScreen}
        options={{ title: 'Calendar' }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen 
        name="CreateEditEvent" 
        component={CreateEditEventScreen}
        options={({ route }) => ({
          title: route.params?.event ? 'Edit Event' : 'Create Event'
        })}
      />
    </Stack.Navigator>
  );
}

export default function AppTabs(){
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🎉' : '📅'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarStack}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📅' : '🗓️'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateStack}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '➕' : '✏️'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Recommendations" 
        component={RecommendationsStack}
        options={{
          tabBarLabel: 'For You',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🎯' : '🤖'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesStack}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '❤️' : '🤍'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
