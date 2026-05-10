package com.mycityslow.app.data.local

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "user_preferences")

class UserPreferencesStore(private val context: Context) {

    companion object {
        private val SELECTED_CITY = stringPreferencesKey("selected_city_slug")
        private val TRAVELER_TYPES = stringSetPreferencesKey("traveler_types")
        private val ONBOARDING_COMPLETE = stringPreferencesKey("onboarding_complete")
    }

    val selectedCitySlug: Flow<String?> = context.dataStore.data.map { it[SELECTED_CITY] }

    val travelerTypes: Flow<Set<String>> = context.dataStore.data.map {
        it[TRAVELER_TYPES] ?: emptySet()
    }

    val onboardingComplete: Flow<Boolean> = context.dataStore.data.map {
        it[ONBOARDING_COMPLETE] == "true"
    }

    suspend fun setSelectedCity(slug: String) {
        context.dataStore.edit { it[SELECTED_CITY] = slug }
    }

    suspend fun setTravelerTypes(types: Set<String>) {
        context.dataStore.edit { it[TRAVELER_TYPES] = types }
    }

    suspend fun completeOnboarding() {
        context.dataStore.edit { it[ONBOARDING_COMPLETE] = "true" }
    }
}
