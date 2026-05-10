package com.mycityslow.app.data.local.dao

import androidx.room.*
import com.mycityslow.app.data.local.entity.CachedCityEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CityDao {
    @Query("SELECT * FROM cached_cities ORDER BY name ASC")
    fun getAllCities(): Flow<List<CachedCityEntity>>

    @Query("SELECT * FROM cached_cities WHERE slug = :slug LIMIT 1")
    suspend fun getCityBySlug(slug: String): CachedCityEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(cities: List<CachedCityEntity>)

    @Query("DELETE FROM cached_cities")
    suspend fun clearAll()

    @Query("SELECT COUNT(*) FROM cached_cities")
    suspend fun count(): Int
}
