package com.mycityslow.app.domain.model

data class ApiResponse<T>(
    val success: Boolean,
    val message: String?,
    val data: T?,
)

data class PaginatedResponse<T>(
    val spots: List<T>,
    val pagination: Pagination,
)

data class Pagination(
    val page: Int,
    val limit: Int,
    val total: Int,
    val totalPages: Int,
    val hasMore: Boolean,
)

data class HomeData(
    val greeting: String,
    val currentCity: City?,
    val trendingSpots: List<Spot>,
    val authenticExperiences: List<Experience>,
    val guides: List<CuratedGuide>,
    val travelerTypes: List<String>,
)

data class DiscoveryFilters(
    val vibe: String? = null,
    val bestTime: String? = null,
    val crowdLevel: String? = null,
    val category: String? = null,
    val travelerType: String? = null,
    val citySlug: String? = null,
    val search: String? = null,
    val page: Int = 1,
    val limit: Int = 20,
)

data class UserPreferences(
    val selectedCitySlug: String? = null,
    val travelerTypes: List<String> = emptyList(),
    val hasCompletedOnboarding: Boolean = false,
)
