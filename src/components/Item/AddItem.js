import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TaskContext from "../../context/TaskContext";
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddItem() {
  const { addItem } = useContext(TaskContext);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayDate, setDisplayDate] = useState(""); 
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 

  const CheckIcon = () => (
    <MaterialCommunityIcons name="check-circle" size={24} color="hsl(270, 50%, 60%)" style={styles.checkIcon} />
  );

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, camera roll permissions needed to make this work!');
      return false;
    }
    return true;
  };

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

    if (!selectedDate) {
      alert("Please select a valid date.");
      return;
    }

    const itemData = {
      description,
      date: selectedDate, 
      images: imageUrls,
    };
  
    addItem(itemData);
    setDescription("");
    setSelectedDate(null);
    setDisplayDate("");
    setImages([]);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleSubmit = async () => {
    if (!description || !selectedDate) {
      Alert.alert("Please enter description and date.");
      return;
    }
    console.log("Sending date:", selectedDate);
    await uploadImagesAndAddItem();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    const isoDate = date.toISOString();
    const formattedDate = date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    setSelectedDate(isoDate);
    setDisplayDate(formattedDate); 
    setDatePickerVisibility(false);
  };
    
  return (
    <>
      <SafeAreaView style={styles.screen}>
        <View style={styles.viewContainer}>
          <Text style={styles.title}>Admin Notifications</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter New Item Description"
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
            <Text style={styles.buttonText}>Send</Text>
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