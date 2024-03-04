import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Items({
  description,
  date,
  images,
  renderRightActions,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>

        <>
          <View style={styles.mainContainer}>       
            <Text style={styles.description}>Description: {description}</Text>
            {images && images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={{ width: 100, height: 100 }} />
            ))}
            <View style={styles.rowContainer}>
                <Text style={styles.description}>{date}</Text>
                <MaterialCommunityIcons name="gesture-swipe-left" size={30} color="hsl(270, 50%, 60%)" />
            </View>
          </View>
        </>

    </Swipeable>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: "#F7E7F8",
        flexDirection: "column",
        paddingLeft: "5%",
        paddingRight: "5%",
        borderWidth: 1,
        borderColor: 'hsl(270, 50%, 60%)',
        margin: "1%"
      },
      rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      },
    
      description: {
        fontWeight: "bold",
        fontSize: 25,
        padding: 5,
        color: 'hsl(270, 50%, 60%)',
        backgroundColor: "#F7E7F8",
        marginTop: 10
      },
});