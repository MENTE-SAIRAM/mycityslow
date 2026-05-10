package com.mycityslow.app.data.local

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "mycityslow_db"
        ).fallbackToDestructiveMigration()
            .build()
    }

    @Provides
    fun provideCityDao(db: AppDatabase) = db.cityDao()

    @Provides
    fun provideSpotDao(db: AppDatabase) = db.spotDao()

    @Provides
    fun provideSavedSpotDao(db: AppDatabase) = db.savedSpotDao()
}
