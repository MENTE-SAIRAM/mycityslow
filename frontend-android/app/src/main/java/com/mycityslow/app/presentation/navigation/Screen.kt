package com.mycityslow.app.presentation.navigation

import android.net.Uri
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Spa
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String) {
    object Onboarding : Screen("onboarding")
    object OnboardingCity : Screen("onboarding/city")
    object OnboardingInterests : Screen("onboarding/interests")
    object Main : Screen("main")
    object Home : Screen("home")
    object Discovery : Screen("discovery")
    object Experiences : Screen("experiences")
    object MyList : Screen("my_list")
    object SpotDetail : Screen("spot_detail/{id}") {
        fun createRoute(id: String) = "spot_detail/${Uri.encode(id)}"
    }
    object ExperienceDetail : Screen("experience_detail/{id}") {
        fun createRoute(id: String) = "experience_detail/$id"
    }
}

sealed class BottomNavItem(val route: String, val label: String, val icon: ImageVector) {
    object Home : BottomNavItem(Screen.Home.route, "Home", Icons.Filled.Home)
    object Discovery : BottomNavItem(Screen.Discovery.route, "Discover", Icons.Filled.Explore)
    object Experiences : BottomNavItem(Screen.Experiences.route, "Experiences", Icons.Filled.Spa)
    object MyList : BottomNavItem(Screen.MyList.route, "My List", Icons.Filled.Bookmark)
}
