// app/sort.tsx

import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { useRouter } from 'expo-router';
// Đảm bảo import đúng đường dẫn: '../src/types' nếu types.ts nằm trong src/
import { Product, ProductState, ProductAction } from '../src/types'; 

// --- Reducer và State Ban đầu ---
const initialState: ProductState = {
  products: [],
  loading: true,
  error: null,
};

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'FETCH_SUCCESS': 
      return { ...state, products: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_PRODUCT': 
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT': 
      return {
        ...state,
        products: state.products.map((product: Product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT': 
      return {
        ...state,
        products: state.products.filter((product: Product) => product.id !== action.payload),
      };
    default:
      return state;
  }
};

export default function SortScreen() {
  const router = useRouter();
  const [state, dispatch] = useReducer(productReducer, initialState);
  const [filter, setFilter] = useState<string>('All');
  
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); 
  const [editName, setEditName] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');


  // R - Read (Fetch dữ liệu)
  useEffect(() => {
    fetch('https://68dc81a37cd1948060aa84f0.mockapi.io/data/bike')
      .then(response => response.json())
      .then((data: Product[]) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(err => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, []);

  const filteredProducts: Product[] = useMemo(() => {
    if (filter === 'All') {
      return state.products;
    } else {
      // Logic lọc theo tên, bạn có thể thay đổi để lọc theo loại xe (Roadbike, Mountain)
      return state.products.filter((item: Product) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }, [state.products, filter]);


  // C - Create
  const handleCreateProduct = () => {
    if (!newProductName || !newProductPrice) {
        Alert.alert("Lỗi", "Vui lòng nhập Tên và Giá sản phẩm.");
        return;
    }
    const newId = (Math.random() * 10000).toFixed(0).toString();
    const newProduct: Product = {
      id: newId,
      name: newProductName,
      price: newProductPrice,
      image: 'https://res.cloudinary.com/ddga6y6tm/image/upload/v1759280290/bifour_-removebg-preview_jkjvvs.png', 
      desciption: `Đây là xe đạp mới được thêm vào: ${newProductName}`,
    };
    
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    setShowCreateForm(false);
    setNewProductName('');
    setNewProductPrice('');
    Alert.alert("Thành công", `Đã thêm xe đạp mới: ${newProduct.name}`);
  };


  // U - Start Update
  const startUpdate = (product: Product) => {
    setEditingProduct(product); 
    setEditName(product.name);
    // Đảm bảo price là string khi đặt vào state
    setEditPrice(product.price.toString()); 
    setShowCreateForm(false);
  };

  // U - Save Update
  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: editName,
      price: editPrice,
    };
    
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    setEditingProduct(null);
    Alert.alert("Thành công", `Đã cập nhật xe: ${updatedProduct.name}`);
  };

  // D - Delete
  const handleDeleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    
    if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(null);
    }
    Alert.alert("Thành công", "Đã xóa sản phẩm.");
  };
  
  const renderItem = ({ item }: { item: Product }) => (
    <View style={{ marginRight: 5, marginBottom: 10, position: 'relative' }}>
        
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push({ 
                pathname: `/detail/${item.id}` as any,
                params: item, 
            })}
        >
            <Image
                source={{ uri: 'https://res.cloudinary.com/ddga6y6tm/image/upload/v1759280290/akar-icons_heart_zd53ah.png' }}
                style={{ width: 25, height: 25, position: 'absolute', top: 20 , left: 5, zIndex: 1}}
            />
            <View>
                <Image 
                    source={{ uri: item.image || 'https://via.placeholder.com/136x124' }} 
                    style={{ width: 136, height: 124 }} 
                />
            </View>
            <View style={{ flex: 1, alignItems: 'center', marginTop: 5 }}>
                <Text style={{ textAlign: 'center', color: 'gray' }}>{item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#F7BA83' }}>$</Text>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>  {item.price}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.editButton}
                    // e.stopPropagation() ngăn sự kiện chạm (onPress) của thẻ cha (TouchableOpacity) bị kích hoạt
                    onPress={(e) => { e.stopPropagation(); startUpdate(item); }}
                >
                    <Text style={{color: 'white', fontSize: 10}}>Sửa</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(item.id)}
        >
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>X</Text>
        </TouchableOpacity>
    </View>
  );

  // --- Main Render ---
  if (state.loading) return (<View style={styles.container}><Text>Đang tải sản phẩm...</Text></View>);
  if (state.error) return (<View style={styles.container}><Text style={{ color: 'red' }}>Lỗi: {state.error}</Text></View>);

  return (
    <View style={styles.container}>
      <Text style={styles.headerContainer}>The world’s Best Bike</Text>
      
      {/* Nút Thêm Mới */}
      <View style={{alignItems: 'center', marginBottom: 15}}>
        <TouchableOpacity 
            style={[styles.crudButton, {backgroundColor: '#28a745', width: '90%'}]} 
            onPress={() => {
                setShowCreateForm(!showCreateForm);
                setEditingProduct(null); 
            }}
        >
            <Text style={styles.crudButtonText}>{showCreateForm ? 'Hủy Thêm' : '+ Thêm Xe Mới'}</Text>
        </TouchableOpacity>
      </View>

      {/* Form Thêm mới */}
      {showCreateForm && (
        <View style={styles.createForm}>
            <TextInput 
                style={styles.input} 
                placeholder="Tên xe đạp" 
                value={newProductName} 
                onChangeText={setNewProductName} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Giá (chỉ số)" 
                keyboardType="numeric"
                value={newProductPrice} 
                onChangeText={setNewProductPrice} 
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCreateProduct}>
                <Text style={styles.crudButtonText}>Lưu Xe Đạp Mới</Text>
            </TouchableOpacity>
        </View>
      )}

      {/* Form Cập nhật */}
      {editingProduct && (
        <View style={styles.createForm}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>Chỉnh sửa: {editingProduct.name}</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Tên xe đạp" 
                value={editName} 
                onChangeText={setEditName} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Giá (chỉ số)" 
                keyboardType="numeric"
                value={editPrice} 
                onChangeText={setEditPrice} 
            />
            <TouchableOpacity style={[styles.submitButton, {backgroundColor: '#007bff'}]} onPress={handleUpdateProduct}>
                <Text style={styles.crudButtonText}>Lưu Cập Nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 5}} onPress={() => setEditingProduct(null)}>
                <Text style={{textAlign: 'center', color: 'gray'}}>Hủy</Text>
            </TouchableOpacity>
        </View>
      )}

      {/* Nút Lọc */}
      <View style={styles.imageContainer}>
        {['All', 'Roadbike', 'Mountain'].map((item) => (
          <TouchableOpacity key={item} onPress={() => setFilter(item)}>
            <Text
              style={[
                styles.sortContainer,
                filter === item && { backgroundColor: '#E94141', color: 'white' },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#fff', },
  headerContainer: { fontWeight: '700', fontSize: 23, color: '#E94141', marginBottom: 10, },
  imageContainer: { justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, borderRadius: 10, },
  sortContainer: { fontSize: 13, textAlign: 'center', color: '#BEB6B6', borderWidth: 1, borderColor: '#E9414187', padding: 3, width: 80, borderRadius: 5, marginHorizontal: 4, },
  crudButton: { padding: 10, borderRadius: 8, },
  crudButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center', },
  productCard: { backgroundColor: '#F7BA8326', alignItems: 'center', padding: 10, width: 150, zIndex: 50, },
  deleteButton: { position: 'absolute', top: 0, right: 0, backgroundColor: '#E94141', width: 25, height: 25, borderRadius: 12.5, justifyContent: 'center', alignItems: 'center', zIndex: 100, },
  editButton: { backgroundColor: '#FFC107', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginTop: 5, zIndex: 60, },
  createForm: { padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9', },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 4, backgroundColor: 'white', },
  submitButton: { padding: 10, borderRadius: 5, backgroundColor: '#28a745', }
});