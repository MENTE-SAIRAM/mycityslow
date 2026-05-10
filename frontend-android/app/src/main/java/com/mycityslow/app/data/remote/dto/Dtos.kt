package com.mycityslow.app.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ApiResponseDto<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String?,
    @SerializedName("data") val data: T?,
)

data class PaginatedResponseDto<T>(
    @SerializedName("spots") val spots: List<T>,
    @SerializedName("pagination") val pagination: PaginationDto,
)

data class PaginationDto(
    @SerializedName("page") val page: Int,
    @SerializedName("limit") val limit: Int,
    @SerializedName("total") val total: Int,
    @SerializedName("totalPages") val totalPages: Int,
    @SerializedName("hasMore") val hasMore: Boolean,
)

data class CityDto(
    @SerializedName("_id") val id: String?,
    @SerializedName("id") val idAlt: String?,
    @SerializedName("name") val name: String,
    @SerializedName("slug") val slug: String,
    @SerializedName("state") val state: String,
    @SerializedName("description") val description: String?,
    @SerializedName("image") val image: String?,
    @SerializedName("spotCount") val spotCount: Int?,
    @SerializedName("peacefulScore") val peacefulScore: Double?,
    @SerializedName("tags") val tags: List<String>?,
    @SerializedName("knownFor") val knownFor: List<String>?,
    @SerializedName("bestTimeToVisit") val bestTimeToVisit: String?,
    @SerializedName("howToReach") val howToReach: String?,
    @SerializedName("localTips") val localTips: String?,
)

data class CityDto2(
    @SerializedName("city") val city: CityDto,
)

data class SpotLocationDto(
    @SerializedName("lat") val lat: Double,
    @SerializedName("lng") val lng: Double,
    @SerializedName("address") val address: String,
)

data class SpotDto(
    @SerializedName("_id") val id: String?,
    @SerializedName("id") val idAlt: String?,
    @SerializedName("name") val name: String,
    @SerializedName("slug") val slug: String?,
    @SerializedName("description") val description: String?,
    @SerializedName("longDescription") val longDescription: String?,
    @SerializedName("images") val images: List<String>?,
    @SerializedName("city") val city: CityDto?,
    @SerializedName("category") val category: String?,
    @SerializedName("peaceScore") val peaceScore: Double?,
    @SerializedName("vibe") val vibe: String?,
    @SerializedName("bestTime") val bestTime: String?,
    @SerializedName("crowdLevel") val crowdLevel: String?,
    @SerializedName("entryFee") val entryFee: String?,
    @SerializedName("timings") val timings: String?,
    @SerializedName("location") val location: SpotLocationDto?,
    @SerializedName("tags") val tags: List<String>?,
    @SerializedName("travelerTypes") val travelerTypes: List<String>?,
    @SerializedName("isTouristFriendly") val isTouristFriendly: Boolean?,
    @SerializedName("localStory") val localStory: String?,
    @SerializedName("bestForTravelers") val bestForTravelers: List<String>?,
)

data class ExperienceDto(
    @SerializedName("_id") val id: String?,
    @SerializedName("id") val idAlt: String?,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String?,
    @SerializedName("images") val images: List<String>?,
    @SerializedName("city") val city: CityDto?,
    @SerializedName("type") val type: String?,
    @SerializedName("category") val category: String?,
    @SerializedName("priceRange") val priceRange: String?,
    @SerializedName("duration") val duration: String?,
    @SerializedName("languages") val languages: List<String>?,
    @SerializedName("rating") val rating: Double?,
    @SerializedName("hostName") val hostName: String?,
    @SerializedName("hostContact") val hostContact: String?,
    @SerializedName("isVerified") val isVerified: Boolean?,
    @SerializedName("tags") val tags: List<String>?,
    @SerializedName("vibe") val vibe: String?,
    @SerializedName("timing") val timing: String?,
    @SerializedName("travelerTypes") val travelerTypes: List<String>?,
)

data class LocalStoryDto(
    @SerializedName("_id") val id: String?,
    @SerializedName("id") val idAlt: String?,
    @SerializedName("title") val title: String?,
    @SerializedName("content") val content: String?,
    @SerializedName("authorName") val authorName: String?,
    @SerializedName("authorImage") val authorImage: String?,
    @SerializedName("imageUrl") val imageUrl: String?,
    @SerializedName("city") val city: CityDto?,
    @SerializedName("spot") val spot: SpotDto?,
    @SerializedName("experience") val experience: ExperienceDto?,
    @SerializedName("tags") val tags: List<String>?,
    @SerializedName("likeCount") val likeCount: Int?,
    @SerializedName("createdAt") val createdAt: String?,
)

data class GuideSectionDto(
    @SerializedName("day") val day: Int?,
    @SerializedName("title") val title: String?,
    @SerializedName("description") val description: String?,
    @SerializedName("spots") val spots: List<String>?,
    @SerializedName("experiences") val experiences: List<String>?,
)

data class CuratedGuideDto(
    @SerializedName("_id") val id: String?,
    @SerializedName("id") val idAlt: String?,
    @SerializedName("title") val title: String?,
    @SerializedName("citySlug") val citySlug: String?,
    @SerializedName("description") val description: String?,
    @SerializedName("imageUrl") val imageUrl: String?,
    @SerializedName("duration") val duration: String?,
    @SerializedName("sections") val sections: List<GuideSectionDto>?,
)

data class HomeDataDto(
    @SerializedName("trendingSpots") val trendingSpots: List<SpotDto>?,
    @SerializedName("authenticExperiences") val authenticExperiences: List<ExperienceDto>?,
    @SerializedName("guides") val guides: List<CuratedGuideDto>?,
    @SerializedName("travelerTypes") val travelerTypes: List<String>?,
    @SerializedName("currentCity") val currentCity: CityDto?,
)
