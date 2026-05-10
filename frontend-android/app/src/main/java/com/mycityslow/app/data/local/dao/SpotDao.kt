package com.mycityslow.app.data.local.dao

import androidx.room.*
import com.mycityslow.app.data.local.entity.CachedSpotEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SpotDao {
    @Query("SELECT * FROM cached_spots ORDER BY name ASC")
    fun getAllSpots(): Flow<List<CachedSpotEntity>>

    @Query("SELECT * FROM cached_spots WHERE id = :id LIMIT 1")
    suspend fun getSpotById(id: String): CachedSpotEntity?

    @Query("SELECT * FROM cached_spots WHERE slug = :slug LIMIT 1")
    suspend fun getSpotBySlug(slug: String): CachedSpotEntity?

    @Query("SELECT * FROM cached_spots WHERE cityId = :cityId")
    fun getSpotsByCity(cityId: String): Flow<List<CachedSpotEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(spots: List<CachedSpotEntity>)

    @Query("DELETE FROM cached_spots")
    suspend fun clearAll()
}
