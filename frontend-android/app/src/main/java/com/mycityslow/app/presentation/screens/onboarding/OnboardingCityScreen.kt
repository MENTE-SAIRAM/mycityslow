package com.mycityslow.app.presentation.screens.onboarding

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Image
import coil.compose.AsyncImage
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ChevronRight
import com.mycityslow.app.R
import com.mycityslow.app.data.local.UserPreferencesStore
import com.mycityslow.app.presentation.theme.DeepForest
import com.mycityslow.app.domain.model.City
import com.mycityslow.app.presentation.theme.SageGreen
import com.mycityslow.app.presentation.theme.Terracotta
import kotlinx.coroutines.launch

@Composable
fun OnboardingCityScreen(
    preferencesStore: UserPreferencesStore,
    onCitySelected: (String) -> Unit,
) {
    val scope = rememberCoroutineScope()
    var saveError by remember { mutableStateOf<String?>(null) }
    val cities = remember {
        listOf(
            City("1", "Bengaluru", "bengaluru", "Karnataka", "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=2000&auto=format&fit=crop", "The Garden City", 0, 0.0, emptyList(), listOf("Gardens", "Cafes", "Parks"), "", "", ""),
            City("2", "Mumbai", "mumbai", "Maharashtra", "https://images.unsplash.com/photo-1529253355930-d2b1f2035c4b?q=80&w=2000&auto=format&fit=crop", "The City of Dreams", 0, 0.0, emptyList(), listOf("Culture", "Food", "Coastal"), "", "", ""),
            City("3", "Jaipur", "jaipur", "Rajasthan", "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop", "The Pink City", 0, 0.0, emptyList(), listOf("Heritage", "Architecture", "Markets"), "", "", ""),
            City("4", "Udaipur", "udaipur", "Rajasthan", "https://images.unsplash.com/photo-1587467538309-de218c1e2f38?q=80&w=2000&auto=format&fit=crop", "City of Lakes", 0, 0.0, emptyList(), listOf("Lakes", "Romance", "Palaces"), "", "", ""),
            City("5", "Varanasi", "varanasi", "Uttar Pradesh", "https://images.unsplash.com/photo-1569121239039-5ea97e421392?q=80&w=2000&auto=format&fit=crop", "The Spiritual Capital", 0, 0.0, emptyList(), listOf("Spirituality", "Ghats", "Culture"), "", "", ""),
            City("6", "Goa", "goa", "Goa", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f9?q=80&w=2000&auto=format&fit=crop", "The Beach Paradise", 0, 0.0, emptyList(), listOf("Beaches", "Chill", "Food"), "", "", ""),
            City("7", "Delhi", "delhi", "Delhi", "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop", "The Capital", 0, 0.0, emptyList(), listOf("History", "Food", "Markets"), "", "", ""),
            City("8", "Chennai", "chennai", "Tamil Nadu", "https://images.unsplash.com/photo-1581833055087-0ef44a939b0a?q=80&w=2000&auto=format&fit=crop", "Gateway to South India", 0, 0.0, emptyList(), listOf("Temples", "Beaches", "Culture"), "", "", ""),
            City("9", "Kolkata", "kolkata", "West Bengal", "https://images.unsplash.com/photo-1571757700470-0f7b66eb4813?q=80&w=2000&auto=format&fit=crop", "The City of Joy", 0, 0.0, emptyList(), listOf("Art", "Food", "Heritage"), "", "", ""),
            City("10", "Hyderabad", "hyderabad", "Telangana", "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop", "The City of Pearls", 0, 0.0, emptyList(), listOf("Food", "History", "Markets"), "", "", ""),
            City("11", "Rishikesh", "rishikesh", "Uttarakhand", "https://images.unsplash.com/photo-1712077792272-f1b3516b282d?q=80&w=2000&auto=format&fit=crop", "Yoga Capital of the World", 0, 0.0, emptyList(), listOf("Yoga", "Adventure", "Spirituality"), "", "", ""),
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(top = 24.dp),
    ) {
        // App Logo
        Image(
            painter = painterResource(id = R.drawable.logo_icon),
            contentDescription = "My City Slow Logo",
            modifier = Modifier
                .size(100.dp)
                .clip(RoundedCornerShape(20.dp))
                .align(Alignment.CenterHorizontally)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Choose Your City",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(horizontal = 24.dp),
        )
        Text(
            text = "Pick a city to start your slow travel journey",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp),
        )
        if (saveError != null) {
            Text(
                text = saveError ?: "",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(horizontal = 24.dp),
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(cities) { city ->
                CitySelectionCard(
                    city = city,
                    onClick = {
                        saveError = null
                        scope.launch {
                            try {
                                preferencesStore.setSelectedCity(city.slug)
                                onCitySelected(city.slug)
                            } catch (e: Exception) {
                                saveError = e.message ?: "Failed to save your city. Please try again."
                            }
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun CitySelectionCard(city: City, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(12.dp)),
            ) {
                if (city.image.isNotBlank()) {
                    AsyncImage(
                        model = city.image,
                        contentDescription = city.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop,
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            text = city.name.take(2),
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = city.name,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Text(
                    text = city.state,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                if (city.knownFor.isNotEmpty()) {
                    Text(
                        text = city.knownFor.take(3).joinToString(" · "),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
            Icon(
                imageVector = Icons.Outlined.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
