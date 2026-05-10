package com.mycityslow.app.data.repository

import com.mycityslow.app.data.local.dao.CityDao
import com.mycityslow.app.data.local.entity.CachedCityEntity
import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.data.remote.dto.CityDto
import com.mycityslow.app.domain.model.City
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CityRepository @Inject constructor(
    private val api: ApiService,
    private val cityDao: CityDao,
) {
    fun getCachedCities(): Flow<List<City>> {
        return cityDao.getAllCities().map { entities -> entities.map { it.toDomain() } }
    }

    suspend fun refreshCities(): List<City> {
        val response = api.getCities()
        val cities = response.data ?: emptyList()
        val entities = cities.map { it.toEntity() }
        cityDao.clearAll()
        cityDao.insertAll(entities)
        return entities.map { it.toDomain() }
    }

    suspend fun getCityBySlug(slug: String): City? {
        return cityDao.getCityBySlug(slug)?.toDomain()
            ?: run {
                val response = api.getCityBySlug(slug)
                response.data?.toEntity()?.let { entity ->
                    cityDao.insertAll(listOf(entity))
                    entity.toDomain()
                }
            }
    }

    private fun CityDto.toEntity() = CachedCityEntity(
        id = id ?: idAlt ?: slug ?: "",
        name = name ?: "",
        slug = slug ?: "",
        state = state ?: "",
        description = description,
        image = image,
        spotCount = spotCount,
        peacefulScore = peacefulScore,
        tags = tags ?: emptyList(),
        knownFor = knownFor ?: emptyList(),
    )

    private fun CachedCityEntity.toDomain() = City(
        id = id,
        name = name,
        slug = slug,
        state = state,
        description = description ?: "",
        image = image ?: "",
        spotCount = spotCount ?: 0,
        peacefulScore = peacefulScore ?: 0.0,
        tags = tags ?: emptyList(),
        knownFor = knownFor ?: emptyList(),
        bestTimeToVisit = "",
        howToReach = "",
        localTips = "",
    )
}
