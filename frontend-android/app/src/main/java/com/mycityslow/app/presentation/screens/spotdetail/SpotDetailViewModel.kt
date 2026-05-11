package com.mycityslow.app.presentation.screens.spotdetail

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.repository.SpotRepository
import com.mycityslow.app.domain.model.Spot
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SpotDetailUiState(
    val spot: Spot? = null,
    val isLoading: Boolean = true,
    val error: String? = null,
    val isSaved: Boolean = false,
    val nearbySpots: List<SpotRepository.NearbySpotPreview> = emptyList(),
    val uiText: SpotRepository.SpotDetailUiText = SpotRepository.SpotDetailUiText(),
    val cardData: SpotRepository.MobileCardData = SpotRepository.MobileCardData(),
)

@HiltViewModel
class SpotDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val spotRepository: SpotRepository,
) : ViewModel() {

    private val spotId: String = savedStateHandle.get<String>("id") ?: ""

    private val _uiState = MutableStateFlow(SpotDetailUiState())
    val uiState: StateFlow<SpotDetailUiState> = _uiState.asStateFlow()

    init {
        loadSpot()
    }

    fun loadSpot() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            try {
                val uiText = runCatching { spotRepository.getSpotDetailUiText() }
                    .getOrDefault(SpotRepository.SpotDetailUiText())
                
                val cardData = runCatching { spotRepository.getMobileCardData() }
                    .getOrDefault(SpotRepository.MobileCardData())

                val spot = spotRepository.getSpotById(spotId)
                val saved = spot?.id?.let { spotRepository.isSpotSaved(it) } ?: false

                val nearby = if (spot != null && (spot.location.lat != 0.0 || spot.location.lng != 0.0)) {
                    runCatching {
                        spotRepository.getNearbySpots(
                            lat = spot.location.lat,
                            lng = spot.location.lng,
                            currentSpotId = spot.id,
                        )
                    }.getOrDefault(emptyList())
                } else {
                    emptyList()
                }

                _uiState.update {
                    it.copy(
                        spot = spot,
                        isLoading = false,
                        isSaved = saved,
                        nearbySpots = nearby,
                        uiText = uiText,
                        cardData = cardData,
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, error = e.message)
                }
            }
        }
    }

    fun toggleSave() {
        viewModelScope.launch {
            val spot = _uiState.value.spot ?: return@launch
            if (_uiState.value.isSaved) {
                spotRepository.removeSavedSpot(spot.id)
                _uiState.update { it.copy(isSaved = false) }
            } else {
                spotRepository.saveSpot(spot.id)
                _uiState.update { it.copy(isSaved = true) }
            }
        }
    }
}
