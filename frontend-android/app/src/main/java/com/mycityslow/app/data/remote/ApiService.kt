package com.mycityslow.app.data.remote

import com.mycityslow.app.data.remote.dto.*
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // Cities
    @GET("cities")
    suspend fun getCities(): ApiResponseDto<List<CityDto>>

    @GET("cities/{slug}")
    suspend fun getCityBySlug(@Path("slug") slug: String): ApiResponseDto<CityDto>

    // Spots — discovery endpoints
    @GET("discovery/spots")
    suspend fun discoverSpots(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("city") city: String? = null,
        @Query("category") category: String? = null,
        @Query("vibe") vibe: String? = null,
        @Query("bestTime") bestTime: String? = null,
        @Query("crowdLevel") crowdLevel: String? = null,
        @Query("travelerType") travelerType: String? = null,
        @Query("search") search: String? = null,
    ): ApiResponseDto<PaginatedResponseDto<SpotDto>>

    @GET("discovery/spots/{id}")
    suspend fun getSpotById(@Path("id") id: String): ApiResponseDto<SpotDto>

    @GET("discovery/spots/mobile/ui-text")
    suspend fun getSpotDetailUiText(): ApiResponseDto<SpotDetailUiTextDto>

    @GET("discovery/spots/mobile/card-data")
    suspend fun getMobileCardData(): ApiResponseDto<MobileCardDataDto>

    @GET("spots/nearby")
    suspend fun getNearbySpots(
        @Query("lat") lat: Double,
        @Query("lng") lng: Double,
        @Query("radius") radius: Double = 8.0,
        @Query("limit") limit: Int = 10,
        @Query("page") page: Int = 1,
    ): ApiResponseDto<PaginatedResponseDto<SpotDto>>

    // Experiences
    @GET("experiences")
    suspend fun getExperiences(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("city") city: String? = null,
        @Query("type") type: String? = null,
        @Query("category") category: String? = null,
        @Query("travelerType") travelerType: String? = null,
        @Query("priceRange") priceRange: String? = null,
        @Query("search") search: String? = null,
    ): ApiResponseDto<ExperiencesResponseDto>

    @GET("experiences/{id}")
    suspend fun getExperienceById(@Path("id") id: String): ApiResponseDto<ExperienceDto>

    @GET("experiences/filters")
    suspend fun getExperienceFilters(): ApiResponseDto<Map<String, List<String>>>

    // Home
    @GET("home")
    suspend fun getHomeData(
        @Query("city") city: String? = null,
        @Query("lat") lat: Double? = null,
        @Query("lng") lng: Double? = null,
    ): ApiResponseDto<HomeDataDto>

    // Stories
    @GET("community/stories")
    suspend fun getStories(
        @Query("city") city: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
    ): ApiResponseDto<StoriesResponseDto>

    @GET("stories/spot/{spotId}")
    suspend fun getStoriesBySpot(
        @Path("spotId") spotId: String,
    ): ApiResponseDto<SpotStoriesResponseDto>

    // Guides
    @GET("guides")
    suspend fun getGuides(): ApiResponseDto<GuidesResponseDto>

    @GET("guides/{citySlug}")
    suspend fun getGuideByCity(@Path("citySlug") citySlug: String): ApiResponseDto<CuratedGuideDto>

    // Search
    @GET("search")
    suspend fun search(
        @Query("q") query: String,
    ): ApiResponseDto<Map<String, Any>>

    // Collection / Saved (requires auth)
    @GET("collection")
    suspend fun getSavedSpots(): ApiResponseDto<PaginatedResponseDto<SpotDto>>

    // Navigation Menu
    @GET("menu")
    suspend fun getNavigationMenu(): MenuResponseDto
}
