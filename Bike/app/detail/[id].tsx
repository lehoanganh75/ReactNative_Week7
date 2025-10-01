import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Product } from '../../src/types'; 

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const product: Product = {
      id: params.id as string || '',
      name: params.name as string || 'Tên xe không xác định',
      price: params.price as string || '0',
      image: params.image as string || '', 
      desciption: params.desciption as string || 'No detailed description available.',
      discount: params.discount as string || '0%',
  };

  const defaultImage = 'https://via.placeholder.com/136x124?text=No+Image';
  let imageUrl = product.image;

  if (!imageUrl || imageUrl === 'undefined' || !imageUrl.startsWith('http')) {
      imageUrl = defaultImage;
  }
  
  if (!product.id) {
     Alert.alert("Lỗi", "Không tìm thấy ID sản phẩm.");
     router.back();
     return null;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.discount}>Khuyến mãi: {product.discount}</Text> 
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.desciption}</Text>
      
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
      <Image source={{uri: 'https://res.cloudinary.com/ddga6y6tm/image/upload/v1759280290/akar-icons_heart_zd53ah.png'}} style={{width: 50, height: 50}}/>
      <TouchableOpacity style={{padding: 15, backgroundColor: '#E94141', borderRadius: 20, width: 240}}
      onPress={() => router.back()} 
      >
      <Text style={{color : '#fff', fontSize: 18}}>
      Add to cart
      </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', },
  image: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 16, },
  name: { fontSize: 22, fontWeight: 'bold', },
  discount: { fontSize: 16, color: '#F7BA83', marginVertical: 8, },
  price: { fontSize: 20, color: 'red', marginBottom: 8, },
  description: { fontSize: 16, color: 'gray', },
});