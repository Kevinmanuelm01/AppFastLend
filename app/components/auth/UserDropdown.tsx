// 👤 Componente UserDropdown - Selector de usuarios con roles

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../constants';

// 🎯 Tipos del componente
interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'employee' | 'manager';
  email: string;
  companyEmail: string;
  isActive: boolean;
}

interface UserDropdownProps {
  label: string;
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User | null) => void;
  onSearchChange: (query: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

// 📱 Obtener dimensiones de pantalla
const { width } = Dimensions.get('window');

// 🎨 Componente UserDropdown
const UserDropdown: React.FC<UserDropdownProps> = ({
  label,
  users,
  selectedUser,
  onUserSelect,
  onSearchChange,
  error,
  required = false,
  placeholder = 'Selecciona un usuario',
  disabled = false,
}) => {
  // 🏪 Estados locales
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // 🎭 Animaciones
  const [arrowAnimation] = useState(new Animated.Value(0));

  // 📱 Referencias
  const searchInputRef = useRef<TextInput>(null);

  // 🎯 Filtrar usuarios basado en la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  // 🎨 Animación de la flecha
  const animateArrow = (toValue: number) => {
    Animated.timing(arrowAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // 🎯 Toggle modal
  const toggleModal = () => {
    if (disabled) return;

    const newIsVisible = !isVisible;
    setIsVisible(newIsVisible);
    animateArrow(newIsVisible ? 1 : 0);

    if (newIsVisible) {
      // Enfocar el input de búsqueda cuando se abre
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      // Limpiar búsqueda cuando se cierra
      setSearchQuery('');
      onSearchChange('');
    }
  };

  // 🎯 Seleccionar usuario
  const selectUser = (user: User) => {
    onUserSelect(user);
    setIsVisible(false);
    animateArrow(0);
    setSearchQuery('');
    onSearchChange('');
  };

  // 🎯 Cerrar modal
  const closeModal = () => {
    setIsVisible(false);
    animateArrow(0);
    setSearchQuery('');
    onSearchChange('');
  };

  // 🎯 Limpiar selección
  const clearSelection = () => {
    onUserSelect(null);
    setSearchQuery('');
    onSearchChange('');
  };

  // 🎯 Manejar cambio de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  // 🎨 Obtener color del rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#dc2626'; // Rojo para admin
      case 'manager':
        return '#2563eb'; // Azul para manager
      case 'employee':
        return '#059669'; // Verde para employee
      default:
        return COLORS.text.secondary;
    }
  };

  // 🎨 Obtener texto del rol
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'employee':
        return 'Empleado';
      default:
        return role;
    }
  };

  // 🎨 Estilos dinámicos
  const arrowRotation = arrowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      {/* 📝 Label */}
      <Text style={[styles.label, error && styles.labelError]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* 🎯 Dropdown Container */}
      <View style={styles.dropdownContainer}>
        {/* 🔘 Botón principal */}
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            error && styles.dropdownButtonError,
            disabled && styles.dropdownButtonDisabled,
          ]}
          onPress={toggleModal}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            <View style={styles.userInfo}>
              {selectedUser ? (
                <>
                  <Text style={styles.selectedUsername}>{selectedUser.username}</Text>
                  <Text style={styles.selectedFullName}>{selectedUser.fullName}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(selectedUser.role) }]}>
                    <Text style={styles.roleText}>{getRoleText(selectedUser.role)}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.placeholderText}>{placeholder}</Text>
              )}
            </View>

            <View style={styles.buttonActions}>
              {selectedUser && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSelection}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
              <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
                <Text style={styles.arrowIcon}>▼</Text>
              </Animated.View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 📋 Modal con opciones */}
        <Modal
          visible={isVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay} onTouchEnd={(e) => e.stopPropagation()}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* 📋 Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <View style={styles.closeButtonCircle}>
                      <Text style={styles.closeButtonIcon}>✕</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.itemCount}>
                    {filteredUsers?.length} {filteredUsers?.length === 1 ? 'usuario' : 'usuarios'}
                  </Text>
                </View>

                {/* 🔍 Barra de búsqueda */}
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                      ref={searchInputRef}
                      style={styles.searchInput}
                      placeholder="Buscar usuario..."
                      placeholderTextColor={COLORS.text.light}
                      value={searchQuery}
                      onChangeText={handleSearchChange}
                      autoCorrect={false}
                      autoCapitalize="none"
                      clearButtonMode="while-editing"
                    />
                  </View>
                </View>

                {/* 📝 Lista de usuarios */}
                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.userItem,
                        selectedUser?.id === item.id && styles.userItemSelected,
                      ]}
                      onPress={() => selectUser(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.userItemContent}>
                        <View style={styles.userItemInfo}>
                          <Text style={styles.userItemUsername}>{item.username}</Text>
                          <Text style={styles.userItemFullName}>{item.fullName}</Text>
                          <Text style={styles.userItemEmail}>{item.email}</Text>
                        </View>
                        <View style={[styles.userItemRole, { backgroundColor: getRoleColor(item.role) }]}>
                          <Text style={styles.userItemRoleText}>{getRoleText(item.role)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
                      </Text>
                    </View>
                  }
                  keyboardShouldPersistTaps="handled"
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews={true}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>

      {/* ❌ Mensaje de error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  labelError: {
    color: COLORS.error,
  },
  required: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  dropdownButtonDisabled: {
    backgroundColor: COLORS.surface,
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  selectedUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  selectedFullName: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  buttonActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: 'bold',
  },
  arrowIcon: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeButtonIcon: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  searchInputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.text.primary,
    padding: 0,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.text.secondary,
  },
  userItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  userItemSelected: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  userItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userItemInfo: {
    flex: 1,
  },
  userItemUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  userItemFullName: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  userItemEmail: {
    fontSize: 12,
    color: COLORS.text.light,
    marginTop: 1,
  },
  userItemRole: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userItemRoleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
  },
});

UserDropdown.displayName = 'UserDropdown';

export default UserDropdown;
export type { User };
