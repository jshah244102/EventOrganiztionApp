import { db, auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  where,
} from "firebase/firestore";

const eventsCol = collection(db, 'events');

export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const createEvent = async (event) => {
  const docRef = await addDoc(eventsCol, { ...event, createdAt: new Date() });
  return docRef.id;
};

export const updateEvent = (id, changes) =>
  updateDoc(doc(db, 'events', id), changes);

export const deleteEvent = (id) =>
  deleteDoc(doc(db, 'events', id));

export const subscribeToEvents = (onUpdate) => {
  return onSnapshot(query(eventsCol, orderBy('createdAt', 'desc')), snapshot => {
    const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(events);
  });
};

// Favorites functionality
export const toggleFavorite = async (userId, eventId) => {
  const userFavoritesRef = doc(db, 'userFavorites', userId);
  const userFavoritesDoc = await getDocs(query(collection(db, 'userFavorites'), where('userId', '==', userId)));
  
  if (userFavoritesDoc.empty) {
    await setDoc(userFavoritesRef, {
      userId,
      favorites: [eventId],
      updatedAt: new Date()
    });
  } else {
    const currentFavorites = userFavoritesDoc.docs[0].data().favorites || [];
    const updatedFavorites = currentFavorites.includes(eventId)
      ? currentFavorites.filter(id => id !== eventId)
      : [...currentFavorites, eventId];
    
    await updateDoc(userFavoritesRef, {
      favorites: updatedFavorites,
      updatedAt: new Date()
    });
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const userFavoritesRef = doc(db, 'userFavorites', userId);
    const userFavoritesDoc = await getDoc(userFavoritesRef);
    
    if (userFavoritesDoc.exists()) {
      return userFavoritesDoc.data().favorites || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
};

// RSVP functionality
export const rsvpToEvent = async (userId, eventId, status = 'attending') => {
  const rsvpRef = doc(db, 'rsvps', `${userId}_${eventId}`);
  await setDoc(rsvpRef, {
    userId,
    eventId,
    status,
    createdAt: new Date()
  });
  
  // Update event attendees count
  const eventRef = doc(db, 'events', eventId);
  const eventDoc = await getDoc(eventRef);
  
  if (eventDoc.exists()) {
    const currentAttendees = eventDoc.data().attendees || [];
    const updatedAttendees = currentAttendees.includes(userId)
      ? currentAttendees
      : [...currentAttendees, userId];
    
    await updateDoc(eventRef, {
      attendees: updatedAttendees
    });
  }
};

export const getUserRSVPs = async (userId) => {
  const rsvpsQuery = query(
    collection(db, 'rsvps'),
    where('userId', '==', userId)
  );
  const rsvpsSnapshot = await getDocs(rsvpsQuery);
  return rsvpsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Event recommendations based on user preferences
export const getRecommendedEvents = async (userId) => {
  try {
    // Get user's favorite categories from their RSVP history
    const userRSVPs = await getUserRSVPs(userId);
    const userFavorites = await getUserFavorites(userId);
    
    // Get all events
    const eventsSnapshot = await getDocs(query(eventsCol, orderBy('createdAt', 'desc')));
    const allEvents = eventsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Simple recommendation algorithm
    const recommendedEvents = allEvents
      .filter(event => event.ownerId !== userId) // Don't recommend own events
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        // Boost score for favorited categories
        if (userFavorites.includes(a.id)) scoreA += 10;
        if (userFavorites.includes(b.id)) scoreB += 10;
        
        // Boost score for events with more attendees
        scoreA += (a.attendees?.length || 0);
        scoreB += (b.attendees?.length || 0);
        
        return scoreB - scoreA;
      })
      .slice(0, 10); // Return top 10 recommendations
    
    return recommendedEvents;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};
