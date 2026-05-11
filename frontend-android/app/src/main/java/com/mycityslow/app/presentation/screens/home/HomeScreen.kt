package com.mycityslow.app.presentation.screens.home

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.mycityslow.app.presentation.components.SpotCard
import com.mycityslow.app.presentation.theme.SageGreen
import com.mycityslow.app.presentation.theme.Terracotta

@Composable
fun HomeScreen(
    onSpotClick: (String) -> Unit,
    onSeeAllTrending: () -> Unit = {},
    onSeeAllExperiences: () -> Unit = {},
    onSeeAllCategories: () -> Unit = {},
    onCityClick: (String) -> Unit = {},
    viewModel: HomeViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    if (state.error != null && state.cards.isEmpty() && !state.isLoading) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center,
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(24.dp),
            ) {
                Text(
                    text = state.error ?: "Unable to load home feed",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.error,
                    textAlign = TextAlign.Center,
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(onClick = { viewModel.loadHomeData() }) {
                    Text("Retry")
                }
            }
        }
        return
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 16.dp),
    ) {
        if (state.isLoading && state.cards.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(400.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator(color = SageGreen)
                }
            }
        } else {
            val cards = state.cards
            cards.forEachIndexed { index, card ->
                when (card.type) {
                    "trending_spots" -> {
                        item(key = "trending_header_$index") {
                                                        val title = extractString(card.data, "title") ?: "🌿 Trending Peaceful Spots"
                            SectionHeader(
                                title = title,
                                onSeeAll = onSeeAllTrending
                            )
                        }
                        item(key = "trending_content_$index") {
                            val spots = extractSpotList(card.data, "spots")
                            if (spots.isNotEmpty()) {
                                LazyRow(
                                    contentPadding = PaddingValues(horizontal = 24.dp),
                                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                                ) {
                                    items(spots) { spot ->
                                        SpotCard(
                                            spot = spot,
                                            onClick = {
                                                if (spot.id.isNotBlank()) {
                                                    onSpotClick(spot.id)
                                                }
                                            },
                                            modifier = Modifier.width(280.dp),
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(24.dp))
                            }
                        }
                    }
                    "authentic_experiences" -> {
                        item(key = "experiences_header_$index") {
                                                        val title = extractString(card.data, "title") ?: "🏡 Authentic Experiences"
                            SectionHeader(
                                title = title,
                                onSeeAll = onSeeAllExperiences
                            )
                        }
                        item(key = "experiences_content_$index") {
                            val exps = extractExperienceList(card.data, "experiences")
                            if (exps.isNotEmpty()) {
                                LazyRow(
                                    contentPadding = PaddingValues(horizontal = 24.dp),
                                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                                ) {
                                    items(exps) { exp ->
                                        ExperienceCard(experience = exp, onClick = { expId ->
                                            // Navigate to experience detail
                                        })
                                    }
                                }
                                Spacer(modifier = Modifier.height(24.dp))
                            }
                        }
                    }
                    "categories" -> {
                        item(key = "categories_header_$index") {
                                                        val title = extractString(card.data, "title") ?: "🎯 Explore by Vibe"
                            SectionHeader(
                                title = title,
                                onSeeAll = onSeeAllCategories
                            )
                        }
                        item(key = "categories_content_$index") {
                            val categories = extractCategoryList(card.data, "categories")
                            if (categories.isNotEmpty()) {
                                CategoriesGrid(categories)
                                Spacer(modifier = Modifier.height(24.dp))
                            }
                        }
                    }
                    "first_time_guide" -> {
                        item(key = "guide_$index") {
                            val cityName = extractString(card.data, "cityName")
                            if (cityName != null) {
                                FirstTimeGuideCard(
                                    cityName = cityName,
                                    onNavigateGuide = { /* Navigate to guides screen */ }
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                            }
                        }
                    }
                    "hero_card" -> {
                        item(key = "hero_card_$index") {
                            val cityName = extractString(card.data, "cityName")
                            val weather = extractString(card.data, "weather")
                            val weatherStatus = extractString(card.data, "weatherStatus")
                            val weatherIcon = extractString(card.data, "weatherIcon")
                            val description = extractString(card.data, "description")
                            val buttonText = extractString(card.data, "buttonText")

                            if (cityName != null) {
                                CityHeroCard(
                                    cityName = cityName,
                                    weather = weather ?: "",
                                    weatherStatus = weatherStatus ?: "",
                                    weatherIcon = weatherIcon ?: "",
                                    description = description ?: "",
                                    buttonText = buttonText ?: "",
                                    onExploreCityClick = { onCityClick(cityName) }
                                )
                                Spacer(modifier = Modifier.height(24.dp))
                            }
                        }
                    }
                    "greeting" -> {
                        item(key = "greeting_$index") {
                            val greeting = extractString(card.data, "greeting")
                            if (!greeting.isNullOrBlank()) {
                                Text(
                                    text = greeting,
                                    style = MaterialTheme.typography.headlineMedium,
                                    color = MaterialTheme.colorScheme.onBackground,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp),
                                )
                            }
                        }
                    }
                    "traveler_types" -> {
                        item(key = "traveler_types_$index") {
                            val types = extractTravelerTypesList(card.data, "types")
                            val title = extractString(card.data, "title")
                            if (types.isNotEmpty() && !title.isNullOrBlank()) {
                                SectionHeader(title = title, onSeeAll = { })
                                TravelerTypesGrid(types)
                                Spacer(modifier = Modifier.height(24.dp))
                            }
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(16.dp)) }
    }
}

private fun extractString(data: Map<String, Any>?, key: String): String? {
    return (data?.get(key) as? String)
}

private fun extractList(data: Map<String, Any>?, key: String): List<String> {
    return when (val raw = data?.get(key)) {
        is List<*> -> raw.mapNotNull { item ->
            when (item) {
                is String -> item
                // API returns objects {id, name, description} - extract "name"
                is Map<*, *> -> item["name"]?.toString()
                else -> null
            }
        }
        else -> emptyList()
    }
}

@Suppress("UNCHECKED_CAST")
private data class TravelerType(
    val id: String,
    val name: String,
    val description: String,
)

@Suppress("UNCHECKED_CAST")
private fun extractTravelerTypesList(data: Map<String, Any>?, key: String): List<TravelerType> {
    val rawList = data?.get(key) as? List<Map<String, Any?>> ?: return emptyList()
    return rawList.map { map ->
        TravelerType(
            id = map["id"]?.toString() ?: "",
            name = map["name"]?.toString() ?: "",
            description = map["description"]?.toString() ?: "",
        )
    }
}

@Composable
private fun CityHeroCard(
    cityName: String,
    weather: String,
    weatherStatus: String,
    weatherIcon: String,
    description: String,
    buttonText: String,
    onExploreCityClick: () -> Unit = { },
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clickable { onExploreCityClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
        ) {
            Text(
                text = cityName.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "$weatherIcon $weather",
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.onBackground,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        text = "$weatherStatus in $cityName",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { onExploreCityClick() },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = SageGreen),
            ) {
                Text(
                    text = buttonText,
                    color = Color.White,
                    style = MaterialTheme.typography.labelLarge,
                )
            }
        }
    }
}

@Composable
private fun TravelerTypesGrid(types: List<TravelerType>) {
    Column(
        modifier = Modifier.padding(horizontal = 24.dp),
    ) {
        types.chunked(2).forEach { row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                row.forEach { type ->
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { },
                        shape = RoundedCornerShape(16.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(
                                text = type.name,
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.onSurface,
                                textAlign = TextAlign.Center,
                                fontWeight = FontWeight.SemiBold,
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = type.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                textAlign = TextAlign.Center,
                                maxLines = 2,
                            )
                        }
                    }
                }
                if (row.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}
@Suppress("UNCHECKED_CAST")
private fun extractSpotList(data: Map<String, Any>?, key: String): List<com.mycityslow.app.domain.model.Spot> {
    val rawList = data?.get(key) as? List<*> ?: return emptyList()
    return rawList.mapNotNull { it as? Map<*, *> }.map { map ->
        val locMap = map["location"] as? Map<*, *>
        val coords = locMap?.get("coordinates") as? List<*>
        com.mycityslow.app.domain.model.Spot(
            id = map["_id"]?.toString() ?: map["id"]?.toString() ?: "",
            // API uses "title"; fall back to "name" for backward compat
            name = map["title"]?.toString() ?: map["name"]?.toString() ?: "",
            slug = map["slug"]?.toString() ?: "",
            description = map["description"]?.toString() ?: "",
            longDescription = map["longDescription"]?.toString() ?: "",
            images = (map["images"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            city = (map["city"] as? Map<*, *>)?.let {
                com.mycityslow.app.domain.model.City(
                    id = it["_id"]?.toString() ?: "",
                    name = it["name"]?.toString() ?: "",
                    slug = it["slug"]?.toString() ?: "",
                    state = it["state"]?.toString() ?: "",
                    description = "", image = "", spotCount = 0, peacefulScore = 0.0,
                    tags = emptyList(), knownFor = emptyList(),
                    bestTimeToVisit = "", howToReach = "", localTips = "",
                )
            } ?: com.mycityslow.app.domain.model.City(
                "", "", "", "", "", "", 0, 0.0, emptyList(), emptyList(), "", "", "",
            ),
            // API uses "categories" array; fall back to "category" string
            category = (map["categories"] as? List<*>)?.filterIsInstance<String>()?.firstOrNull()
                ?: map["category"]?.toString() ?: "",
            peaceScore = (map["peaceScore"] as? Number)?.toDouble() ?: 0.0,
            vibe = map["vibe"]?.toString() ?: "",
            bestTime = map["bestTime"]?.toString() ?: "",
            crowdLevel = map["crowdLevel"]?.toString() ?: "",
            entryFee = map["entryFee"]?.toString() ?: "Free",
            timings = map["timings"]?.toString() ?: map["openingHours"]?.toString() ?: "",
            location = com.mycityslow.app.domain.model.SpotLocation(
                // GeoJSON: coordinates = [longitude, latitude] (index 0 = lng, 1 = lat)
                lat = (locMap?.get("lat") as? Number)?.toDouble()
                    ?: (coords?.getOrNull(1) as? Number)?.toDouble() ?: 0.0,
                lng = (locMap?.get("lng") as? Number)?.toDouble()
                    ?: (coords?.getOrNull(0) as? Number)?.toDouble() ?: 0.0,
                // "address" is top-level in the API
                address = map["address"]?.toString() ?: locMap?.get("address")?.toString() ?: "",
            ),
            tags = (map["tags"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            isSaved = false,
            travelerTypes = (map["travelerTypes"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            isTouristFriendly = (map["isTouristFriendly"] as? Boolean) ?: true,
            localStory = map["localStory"]?.toString()?.ifBlank { null },
            bestForTravelers = (map["bestForTravelers"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
        )
    }
}

@Suppress("UNCHECKED_CAST")
private fun extractExperienceList(data: Map<String, Any>?, key: String): List<com.mycityslow.app.domain.model.Experience> {
    val rawList = data?.get(key) as? List<*> ?: return emptyList()
    return rawList.mapNotNull { it as? Map<*, *> }.map { map ->
        com.mycityslow.app.domain.model.Experience(
            id = map["_id"]?.toString() ?: map["id"]?.toString() ?: "",
            name = map["title"]?.toString() ?: map["name"]?.toString() ?: "",
            description = map["description"]?.toString() ?: "",
            images = (map["images"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            city = com.mycityslow.app.domain.model.City(
                id = "", name = "", slug = "", state = "",
                description = "", image = "", spotCount = 0, peacefulScore = 0.0,
                tags = emptyList(), knownFor = emptyList(),
                bestTimeToVisit = "", howToReach = "", localTips = "",
            ),
            type = map["type"]?.toString() ?: "",
            category = (map["categories"] as? List<*>)?.filterIsInstance<String>()?.firstOrNull()
                ?: map["category"]?.toString() ?: "",
            priceRange = map["priceRange"]?.toString() ?: "",
            duration = map["duration"]?.toString() ?: "",
            languages = (map["languages"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            rating = (map["rating"] as? Number)?.toDouble() ?: 0.0,
            hostName = map["hostName"]?.toString() ?: "",
            hostContact = map["hostContact"]?.toString() ?: "",
            isVerified = (map["isVerified"] as? Boolean) ?: false,
            tags = (map["tags"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            vibe = map["vibe"]?.toString() ?: "",
            timing = map["timing"]?.toString() ?: map["bestTime"]?.toString() ?: "",
            travelerTypes = (map["travelerTypes"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
        )
    }
}

@Suppress("UNCHECKED_CAST")
private data class CategoryItem(
    val id: String,
    val name: String,
    val icon: String,
    val color: String,
)

@Suppress("UNCHECKED_CAST")
private fun extractCategoryList(data: Map<String, Any>?, key: String): List<CategoryItem> {
    val rawList = data?.get(key) as? List<Map<String, Any?>> ?: return emptyList()
    return rawList.map { map ->
        CategoryItem(
            id = map["id"]?.toString() ?: "",
            name = map["name"]?.toString() ?: "",
            icon = map["icon"]?.toString() ?: "",
            color = map["color"]?.toString() ?: "",
        )
    }
}

@Composable
private fun CategoryChip(category: CategoryItem) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(text = category.icon, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = category.name,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurface,
            )
        }
    }
}

@Composable
private fun CategoriesGrid(categories: List<CategoryItem>) {
    Column(
        modifier = Modifier.padding(horizontal = 24.dp),
    ) {
        categories.chunked(2).forEach { row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                row.forEach { category ->
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { },
                        shape = RoundedCornerShape(16.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(
                                text = category.icon,
                                style = MaterialTheme.typography.headlineSmall,
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = category.name,
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.onSurface,
                                textAlign = TextAlign.Center,
                                maxLines = 2,
                            )
                        }
                    }
                }
                if (row.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun SectionHeader(title: String, onSeeAll: () -> Unit = { }) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onBackground,
            fontWeight = FontWeight.SemiBold,
        )
        TextButton(onClick = onSeeAll) {
            Text("See All", color = SageGreen, style = MaterialTheme.typography.labelLarge)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExperienceCard(
    experience: com.mycityslow.app.domain.model.Experience,
    onClick: (String) -> Unit = { },
) {
    Card(
        onClick = { onClick(experience.id) },
        modifier = Modifier.width(260.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
    ) {
        Column {
            AsyncImage(
                model = experience.images.firstOrNull().orEmpty(),
                contentDescription = experience.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)),
                contentScale = ContentScale.Crop,
            )
            Column(modifier = Modifier.padding(12.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = if (experience.isVerified) SageGreen.copy(alpha = 0.2f)
                        else MaterialTheme.colorScheme.surface,
                    ) {
                        Text(
                            text = experience.type,
                            style = MaterialTheme.typography.labelSmall,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            color = if (experience.isVerified) SageGreen
                            else MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = "⭐ ${String.format("%.1f", experience.rating)}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = experience.name,
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    text = "${experience.duration} · ${experience.priceRange}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = "Hosted by ${experience.hostName}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FirstTimeGuideCard(
    cityName: String,
    onNavigateGuide: () -> Unit = {},
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clickable { onNavigateGuide() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
    ) {
        Row(
            modifier = Modifier.padding(20.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "🧘 First Time in $cityName?",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Our curated 3-day slow travel guide",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f),
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { onNavigateGuide() },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SageGreen),
                ) {
                    Text("View Guide", color = Color.White)
                }
            }
            Text(
                text = "🗺️",
                style = MaterialTheme.typography.displayMedium,
            )
        }
    }
}
