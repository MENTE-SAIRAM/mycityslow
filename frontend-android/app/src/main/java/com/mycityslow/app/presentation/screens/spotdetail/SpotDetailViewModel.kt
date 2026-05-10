package com.mycityslow.app.presentation.screens.spotdetail

import android.net.Uri
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
)

@HiltViewModel
class SpotDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val spotRepository: SpotRepository,
) : ViewModel() {

    private val slug: String = Uri.decode(savedStateHandle.get<String>("slug") ?: "")

    private val _uiState = MutableStateFlow(SpotDetailUiState())
    val uiState: StateFlow<SpotDetailUiState> = _uiState.asStateFlow()

    init {
        loadSpot()
    }

    fun loadSpot() {
        viewModelScope.launch {
            if (slug.isBlank()) {
                _uiState.update {
                    it.copy(isLoading = false, error = "Invalid spot link")
                }
                return@launch
            }
            _uiState.update { it.copy(isLoading = true) }
            try {
                val spot = spotRepository.getSpotBySlug(slug)
                val saved = spot?.id?.let { spotRepository.isSpotSaved(it) } ?: false
                _uiState.update {
                    it.copy(spot = spot, isLoading = false, isSaved = saved)
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, error = e.message ?: "Failed to load spot")
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
