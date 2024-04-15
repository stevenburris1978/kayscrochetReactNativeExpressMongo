import React, { useState, useContext, useEffect } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Text, Alert, SafeAreaView } from 'react-native';
import AddItem from '../components/Item/AddItem';
import Constants from "expo-constants";
import Items from '../components/Item/Items';
import TaskContext from "../context/TaskContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from '../context/AuthContext';

const AdminScreen = () => {

  const { itemList, deleteItem, editItem, updateItem, fetchItems } = useContext(TaskContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [itemId, setItemId] = useState(null);
  const { userToken } = useContext(AuthContext);

  const handleEditItem = (item) => {
    setItemId(item._id);
    setDescription(item.description);
    setModalVisible(true);
    editItem(item);
  };
  
  // make the edit description modal open
  const handleAdminPress = () => {
    setModalVisible(false);
  };
  
  // finish update an item description
  const handleUpdateItem = async () => {
    if (itemId) {
      try {
        await updateItem(itemId, { description });
        setModalVisible(false);
        await fetchItems(); 
      } catch (error) {
        Alert.alert('Update Error', 'Failed to update the item.');
        console.error('Update error:', error);
      }
    }
  };

  // check if the admin is authenticated and show Admin notifications screen
  const checkAdminAuth = async () => {
    try {
      const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/admin/check-auth', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); 
        
      } else {
        Alert.alert('Authentication Failed', 'You are not authorized to access this page.');
      }
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      Alert.alert('Network Error', 'Unable to verify authentication.');
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  // below is the view to show the admin add item component and the item's list in one FlatList component
  return (
<SafeAreaView style={styles.screen}>
    
      <FlatList
        ListHeaderComponent={<AddItem />}
        ListHeaderComponentStyle={styles.headerComponent}
        data={itemList.filter(item => item)}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Items
            description={item.description}
            date={item.date} 
            images={item.images}
            
            renderRightActions={() => (

              <View style = {styles.actionsContainer}>
                <TouchableWithoutFeedback onPress={() => handleEditItem(item)}>                   
                  <View style={styles.pencilContainer}>
                    <MaterialCommunityIcons 
                      name="pencil"
                      size={40}
                      color="hsl(270, 50%, 60%)"
                    />                   
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => deleteItem(item._id)}>                
                  <View style={styles.trashContainer}>
                    <MaterialCommunityIcons 
                      name="trash-can"
                      size={40}
                      color="hsl(270, 50%, 60%)"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}  

          />

        )}
      
      />

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Item's Description"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateItem}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAdminPress}>
              <Text style={styles.buttonText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    
  </SafeAreaView>
  
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.StatusBarHeight,
    backgroundColor: "#F7E7F8",
  },
  container: {
    padding: 20,
    paddingTop: 100,
  },
  secondContainer: {
    padding: 20,
    paddingTop: 50,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 7,
  },
  description: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionsContainer: {
    width: 150,
    marginTop: 20,
    flexDirection: "column",
  },

  pencilContainer: {
    flex: 2,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 5,
    backgroundColor: "lavenderblush",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'hsl(270, 50%, 60%)',
    marginRight: "2%",

  },

  trashContainer: {
    flex: 2,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 5,
    backgroundColor: "#F8D7DA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'hsl(270, 50%, 60%)',
    marginRight: "2%",
    marginBottom: "4%",
  },
  modalContent: {
    backgroundColor: "#F7E7F8",
    padding: 20,
    height: "100%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 50,
    color: 'hsl(270, 50%, 60%)',
  },
  input: {
    borderWidth: 2,
    borderColor: "hsl(270, 50%, 60%)",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    color: "hsl(270, 50%, 60%)",
    backgroundColor: "lavenderblush",
  },
  button: {
    backgroundColor: "lavenderblush",
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "hsl(270, 50%, 60%)",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerComponent: {
    paddingTop: 13,
  },
});

export default AdminScreen;