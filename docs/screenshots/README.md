# Screenshots

Este directorio contiene las capturas de pantalla del proyecto para mostrar en el README principal.

## 📷 Cómo agregar screenshots:

1. **Toma la captura de pantalla** desde el simulador/dispositivo
2. **Guárdala** en esta carpeta (`docs/screenshots/`)
3. **Nombra el archivo** de forma descriptiva:
   - `login-screen.png` - Pantalla de login
   - `home-screen.png` - Pantalla principal
   - `components-showcase.png` - Showcase de componentes

## 📐 Recomendaciones:

- **Formato**: PNG o JPG
- **Tamaño**: Mantener proporciones originales del dispositivo
- **Calidad**: Alta resolución pero optimizada para web
- **Consistencia**: Usar el mismo dispositivo/simulador para todas las capturas

## 🎯 Screenshots actuales:

- `login-screen.png` - Pantalla de login con formulario de validación

## 💡 Tip:

Para tomar screenshots del simulador iOS:
```bash
# Captura de pantalla del simulador
xcrun simctl io booted screenshot login-screen.png

# O usar Cmd+S en el simulador
```

Para Android:
```bash
# Captura de pantalla del emulador/dispositivo
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png login-screen.png
```
