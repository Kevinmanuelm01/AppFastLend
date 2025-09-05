# 🚀 AppFastLend

Aplicación de préstamos rápida y segura construida con React Native y TypeScript, diseñada para ofrecer una experiencia de usuario excepcional en el sector financiero.

## ✨ Features

- 📱 **React Native 0.75.4** - Latest stable version
- 🔷 **TypeScript 5.9.2** - Strong and modern typing
- 🧭 **React Navigation 6** - Optimized native navigation
- 🔄 **TanStack Query 5.59** - Server state management
- 🎨 **React Native Unistyles 2** - Unified styling system
- 💾 **MMKV 3.0** - Fast and efficient storage
- 🔧 **ESLint + Prettier** - Automatic linting and formatting
- 🪝 **Husky + Lint-staged** - Pre-commit hooks
- 🧪 **Jest 29** - Configured testing framework
- 📍 **Path mapping** - Configured absolute imports
- 🎯 **Node.js 20+** - Modern runtime support

---

> **Professional React Native template with TypeScript, scalable architecture, and mobile development best practices**

This is an advanced [**React Native**](https://reactnative.dev) template with **TypeScript**, created using [`@react-native-community/cli`](https://github.com/react-native-community/cli) and optimized for professional development.

## 📱 Screenshots

<div align="center">

### 🔐 Login Screen
<img src="docs/screenshots/login-screen.png" alt="Login Screen" width="300"/>

*Clean and modern login interface with email validation, password toggle, and loading states*

---

### ✨ Features Showcase

| Feature | Description |
|---------|-------------|
| 📧 **Email Validation** | Real-time email format validation |
| 🔒 **Password Security** | Password visibility toggle with eye icon |
| ⚡ **Loading States** | Button loading animation during sign-in |
| 🎨 **Modern UI** | Clean design with consistent spacing |
| 📱 **Responsive** | Optimized for different screen sizes |
| ✅ **Form Validation** | Comprehensive form validation with error messages |

</div>


## 🚀 Quick Start

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### 1️⃣ Install Dependencies

First, install all project dependencies:

```bash
# Using npm
npm install

# OR using Yarn
yarn install

# For iOS, install pods
cd ios && pod install && cd ..
```

### 2️⃣ Start Metro Server

Start **Metro**, the JavaScript _bundler_ that ships with React Native:

```bash
# Using npm
npm start

# OR using Yarn
yarn start
```

### 3️⃣ Run the Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the project root and run:

#### 🤖 For Android

```bash
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### 🍎 For iOS

```bash
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

#### 📱 Additional Options

```bash
# Run on specific device
npx react-native run-ios --device "John's iPhone"
npx react-native run-android --deviceId=device_id

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 16"
```

If everything is set up correctly, you should see your app running in the emulator/simulator.

> **Tip**: You can also run the app directly from Android Studio or Xcode.

### 4️⃣ Development and Modifications

Now that you have the app running, you can start developing:

#### 🔧 Hot Reload
1. Open `App.tsx` in your favorite editor and modify the code
2. Changes will be reflected automatically thanks to **Fast Refresh**

#### 🛠️ Developer Menu
- **Android**: <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS)
- **iOS**: <kbd>Cmd ⌘</kbd> + <kbd>D</kbd> in the simulator

#### 📁 Project Structure

Explore the `app/` folder that contains the entire architecture:

```
app/
├── components/     # Reusable components
│   └── Button/     # Button components
│       ├── Button/ # Primary button component
│       └── Input/  # Input component
├── screens/        # Application screens
│   └── Home/       # Home screen with login
├── hooks/          # Custom hooks
├── services/       # API services
├── utils/          # Utility functions
│   ├── index.ts           # Main exports
│   ├── utilsStrings.ts    # String utilities
│   ├── utilsDate.ts       # Date utilities
│   ├── utilsNumber.ts     # Number utilities
│   └── utilsStyle.ts      # Style utilities
├── types/          # TypeScript definitions
├── assets/         # Theme system & assets
│   └── theme/      # Theme configuration
│       ├── index.ts           # Theme exports
│       ├── ColorsDefault.ts   # Color palette
│       ├── Fonts.ts           # Typography system
│       ├── Metrics.ts         # Spacing & dimensions
│       └── Margins.ts         # Spacing styles
└── constants/      # Global constants
```

> 📖 **Complete documentation**: Check `app/README.md` for detailed usage guides.

## 🎉 Congratulations!

You've successfully run your React Native TypeScript application! 🚀

### 🔥 Next Steps

#### 🏗️ **Development**
- Explore **components** in `app/components/`
- Use **custom hooks** for forms and API
- Customize the **theme system** in `app/assets/theme/`
- Add new **screens** in `app/screens/`

#### 📚 **Useful Resources**
- [Integration Guide](https://reactnative.dev/docs/integration-with-existing-apps) - For existing apps
- [React Native Introduction](https://reactnative.dev/docs/getting-started) - Basic concepts
- [TypeScript with React Native](https://reactnative.dev/docs/typescript) - Advanced typing

#### 🛠️ **Available Scripts**

```bash
# Development
npm start              # Start Metro
npm run start:reset    # Start Metro with clean cache
npm run android        # Run on Android
npm run ios            # Run on iOS

# Code Quality
npm run lint           # Run ESLint
npm run lint-fix       # Fix ESLint errors
npm run type-check     # Check TypeScript types
npm test               # Run tests
npm run test:coverage  # Run tests with coverage

# Build & Cleanup
npm run build:android  # Android production build
npm run build:ios      # iOS production build
npm run clean          # Complete project cleanup
```

## 📦 Included Versions

| Dependency | Version |
|------------|---------|
| React Native | 0.75.4 |
| React | 18.3.1 |
| TypeScript | 5.9.2 |
| React Navigation | 6.1.18 |
| TanStack Query | 5.59.0 |
| React Native Screens | 3.35.0 |
| React Native Safe Area Context | 4.14.0 |
| React Native Unistyles | 2.10.0 |
| React Native MMKV | 3.0.2 |
| ESLint | 8.57.0 |
| Prettier | 3.6.2 |
| Jest | 29.6.3 |

## 📋 Requirements

- Node.js >= 20
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

## 🎯 Additional Features

### Path Mapping
The template includes path mapping configuration for cleaner imports:

```typescript
// Instead of
import { Button } from '../../../components/Button/Button.component';

// You can use
import { Button } from '@components/Button/Button.component';
```

### Available Paths:
- `@/*` → `./app/*`
- `@components/*` → `./app/components/*`
- `@screens/*` → `./app/screens/*`
- `@hooks/*` → `./app/hooks/*`
- `@services/*` → `./app/services/*`
- `@utils/*` → `./app/utils/*`
- `@assets/*` → `./app/assets/*`

### Utility Libraries
The template includes organized utility libraries:

```typescript
// String utilities
import { isValidEmail, capitalize, truncateText } from '@utils/utilsStrings';

// Date utilities  
import { formatDate, getRelativeTime, isToday } from '@utils/utilsDate';

// Number utilities
import { formatCurrency, formatBytes, average } from '@utils/utilsNumber';

// Style utilities
import { createShadow, hexToRgba, scaleSize } from '@utils/utilsStyle';

// Or import everything
import { isValidEmail, formatDate, formatCurrency, createShadow } from '@utils';
```

### Development Configuration
- **ESLint**: Configured with Airbnb style guide and custom rules
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for code quality
- **TypeScript**: Strict configuration for better typing
- **Jest**: Testing framework with preconfigured mocks

## 🔧 Troubleshooting

### ❌ Common Issues

#### Metro won't start
```bash
# Clean cache
npx react-native start --reset-cache

# OR using Yarn
yarn start --reset-cache
```

#### iOS compilation errors
```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Reinstall pods
cd ios && rm -rf Pods && pod install && cd ..
```

#### Android compilation errors
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Clean Gradle cache
cd android && ./gradlew cleanBuildCache && cd ..
```

#### Dependency issues
```bash
# Reinstall node_modules
rm -rf node_modules && npm install

# OR with Yarn
rm -rf node_modules && yarn install
```

### 🆘 More Help

- [Official Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [React Native Issues](https://github.com/facebook/react-native/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

## 📚 Learning Resources

### 🎯 **React Native**
- [**Official Website**](https://reactnative.dev) - Complete documentation
- [**Getting Started**](https://reactnative.dev/docs/environment-setup) - Environment setup
- [**Learn the Basics**](https://reactnative.dev/docs/getting-started) - Guided tour of basic concepts
- [**Official Blog**](https://reactnative.dev/blog) - Latest news and updates

### 🔷 **TypeScript**
- [**TypeScript Handbook**](https://www.typescriptlang.org/docs/) - Complete guide
- [**React Native + TypeScript**](https://reactnative.dev/docs/typescript) - Official integration
- [**Type Challenges**](https://github.com/type-challenges/type-challenges) - Practical exercises

### 🏗️ **Architecture and Patterns**
- [**React Patterns**](https://reactpatterns.com/) - Design patterns
- [**Clean Architecture**](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Architecture principles
- [**React Native Best Practices**](https://github.com/react-native-community/discussions-and-proposals) - Best practices

### 🛠️ **Development Tools**
- [**Flipper**](https://fbflipper.com/) - Advanced debugging
- [**Reactotron**](https://github.com/infinitered/reactotron) - State inspector
- [**Detox**](https://github.com/wix/Detox) - E2E testing

### 📱 **Useful Repositories**
- [**React Native**](https://github.com/facebook/react-native) - Official repository
- [**Awesome React Native**](https://github.com/jondot/awesome-react-native) - Curated list of resources
- [**React Native Elements**](https://github.com/react-native-elements/react-native-elements) - Component library

---

## 📄 License

This project is under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatibility**: React Native 0.75+, iOS 13+, Android 7+ (API 23+)  
**Template**: React Native TypeScript Professional  
**Node.js**: >= 20.0.0  

---

**Made with ❤️ for the React Native developer community**

Like this template? ⭐ **Give it a star on GitHub!** ⭐
