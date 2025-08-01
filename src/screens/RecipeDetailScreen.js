import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
  } from "react-native";
  import React from "react";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { useNavigation } from "@react-navigation/native";
  import { useDispatch, useSelector } from "react-redux";
  import { toggleFavorite } from "../redux/favoritesSlice";
  
  export default function RecipeDetailScreen(props) {
    const recipe = props.route.params;
  
    const dispatch = useDispatch();
    const favoriterecipes = useSelector(
      (state) => state.favorites.favoriterecipes
    );
    const isFavourite = favoriterecipes?.some(
      (favrecipe) => favrecipe.idFood === recipe.idFood
    );
  
    const navigation = useNavigation();
  
    const handleToggleFavorite = () => {
      dispatch(toggleFavorite(recipe));
    };
  
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recipe Image */}
        <View style={styles.imageContainer} testID="imageContainer">
          <Image source={{ uri: recipe.recipeImage }} style={styles.recipeImage} />
        </View>
  
        {/* Back & Favorite Buttons */}
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
            <Text style={styles.buttonText}>{isFavourite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>
  
        {/* Title */}
        <View testID="recipeTitle">
          <Text style={styles.mealName}>{recipe.recipeName}</Text>
        </View>
  
        {/* Category */}
        <View testID="recipeCategory">
          <Text style={styles.mealCategory}>{recipe.recipeCategory}</Text>
        </View>
  
        {/* Misc Info */}
        <View testID="miscContainer" style={styles.miscContainer}>
          <View style={styles.miscItem}>
            <Text style={styles.miscIcon}>⏱</Text>
            <Text style={styles.miscText}>{recipe.minutes} mins</Text>
          </View>
          <View style={styles.miscItem}>
            <Text style={styles.miscIcon}>🍽</Text>
            <Text style={styles.miscText}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.miscItem}>
            <Text style={styles.miscIcon}>🔥</Text>
            <Text style={styles.miscText}>{recipe.calories} cal</Text>
          </View>
          <View style={styles.miscItem}>
            <Text style={styles.miscIcon}>📂</Text>
            <Text style={styles.miscText}>{recipe.recipeType}</Text>
          </View>
        </View>
  
        {/* Ingredients Section */}
        <View testID="sectionContainer" style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View testID="ingredientsList" style={styles.ingredientsList}>
            {recipe.ingredients?.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>
                  {item.ingredientName} - {item.measure}
                </Text>
              </View>
            ))}
          </View>
        </View>
  
        {/* Instructions Section */}
        <View testID="sectionContainer" style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            {recipe.recipeInstructions}
          </Text>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
    },
    recipeImage: {
      width: wp(98),
      height: hp(45),
      borderRadius: 20,
      marginTop: 4,
    },
    topButtonsContainer: {
      width: "100%",
      position: "absolute",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: hp(4),
    },
    backButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: "#f0f0f0",
      marginLeft: wp(5),
    },
    buttonText: {
      fontSize: hp(2),
      color: "#333",
      fontWeight: "bold",
    },
    favoriteButton: {
      padding: 10,
      borderRadius: 20,
      marginRight: wp(5),
      borderWidth: 1,
    },
    mealName: {
      fontSize: hp(4),
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      marginVertical: 10,
      fontFamily: "Roboto",
    },
    mealCategory: {
      fontSize: hp(2),
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
      fontFamily: "Roboto",
    },
    miscContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
      paddingHorizontal: wp(4),
    },
    miscItem: {
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 3,
    },
    miscIcon: {
      fontSize: hp(3.5),
      marginBottom: 5,
    },
    miscText: {
      fontSize: hp(2),
      fontWeight: "600",
      fontFamily: "Lato",
    },
    sectionContainer: {
      marginHorizontal: wp(5),
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: hp(2.8),
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
      fontFamily: "Lato",
    },
    ingredientsList: {
      marginLeft: wp(4),
    },
    ingredientItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(1),
      padding: 10,
      backgroundColor: "#FFF9E1",
      borderRadius: 8,
      elevation: 2,
    },
    ingredientBullet: {
      backgroundColor: "#FFD700",
      borderRadius: 50,
      height: hp(1.5),
      width: hp(1.5),
      marginRight: wp(2),
    },
    ingredientText: {
      fontSize: hp(1.9),
      color: "#333",
      fontFamily: "Lato",
    },
    instructionsText: {
      fontSize: hp(2),
      color: "#444",
      lineHeight: hp(3),
      textAlign: "justify",
      fontFamily: "Lato",
    },
  });