import { useState, useEffect, createContext } from "react";
import { Alert } from "react-native";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [itemList, setItemList] = useState([]);
  const [itemEdit, setItemEdit] = useState({
    item: {},
    edit: false,
  });

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/items');
      const data = await response.json();
      if (response.ok) {
        setItemList(data);
      } else {
        console.error('Error fetching items:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add New Item
  const addItem = async (newItem) => {
    try {
      const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const addedItem = await response.json();
        setItemList(prevItems => [...prevItems, addedItem]);
      } else {
        console.error('Error adding item:', await response.json());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Delete Item
  const deleteItem = (_id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/items/${_id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                fetchItems(); 
              } else {
                
                console.error('Error deleting item:', await response.json());
              }
            } catch (error) {
              console.error('Network error:', error);
            }
          },
        },
      ],
    );
  };

  // Edit Item
  const editItem = (item) => {
    setItemEdit({ item, edit: true });
  };

  // Update Item
  const updateItem = async (_id, updItem) => {
    try {
      console.log(`Updating item with id: ${_id} and data: `, updItem);
      const response = await fetch(`https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/items/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error updating item.");
      }
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{ itemList, addItem, editItem, updateItem, deleteItem, itemEdit, fetchItems }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
