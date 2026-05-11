package com.mycityslow.app

/**
 * QUICK START GUIDE - How to Use the New Navigation System
 * 
 * This file contains ready-to-use code examples for integrating
 * the premium navigation system into your app.
 */

// ============================================================================
// 1. EXAMPLE: Using the Complete Navigation Host (RECOMMENDED)
// ============================================================================

/*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.mycityslow.app.navigation.DeepLinkHandler
import com.mycityslow.app.presentation.components.navigation.MyCitySlowNavigationHost
import androidx.navigation.NavController

@Composable
fun MyAppContent(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    MyCitySlowNavigationHost(
        onDeepLinkAction = { deeplink ->
            val action = DeepLinkHandler.handleDeepLink(deeplink)
            DeepLinkHandler.executeDeepLinkAction(action, navController)
        },
        userName = "John Doe",  // optional
        userEmail = "john@example.com",  // optional
        modifier = modifier,
        content = { paddingValues ->
            // Your main content goes here
            // This already has TopAppBar above it
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(Color.White)
            ) {
                // Your navigation graph or screens
                // Example:
                // NavHost(navController, route = "home") { ... }
            }
        }
    )
}
*/

// ============================================================================
// 2. EXAMPLE: Using TopAppBar and Drawer Separately
// ============================================================================

/*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.*
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.mycityslow.app.presentation.components.navigation.MyCitySlowTopAppBar
import com.mycityslow.app.presentation.components.navigation.MyCitySlowNavigationDrawer
import com.mycityslow.app.presentation.viewmodel.MenuViewModel
import kotlinx.coroutines.launch

@Composable
fun MyCustomNavigation(
    menuViewModel: MenuViewModel = hiltViewModel()
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val menuItems by menuViewModel.menuItems.collectAsStateWithLifecycle()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                MyCitySlowNavigationDrawer(
                    menuItems = menuItems,
                    onMenuItemClick = { item ->
                        // Handle item click
                        scope.launch { drawerState.close() }
                    },
                    onCloseDrawer = {
                        scope.launch { drawerState.close() }
                    },
                    userName = "John Doe",
                    userEmail = "john@example.com"
                )
            }
        }
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            MyCitySlowTopAppBar(
                onMenuClick = {
                    scope.launch { drawerState.open() }
                }
            )
            
            // Rest of your content
        }
    }
}
*/

// ============================================================================
// 3. EXAMPLE: AndroidManifest.xml - Deep Link Intent Filter
// ============================================================================

/*
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- ... existing permissions ... -->

    <application>
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MyCitySlow">
            
            <!-- Main launcher intent filter -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Deep linking support -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                
                <data android:scheme="mycityslow" android:host="home" />
                <data android:scheme="mycityslow" android:host="discover" />
                <data android:scheme="mycityslow" android:host="experiences" />
                <data android:scheme="mycityslow" android:host="collection" />
                <data android:scheme="mycityslow" android:host="guide" />
                <data android:scheme="mycityslow" android:host="submit" />
                <data android:scheme="mycityslow" android:host="stories" />
                <data android:scheme="mycityslow" android:host="about" />
                <data android:scheme="mycityslow" android:host="privacy" />
                <data android:scheme="mycityslow" android:host="share" />
                <data android:scheme="mycityslow" android:host="rate" />
            </intent-filter>
        </activity>
    </application>
</manifest>
*/

// ============================================================================
// 4. EXAMPLE: MainActivity.kt - Handle Deep Links
// ============================================================================

/*
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.mycityslow.app.navigation.DeepLinkHandler
import com.mycityslow.app.presentation.screens.HomeScreen
import com.mycityslow.app.presentation.screens.DiscoverScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            val navController = rememberNavController()
            
            MyCitySlowTheme {
                MyAppContent(navController = navController)
            }
        }
        
        // Handle incoming deep link
        handleDeepLink(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleDeepLink(intent)
    }

    private fun handleDeepLink(intent: Intent) {
        intent.data?.toString()?.let { deeplink ->
            // The deep link will be processed by MyCitySlowNavigationHost
            // and routed through DeepLinkHandler
        }
    }
}
*/

// ============================================================================
// 5. EXAMPLE: Testing Deep Links via ADB
// ============================================================================

/*
# Test Home navigation
adb shell am start -W -a android.intent.action.VIEW \
    -d "mycityslow://home" com.mycityslow.app

# Test Discover
adb shell am start -W -a android.intent.action.VIEW \
    -d "mycityslow://discover" com.mycityslow.app

# Test Experiences
adb shell am start -W -a android.intent.action.VIEW \
    -d "mycityslow://experiences" com.mycityslow.app

# Test Share (opens system share)
adb shell am start -W -a android.intent.action.VIEW \
    -d "mycityslow://share" com.mycityslow.app

# Test Rate (opens Play Store)
adb shell am start -W -a android.intent.action.VIEW \
    -d "mycityslow://rate" com.mycityslow.app
*/

// ============================================================================
// 6. EXAMPLE: Backend API Response for Menu
// ============================================================================

/*
GET /api/menu

Response:
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
    },
    {
      "id": "about",
      "title": "About Us",
      "icon": "ℹ️",
      "deeplink": "mycityslow://about",
      "type": "menu",
      "order": 8,
      "visible": true
    }
  ],
  "message": "Menu fetched successfully"
}

NOTE: If API returns error or times out, app automatically uses
      default menu items defined in MenuRepository.kt
*/

// ============================================================================
// 7. EXAMPLE: Customizing Colors (in your Theme file)
// ============================================================================

/*
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

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
    tertiary = DeepForest,
    surface = Color.White,
    onSurface = DeepForest,
    onSurfaceVariant = Color.Gray,
    background = Color.White,
    onBackground = DeepForest,
    outline = SageGreen.copy(alpha = 0.3f)
)
*/

// ============================================================================
// 8. EXAMPLE: Adding Custom Menu Item Handling
// ============================================================================

/*
// In your composable or ViewModel
val navController: NavController = rememberNavController()

MyCitySlowNavigationHost(
    onDeepLinkAction = { deeplink ->
        when {
            deeplink.contains("home") -> {
                navController.navigate("home") {
                    popUpTo("home") { inclusive = true }
                }
            }
            deeplink.contains("discover") -> {
                navController.navigate("discover")
            }
            deeplink.contains("experiences") -> {
                navController.navigate("experiences")
            }
            // ... handle other deep links ...
            else -> {
                // Custom handling for unknown deep links
                Log.d("Navigation", "Unknown deep link: $deeplink")
            }
        }
    }
)
*/

// ============================================================================
// FILES LOCATION REFERENCE
// ============================================================================

/*
Frontend Android Project Structure:
├── app/src/main/java/com/mycityslow/app/
│   ├── data/
│   │   ├── remote/
│   │   │   └── dto/
│   │   │       └── MenuDto.kt                        ← NEW
│   │   └── repository/
│   │       └── MenuRepository.kt                     ← NEW
│   ├── domain/
│   │   └── model/
│   │       └── MenuItem.kt                           ← NEW
│   ├── navigation/
│   │   └── DeepLinkHandler.kt                        ← NEW
│   └── presentation/
│       ├── components/
│       │   └── navigation/
│       │       ├── MyCitySlowTopAppBar.kt            ← NEW
│       │       ├── MyCitySlowNavigationDrawer.kt     ← NEW
│       │       └── MyCitySlowNavigationHost.kt       ← NEW
│       └── viewmodel/
│           └── MenuViewModel.kt                      ← NEW

└── Documentation:
    ├── NAVIGATION_SYSTEM_GUIDE.md                    ← NEW
    ├── NAVIGATION_IMPLEMENTATION_SUMMARY.md          ← NEW
    └── LOGO_DESIGN_BRIEF.md                          (updated)

Logo Location:
├── app/src/main/res/drawable/
│   └── logo_main.xml                                 (updated with new design)
*/

// ============================================================================
// DEPENDENCIES (Already in build.gradle.kts)
// ============================================================================

/*
// Navigation
implementation("androidx.navigation:navigation-compose:2.7.7")
implementation("androidx.hilt:hilt-navigation-compose:1.2.0")

// Compose
implementation("androidx.compose.material3:material3:1.2.0")
implementation("androidx.activity:activity-compose:1.9.0")

// Hilt
implementation("com.google.dagger:hilt-android:2.50")
kapt("com.google.dagger:hilt-compiler:2.50")

// Lifecycle
implementation("androidx.lifecycle:lifecycle-compose:2.7.0")

// Retrofit (for menu API calls)
implementation("com.squareup.retrofit2:retrofit:2.9.0")
implementation("com.google.code.gson:gson:2.10.1")
*/

// ============================================================================
// QUICK CHECKLIST FOR INTEGRATION
// ============================================================================

/*
✅ Copy all 9 files to appropriate directories
✅ Update AndroidManifest.xml with deep link intent filter
✅ Add theme colors (SageGreen, WarmBeige, DeepForest)
✅ Implement deep link handler in MainActivity
✅ Replace existing navigation with MyCitySlowNavigationHost
✅ (Optional) Create /api/menu endpoint in backend
✅ Test all deep links using adb commands
✅ Verify TopAppBar renders correctly
✅ Verify Drawer opens/closes smoothly
✅ Test Share and Rate functionality
✅ Build and deploy to Play Store

When all checked, you're production ready! 🚀
*/
