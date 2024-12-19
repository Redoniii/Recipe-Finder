import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function MealPlanTab() {
  const { mealPlan, setMealPlan } = useAppContext();

  const removeMeal = (id: number) => {
    setMealPlan((prev) => prev.filter((meal) => meal.id !== id));
  };

  const renderMeal = ({ item }: { item: { id: number; title: string; image?: string } }) => (
    <View style={styles.mealItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.mealImage} />
      )}
      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => removeMeal(item.id)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Meal Plan</Text>
      {mealPlan.length === 0 ? (
        <Text style={styles.emptyText}>No meals added yet. Add some from the Recipes tab!</Text>
      ) : (
        <FlatList
          data={mealPlan}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMeal}
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
  mealItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    overflow: 'hidden'
  },
  mealImage: {
    width: 80,
    height: 80
  },
  mealInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between'
  },
  mealTitle: {
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
