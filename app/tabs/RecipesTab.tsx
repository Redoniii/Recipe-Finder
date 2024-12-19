import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Image, 
  ScrollView 
} from 'react-native';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const API_KEY = '650ff51e3fc04437b4bde0a9369813db';

// Allowed diets example: "vegetarian", "vegan", "gluten free"
const DIET_OPTIONS = ['none', 'vegetarian', 'vegan', 'gluten free'];

type Recipe = {
  id: number;
  title: string;
  image: string;
};

export default function RecipesTab() {
  const { mealPlan, setMealPlan, favorites, setFavorites } = useAppContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('pasta');
  const [selectedDiet, setSelectedDiet] = useState('none');
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [searchQuery, selectedDiet, sortByPopularity]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(searchQuery)}&number=10&apiKey=${API_KEY}&addRecipeInformation=true`;
      if (selectedDiet !== 'none') {
        url += `&diet=${encodeURIComponent(selectedDiet)}`;
      }
      if (sortByPopularity) {
        url += `&sort=popularity`;
      }
      const response = await axios.get(url);
      setRecipes(response.data.results || []);
    } catch (error) {
      console.log('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const addToMealPlan = (recipe: Recipe) => {
    if (!mealPlan.find((r) => r.id === recipe.id)) {
      setMealPlan((prev) => [...prev, recipe]);
    }
  };

  const addToFavorites = (recipe: Recipe) => {
    if (!favorites.find((fav) => fav.id === recipe.id)) {
      setFavorites((prev) => [...prev, recipe]);
    }
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => addToMealPlan(item)} style={styles.actionButton}>
            <Text style={styles.actionText}>Add to Meal Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addToFavorites(item)} style={styles.actionButton}>
            <Text style={styles.actionText}>☆ Favorite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Find Recipes</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={fetchRecipes}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DIET_OPTIONS.map((diet) => (
            <TouchableOpacity 
              key={diet} 
              onPress={() => setSelectedDiet(diet)}
              style={[
                styles.filterButton, 
                selectedDiet === diet && styles.filterButtonActive
              ]}
            >
              <Text style={styles.filterButtonText}>{diet}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => setSortByPopularity((prev) => !prev)}
        >
          <Text style={styles.sortButtonText}>
            {sortByPopularity ? 'Sort: Popularity ✓' : 'Sort: Popularity'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9', marginTop: 40 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchContainer: {
    flexDirection: 'row', 
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#fff'
  },
  filterContainer: {
    flexDirection: 'row', 
    marginBottom: 16
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 16,
    marginRight: 8
  },
  filterButtonActive: {
    backgroundColor: '#2196F3'
  },
  filterButtonText: {
    color: '#000'
  },
  sortContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 16
  },
  sortButtonText: {
    color: '#000'
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee'
  },
  recipeImage: {
    width: 100,
    height: 100
  },
  recipeInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between'
  },
  recipeTitle: {
    fontSize: 16, 
    fontWeight: 'bold'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8
  },
  actionButton: {
    marginRight: 8,
    backgroundColor: '#2196F3',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  actionText: {
    color: '#fff'
  }
});
