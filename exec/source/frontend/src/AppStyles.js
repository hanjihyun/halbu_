import { StyleSheet, Dimensions } from 'react-native';

// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 250;
const RECIPE_ITEM_MARGIN = 5;

const STAR_ITEM_SIZE = 30;

// 2 photos per width
export const RecipeCard = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: RECIPE_ITEM_MARGIN,
        marginTop: 15,
        width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
        height: RECIPE_ITEM_HEIGHT,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 15,
    },
    photo: {
        width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
        height: RECIPE_ITEM_HEIGHT,
        borderRadius: 10,
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#9B85CB',
        width: '100%',
        // borderBottomLeftRadius: 0,
    },
    fav: {
        position: 'absolute',
        alignSelf: 'flex-end',
        top: 2,
        right: 2,
    },
    favbt: {
        width: STAR_ITEM_SIZE,
        height: STAR_ITEM_SIZE,
    },
    result: {
        justifyContent: 'center',
        width: 130,
        height: 130,
    },
    title: {
        flex: 1,
        fontSize: 23,
        fontFamily: 'Binggrae-Bold',
        textAlign: 'center',
        color: '#444444',
        marginTop: 20,
        marginRight: 5,
        marginLeft: 5,
        justifyContent: 'center',
    },
    category: {
        marginTop: 5,
        marginBottom: 5,
    },
});
