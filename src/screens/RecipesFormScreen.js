import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const RecipesFormScreen = ({ route }) => {
  const navigation = useNavigation();
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};

  // Initialize state with existing recipe data if editing, else empty strings
  const [title, setTitle] = useState(recipeToEdit?.title || "");
  const [image, setImage] = useState(recipeToEdit?.image || "");
  const [description, setDescription] = useState(recipeToEdit?.description || "");

  // Save recipe function
  const saverecipe = async () => {
    try {
      // Validate required fields
      if (!title.trim()) {
        Alert.alert("Validation Error", "Title cannot be empty.");
        return;
      }

      const newrecipe = { title, image, description };

      // Retrieve existing recipes from AsyncStorage
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      if (recipeToEdit) {
        // Editing existing recipe: update it
        if (recipeIndex !== undefined && recipes[recipeIndex]) {
          recipes[recipeIndex] = newrecipe;
        } else {
          Alert.alert("Error", "Recipe to edit not found.");
          return;
        }
      } else {
        // Adding new recipe: append to array
        recipes.push(newrecipe);
      }

      // Save updated recipes array back to AsyncStorage
      await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));

      // Notify parent component if editing
      if (recipeToEdit && typeof onrecipeEdited === "function") {
        onrecipeEdited();
      }

      // Navigate back to previous screen
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe:", error);
      Alert.alert("Error", "There was a problem saving the recipe.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.placeholderText}>Upload Image URL</Text>
      )}
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={saverecipe}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("5%"),
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: wp("3%"),
    marginBottom: hp("2%"),
    borderRadius: 5,
    fontSize: 16,
  },
  descriptionInput: {
    height: hp("15%"),
    textAlignVertical: "top",
  },
  imagePreview: {
    width: wp("80%"),
    height: hp("25%"),
    alignSelf: "center",
    marginBottom: hp("2%"),
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  saveButton: {
    backgroundColor: "#2e86de",
    paddingVertical: hp("1.5%"),
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default RecipesFormScreen;