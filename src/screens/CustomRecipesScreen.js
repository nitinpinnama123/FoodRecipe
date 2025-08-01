import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice"; // adjust path accordingly
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CustomRecipesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const recipe = route.params?.recipe;

  // Redux: get favorite recipes array from state
  const favoriteRecipes = useSelector(
    (state) => state.favorites.favoriteRecipes || []
  );

  // Check if current recipe is favorited by its idCategory
  const isFavorite = recipe ? favoriteRecipes.includes(recipe.idCategory) : false;

  const handleToggleFavorite = () => {
    if (recipe) {
      dispatch(toggleFavorite(recipe.idCategory));
    }
  };

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text>No Recipe Details Available</Text>
      </View>
    );
  }

  // Using recipe.idCategory as "index" for height logic
  const index = parseInt(recipe.idCategory, 10) || 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Container */}
      <View testID="imageContainer">
        <Image
          source={{ uri: recipe.image }}
          style={[
            styles.articleImage,
            { height: index % 3 === 0 ? hp(25) : hp(35) },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Top Buttons Container */}
      <View style={styles.topButtonsContainer} testID="topButtonsContainer">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>GoBack</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.buttonText}>{isFavorite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View testID="contentContainer" style={styles.contentContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View>
          <Text style={styles.contentLabel}>Content</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#fff",
  },
  articleImage: {
    width: wp("90%"),
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: hp("2%"),
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  backButton: {
    backgroundColor: "#3498db",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 5,
  },
  favoriteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  contentContainer: {
    paddingTop: hp("1%"),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  contentLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: hp("0.5%"),
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomRecipesScreen;