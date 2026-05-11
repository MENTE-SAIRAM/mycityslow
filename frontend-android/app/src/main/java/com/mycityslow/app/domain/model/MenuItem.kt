package com.mycityslow.app.domain.model

data class MenuItem(
    val id: String,
    val title: String,
    val subtitle: String? = null,
    val icon: String? = null,
    val deeplink: String? = null,
    val type: String = "menu", // "menu", "section", "divider", "header"
    val order: Int = 0,
    val visible: Boolean = true
)
