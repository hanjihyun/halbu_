import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Button,
} from "react-native";

import Contacts from "react-native-contacts";
import ListItem from "./components/ListItem";
import Avatar from "./components/Avatar";
import SearchBar from "./components/SearchBar";
import { DrawerContentScrollView } from "@react-navigation/drawer";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);

    this.state = {
      contacts: [],
      searchPlaceholder: "Search",
      typeText: null,
      loading: true,
    };
  }

  search(text) {
    const phoneNumberRegex =
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === "" || text === null) {
      this.loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then((contacts) => {
        this.setState({ contacts });
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text).then((contacts) => {
        this.setState({ contacts });
      });
    } else {
      Contacts.getContactsMatchingString(text).then((contacts) => {
        this.setState({ contacts });
      });
    }
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
      }).then(() => {
        this.loadContacts();
      });
    } else {
      this.loadContacts();
    }
  }

  loadContacts() {
    Contacts.getAll()
      .then((contacts) => {
        this.setState({ contacts, loading: false });
      })
      .catch((e) => {
        this.setState({ loading: false });
      });

    Contacts.getCount().then((count) => {
      this.setState({ searchPlaceholder: `Search ${count} contacts` });
    });

    Contacts.checkPermission();
  }

  onPressContact(contact) {
    // var text = this.state.typeText;
    // this.setState({ typeText: null });
    // if (text === null || text === '')
    //   Contacts.openExistingContact(contact)
    // else {
    //   var newPerson = {
    //     recordID: contact.recordID,
    //     phoneNumbers: [{ label: 'mobile', number: text }]
    //   }
    //   Contacts.editExistingContact(newPerson).then(contact => {
    //     //contact updated
    //   });
    // }
  }

  async requestContactPermission() {}

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {/* <Button 
          title="김부리"
          onPress={() =>{
            if (Platform.OS === "android") {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: "Contacts",
                message: "This app would like to view your contacts."
              }).then(() => {
                this.loadContacts();
              });
            } else {
              this.loadContacts();
            }
          }
        }
        /> */}
        <View
          style={{
            paddingLeft: 100,
            paddingRight: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Image
            source={require("./logo.png")}
            style={{
              aspectRatio: 6,
              resizeMode: "contain"
            }}
          /> */}
        </View>
        {/* <Button title="Add new" onPress={() => this.addNew()} />
        <SearchBar
          searchPlaceholder={this.state.searchPlaceholder}
          onChangeText={this.search}
        /> */}

        {/* <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TextInput
            keyboardType='number-pad'
            style={styles.inputStyle}
            placeholder='Enter number to add to contact'
            onChangeText={text => this.setState({ typeText: text })}
            value={this.state.typeText}
          />
        </View> */}

        {this.state.loading === true ? (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {this.state.contacts.map((contact) => {
              return (
                <ListItem
                  leftElement={
                    <Avatar
                      img={
                        contact.hasThumbnail
                          ? { uri: contact.thumbnailPath }
                          : undefined
                      }
                      placeholder={getAvatarInitials(
                        `${contact.givenName} ${contact.familyName}`
                      )}
                      width={40}
                      height={40}
                    />
                  }
                  key={contact.recordID}
                  title={`${contact.givenName} ${contact.familyName}`}
                  description={`${contact.company}`}
                  onPress={() => {
                    console.log("김부리");
                    console.log(contact);
                    navigation.navigate("Photo", { contact });
                    //this.onPressContact(contact)
                  }}
                  onDelete={() =>
                    Contacts.deleteContact(contact).then(() => {
                      this.loadContacts();
                    })
                  }
                />
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  inputStyle: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "center",
  },
});

const getAvatarInitials = (textString) => {
  if (!textString) return "";
  const text = textString.trim();
  const textSplit = text.split(" ");

  if (textSplit.length <= 1) return text.charAt(0);

  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

  return initials;
};
