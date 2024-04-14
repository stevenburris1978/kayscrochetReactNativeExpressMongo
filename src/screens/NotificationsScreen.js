import React, { useContext } from 'react';
import { FlatList, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import Constants from "expo-constants";
import Items from '../components/Item/Items';
import TaskContext from "../context/TaskContext";

function NotificationsScreen() {
  const { itemList } = useContext(TaskContext);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.screenTitle}>Notifications:</Text>
      <View style={styles.itemScreen}>
        <FlatList
          data={itemList}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <Items
              description={item.description}
              date={item.date}  
              images={item.images}
              showSwipeIcon={false}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.StatusBarHeight,
    backgroundColor: "#F7E7F8",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'hsl(270, 50%, 60%)',
    marginLeft: "1%",
    paddingLeft: 5,
    paddingTop: 10,
  },
  itemScreen: {
    padding: 5,
  },
});

export default NotificationsScreen;
