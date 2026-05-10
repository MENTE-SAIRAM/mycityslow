package com.mycityslow.app.data.local.dao

import androidx.room.*
import com.mycityslow.app.data.local.entity.SavedSpotEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SavedSpotDao {
    @Query("SELECT * FROM saved_spots ORDER BY savedAt DESC")
    fun getAllSavedSpotIds(): Flow<List<SavedSpotEntity>>

    @Query("SELECT * FROM saved_spots ORDER BY savedAt DESC")
    suspend fun getAllSavedSpotIdsSync(): List<SavedSpotEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveSpot(spot: SavedSpotEntity)

    @Delete
    suspend fun removeSpot(spot: SavedSpotEntity)

    @Query("DELETE FROM saved_spots WHERE spotId = :spotId")
    suspend fun removeSpotById(spotId: String)

    @Query("SELECT EXISTS(SELECT 1 FROM saved_spots WHERE spotId = :spotId)")
    suspend fun isSpotSaved(spotId: String): Boolean
}
