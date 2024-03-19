import React, { useContext } from 'react';
import { FlatList, StyleSheet, View, SafeAreaView } from 'react-native';
import Constants from "expo-constants";
import Items from '../components/Item/Items';
import TaskContext from "../context/TaskContext";

function NotificationsScreen() {

  const { itemList } = useContext(TaskContext);

    return (

      <SafeAreaView style={styles.screen}>
        <View>
          <FlatList
            data={itemList}
            keyExtractor={(itemList) => itemList.id}
            renderItem={({ item }) => (
              <Items
                description={item.data.description}
                date={item.data.date}
                images={item.data.images}
              />
            )}
          />
        </View>
      </SafeAreaView>
    
    );
  
  }
  
  const styles = StyleSheet.create({
    screen: {
      paddingTop: Constants.StatusBarHeight,
      backgroundColor: "#F7E7F8",
    },
    
  });

  export default NotificationsScreen;