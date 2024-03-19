import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import TaskContext from "../../context/TaskContext";
import { launchImageLibrary } from 'react-native-image-picker';

export default function AddItem() {
  const {addItem} = useContext(TaskContext);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const selectImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
      if(response.didCancel) {
        console.log('User cancelled image picker');
      } else if(response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImages = response.assets.map(asset => asset.uri);
        setImages(selectedImages);
      }
    });
  };

  const uploadImagesAndAddItem = async () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', {
        name: `image${index}.jpg`,
        type: 'image/jpeg',
        uri: image,
      });
    });

    try {
      let imageUrls = [];
      if (images.length > 0) {
        const response = await fetch('https://kayscrochetmobileapp-5c1e1888702b.herokuapp.com/upload-images', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrls = await response.json();
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
    } catch (error) {
      console.error('Error uploading images:', error);
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
    // only show month, day, and year
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
          
          <TextInput
            style={styles.input}
            placeholder="Enter Item Description"
            onChangeText={(description) => setDescription(description)}
            value={description}
            multiline={true} // Enable multiline input
            maxLength={10000}
          />

          <TouchableOpacity onPress={selectImages} style={styles.button}>
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity>

          <View style={styles.date}>
            <TouchableOpacity 
              onPress={showDatePicker}>
              <Text style={styles.buttonText}>Add Date</Text>
            </TouchableOpacity>
            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}>
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
    padding: 15,
    borderColor: "hsl(270, 50%, 60%)",
    color: "hsl(270, 50%, 60%)",
    borderRadius: 15,
    backgroundColor: "lavenderblush",
  },
  date: {
    backgroundColor: "lavenderblush",
    color: "hsl(270, 50%, 60%)",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: "3%",
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
  
});