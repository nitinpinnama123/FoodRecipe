import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const MyRecipeScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved recipes
  const fetchRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem("customrecipes");
      const parsed = stored ? JSON.parse(stored) : [];
      setRecipes(parsed);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRecipes);
    return unsubscribe;
  }, [navigation]);

  // Handle edit
  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
    });
  };

  // Delete without Alert (for now)
  const deleteRecipe = async (index) => {
    try {
      const updated = [...recipes];
      updated.splice(index, 1);
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updated));
      setRecipes(updated);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("RecipesFormScreen")}>
        <Text style={styles.addButtonText}>Add Recipe</Text>
      </TouchableOpacity>

      {recipes.map((recipe, index) => (
        <View key={index} style={styles.card}>
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.image} />
          ) : null}

          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description}>
            {recipe.description?.substring(0, 80) || ""}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editBtn} onPress={() => editRecipe(recipe, index)}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteRecipe(index)}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    marginTop: 4,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "#2980b9",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: "#c0392b",
    padding: 8,
    borderRadius: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default MyRecipeScreen;