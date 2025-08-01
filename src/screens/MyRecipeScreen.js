import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const MyRecipeScreen = () => {
  const navigation = useNavigation();

  const [recipes, setrecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from AsyncStorage
  const fetchrecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      if (storedRecipes) {
        setrecipes(JSON.parse(storedRecipes));
      } else {
        setrecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchrecipes();
  }, []);

  // Handle recipe card press - view recipe details
  const handlerecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  // Handle add new recipe button press
  const handleAddrecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  // Edit existing recipe
  const editrecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
      // Optionally, you can pass a callback here to refresh or update list after editing
    });
  };

  // Delete recipe from list and AsyncStorage
  const deleterecipe = async (index) => {
    try {
      Alert.alert(
        "Delete Recipe",
        "Are you sure you want to delete this recipe?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const updatedrecipes = [...recipes];
              updatedrecipes.splice(index, 1);
              await AsyncStorage.setItem(
                "customrecipes",
                JSON.stringify(updatedrecipes)
              );
              setrecipes(updatedrecipes);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header & Add Recipe Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Recipes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddrecipe}>
          <Text style={styles.addButtonText}>Add New Recipe</Text>
        </TouchableOpacity>
      </View>

      {recipes.length === 0 ? (
        <View style={styles.centered}>
          <Text>No recipes found. Add your first recipe!</Text>
        </View>
      ) : (
        <ScrollView>
          {recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <TouchableOpacity
                testID="handlerecipeBtn"
                onPress={() => handlerecipeClick(recipe)}
                style={styles.imageWrapper}
              >
                {recipe.image ? (
                  <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipeImage}
                  />
                ) : null}
              </TouchableOpacity>

              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text testID="recipeDescp" style={styles.recipeDescription}>
                  {recipe.description
                    ? recipe.description.length > 50
                      ? recipe.description.substring(0, 50) + "…"
                      : recipe.description
                    : ""}
                </Text>

                <View testID="editDeleteButtons" style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editrecipe(recipe, index)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleterecipe(index)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#3498db",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  recipeCard: {
    flexDirection: "row",
    marginBottom: hp("2%"),
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  imageWrapper: {
    width: wp("30%"),
    height: hp("15%"),
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  recipeInfo: {
    flex: 1,
    padding: wp("3%"),
    justifyContent: "space-between",
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: hp("0.5%"),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: wp("3%"),
  },
  editButton: {
    backgroundColor: "#2980b9",
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("3%"),
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#c0392b",
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("3%"),
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default MyRecipeScreen;