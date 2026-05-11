package com.mycityslow.app.presentation.screens.discovery

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.repository.SpotRepository
import com.mycityslow.app.domain.model.DiscoveryFilters
import com.mycityslow.app.domain.model.Spot
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DiscoveryUiState(
    val spots: List<Spot> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val hasMore: Boolean = true,
    val currentPage: Int = 1,
    val filters: DiscoveryFilters = DiscoveryFilters(),
)

@HiltViewModel
class DiscoveryViewModel @Inject constructor(
    private val spotRepository: SpotRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(DiscoveryUiState())
    val uiState: StateFlow<DiscoveryUiState> = _uiState.asStateFlow()

    private var searchJob: Job? = null

    init {
        loadSpots()
    }

    fun loadSpots() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val spots = spotRepository.discoverSpots(_uiState.value.filters.copy(page = 1))
                _uiState.update {
                    it.copy(
                        spots = spots,
                        isLoading = false,
                        currentPage = 1,
                        hasMore = spots.size >= it.filters.limit,
                        error = null,
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    fun loadMore() {
        val state = _uiState.value
        if (state.isLoading || !state.hasMore) return
        viewModelScope.launch {
            val nextPage = state.currentPage + 1
            try {
                val newSpots = spotRepository.discoverSpots(state.filters.copy(page = nextPage))
                _uiState.update {
                    it.copy(
                        spots = it.spots + newSpots,
                        currentPage = nextPage,
                        hasMore = newSpots.size >= it.filters.limit,
                        error = null,
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(error = e.message ?: "Failed to load more spots")
                }
            }
        }
    }

    fun setVibe(vibe: String?) {
        _uiState.update { it.copy(filters = it.filters.copy(vibe = vibe), error = null) }
        loadSpots()
    }

    fun setBestTime(time: String?) {
        _uiState.update { it.copy(filters = it.filters.copy(bestTime = time), error = null) }
        loadSpots()
    }

    fun setCrowdLevel(level: String?) {
        _uiState.update { it.copy(filters = it.filters.copy(crowdLevel = level), error = null) }
        loadSpots()
    }

    fun setCategory(category: String?) {
        _uiState.update { it.copy(filters = it.filters.copy(category = category), error = null) }
        loadSpots()
    }

    fun updateSearchQuery(query: String) {
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            _uiState.update { it.copy(filters = it.filters.copy(search = query.ifBlank { null })) }
            delay(400)
            loadSpots()
        }
    }
}
