import React, { useState, useContext, useEffect } from 'react';
import { FlatList, Modal, StyleSheet, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Text, Alert, SafeAreaView } from 'react-native';
import AddItem from '../components/Item/AddItem';
import Constants from "expo-constants";
import Items from '../components/Item/Items';
import TaskContext from "../context/TaskContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from '../context/AuthContext';

const AdminScreen = () => {

  const { itemList, deleteItem, editItem, updateItem } = useContext(TaskContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [itemId, setItemId] = useState(null);
  const { userToken } = useContext(AuthContext);

  const handleEditItem = (item) => {
    setItemId(item.id);
    setDescription(item.data.description);
    setModalVisible(true);
    editItem(item);
  };

  const handleUpdateItem = () => {
    if (itemId) {
      updateItem(itemId, { description });
      setModalVisible(false);
    }
  };

  // Function to check if the admin is authenticated
  const checkAdminAuth = async () => {
    try {
      const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/admin/check-auth', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // "Authenticated"
        // Proceed with showing admin content
      } else {
        Alert.alert('Authentication Failed', 'You are not authorized to access this page.');
        // Redirect to login screen or handle unauthorized access
      }
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      Alert.alert('Network Error', 'Unable to verify authentication.');
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  return (
<SafeAreaView style={styles.screen}>
    <View>
      <FlatList
        ListHeaderComponent={AddItem}
        data={itemList}
        keyExtractor={(itemList) => itemList.id}
        renderItem={({ item }) => (
          <Items
            description={item.data.description}
            date={item.data.date}
            images={item.data.images}
            
            renderRightActions={() => (

              <View style = {styles.actionsContainer}>
                <TouchableWithoutFeedback onPress={() => handleEditItem(item)}>                   
                  <View style={styles.pencilContainer}>
                    <MaterialCommunityIcons 
                      name="pencil"
                      size={40}
                      color="midnightblue"
                    />                   
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => deleteItem(item.id)}>                
                  <View style={styles.trashContainer}>
                    <MaterialCommunityIcons 
                      name="trash-can"
                      size={40}
                      color="midnightblue"
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
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  
  );

}

const styles = StyleSheet.create({
  screen: {
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
    flex: 3,
    backgroundColor: "lavenderblush",
    justifyContent: "center",
    alignItems: "center",
  },

  trashContainer: {
    flex: 1,
    backgroundColor: "#F8D7DA",
    justifyContent: "center",
    alignItems: "center",
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
});

export default AdminScreen;