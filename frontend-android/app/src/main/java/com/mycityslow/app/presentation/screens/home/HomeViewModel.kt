package com.mycityslow.app.presentation.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.local.UserPreferencesStore
import com.mycityslow.app.data.repository.CityRepository
import com.mycityslow.app.data.repository.ExperienceRepository
import com.mycityslow.app.data.repository.SpotRepository
import com.mycityslow.app.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import javax.inject.Inject

data class HomeUiState(
    val greeting: String = "",
    val currentCity: City? = null,
    val trendingSpots: List<Spot> = emptyList(),
    val authenticExperiences: List<Experience> = emptyList(),
    val guides: List<CuratedGuide> = emptyList(),
    val travelerTypes: List<String> = emptyList(),
    val isLoading: Boolean = true,
    val error: String? = null,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val spotRepository: SpotRepository,
    private val experienceRepository: ExperienceRepository,
    private val cityRepository: CityRepository,
    private val preferencesStore: UserPreferencesStore,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadHomeData()
    }

    fun loadHomeData(citySlug: String? = null) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            try {
                val hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY)
                val greeting = when (hour) {
                    in 5..11 -> "Good Morning"
                    in 12..16 -> "Good Afternoon"
                    else -> "Good Evening"
                }

                var slug = citySlug
                if (slug == null) {
                    slug = preferencesStore.selectedCitySlug
                        .catch { emit(null) }
                        .firstOrNull()
                        ?.takeIf { it.isNotBlank() }
                        ?: "bengaluru"
                }

                // Parallel data loading
                val result = coroutineScope {
                    val spotsDeferred = async {
                        spotRepository.discoverSpots(DiscoveryFilters(citySlug = slug, limit = 6))
                    }
                    val cityDeferred = async {
                        cityRepository.getCityBySlug(slug)
                    }
                    val experiencesDeferred = async {
                        experienceRepository.getExperiences(city = slug)
                    }
                    Triple(spotsDeferred.await(), cityDeferred.await(), experiencesDeferred.await())
                }

                val (spots, city, experiences) = result

                _uiState.update {
                    it.copy(
                        greeting = greeting,
                        currentCity = city,
                        trendingSpots = spots.take(6),
                        authenticExperiences = experiences.take(4),
                        travelerTypes = listOf(
                            "Slow Travel", "Photography", "Wellness",
                            "Foodie", "Culture", "Adventure",
                        ),
                        isLoading = false,
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, error = e.message ?: "Failed to load")
                }
            }
        }
    }
}
