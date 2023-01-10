import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [listFood, setListFood] = useState([]);
  const [choosen, setChoosen] = useState('');
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })
  const [isLoad, setIsLoad] = useState(false)
  const [text, onChangeText] = useState('');
  const getListFoodOnStorage = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0
      })
      const value = await AsyncStorage.getItem('listFood')
      if (value !== null) {
        setListFood(JSON.parse(value));
      }
    } catch (e) {
      // error reading value
    }
  }

  console.log(listFood);

  useEffect(() => {
    getListFoodOnStorage()
  }, [])
  const onPressGacha = () => {

    setIsLoad(true);
    let item;
    setTimeout(() => {
      do {
        item = listFood[Math.floor(Math.random() * listFood.length)];
        setIsLoad(false);
      } while (item === choosen);
      setChoosen(item);
    }, 1000);

  }

  const onPressSave = async () => {
    try {
      if (!listFood.includes(text)) {
        await AsyncStorage.setItem('listFood', JSON.stringify([...listFood, text]));
        getListFoodOnStorage();
      }
      onChangeText('');
    } catch (e) {
      // saving error
    }
  }



  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
        }}
        onChangeText={onChangeText}
        value={text}
      />
      <Button
        onPress={onPressSave}
        title="Save"
        color="#f264ab"
      />
      {
        !isLoad ?
          <Text style={{
            fontSize: 20,
            fontWeight: "bold"
          }}>{choosen}</Text>
          :
          <Image source={require("./Loading_icon.gif")} />
      }
      <StatusBar style="auto" />
      <Button
        onPress={onPressGacha}
        title="Gacha"
        color="#f264ab"
      />
      <MapView style={{
        width: '100%',
        height: '50%',
      }}
        initialRegion={mapRegion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
