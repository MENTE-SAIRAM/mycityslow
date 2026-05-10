package com.mycityslow.app.presentation.screens.mylist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.local.dao.SavedSpotDao
import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.domain.model.Spot
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class MyListUiState(
    val savedSpots: List<Spot> = emptyList(),
    val isLoading: Boolean = true,
    val isEmpty: Boolean = false,
    val error: String? = null,
)

@HiltViewModel
class MyListViewModel @Inject constructor(
    private val api: ApiService,
    private val savedSpotDao: SavedSpotDao,
) : ViewModel() {

    private val _uiState = MutableStateFlow(MyListUiState())
    val uiState: StateFlow<MyListUiState> = _uiState.asStateFlow()

    init { loadSavedSpots() }

    fun loadSavedSpots() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val response = api.getSavedSpots()
                val spots = response.data?.map { dto ->
                    Spot(
                        id = dto.id ?: dto.idAlt ?: "",
                        name = dto.name,
                        slug = dto.slug ?: "",
                        description = dto.description ?: "",
                        longDescription = dto.longDescription ?: "",
                        images = dto.images ?: emptyList(),
                        city = com.mycityslow.app.domain.model.City(
                            id = dto.city?.id ?: dto.city?.idAlt ?: "",
                            name = dto.city?.name ?: "",
                            slug = dto.city?.slug ?: "",
                            state = dto.city?.state ?: "",
                            description = "", image = "", spotCount = 0,
                            peacefulScore = 0.0, tags = emptyList(),
                            knownFor = emptyList(), bestTimeToVisit = "",
                            howToReach = "", localTips = "",
                        ),
                        category = dto.category ?: "",
                        peaceScore = dto.peaceScore ?: 0.0,
                        vibe = dto.vibe ?: "",
                        bestTime = dto.bestTime ?: "",
                        crowdLevel = dto.crowdLevel ?: "",
                        entryFee = dto.entryFee ?: "Free",
                        timings = dto.timings ?: "",
                        location = com.mycityslow.app.domain.model.SpotLocation(
                            lat = dto.location?.lat ?: 0.0,
                            lng = dto.location?.lng ?: 0.0,
                            address = dto.location?.address ?: "",
                        ),
                        tags = dto.tags ?: emptyList(),
                        isSaved = true,
                        travelerTypes = dto.travelerTypes ?: emptyList(),
                        isTouristFriendly = dto.isTouristFriendly ?: true,
                        localStory = dto.localStory,
                        bestForTravelers = dto.bestForTravelers ?: emptyList(),
                    )
                } ?: emptyList()

                _uiState.update {
                    it.copy(
                        savedSpots = spots,
                        isLoading = false,
                        isEmpty = spots.isEmpty(),
                        error = null,
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        isEmpty = false,
                        error = e.message ?: "Failed to load your list",
                    )
                }
            }
        }
    }
}
