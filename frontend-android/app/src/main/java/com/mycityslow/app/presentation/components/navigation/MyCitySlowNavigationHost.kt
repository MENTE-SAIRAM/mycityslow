package com.mycityslow.app.presentation.components.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.mycityslow.app.domain.model.MenuItem
import com.mycityslow.app.presentation.viewmodel.MenuViewModel
import kotlinx.coroutines.launch

/**
 * Main Navigation Host that integrates TopAppBar, NavigationDrawer, and handles deep linking
 * Usage:
 * ```
 * MyCitySlowNavigationHost(
 *     onDeepLinkAction = { deeplink ->
 *         // Handle deep link navigation
 *     },
 *     content = { /* Your main content */ }
 * )
 * ```
 */
@Composable
fun MyCitySlowNavigationHost(
    onDeepLinkAction: (String) -> Unit,
    modifier: Modifier = Modifier,
    userName: String? = null,
    userEmail: String? = null,
    menuViewModel: MenuViewModel = hiltViewModel(),
    content: @Composable (paddingValues: PaddingValues) -> Unit = {}
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    // Collect menu items from ViewModel
    val menuItems by menuViewModel.menuItems.collectAsStateWithLifecycle()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(
                modifier = Modifier.width(280.dp),
                drawerContainerColor = Color.White
            ) {
                MyCitySlowNavigationDrawer(
                    menuItems = menuItems,
                    onMenuItemClick = { item ->
                        // Handle menu item click with deep link
                        if (!item.deeplink.isNullOrEmpty()) {
                            onDeepLinkAction(item.deeplink)
                        }
                    },
                    onCloseDrawer = {
                        scope.launch {
                            drawerState.close()
                        }
                    },
                    userName = userName,
                    userEmail = userEmail
                )
            }
        },
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
        ) {
            // Top App Bar
            MyCitySlowTopAppBar(
                onMenuClick = {
                    scope.launch {
                        drawerState.open()
                    }
                }
            )

            // Main Content
            content(PaddingValues(0.dp))
        }
    }
}
