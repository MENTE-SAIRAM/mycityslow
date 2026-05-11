package com.mycityslow.app.data.repository

import com.mycityslow.app.data.local.dao.SavedSpotDao
import com.mycityslow.app.data.local.dao.SpotDao
import com.mycityslow.app.data.local.entity.CachedSpotEntity
import com.mycityslow.app.data.local.entity.SavedSpotEntity
import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.data.remote.dto.SpotDetailUiTextDto
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
    data class SpotDetailUiText(
        val sectionBestTimeForSilence: String = "",
        val sectionHowToReach: String = "",
        val sectionCommunityPerspective: String = "",
        val sectionNearbySimilarSpots: String = "",
        val peaceScoreLabel: String = "",
        val peaceScoreSuffix: String = "",
        val vibeLabelPrefix: String = "",
        val bestTimeLabelPrefix: String = "",
        val bestTimeInsightText: String = "",
        val bestTimeChartLabels: List<String> = emptyList(),
        val bestTimeChartHeights: List<Int> = emptyList(),
        val bestTimeChartHighlightIndex: Int = 0,
        val mapFallbackDistanceLabel: String = "",
        val distanceAwayTemplate: String = "",
        val distanceChipTemplate: String = "",
        val nearbyFallbackDistanceLabel: String = "",
        val noNearbySpotsText: String = "",
        val addToSlowListText: String = "",
        val addedToSlowListText: String = "",
        val startWalkingText: String = "",
    )

    data class MobileCardData(
        val bestTimeHeights: List<Int> = emptyList(),
        val bottomBarTexts: Map<String, String> = emptyMap(),
    )

    data class NearbySpotPreview(
        val id: String,
        val title: String,
        val imageUrl: String,
        val distanceKm: Double?,
        val lat: Double = 0.0,
        val lng: Double = 0.0,
    )

    data class CommunityStoryPreview(
        val id: String,
        val imageUrl: String,
        val authorName: String,
    )

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

    suspend fun getSpotById(spotId: String): Spot? {
        val cached = spotDao.getSpotById(spotId)
        if (cached != null) return cached.toDomain()

        val response = api.getSpotById(spotId)
        val dto = response.data ?: return null
        val saved = savedSpotDao.isSpotSaved(spotId)
        spotDao.insertAll(listOf(dto.toEntity()))
        return dto.toDomain(spotId, saved)
    }

    suspend fun getSpotDetailUiText(): SpotDetailUiText {
        val response = api.getSpotDetailUiText()
        return response.data?.toDomain() ?: SpotDetailUiText()
    }

    suspend fun getMobileCardData(): MobileCardData {
        return try {
            val response = api.getMobileCardData()
            val dto = response.data ?: return MobileCardData()
            
            MobileCardData(
                bestTimeHeights = dto.bestTimeCard?.chartHeights ?: emptyList(),
                bottomBarTexts = mapOf(
                    "addToList" to (dto.bottomBar?.addToListText ?: ""),
                    "addedToList" to (dto.bottomBar?.addedToListText ?: ""),
                    "startWalking" to (dto.bottomBar?.startWalkingText ?: ""),
                ),
            )
        } catch (e: Exception) {
            MobileCardData()
        }
    }

    suspend fun getNearbySpots(
        lat: Double,
        lng: Double,
        currentSpotId: String,
        radiusKm: Double = 8.0,
        limit: Int = 8,
    ): List<NearbySpotPreview> {
        val response = api.getNearbySpots(
            lat = lat,
            lng = lng,
            radius = radiusKm,
            limit = limit + 2,
            page = 1,
        )
        val spots = response.data?.spots ?: emptyList()

        return spots
            .mapNotNull { dto ->
                val id = dto.id ?: dto.idAlt ?: return@mapNotNull null
                if (id == currentSpotId) return@mapNotNull null

                NearbySpotPreview(
                    id = id,
                    title = dto.title ?: dto.name ?: "",
                    imageUrl = dto.images?.firstOrNull().orEmpty(),
                    distanceKm = dto.distanceKm,
                    lat = dto.location?.lat ?: 0.0,
                    lng = dto.location?.lng ?: 0.0,
                )
            }
            .take(limit)
    }

    suspend fun getCommunityStories(spotId: String, limit: Int = 8): List<CommunityStoryPreview> {
        val response = api.getStoriesBySpot(spotId)
        val stories = response.data?.stories ?: emptyList()

        return stories.mapNotNull { story ->
            val image = story.images?.firstOrNull()
                ?: story.imageUrl
                ?: return@mapNotNull null

            CommunityStoryPreview(
                id = story.id ?: story.idAlt ?: image,
                imageUrl = image,
                authorName = story.authorName
                    ?: story.author?.name
                    ?: "",
            )
        }.take(limit)
    }

    private fun SpotDetailUiTextDto.toDomain(): SpotDetailUiText = SpotDetailUiText(
        sectionBestTimeForSilence = sectionBestTimeForSilence.orEmpty(),
        sectionHowToReach = sectionHowToReach.orEmpty(),
        sectionCommunityPerspective = sectionCommunityPerspective.orEmpty(),
        sectionNearbySimilarSpots = sectionNearbySimilarSpots.orEmpty(),
        peaceScoreLabel = peaceScoreLabel.orEmpty(),
        peaceScoreSuffix = peaceScoreSuffix.orEmpty(),
        vibeLabelPrefix = vibeLabelPrefix.orEmpty(),
        bestTimeLabelPrefix = bestTimeLabelPrefix.orEmpty(),
        bestTimeInsightText = bestTimeInsightText.orEmpty(),
        bestTimeChartLabels = bestTimeChartLabels ?: emptyList(),
        bestTimeChartHeights = bestTimeChartHeights ?: emptyList(),
        bestTimeChartHighlightIndex = bestTimeChartHighlightIndex ?: 0,
        mapFallbackDistanceLabel = mapFallbackDistanceLabel.orEmpty(),
        distanceAwayTemplate = distanceAwayTemplate.orEmpty(),
        distanceChipTemplate = distanceChipTemplate.orEmpty(),
        nearbyFallbackDistanceLabel = nearbyFallbackDistanceLabel.orEmpty(),
        noNearbySpotsText = noNearbySpotsText.orEmpty(),
        addToSlowListText = addToSlowListText.orEmpty(),
        addedToSlowListText = addedToSlowListText.orEmpty(),
        startWalkingText = startWalkingText.orEmpty(),
    )

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
        name = title ?: name ?: "",
        slug = slug,
        description = description,
        longDescription = longDescription,
        images = images ?: emptyList(),
        cityId = city?.id ?: city?.idAlt,
        category = categories?.firstOrNull() ?: category ?: "",
        peaceScore = peaceScore,
        vibe = vibe,
        bestTime = bestTime,
        crowdLevel = crowdLevel,
        entryFee = entryFee ?: timings?.let { "Free" },
        timings = timings ?: openingHours,
        lat = location?.lat ?: location?.coordinates?.getOrNull(1),
        lng = location?.lng ?: location?.coordinates?.getOrNull(0),
        address = address ?: location?.address,
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
        name = title ?: name ?: "",
        slug = slug ?: "",
        description = description ?: "",
        longDescription = longDescription ?: "",
        images = images ?: emptyList(),
        city = city?.let {
            com.mycityslow.app.domain.model.City(
                id = it.id ?: it.idAlt ?: "",
                name = it.name ?: "",
                slug = it.slug ?: "",
                state = it.state ?: "",
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
        category = categories?.firstOrNull() ?: category ?: "",
        peaceScore = peaceScore ?: 0.0,
        vibe = vibe ?: "",
        bestTime = bestTime ?: "",
        crowdLevel = crowdLevel ?: "",
        entryFee = entryFee ?: "Free",
        timings = timings ?: openingHours ?: "",
        location = SpotLocation(
            lat = location?.lat ?: location?.coordinates?.getOrNull(1) ?: 0.0,
            lng = location?.lng ?: location?.coordinates?.getOrNull(0) ?: 0.0,
            address = address ?: location?.address ?: "",
        ),
        tags = tags ?: emptyList(),
        isSaved = isSaved,
        travelerTypes = travelerTypes ?: emptyList(),
        isTouristFriendly = isTouristFriendly ?: true,
        localStory = localStory,
        bestForTravelers = bestForTravelers ?: emptyList(),
    )
}
