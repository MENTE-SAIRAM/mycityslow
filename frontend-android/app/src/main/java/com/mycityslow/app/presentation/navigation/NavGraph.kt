package com.mycityslow.app.presentation.navigation

import androidx.compose.animation.*
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.mycityslow.app.data.local.UserPreferencesStore
import com.mycityslow.app.presentation.screens.discovery.DiscoveryScreen
import com.mycityslow.app.presentation.screens.experiences.ExperiencesScreen
import com.mycityslow.app.presentation.screens.home.HomeScreen
import com.mycityslow.app.presentation.screens.mylist.MyListScreen
import com.mycityslow.app.presentation.screens.onboarding.OnboardingCityScreen
import com.mycityslow.app.presentation.screens.onboarding.OnboardingInterestsScreen
import com.mycityslow.app.presentation.screens.onboarding.OnboardingWelcomeScreen
import com.mycityslow.app.presentation.screens.spotdetail.SpotDetailScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NavGraph(
    navController: NavHostController,
    preferencesStore: UserPreferencesStore,
) {
    val onboardingComplete by preferencesStore.onboardingComplete.collectAsStateWithLifecycle(
        initialValue = false
    )
    val startDestination = if (onboardingComplete) Screen.Home.route else Screen.Onboarding.route

    val bottomNavItems = listOf(
        BottomNavItem.Home,
        BottomNavItem.Discovery,
        BottomNavItem.Experiences,
        BottomNavItem.MyList,
    )

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val showBottomBar = currentRoute in bottomNavItems.map { it.route }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface,
                ) {
                    bottomNavItems.forEach { item ->
                        val selected = currentRoute == item.route
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = item.icon,
                                    contentDescription = item.label,
                                )
                            },
                            label = { Text(item.label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = MaterialTheme.colorScheme.primary,
                                selectedTextColor = MaterialTheme.colorScheme.primary,
                                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            ),
                        )
                    }
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.padding(paddingValues),
        ) {
            // Onboarding
            composable(Screen.Onboarding.route) {
                OnboardingWelcomeScreen(
                    onGetStarted = {
                        navController.navigate(Screen.OnboardingCity.route)
                    }
                )
            }
            composable(Screen.OnboardingCity.route) {
                OnboardingCityScreen(
                    preferencesStore = preferencesStore,
                    onCitySelected = {
                        navController.navigate(Screen.OnboardingInterests.route)
                    }
                )
            }
            composable(Screen.OnboardingInterests.route) {
                OnboardingInterestsScreen(
                    preferencesStore = preferencesStore,
                    onComplete = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Onboarding.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
            }

            // Main tabs
            composable(Screen.Home.route) {
                HomeScreen(
                    onSpotClick = { id ->
                        navController.navigate(Screen.SpotDetail.createRoute(id))
                    }
                )
            }
            composable(Screen.Discovery.route) {
                DiscoveryScreen(
                    onSpotClick = { id ->
                        navController.navigate(Screen.SpotDetail.createRoute(id))
                    }
                )
            }
            composable(Screen.Experiences.route) {
                ExperiencesScreen()
            }
            composable(Screen.MyList.route) {
                MyListScreen(
                    onSpotClick = { id ->
                        navController.navigate(Screen.SpotDetail.createRoute(id))
                    }
                )
            }

            // Detail screens
            composable(
                route = Screen.SpotDetail.route,
                arguments = listOf(navArgument("id") { type = NavType.StringType })
            ) { backStackEntry ->
                val id = backStackEntry.arguments?.getString("id") ?: ""
                SpotDetailScreen(
                    spotId = id,
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}
