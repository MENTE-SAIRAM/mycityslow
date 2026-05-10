package com.mycityslow.app.data.repository

import com.mycityslow.app.data.local.dao.SavedSpotDao
import com.mycityslow.app.data.local.dao.SpotDao
import com.mycityslow.app.data.local.entity.CachedSpotEntity
import com.mycityslow.app.data.local.entity.SavedSpotEntity
import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.data.remote.dto.SpotDto
import com.mycityslow.app.domain.model.DiscoveryFilters
import com.mycityslow.app.domain.model.Spot
import com.mycityslow.app.domain.model.SpotLocation
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SpotRepository @Inject constructor(
    private val api: ApiService,
    private val spotDao: SpotDao,
    private val savedSpotDao: SavedSpotDao,
) {
    fun getCachedSpots(): Flow<List<Spot>> {
        return spotDao.getAllSpots().map { entities -> entities.map { it.toDomain() } }
    }

    suspend fun discoverSpots(filters: DiscoveryFilters): List<Spot> {
        val response = api.discoverSpots(
            page = filters.page,
            limit = filters.limit,
            city = filters.citySlug,
            category = filters.category,
            vibe = filters.vibe,
            bestTime = filters.bestTime,
            crowdLevel = filters.crowdLevel,
            travelerType = filters.travelerType,
            search = filters.search,
        )
        val spots = response.data?.spots ?: emptyList()
        val savedIds = savedSpotDao.getAllSavedSpotIdsSync().map { it.spotId }.toSet()
        val entities = spots.map { it.toEntity() }
        spotDao.insertAll(entities)
        return spots.map { it.toDomain(it.id ?: it.idAlt ?: "", savedIds.contains(it.id ?: it.idAlt ?: "")) }
    }

    suspend fun getSpotBySlug(slug: String): Spot? {
        val cached = spotDao.getSpotBySlug(slug)
        if (cached != null) return cached.toDomain()

        val response = api.getSpotBySlug(slug)
        val dto = response.data ?: return null
        val saved = savedSpotDao.isSpotSaved(dto.id ?: dto.idAlt ?: "")
        spotDao.insertAll(listOf(dto.toEntity()))
        return dto.toDomain(dto.id ?: dto.idAlt ?: "", saved)
    }

    suspend fun saveSpot(spotId: String) {
        savedSpotDao.saveSpot(SavedSpotEntity(spotId = spotId))
    }

    suspend fun removeSavedSpot(spotId: String) {
        savedSpotDao.removeSpotById(spotId)
    }

    fun getSavedSpotIds(): Flow<List<String>> {
        return savedSpotDao.getAllSavedSpotIds().map { list -> list.map { it.spotId } }
    }

    suspend fun isSpotSaved(spotId: String): Boolean {
        return savedSpotDao.isSpotSaved(spotId)
    }

    private fun SpotDto.toEntity() = CachedSpotEntity(
        id = id ?: idAlt ?: "",
        name = name,
        slug = slug,
        description = description,
        longDescription = longDescription,
        images = images ?: emptyList(),
        cityId = city?.id ?: city?.idAlt,
        category = category,
        peaceScore = peaceScore,
        vibe = vibe,
        bestTime = bestTime,
        crowdLevel = crowdLevel,
        entryFee = entryFee,
        timings = timings,
        lat = location?.lat,
        lng = location?.lng,
        address = location?.address,
        tags = tags ?: emptyList(),
        travelerTypes = travelerTypes ?: emptyList(),
        isTouristFriendly = isTouristFriendly,
        localStory = localStory,
        bestForTravelers = bestForTravelers ?: emptyList(),
    )

    private fun CachedSpotEntity.toDomain(): Spot = Spot(
        id = id,
        name = name,
        slug = slug ?: "",
        description = description ?: "",
        longDescription = longDescription ?: "",
        images = images ?: emptyList(),
        city = com.mycityslow.app.domain.model.City(
            id = cityId ?: "", name = "", slug = "", state = "",
            description = "", image = "", spotCount = 0, peacefulScore = 0.0,
            tags = emptyList(), knownFor = emptyList(),
            bestTimeToVisit = "", howToReach = "", localTips = "",
        ),
        category = category ?: "",
        peaceScore = peaceScore ?: 0.0,
        vibe = vibe ?: "",
        bestTime = bestTime ?: "",
        crowdLevel = crowdLevel ?: "",
        entryFee = entryFee ?: "Free",
        timings = timings ?: "",
        location = SpotLocation(lat = lat ?: 0.0, lng = lng ?: 0.0, address = address ?: ""),
        tags = tags ?: emptyList(),
        travelerTypes = travelerTypes ?: emptyList(),
        isTouristFriendly = isTouristFriendly ?: true,
        localStory = localStory,
        bestForTravelers = bestForTravelers ?: emptyList(),
    )

    private fun SpotDto.toDomain(id: String, isSaved: Boolean): Spot = Spot(
        id = id,
        name = name,
        slug = slug ?: "",
        description = description ?: "",
        longDescription = longDescription ?: "",
        images = images ?: emptyList(),
        city = city?.let {
            com.mycityslow.app.domain.model.City(
                id = it.id ?: it.idAlt ?: "",
                name = it.name,
                slug = it.slug,
                state = it.state,
                description = it.description ?: "",
                image = it.image ?: "",
                spotCount = it.spotCount ?: 0,
                peacefulScore = it.peacefulScore ?: 0.0,
                tags = it.tags ?: emptyList(),
                knownFor = it.knownFor ?: emptyList(),
                bestTimeToVisit = it.bestTimeToVisit ?: "",
                howToReach = it.howToReach ?: "",
                localTips = it.localTips ?: "",
            )
        } ?: com.mycityslow.app.domain.model.City("", "", "", "", "", "", 0, 0.0, emptyList(), emptyList(), "", "", ""),
        category = category ?: "",
        peaceScore = peaceScore ?: 0.0,
        vibe = vibe ?: "",
        bestTime = bestTime ?: "",
        crowdLevel = crowdLevel ?: "",
        entryFee = entryFee ?: "Free",
        timings = timings ?: "",
        location = SpotLocation(
            lat = location?.lat ?: 0.0,
            lng = location?.lng ?: 0.0,
            address = location?.address ?: "",
        ),
        tags = tags ?: emptyList(),
        isSaved = isSaved,
        travelerTypes = travelerTypes ?: emptyList(),
        isTouristFriendly = isTouristFriendly ?: true,
        localStory = localStory,
        bestForTravelers = bestForTravelers ?: emptyList(),
    )
}
