package com.mycityslow.app.data.remote.dto

import com.google.gson.annotations.SerializedName

data class MenuResponseDto(
    @SerializedName("status")
    val status: String?,
    @SerializedName("data")
    val data: List<MenuItemDto>?,
    @SerializedName("message")
    val message: String?
)

data class MenuItemDto(
    @SerializedName("id")
    val id: String?,
    @SerializedName("title")
    val title: String?,
    @SerializedName("subtitle")
    val subtitle: String?,
    @SerializedName("icon")
    val icon: String?, // emoji or icon name
    @SerializedName("deeplink")
    val deeplink: String?,
    @SerializedName("type")
    val type: String?, // "menu", "section", "divider", "header"
    @SerializedName("order")
    val order: Int?,
    @SerializedName("visible")
    val visible: Boolean?
)
