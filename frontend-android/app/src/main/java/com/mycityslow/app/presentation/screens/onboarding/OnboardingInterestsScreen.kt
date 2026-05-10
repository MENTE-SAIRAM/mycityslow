package com.mycityslow.app.presentation.screens.onboarding

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.foundation.BorderStroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.mycityslow.app.data.local.UserPreferencesStore
import com.mycityslow.app.presentation.theme.SageGreen
import com.mycityslow.app.presentation.theme.Terracotta
import kotlinx.coroutines.launch

data class TravelerType(
    val name: String,
    val icon: String,
    val description: String,
)

private val travelerTypes = listOf(
    TravelerType("Slow Travel", "🐢", "Take it easy, immerse deeply"),
    TravelerType("Photography", "📷", "Capture every frame"),
    TravelerType("Wellness", "🧘", "Yoga, meditation, healing"),
    TravelerType("Foodie", "🍜", "Eat your way through cities"),
    TravelerType("Culture", "🎭", "Museums, art, heritage"),
    TravelerType("Adventure", "🏔️", "Hike, trek, explore"),
    TravelerType("Solo Travel", "🧳", "Travel alone, find yourself"),
    TravelerType("Digital Nomad", "💻", "Work from anywhere"),
)

@Composable
fun OnboardingInterestsScreen(
    preferencesStore: UserPreferencesStore,
    onComplete: () -> Unit,
) {
    val scope = rememberCoroutineScope()
    var selectedTypes by remember { mutableStateOf(setOf<String>()) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(top = 48.dp),
    ) {
        Text(
            text = "What's Your Travel Vibe?",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(horizontal = 24.dp),
        )
        Text(
            text = "Select all that resonate with you",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp),
        )

        Spacer(modifier = Modifier.height(24.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(horizontal = 24.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f),
        ) {
            items(travelerTypes) { type ->
                val selected = type.name in selectedTypes
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            selectedTypes = if (selected) {
                                selectedTypes - type.name
                            } else {
                                selectedTypes + type.name
                            }
                        },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (selected) {
                            MaterialTheme.colorScheme.primaryContainer
                        } else {
                            MaterialTheme.colorScheme.surfaceVariant
                        },
                    ),
                    border = if (selected) BorderStroke(1.5.dp, SageGreen) else null,
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(text = type.icon, style = MaterialTheme.typography.headlineLarge)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = type.name,
                            style = MaterialTheme.typography.titleSmall,
                            color = MaterialTheme.colorScheme.onSurface,
                            textAlign = TextAlign.Center,
                        )
                        Text(
                            text = type.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center,
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                scope.launch {
                    preferencesStore.setTravelerTypes(selectedTypes)
                    preferencesStore.completeOnboarding()
                    onComplete()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .height(56.dp),
            shape = RoundedCornerShape(28.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = SageGreen,
                disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            ),
            enabled = selectedTypes.isNotEmpty(),
        ) {
            Text(
                "Start Exploring",
                style = MaterialTheme.typography.titleMedium,
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}
