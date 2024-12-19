import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function FavoritesTab() {
  const { favorites, setFavorites } = useAppContext();

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const renderFavorite = ({ item }: { item: { id: number; title: string; image?: string } }) => (
    <View style={styles.favoriteItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.favoriteImage} />
      )}
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove from Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorite Recipes</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet. Add some from the Recipes tab!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavorite}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9',marginTop: 40 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    overflow: 'hidden'
  },
  favoriteImage: {
    width: 80,
    height: 80
  },
  favoriteInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between'
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  removeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8
  },
  removeButtonText: {
    color: '#fff'
  }
});
