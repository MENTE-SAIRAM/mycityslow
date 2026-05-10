package com.mycityslow.app.domain.model

data class City(
    val id: String,
    val name: String,
    val slug: String,
    val state: String,
    val description: String,
    val image: String,
    val spotCount: Int,
    val peacefulScore: Double,
    val tags: List<String>,
    val knownFor: List<String>,
    val bestTimeToVisit: String,
    val howToReach: String,
    val localTips: String,
)

data class Spot(
    val id: String,
    val name: String,
    val slug: String,
    val description: String,
    val longDescription: String,
    val images: List<String>,
    val city: City,
    val category: String,
    val peaceScore: Double,
    val vibe: String,
    val bestTime: String,
    val crowdLevel: String,
    val entryFee: String,
    val timings: String,
    val location: SpotLocation,
    val tags: List<String>,
    val isSaved: Boolean = false,
    val travelerTypes: List<String>,
    val isTouristFriendly: Boolean,
    val localStory: String?,
    val bestForTravelers: List<String>,
)

data class SpotLocation(
    val lat: Double,
    val lng: Double,
    val address: String,
)

data class Experience(
    val id: String,
    val name: String,
    val description: String,
    val images: List<String>,
    val city: City,
    val type: String,
    val category: String,
    val priceRange: String,
    val duration: String,
    val languages: List<String>,
    val rating: Double,
    val hostName: String,
    val hostContact: String,
    val isVerified: Boolean,
    val tags: List<String>,
    val vibe: String,
    val timing: String,
    val travelerTypes: List<String>,
)

data class LocalStory(
    val id: String,
    val title: String,
    val content: String,
    val authorName: String,
    val authorImage: String?,
    val imageUrl: String?,
    val city: City?,
    val spot: Spot?,
    val experience: Experience?,
    val tags: List<String>,
    val likeCount: Int,
    val createdAt: String,
)

data class CuratedGuide(
    val id: String,
    val title: String,
    val citySlug: String,
    val description: String,
    val imageUrl: String,
    val duration: String,
    val sections: List<GuideSection>,
)

data class GuideSection(
    val day: Int,
    val title: String,
    val description: String,
    val spots: List<String>,
    val experiences: List<String>,
)
