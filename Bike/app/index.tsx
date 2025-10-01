import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, VT323_400Regular } from '@expo-google-fonts/vt323';
import React from 'react';

export default function StartScreen() {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    VT323_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading Fonts...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerContainer}>
        A premium online store for sporter and their stylish choices
      </Text>
      <View style={styles.imageContainer}>
      <Image 
        source={{uri: 'https://res.cloudinary.com/ddga6y6tm/image/upload/v1759280290/bifour_-removebg-preview_jkjvvs.png'}} 
        style={{width: 292, height: 270}}
      />
      </View>
      <Text style={{fontWeight: '700', textAlign: 'center', fontSize: 18, marginTop: 20}}>
      POWER BI {'\n'}
      SHOP
      </Text>
      <View>
      <TouchableOpacity 
        style={styles.buttonStart} 
        onPress={() => router.push({ pathname: '/sort' })} 
      >
      <Text style={{fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center', color: '#fff'}}>
      Get Started
      </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 8, backgroundColor: '#fff', },
  headerContainer: { fontWeight: '700', fontSize: 18, textAlign: 'center', margin: 20, },
  imageContainer: { justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#E941411A', borderRadius: 10, },
  buttonStart: { padding: 16, backgroundColor: '#E94141', borderRadius: 30, marginTop: 20, },
});