import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
/* import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer' */
import HomeScreen from "../screens/Home/HomeScreen";
import CategoriesScreen from "../screens/Categories/CategoriesScreen";
import RecipeScreen from "../screens/Recipe/RecipeScreen";
import RecipesListScreen from "../screens/RecipesList/RecipesListScreen";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import IngredientScreen from "../screens/Ingredient/IngredientScreen";
import IngredientsDetailsScreen from "../screens/IngredientsDetails/IngredientsDetailsScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import AuthLoadingScreen from "../screens/Login/AuthLoadingScreen";
import PhotoScreen from "../screens/Photo/PhotoScreen";
import ModifyPhoto from "../screens/Photo/ModifyPhoto";
import ModifyContacts from "../screens/Photo/ModifyContacts";
import RegistScreen from "../screens/Regist/Regist";

import ContactsScreen from "../screens/Photo/Contacts";
import ContactsScreen2 from "../screens/Photo/Contacts2";
/* const Stack = createStackNavigator();

function MainNavigator() {
  return(
    <Stack.Navigator
      screenOptions={{
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
          }
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Categories' component={CategoriesScreen}/>
      <Stack.Screen name='Recipe' component={RecipeScreen}/>
      <Stack.Screen name='RecipesList' component={RecipesListScreen} />
      <Stack.Screen name='Ingredient' component={IngredientScreen} />
      <Stack.Screen name='Search' component={SearchScreen} />
      <Stack.Screen name='IngredientsDetails' component={IngredientsDetailsScreen} />
    </Stack.Navigator>
  )
} */

const MainNavigator = createStackNavigator(
  {
    AuthLoading: {
      screen: AuthLoadingScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Home: HomeScreen,
    Categories: CategoriesScreen,
    Recipe: RecipeScreen,
    RecipesList: RecipesListScreen,
    Ingredient: IngredientScreen,
    IngredientsDetails: IngredientsDetailsScreen,
    Photo: {
      screen: PhotoScreen,
      navigationOptions: {
        title: "전화번호 등록",
      },
    },
    Regist: {
      screen: RegistScreen,
      navigationOptions: {
        title: "긴급전화번호 등록",
      },
    },
    Modify: {
      screen: ModifyPhoto,
      navigationOptions: {
        title: "전화번호 수정",
      },
    },
    ModifyContacts: {
      screen: ModifyContacts,
      navigationOptions: {
        title: "전화번호 수정",
      },
    },
    Contacts: {
      screen: ContactsScreen,
      navigationOptions: {
        title: "주소록",
      },
    },
    Contacts2: {
      screen: ContactsScreen2,
      navigationOptions: {
        title: "주소록",
      },
    },
  },
  {
    initialRouteName: "AuthLoading",
    // headerMode: 'float',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#D9C5E4",
      },
      headerTintColor: "#ffffff",
      headerTitleStyle: {
        fontFamily: "Binggrae-bold",
        // fontWeight: 'bold',
      },
    },
  }
);

/* const Drawer = createDrawerNavigator();

function DrawerStack() {
  return(
    <Drawer.Navigator
      drawerPosition='left'
      initialRouteName='Main'
      drawerStyle={{
        width: 250
      }}
      drawerContent={props=> DrawerContainer}
    >
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  )
} */

const DrawerStack = createDrawerNavigator(
  {
    Main: MainNavigator,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Main",
    drawerWidth: 250,
    contentComponent: DrawerContainer,
  }
);

/* export default function AppContainer() {
  return(
    <NavigationContainer>
      <DrawerStack/>
    </NavigationContainer>
  )
} */

export default AppContainer = createAppContainer(DrawerStack);

console.disableYellowBox = true;
