import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TaskContext from "../../context/TaskContext";
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddItem() {
  const {addItem} = useContext(TaskContext);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const CheckIcon = () => (
    <MaterialCommunityIcons name="check-circle" size={24} color="hsl(270, 50%, 60%)" style={styles.checkIcon} />
  );

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  // Function to select images
  const selectImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.cancelled && result.assets) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages(selectedImages);
    }
  };

  const uploadImagesAndAddItem = async () => {
    let imageUrls = [];
  
    for (const imageUri of images) {
      const base64 = await uriToBase64(imageUri);
  
      if (base64) {
        try {
          const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/api/upload', {
            method: 'POST',
            body: JSON.stringify({ image: base64 }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            imageUrls.push(data.Location);
          } else {
            const text = await response.text();
            throw new Error(`Image upload failed with status ${response.status}: ${text}`);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }
  
    const itemData = {
      description,
      date: selectedDate,
      images: imageUrls,
    };
  
    addItem(itemData);
    setDescription("");
    setSelectedDate(null);
    setImages([]);
  };
  
  // Helper function to convert URI to base64
  const uriToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };
  

  // add item card
  const handleSubmit = () => {
    if (description && selectedDate) {
      uploadImagesAndAddItem();
    } else {
      alert("Please enter all required info.");
    }
  };
  
  //DateTimePicker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
   
    const formattedDate = date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    setSelectedDate(formattedDate);
    console.log("A date has been picked: ", formattedDate);
    hideDatePicker();
  };
    
  return (
    <>
      <SafeAreaView style={styles.screen}>
        <View style={styles.viewContainer}>
          <Text style={styles.title}>Add Items</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter Item Description"
              onChangeText={(description) => setDescription(description)}
              value={description}
              multiline={true} 
              maxLength={10000}
            />
            {description ? <CheckIcon /> : null}
          </View>

          <View style={styles.inputRow}>
            <TouchableOpacity onPress={selectImages} style={styles.button}>
              <Text style={styles.buttonText}>Select Images</Text>
            </TouchableOpacity>
            {images.length > 0 ? <CheckIcon /> : null}
          </View>

          <View style={styles.inputRow}>
            <TouchableOpacity onPress={showDatePicker} style={styles.date}>
              <Text style={styles.buttonText}>Add Date</Text>
            </TouchableOpacity>
            {selectedDate ? <CheckIcon /> : null}
          </View>

          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <TouchableOpacity style={styles.buttonTwo} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );        
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "aqua",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  button: {
    backgroundColor: "lavenderblush",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: "3%",
    alignSelf: 'center',
    width: "100%",
    marginLeft: -1,
    marginBottom: -10,
  },
  buttonTwo: {
    backgroundColor: "lavenderblush",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: "3%",
    alignSelf: 'center',
    marginBottom: -10,
  },
  buttonText: {
    color: "hsl(270, 50%, 60%)",
    fontSize: 20,
    textAlign: "center",
  },
  viewContainer: {
    flex: 4,
    padding: 45,
    backgroundColor: "#F7E7F8",
    width: "100%"
  },
  title: {
    color: "hsl(270, 50%, 60%)",
    fontSize: 32,
    textAlign: "center",
  },
  input: {
    margin: "3%",
    borderWidth: 2,
    width: "100%",
    paddingTop: 10,  
    paddingBottom: 15,  
    paddingHorizontal: 15,
    borderColor: "hsl(270, 50%, 60%)",
    color: "hsl(270, 50%, 60%)",
    borderRadius: 15,
    backgroundColor: "lavenderblush",
    marginLeft: -1,
    marginBottom: -10,
  },
  date: {
    backgroundColor: "lavenderblush",
    color: "hsl(270, 50%, 60%)",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: "3%",
    width: "100%",
    marginLeft: -1,
  },
  dateText: {
    fontSize: 10,
  },
  textArea: {
    margin: "3%",
    borderWidth: 2,
    padding: 15,
    borderColor: "hsl(270, 50%, 60%)",
    color: "hsl(270, 50%, 60%)",
    borderRadius: 15,
    backgroundColor: "lavenderblush",
    height: 80,
    textAlignVertical: 'top',
  },
  checkIcon: {
    alignSelf: 'center',
    marginLeft: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: "3%",
    
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "lavenderblush",
    borderRadius: 15,
    margin: "3%",

  },
  
});