# My City Slow - Navigation System Integration Guide

## Overview

This document provides complete integration instructions for the new premium navigation system, including the Top App Bar, Navigation Drawer, and deep linking support.

## Architecture Components

### 1. **Data Layer**
- `MenuDto.kt` - API DTOs for menu items
- `MenuRepository.kt` - Repository with default menu items fallback

### 2. **Domain Layer**
- `MenuItem.kt` - Domain model for menu items

### 3. **Presentation Layer (UI Components)**
- `MyCitySlowTopAppBar.kt` - Custom top navigation bar with logo
- `MyCitySlowNavigationDrawer.kt` - Navigation drawer with menu items
- `MyCitySlowNavigationHost.kt` - Main host composable that integrates everything
- `MenuViewModel.kt` - ViewModel for menu state management

### 4. **Navigation**
- `DeepLinkHandler.kt` - Centralized deep link routing logic

---

## API Setup (Backend)

### Menu Endpoint
Create the following endpoint in your backend:

```http
GET /api/menu
```

**Response Format:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "home",
      "title": "Home",
      "subtitle": null,
      "icon": "🏠",
      "deeplink": "mycityslow://home",
      "type": "menu",
      "order": 1,
      "visible": true
    },
    {
      "id": "discover",
      "title": "Discover",
      "subtitle": "Hidden peaceful spots",
      "icon": "🗺️",
      "deeplink": "mycityslow://discover",
      "type": "menu",
      "order": 2,
      "visible": true
    },
    {
      "id": "divider1",
      "type": "divider",
      "title": "",
      "order": 7
    }
  ],
  "message": "Menu fetched successfully"
}
```

**Menu Item Types:**
- `menu` - Regular clickable menu item
- `section` - Section header (non-clickable)
- `divider` - Visual separator

---

## Integration Steps

### Step 1: Update AndroidManifest.xml

Add deep link scheme to your MainActivity:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <!-- Deep linking support -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="mycityslow"
            android:host="home" />
        <data
            android:scheme="mycityslow"
            android:host="discover" />
        <data
            android:scheme="mycityslow"
            android:host="experiences" />
        <data
            android:scheme="mycityslow"
            android:host="collection" />
        <data
            android:scheme="mycityslow"
            android:host="guide" />
        <data
            android:scheme="mycityslow"
            android:host="submit" />
        <data
            android:scheme="mycityslow"
            android:host="stories" />
        <data
            android:scheme="mycityslow"
            android:host="about" />
        <data
            android:scheme="mycityslow"
            android:host="privacy" />
        <data
            android:scheme="mycityslow"
            android:host="share" />
        <data
            android:scheme="mycityslow"
            android:host="rate" />
    </intent-filter>
</activity>
```

### Step 2: Update MainActivity

Modify your `MainActivity.kt` to handle deep links:

```kotlin
import com.mycityslow.app.navigation.DeepLinkHandler

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Handle incoming deep link
        handleIncomingDeepLink(intent)

        setContent {
            MyCitySlowTheme {
                // Your app content with navigation
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIncomingDeepLink(intent)
    }

    private fun handleIncomingDeepLink(intent: Intent) {
        val deepLinkUri = intent.data?.toString()
        if (!deepLinkUri.isNullOrEmpty()) {
            // Navigate using the deep link
            // This will be handled through your navigation controller
        }
    }
}
```

### Step 3: Update Your Main App Navigation

In your main app composable, integrate the navigation system:

```kotlin
@Composable
fun MyCitySlowApp(
    navController: NavController,
    userName: String? = null,
    userEmail: String? = null
) {
    MyCitySlowNavigationHost(
        onDeepLinkAction = { deeplink ->
            val action = DeepLinkHandler.handleDeepLink(deeplink)
            DeepLinkHandler.executeDeepLinkAction(action, navController)
        },
        userName = userName,
        userEmail = userEmail,
        content = { paddingValues ->
            // Your main content/screens
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // Navigation graph or screen content
            }
        }
    )
}
```

### Step 4: Using Individual Components

If you want to use components separately:

#### Top App Bar Only
```kotlin
MyCitySlowTopAppBar(
    onMenuClick = {
        // Handle menu click
    },
    showTagline = true
)
```

#### Navigation Drawer Only
```kotlin
val menuViewModel: MenuViewModel = hiltViewModel()
val menuItems by menuViewModel.menuItems.collectAsStateWithLifecycle()

MyCitySlowNavigationDrawer(
    menuItems = menuItems,
    onMenuItemClick = { item ->
        // Handle menu item click
    },
    onCloseDrawer = {
        // Handle drawer close
    },
    userName = "John Doe",
    userEmail = "john@example.com"
)
```

---

## Color Palette Integration

The navigation system uses the app's theme colors. Ensure these are defined in your theme:

```kotlin
// In your theme file
private val SageGreen = Color(0xFFA8C4B0)
private val WarmBeige = Color(0xFFF5F0E8)
private val DeepForest = Color(0xFF2C4A2B)

val MyCitySlowColorScheme = lightColorScheme(
    primary = SageGreen,
    onPrimary = Color.White,
    primaryContainer = SageGreen.copy(alpha = 0.08f),
    onPrimaryContainer = SageGreen,
    secondary = WarmBeige,
    onSecondary = Color.White,
    surface = Color.White,
    onSurface = DeepForest,
    onSurfaceVariant = Color.Gray,
    background = Color.White,
    onBackground = DeepForest,
    outline = SageGreen.copy(alpha = 0.3f)
)
```

---

## Features

### ✅ Top App Bar
- Displays app logo (from `logo_main.xml`)
- Shows app name "My City Slow"
- Optional tagline "Discover the Peaceful Side"
- Hamburger menu button with sage green accent
- Clean, minimal design with elevation shadow

### ✅ Navigation Drawer
- Header section with larger logo
- User profile display (if logged in)
- Dynamic menu items from API (with fallback defaults)
- Support for sections, dividers, and regular menu items
- Emoji icons for visual appeal
- Subtitle support for menu items
- Smooth animations

### ✅ Deep Linking
- `mycityslow://home` - Navigate to Home
- `mycityslow://discover` - Navigate to Discover
- `mycityslow://experiences` - Navigate to Experiences
- `mycityslow://collection` - Navigate to Saved Items
- `mycityslow://guide` - Navigate to First Time Guide
- `mycityslow://submit` - Navigate to Submit Spot
- `mycityslow://stories` - Navigate to Community Stories
- `mycityslow://about` - Navigate to About Us
- `mycityslow://privacy` - Navigate to Privacy Policy
- `mycityslow://share` - Share app (opens system share)
- `mycityslow://rate` - Rate app (opens Play Store)

### ✅ Responsive Design
- Works on all Android device sizes
- Portrait and landscape support
- Proper Material 3 theming
- Accessibility support

---

## Default Menu Structure

If the API is unavailable or fails, the app falls back to these default menu items:

```
🏠 Home
🗺️ Discover - Hidden peaceful spots
✨ Authentic Experiences
❤️ My Slow List
🆕 First Time Guide
🎯 Submit a Spot
---
📖 Community Stories
ℹ️ About Us
---
🔒 Privacy Policy
📤 Share App
⭐ Rate Us
```

---

## Styling & Theming

### TopAppBar
- Height: 64dp (or 80dp with tagline)
- Logo size: 48dp
- Background: White with 2dp elevation
- Hamburger icon: Sage green with subtle background

### NavigationDrawer
- Width: 280dp
- Header background: Sage green (5% opacity)
- Logo size: 80dp
- Menu item height: 56dp
- Support for dark mode

---

## Best Practices

1. **Cache Menu Items** - The ViewModel caches menu items after first load
2. **Error Handling** - Automatic fallback to default menu if API fails
3. **Deep Links** - Always prefix with `mycityslow://` for consistency
4. **Accessibility** - All components support content descriptions
5. **Performance** - Drawer uses LazyColumn for efficient list rendering

---

## Troubleshooting

### Menu items not loading?
- Check if `/api/menu` endpoint is responding
- Verify API timeout (default 60s in RetrofitModule)
- Check logcat for API errors

### Deep links not working?
- Verify intent-filter in AndroidManifest.xml
- Check deep link format: `mycityslow://destination`
- Ensure NavController is properly initialized

### Logo not showing?
- Verify `R.drawable.logo_main` exists
- Check drawable file permissions
- Ensure theme colors are properly defined

---

## Testing

### Test Deep Links (via ADB)

```bash
# Navigate to Home
adb shell am start -W -a android.intent.action.VIEW -d "mycityslow://home" com.mycityslow.app

# Navigate to Discover
adb shell am start -W -a android.intent.action.VIEW -d "mycityslow://discover" com.mycityslow.app

# Open Share
adb shell am start -W -a android.intent.action.VIEW -d "mycityslow://share" com.mycityslow.app
```

### Test Menu Loading
- Monitor logcat for MenuViewModel logs
- Check API endpoint response in Network Interceptor
- Verify menu items display correctly in drawer

---

## Future Enhancements

- [ ] User preferences for menu item ordering
- [ ] Analytics tracking for menu item clicks
- [ ] Animated menu transitions
- [ ] Nested menu support
- [ ] Keyboard shortcuts for menu items
- [ ] Menu item badges (notifications)
- [ ] Dynamic menu caching strategies
