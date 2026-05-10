package com.mycityslow.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.mycityslow.app.data.local.dao.*
import com.mycityslow.app.data.local.entity.*

@Database(
    entities = [
        CachedCityEntity::class,
        CachedSpotEntity::class,
        CachedExperienceEntity::class,
        SavedSpotEntity::class,
    ],
    version = 1,
    exportSchema = false,
)
@TypeConverters(RoomTypeConverters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun cityDao(): CityDao
    abstract fun spotDao(): SpotDao
    abstract fun savedSpotDao(): SavedSpotDao
}
