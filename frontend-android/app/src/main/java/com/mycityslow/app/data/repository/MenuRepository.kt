package com.mycityslow.app.data.repository

import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.domain.model.MenuItem
import javax.inject.Inject

class MenuRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getNavigationMenu(): List<MenuItem> {
        return try {
            val response = apiService.getNavigationMenu()
            response.data?.map { dto ->
                MenuItem(
                    id = dto.id ?: "",
                    title = dto.title ?: "",
                    subtitle = dto.subtitle,
                    icon = dto.icon,
                    deeplink = dto.deeplink,
                    type = dto.type ?: "menu",
                    order = dto.order ?: 0,
                    visible = dto.visible ?: true
                )
            }?.sortedBy { it.order } ?: getDefaultMenuItems()
        } catch (e: Exception) {
            getDefaultMenuItems()
        }
    }

    private fun getDefaultMenuItems(): List<MenuItem> {
        return listOf(
            MenuItem(
                id = "home",
                title = "Home",
                icon = "🏠",
                deeplink = "mycityslow://home",
                order = 1
            ),
            MenuItem(
                id = "discover",
                title = "Discover",
                subtitle = "Hidden peaceful spots",
                icon = "🗺️",
                deeplink = "mycityslow://discover",
                order = 2
            ),
            MenuItem(
                id = "experiences",
                title = "Authentic Experiences",
                icon = "✨",
                deeplink = "mycityslow://experiences",
                order = 3
            ),
            MenuItem(
                id = "collection",
                title = "My Slow List",
                icon = "❤️",
                deeplink = "mycityslow://collection",
                order = 4
            ),
            MenuItem(
                id = "first_time",
                title = "First Time Guide",
                icon = "🆕",
                deeplink = "mycityslow://guide",
                order = 5
            ),
            MenuItem(
                id = "submit",
                title = "Submit a Spot",
                icon = "🎯",
                deeplink = "mycityslow://submit",
                order = 6
            ),
            MenuItem(
                id = "divider1",
                type = "divider",
                title = "",
                order = 7
            ),
            MenuItem(
                id = "community",
                title = "Community Stories",
                icon = "📖",
                deeplink = "mycityslow://stories",
                order = 8
            ),
            MenuItem(
                id = "about",
                title = "About Us",
                icon = "ℹ️",
                deeplink = "mycityslow://about",
                order = 9
            ),
            MenuItem(
                id = "divider2",
                type = "divider",
                title = "",
                order = 10
            ),
            MenuItem(
                id = "privacy",
                title = "Privacy Policy",
                icon = "🔒",
                deeplink = "mycityslow://privacy",
                order = 11
            ),
            MenuItem(
                id = "share",
                title = "Share App",
                icon = "📤",
                deeplink = "mycityslow://share",
                order = 12
            ),
            MenuItem(
                id = "rate",
                title = "Rate Us",
                icon = "⭐",
                deeplink = "mycityslow://rate",
                order = 13
            )
        )
    }
}
