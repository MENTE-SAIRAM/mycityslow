package com.mycityslow.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mycityslow.app.data.repository.MenuRepository
import com.mycityslow.app.domain.model.MenuItem
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MenuViewModel @Inject constructor(
    private val menuRepository: MenuRepository
) : ViewModel() {

    private val _menuItems = MutableStateFlow<List<MenuItem>>(emptyList())
    val menuItems: StateFlow<List<MenuItem>> = _menuItems.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    init {
        loadMenuItems()
    }

    fun loadMenuItems() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null
                val items = menuRepository.getNavigationMenu()
                _menuItems.value = items
            } catch (e: Exception) {
                _error.value = e.message ?: "Failed to load menu"
                _menuItems.value = menuRepository.getNavigationMenu() // fallback to defaults
            } finally {
                _isLoading.value = false
            }
        }
    }
}
