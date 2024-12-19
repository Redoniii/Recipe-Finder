import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Recipe = {
  id: number;
  title: string;
  image?: string;
};

type AppContextType = {
  mealPlan: Recipe[];
  setMealPlan: React.Dispatch<React.SetStateAction<Recipe[]>>;
  favorites: Recipe[];
  setFavorites: React.Dispatch<React.SetStateAction<Recipe[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [mealPlan, setMealPlan] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // Keys to store data in AsyncStorage
  const MEAL_PLAN_KEY = '@mealPlan';
  const FAVORITES_KEY = '@favorites';

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedMealPlan = await AsyncStorage.getItem(MEAL_PLAN_KEY);
        const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (savedMealPlan) {
          setMealPlan(JSON.parse(savedMealPlan));
        }
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.warn('Error loading stored data: ', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(mealPlan));
      } catch (error) {
        console.warn('Error saving meal plan: ', error);
      }
    };
    storeData();
  }, [mealPlan]);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.warn('Error saving favorites: ', error);
      }
    };
    storeData();
  }, [favorites]);

  return (
    <AppContext.Provider value={{ mealPlan, setMealPlan, favorites, setFavorites }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
