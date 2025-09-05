// 📋 Componente DropDownListReusable - Dropdown completamente reutilizable

import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../constants';

// 📱 Obtener dimensiones de pantalla
const { width } = Dimensions.get('window');

// 🎯 Tipos del componente
interface DropdownItem {
  [key: string]: any;
}

interface DropDownListReusableProps {
  label: string;
  data: DropdownItem[];
  valueSelected?: string | number | null;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange: (value: string | number | null) => void;
  disabled?: boolean;
  loading?: boolean;
  colorLoading?: string;
  errorMessage?: string;
  customStyles?: {
    container?: object;
    emptyContainer?: object;
    emptyText?: object;
    labelContainer?: object;
    labelStyle?: object;
    input?: object;
    valueSelected?: object;
    placeholder?: object;
    errorInput?: object;
    errorLabel?: object;
    errorText?: object;
    errorMessageStyle?: object;
    disabledInput?: object;
    disabledText?: object;
    iconCustom?: object;
    modalOverlay?: object;
    modalContainer?: object;
    modalContent?: object;
    modalHeader?: object;
    closeButton?: object;
    closeButtonCircle?: object;
    closeButtonIcon?: object;
    itemCount?: object;
    searchContainer?: object;
    searchInputContainer?: object;
    searchInput?: object;
    searchIcon?: object;
    listContent?: object;
    item?: object;
    itemText?: object;
    selectedItem?: object;
    selectedItemText?: object;
  };
  labelKey?: string;
  valueKey?: string;
  iconCustom?: React.ReactElement;
  iconSize?: number;
  iconColor?: string;
  required?: boolean;
  showRequired?: boolean;
  maxLength?: number;
}

// 🎨 Componente DropDownListReusable
const DropDownListReusable: React.FC<DropDownListReusableProps> = ({
  label,
  data,
  valueSelected,
  placeholder = '',
  searchPlaceholder = 'Buscar...',
  onChange,
  disabled = false,
  loading = false,
  colorLoading = '#4A9ED4',
  errorMessage,
  customStyles = {},
  labelKey = 'label',
  valueKey = 'value',
  iconCustom = null,
  iconSize = 22,
  iconColor = '#B3B9C6',
  required = false,
  showRequired = true,
  maxLength = null,
}) => {
  // 🏪 Estados locales
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 🎯 Encuentra el item seleccionado
  const selectedItem = useMemo(
    () => data?.find((item) => item[valueKey] === valueSelected),
    [data, valueKey, valueSelected]
  );

  // 🎯 Valor a mostrar (con truncamiento si es necesario)
  const displayValue = useMemo(() => {
    if (!selectedItem) return '';

    const text = selectedItem[labelKey];

    if (maxLength && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }

    return text;
  }, [selectedItem, labelKey, maxLength]);

  // 🎯 Determinar si mostrar el asterisco según showRequired y si hay valor seleccionado
  const shouldShowAsterisk = useMemo(
    () => required && showRequired && !selectedItem,
    [required, showRequired, selectedItem]
  );

  // 🎯 Datos filtrados por búsqueda
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchText) return data;

    return data.filter((item) =>
      item[labelKey]?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText, labelKey]);

  // 🎯 Verificar si hay suficientes elementos para mostrar la barra de búsqueda (10 o más)
  const shouldShowSearch = useMemo(
    () => data && Array.isArray(data) && data.length > 10,
    [data]
  );

  // 🎯 Handlers
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsVisible(true);
      setSearchText('');
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSearchText('');
  }, []);

  const handleSelect = useCallback(
    (item: DropdownItem) => {
      if (item[valueKey] === valueSelected) {
        // Si el usuario selecciona el mismo elemento, deselecciona
        onChange(null);
      } else {
        onChange(item[valueKey]);
      }

      handleClose();
    },
    [onChange, valueKey, valueSelected, handleClose]
  );

  // 🎨 Componentes renderizados
  const renderItem = useCallback(
    ({ item }: { item: DropdownItem }) => {
      // Determinar si este ítem es el seleccionado actualmente
      const isSelected = item[valueKey] === valueSelected;

      return (
        <TouchableOpacity
          style={[
            styles.item,
            customStyles.item,
            isSelected && [styles.selectedItem, customStyles.selectedItem],
          ]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar ${item[labelKey]}`}
          accessibilityHint="Selecciona una opción de la lista"
        >
          <Text
            style={[
              styles.itemText,
              customStyles.itemText,
              isSelected && [styles.selectedItemText, customStyles.selectedItemText],
            ]}
          >
            {item[labelKey]}
          </Text>
        </TouchableOpacity>
      );
    },
    [labelKey, valueKey, valueSelected, handleSelect, customStyles]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={[styles.emptyContainer, customStyles.emptyContainer]}>
        <Text style={[styles.emptyText, customStyles.emptyText]}>
          No se encontraron resultados
        </Text>
      </View>
    ),
    [customStyles]
  );

  // 🎨 Icono a mostrar (error o normal)
  const icon = useMemo(() => {
    if (errorMessage) {
      return (
        <View style={[styles.iconCustom, customStyles.iconCustom]}>
          <Text style={styles.errorIcon}>⚠️</Text>
        </View>
      );
    }

    return (
      <View style={[styles.iconCustom, customStyles.iconCustom]}>
        {iconCustom || <Text style={[styles.chevronIcon, { color: iconColor }]}>▼</Text>}
      </View>
    );
  }, [errorMessage, iconCustom, iconColor, customStyles]);

  return (
    <View style={[styles.container, customStyles.container]}>
      {/* 📝 Etiqueta */}
      <View style={[styles.labelContainer, customStyles.labelContainer]}>
        <Text
          style={[
            styles.labelStyle,
            customStyles.labelStyle,
            errorMessage && [styles.errorLabel, customStyles.errorLabel],
          ]}
        >
          {label}
          {shouldShowAsterisk && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
      </View>

      {/* 🎯 Campo seleccionable o cargando */}
      <TouchableOpacity
        style={[
          styles.input,
          customStyles.input,
          errorMessage && [styles.errorInput, customStyles.errorInput],
          (disabled || loading) && [styles.disabledInput, customStyles.disabledInput],
        ]}
        onPress={handleOpen}
        disabled={disabled || loading}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar ${label}`}
        accessibilityHint="Abre una lista de opciones"
      >
        {loading ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color={colorLoading} />
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.valueSelectedStyle,
                !displayValue && [styles.placeholder, customStyles.placeholder],
                customStyles.valueSelected,
                errorMessage && [styles.errorText, customStyles.errorText],
                (disabled || loading) && [styles.disabledText, customStyles.disabledText],
              ]}
            >
              {displayValue || placeholder}
            </Text>
            {icon}
          </>
        )}
      </TouchableOpacity>

      {/* ❌ Mensaje de error */}
      {errorMessage && (
        <Text style={[styles.errorMessageStyle, customStyles.errorMessageStyle]}>
          {errorMessage}
        </Text>
      )}

      {/* 📋 Modal con opciones */}
      {!loading && (
        <Modal
          visible={isVisible}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
          statusBarTranslucent={true}
        >
          <View
            style={[styles.modalOverlay, customStyles.modalOverlay]}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <SafeAreaView style={[styles.modalContainer, customStyles.modalContainer]}>
              <View style={[styles.modalContent, customStyles.modalContent]}>
                {/* 📋 Header */}
                <View style={[styles.modalHeader, customStyles.modalHeader]}>
                  <TouchableOpacity
                    style={[styles.closeButton, customStyles.closeButton]}
                    onPress={handleClose}
                  >
                    <View style={[styles.closeButtonCircle, customStyles.closeButtonCircle]}>
                      <Text style={[styles.closeButtonIcon, customStyles.closeButtonIcon]}>✕</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.itemCount, customStyles.itemCount]}>
                    {filteredData?.length} {filteredData?.length === 1 ? 'elemento' : 'elementos'}
                  </Text>
                </View>

                {/* 🔍 Búsqueda - solo se muestra si hay 10 o más elementos */}
                {shouldShowSearch && (
                  <View style={[styles.searchContainer, customStyles.searchContainer]}>
                    <View style={[styles.searchInputContainer, customStyles.searchInputContainer]}>
                      <Text style={[styles.searchIcon, customStyles.searchIcon]}>🔍</Text>
                      <TextInput
                        style={[styles.searchInput, customStyles.searchInput]}
                        placeholder={searchPlaceholder}
                        value={searchText}
                        onChangeText={setSearchText}
                        clearButtonMode="while-editing"
                      />
                    </View>
                  </View>
                )}

                {/* 📝 Lista */}
                <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `${item[valueKey]?.toString() || ''}${index}`}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={[styles.listContent, customStyles.listContent]}
                  ListEmptyComponent={ListEmptyComponent}
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
      )}
    </View>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    minHeight: 56,
  },
  valueSelectedStyle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  placeholder: {
    color: COLORS.text.light,
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
  },
  selectedItemText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  errorInput: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  errorLabel: {
    color: COLORS.error,
  },
  errorText: {
    color: COLORS.text.secondary,
  },
  errorMessageStyle: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'left',
    paddingHorizontal: 4,
    fontWeight: '500',
  },
  disabledInput: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    opacity: 0.6,
  },
  disabledText: {
    color: COLORS.text.light,
    fontSize: 16,
  },
  requiredAsterisk: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  iconCustom: {
    marginLeft: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 18,
    color: COLORS.error,
  },
  chevronIcon: {
    fontSize: 12,
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
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.text.secondary,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.text.primary,
    padding: 0,
  },
  listContent: {
    padding: 8,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text.primary,
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
});

DropDownListReusable.displayName = 'DropDownListReusable';

export default DropDownListReusable;
export type { DropDownListReusableProps, DropdownItem };
