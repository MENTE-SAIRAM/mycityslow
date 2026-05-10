package com.mycityslow.app.presentation.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.local.UserPreferencesStore
import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.data.remote.dto.HomeCardDto
import com.mycityslow.app.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeCard(
    val type: String,
    val data: Map<String, Any>?,
)

data class HomeUiState(
    val greeting: String = "",
    val currentCity: City? = null,
    val trendingSpots: List<Spot> = emptyList(),
    val authenticExperiences: List<Experience> = emptyList(),
    val guides: List<CuratedGuide> = emptyList(),
    val travelerTypes: List<String> = emptyList(),
    val cards: List<HomeCard> = emptyList(),
    val isLoading: Boolean = true,
    val error: String? = null,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val api: ApiService,
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
                var slug = citySlug
                if (slug == null) {
                    slug = preferencesStore.selectedCitySlug
                        .catch { emit(null) }
                        .firstOrNull()
                        ?.takeIf { it.isNotBlank() }
                        ?: "bengaluru"
                }

                val response = api.getHomeData(city = slug)
                val data = response.data

                if (data == null) {
                    _uiState.update { it.copy(isLoading = false, error = "No data received") }
                    return@launch
                }

                val hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY)
                val greeting = data.greeting ?: when (hour) {
                    in 5..11 -> "Good Morning"
                    in 12..16 -> "Good Afternoon"
                    else -> "Good Evening"
                }

                val cards = data.cards ?: emptyList()

                _uiState.update {
                    it.copy(
                        greeting = greeting,
                        cards = cards.map { HomeCard(type = it.type, data = it.data) },
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
