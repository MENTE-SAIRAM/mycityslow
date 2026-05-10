package com.mycityslow.app.presentation.screens.experiences

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.repository.ExperienceRepository
import com.mycityslow.app.domain.model.Experience
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ExperiencesUiState(
    val experiences: List<Experience> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val selectedType: String? = null,
    val selectedPriceRange: String? = null,
)

@HiltViewModel
class ExperiencesViewModel @Inject constructor(
    private val experienceRepository: ExperienceRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExperiencesUiState())
    val uiState: StateFlow<ExperiencesUiState> = _uiState.asStateFlow()

    init { loadExperiences() }

    fun loadExperiences() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            try {
                val exps = experienceRepository.getExperiences(
                    type = _uiState.value.selectedType,
                    priceRange = _uiState.value.selectedPriceRange,
                )
                _uiState.update { it.copy(experiences = exps, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    fun setTypeFilter(type: String?) {
        _uiState.update { it.copy(selectedType = type) }
        loadExperiences()
    }

    fun setPriceFilter(price: String?) {
        _uiState.update { it.copy(selectedPriceRange = price) }
        loadExperiences()
    }
}
