package com.mycityslow.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_cities")
data class CachedCityEntity(
    @PrimaryKey val id: String,
    val name: String,
    val slug: String,
    val state: String,
    val description: String?,
    val image: String?,
    val spotCount: Int?,
    val peacefulScore: Double?,
    val tags: List<String>?,
    val knownFor: List<String>?,
    val cachedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "cached_spots")
data class CachedSpotEntity(
    @PrimaryKey val id: String,
    val name: String,
    val slug: String?,
    val description: String?,
    val longDescription: String?,
    val images: List<String>?,
    val cityId: String?,
    val category: String?,
    val peaceScore: Double?,
    val vibe: String?,
    val bestTime: String?,
    val crowdLevel: String?,
    val entryFee: String?,
    val timings: String?,
    val lat: Double?,
    val lng: Double?,
    val address: String?,
    val tags: List<String>?,
    val travelerTypes: List<String>?,
    val isTouristFriendly: Boolean?,
    val localStory: String?,
    val bestForTravelers: List<String>?,
    val cachedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "cached_experiences")
data class CachedExperienceEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String?,
    val images: List<String>?,
    val cityId: String?,
    val type: String?,
    val category: String?,
    val priceRange: String?,
    val duration: String?,
    val languages: List<String>?,
    val rating: Double?,
    val hostName: String?,
    val hostContact: String?,
    val isVerified: Boolean?,
    val tags: List<String>?,
    val vibe: String?,
    val timing: String?,
    val travelerTypes: List<String>?,
    val cachedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "saved_spots")
data class SavedSpotEntity(
    @PrimaryKey val spotId: String,
    val savedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "saved_experiences")
data class SavedExperienceEntity(
    @PrimaryKey val experienceId: String,
    val savedAt: Long = System.currentTimeMillis(),
)
