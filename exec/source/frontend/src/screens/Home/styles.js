import { StyleSheet, Dimensions } from 'react-native';
import { RecipeCard } from '../../AppStyles';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: RecipeCard.container,
    photo: RecipeCard.photo,
    title: RecipeCard.title,
    category: RecipeCard.category,
    fav: RecipeCard.fav,
    favbt: RecipeCard.favbt,
    result: RecipeCard.result,
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input: {
        fontFamily: 'Binggrae',
        color: 'black',
        margin: 5,
        height: height * 0.05,
        width: width * 0.8,
        fontSize: 20,
        borderColor: '#BCA4D7',
        borderRadius: 20,
        borderWidth: 4,
        textAlign: 'center',
        paddingTop: 5,
    },
});

export default styles;
