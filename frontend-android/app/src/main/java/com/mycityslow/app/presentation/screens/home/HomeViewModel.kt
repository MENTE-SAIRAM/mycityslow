package com.mycityslow.app.presentation.screens.home

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.local.UserPreferencesStore
import com.mycityslow.app.data.remote.ApiService
import com.mycityslow.app.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeCard(
    val type: String,
    val data: Map<String, Any>?,
)

data class HomeUiState(
    val greeting: String = "",
    val cards: List<HomeCard> = emptyList(),
    val isLoading: Boolean = true,
    val error: String? = null,
    val hasLocation: Boolean = false,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val api: ApiService,
    private val preferencesStore: UserPreferencesStore,
    @ApplicationContext private val context: Context,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private var currentLat: Double? = null
    private var currentLng: Double? = null

    init {
        loadHomeData()
    }

    fun onLocationGranted() {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        try {
            val hasFineLocation = ContextCompat.checkSelfPermission(
                context, Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
            val hasCoarseLocation = ContextCompat.checkSelfPermission(
                context, Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            if (hasFineLocation || hasCoarseLocation) {
                val provider = if (hasFineLocation) LocationManager.GPS_PROVIDER
                else LocationManager.NETWORK_PROVIDER
                val location = locationManager.getLastKnownLocation(provider)
                if (location != null) {
                    currentLat = location.latitude
                    currentLng = location.longitude
                    _uiState.update { it.copy(hasLocation = true) }
                    loadHomeData()
                } else {
                    val allProviders = locationManager.getProviders(true)
                    for (p in allProviders) {
                        val loc = locationManager.getLastKnownLocation(p)
                        if (loc != null) {
                            currentLat = loc.latitude
                            currentLng = loc.longitude
                            _uiState.update { it.copy(hasLocation = true) }
                            loadHomeData()
                            break
                        }
                    }
                }
            }
        } catch (_: Exception) {}
    }

    fun loadHomeData(citySlug: String? = null) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            try {
                var slug = citySlug
                if (slug == null && currentLat == null) {
                    slug = preferencesStore.selectedCitySlug
                        .catch { emit(null) }
                        .firstOrNull()
                        ?.takeIf { it.isNotBlank() }
                        ?: "bengaluru"
                }

                val response = api.getHomeData(
                    city = slug,
                    lat = currentLat,
                    lng = currentLng,
                )
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
