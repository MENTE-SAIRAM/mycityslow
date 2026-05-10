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

    // Spots
    @GET("spots/discover")
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

    @GET("spots/{slug}")
    suspend fun getSpotBySlug(@Path("slug") slug: String): ApiResponseDto<SpotDto>

    @GET("spots")
    suspend fun getSpots(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("city") city: String? = null,
        @Query("category") category: String? = null,
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
    ): ApiResponseDto<List<ExperienceDto>>

    @GET("experiences/{id}")
    suspend fun getExperienceById(@Path("id") id: String): ApiResponseDto<ExperienceDto>

    @GET("experiences/filters")
    suspend fun getExperienceFilters(): ApiResponseDto<Map<String, List<String>>>

    // Home
    @GET("home")
    suspend fun getHomeData(
        @Query("city") city: String? = null,
    ): ApiResponseDto<HomeDataDto>

    // Stories
    @GET("stories")
    suspend fun getStories(
        @Query("city") city: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
    ): ApiResponseDto<List<LocalStoryDto>>

    // Guides
    @GET("guides")
    suspend fun getGuides(): ApiResponseDto<List<CuratedGuideDto>>

    @GET("guides/{citySlug}")
    suspend fun getGuideByCity(@Path("citySlug") citySlug: String): ApiResponseDto<CuratedGuideDto>

    // Search
    @GET("search")
    suspend fun search(
        @Query("q") query: String,
    ): ApiResponseDto<Map<String, Any>>

    // Collection / Saved
    @GET("saved-spots")
    suspend fun getSavedSpots(): ApiResponseDto<List<SpotDto>>
}
