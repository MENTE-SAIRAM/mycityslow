package com.mycityslow.app.data.repository

import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.data.remote.dto.ExperienceDto
import com.mycityslow.app.domain.model.City
import com.mycityslow.app.domain.model.Experience
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ExperienceRepository @Inject constructor(
    private val api: ApiService,
) {
    suspend fun getExperiences(
        city: String? = null,
        type: String? = null,
        travelerType: String? = null,
        priceRange: String? = null,
    ): List<Experience> {
        val response = api.getExperiences(
            city = city,
            type = type,
            travelerType = travelerType,
            priceRange = priceRange,
        )
        return response.data?.map { it.toDomain() } ?: emptyList()
    }

    suspend fun getExperienceById(id: String): Experience? {
        val response = api.getExperienceById(id)
        return response.data?.toDomain()
    }

    private fun ExperienceDto.toDomain(): Experience = Experience(
        id = id ?: idAlt ?: "",
        name = name,
        description = description ?: "",
        images = images ?: emptyList(),
        city = city?.let {
            City(
                id = it.id ?: it.idAlt ?: "", name = it.name, slug = it.slug,
                state = it.state, description = it.description ?: "", image = it.image ?: "",
                spotCount = it.spotCount ?: 0, peacefulScore = it.peacefulScore ?: 0.0,
                tags = it.tags ?: emptyList(), knownFor = it.knownFor ?: emptyList(),
                bestTimeToVisit = "", howToReach = "", localTips = "",
            )
        } ?: City("", "", "", "", "", "", 0, 0.0, emptyList(), emptyList(), "", "", ""),
        type = type ?: "",
        category = category ?: "",
        priceRange = priceRange ?: "",
        duration = duration ?: "",
        languages = languages ?: emptyList(),
        rating = rating ?: 0.0,
        hostName = hostName ?: "",
        hostContact = hostContact ?: "",
        isVerified = isVerified ?: false,
        tags = tags ?: emptyList(),
        vibe = vibe ?: "",
        timing = timing ?: "",
        travelerTypes = travelerTypes ?: emptyList(),
    )
}
