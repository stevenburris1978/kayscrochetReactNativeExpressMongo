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
      const response = await fetch('<your-backend-url>/items');
      const data = await response.json();
      if (response.ok) {
        setItemList(data);
      } else {
        // Handle errors
        console.error('Error fetching items:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add Item
  const addItem = async (newItem) => {
    try {
      const response = await fetch('<your-backend-url>/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        fetchItems(); // Refresh the list after adding
      } else {
        // Handle errors
        console.error('Error adding item:', await response.json());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Delete Item
  const deleteItem = (id) => {
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
              const response = await fetch(`<your-backend-url>/items/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                fetchItems(); // Refresh the list after deletion
              } else {
                // Handle errors
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
  const updateItem = async (id, updItem) => {
    try {
      const response = await fetch(`<your-backend-url>/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem),
      });
      if (response.ok) {
        fetchItems(); // Refresh the list after updating
      } else {
        // Handle errors
        console.error('Error updating item:', await response.json());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ itemList, addItem, editItem, updateItem, deleteItem, itemEdit }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
