package com.mycityslow.app.presentation.screens.home

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.NearMe
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.mycityslow.app.presentation.theme.SageGreen

@Composable
fun HomeScreen(
    onSpotClick: (String) -> Unit,
    onSeeAllTrending: () -> Unit = {},
    onSeeAllCategories: () -> Unit = {},
    onCityClick: (String) -> Unit = {},
    viewModel: HomeViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        if (permissions.values.any { it }) {
            viewModel.onLocationGranted()
        }
    }

    LaunchedEffect(Unit) {
        val hasFine = androidx.core.content.ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_FINE_LOCATION
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED
        val hasCoarse = androidx.core.content.ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_COARSE_LOCATION
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED

        if (hasFine || hasCoarse) {
            viewModel.onLocationGranted()
        } else {
            locationPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                )
            )
        }
    }

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

    val heroCard = state.cards.firstOrNull { it.type == "hero_card" }?.data
    val nearbyCard = state.cards.firstOrNull { it.type == "nearby_spots" }?.data
    val trendingCard = state.cards.firstOrNull { it.type == "trending_spots" }?.data
    val categoriesCard = state.cards.firstOrNull { it.type == "categories" }?.data

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
            item(key = "top_bar") {
                HomeTopBar(
                    locationLabel = extractString(heroCard, "locationLabel").orEmpty(),
                    greeting = state.greeting,
                )
                Spacer(modifier = Modifier.height(12.dp))
            }

            item(key = "hero") {
                val cityName = extractString(heroCard, "cityName")
                if (!cityName.isNullOrBlank()) {
                    CityHeroCard(
                        cityName = cityName,
                        weather = extractString(heroCard, "weather").orEmpty(),
                        weatherStatus = extractString(heroCard, "weatherStatus").orEmpty(),
                        weatherIcon = extractString(heroCard, "weatherIcon").orEmpty(),
                        description = extractString(heroCard, "description").orEmpty(),
                        buttonText = extractString(heroCard, "buttonText").orEmpty(),
                        backgroundImage = extractString(heroCard, "backgroundImage").orEmpty(),
                        onExploreCityClick = { onCityClick(cityName) },
                    )
                }
                Spacer(modifier = Modifier.height(20.dp))
            }

            item(key = "nearby_header") {
                val title = extractString(nearbyCard, "title")
                if (!title.isNullOrBlank()) {
                    SectionHeader(
                        title = title,
                        seeAllText = extractString(nearbyCard, "seeAllText"),
                        onSeeAll = onSeeAllTrending,
                    )
                }
            }

            item(key = "nearby_content") {
                val spots = extractSpotList(nearbyCard, "spots")
                if (spots.isNotEmpty()) {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 24.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        items(spots) { spot ->
                            FigmaTrendingSpotCard(
                                spot = spot,
                                onClick = { if (spot.id.isNotBlank()) onSpotClick(spot.id) },
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(28.dp))
                }
            }

            item(key = "trending_header") {
                val title = extractString(trendingCard, "title")
                if (!title.isNullOrBlank()) {
                    SectionHeader(
                        title = title,
                        seeAllText = extractString(trendingCard, "seeAllText"),
                        onSeeAll = onSeeAllTrending,
                    )
                }
            }

            item(key = "trending_content") {
                val spots = extractSpotList(trendingCard, "spots")
                if (spots.isNotEmpty()) {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 24.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        items(spots) { spot ->
                            FigmaTrendingSpotCard(
                                spot = spot,
                                onClick = { if (spot.id.isNotBlank()) onSpotClick(spot.id) },
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(28.dp))
                }
            }

            item(key = "categories_header") {
                val title = extractString(categoriesCard, "title")
                SectionHeader(
                    title = title.orEmpty(),
                    seeAllText = extractString(categoriesCard, "seeAllText"),
                    onSeeAll = onSeeAllCategories,
                )
            }

            item(key = "categories_content") {
                val categories = extractCategoryList(categoriesCard, "categories")
                if (categories.isNotEmpty()) {
                    CategoriesGrid(
                        categories = categories,
                        onCategoryClick = onSeeAllCategories,
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }

        item { Spacer(modifier = Modifier.height(16.dp)) }
    }
}

private fun extractString(data: Map<String, Any>?, key: String): String? {
    return (data?.get(key) as? String)
}

@Suppress("UNCHECKED_CAST")
private fun extractSpotList(data: Map<String, Any>?, key: String): List<com.mycityslow.app.domain.model.Spot> {
    val rawList = data?.get(key) as? List<*> ?: return emptyList()
    return rawList.mapNotNull { it as? Map<*, *> }.map { map ->
        val locMap = map["location"] as? Map<*, *>
        val coords = locMap?.get("coordinates") as? List<*>
        val cityMap = map["city"] as? Map<*, *>
        com.mycityslow.app.domain.model.Spot(
            id = map["_id"]?.toString() ?: map["id"]?.toString() ?: "",
            name = map["title"]?.toString() ?: map["name"]?.toString() ?: "",
            slug = map["slug"]?.toString() ?: "",
            description = map["description"]?.toString() ?: "",
            longDescription = map["longDescription"]?.toString() ?: "",
            images = (map["images"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            city = com.mycityslow.app.domain.model.City(
                id = cityMap?.let { it["_id"]?.toString() ?: it["id"]?.toString() ?: "" } ?: "",
                name = cityMap?.let { it["name"]?.toString() ?: "" } ?: "",
                slug = cityMap?.let { it["slug"]?.toString() ?: "" } ?: "",
                state = "",
                description = "", image = "", spotCount = 0, peacefulScore = 0.0,
                tags = emptyList(), knownFor = emptyList(),
                bestTimeToVisit = "", howToReach = "", localTips = "",
            ),
            category = (map["categories"] as? List<*>)?.filterIsInstance<String>()?.firstOrNull()
                ?: map["category"]?.toString() ?: "",
            peaceScore = (map["peaceScore"] as? Number)?.toDouble() ?: 0.0,
            vibe = map["vibe"]?.toString() ?: "",
            bestTime = map["bestTime"]?.toString() ?: "",
            crowdLevel = map["crowdLevel"]?.toString() ?: "",
            entryFee = map["entryFee"]?.toString() ?: "Free",
            timings = map["timings"]?.toString() ?: map["openingHours"]?.toString() ?: "",
            location = com.mycityslow.app.domain.model.SpotLocation(
                lat = (locMap?.get("lat") as? Number)?.toDouble()
                    ?: (coords?.getOrNull(1) as? Number)?.toDouble() ?: 0.0,
                lng = (locMap?.get("lng") as? Number)?.toDouble()
                    ?: (coords?.getOrNull(0) as? Number)?.toDouble() ?: 0.0,
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

@Suppress("UNCHECKED_CAST")
private data class CategoryItem(
    val id: String,
    val name: String,
    val icon: String,
    val color: String,
)

@Composable
private fun HomeTopBar(
    locationLabel: String,
    greeting: String,
) {
    Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 6.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Outlined.LocationOn,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(14.dp),
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = locationLabel,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Medium,
            )
        }
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = greeting,
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
            fontWeight = FontWeight.Medium,
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
    backgroundImage: String,
    onExploreCityClick: () -> Unit = {},
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clip(RoundedCornerShape(24.dp)),
    ) {
        AsyncImage(
            model = backgroundImage,
            contentDescription = null,
            modifier = Modifier
                .fillMaxWidth()
                .height(420.dp),
            contentScale = ContentScale.Crop,
        )
        Box(
            modifier = Modifier
                .matchParentSize()
                .background(
                    Brush.verticalGradient(
                        0f to Color.Black.copy(alpha = 0.12f),
                        0.55f to Color.Transparent,
                        1f to Color.Black.copy(alpha = 0.45f),
                    )
                )
        )
        Surface(
            modifier = Modifier
                .padding(start = 22.dp, top = 22.dp),
            shape = RoundedCornerShape(20.dp),
            color = Color(0x8A667066),
            tonalElevation = 0.dp,
        ) {
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp)) {
                Text(
                    text = "$weatherIcon $weather",
                    style = MaterialTheme.typography.headlineMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = "$weatherStatus in $cityName",
                    style = MaterialTheme.typography.bodyLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Medium,
                )
            }
        }
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(horizontal = 22.dp, vertical = 20.dp),
        ) {
            Text(
                text = description,
                style = MaterialTheme.typography.headlineSmall,
                color = Color.White,
                fontWeight = FontWeight.Medium,
            )
            Spacer(modifier = Modifier.height(14.dp))
            Button(
                onClick = onExploreCityClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA8C3AF)),
            ) {
                Text(
                    text = buttonText,
                    color = Color(0xFF264238),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FigmaTrendingSpotCard(
    spot: com.mycityslow.app.domain.model.Spot,
    onClick: () -> Unit,
) {
    Card(
        onClick = onClick,
        modifier = Modifier.width(282.dp),
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column {
            Box {
                AsyncImage(
                    model = spot.images.firstOrNull().orEmpty(),
                    contentDescription = spot.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(190.dp)
                        .clip(RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp)),
                    contentScale = ContentScale.Crop,
                )
                Surface(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(10.dp),
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.surfaceVariant,
                ) {
                    Icon(
                        imageVector = Icons.Outlined.BookmarkBorder,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier
                            .padding(8.dp)
                            .size(18.dp),
                    )
                }
            }
            Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp)) {
                Text(
                    text = spot.name,
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.NearMe,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp),
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (spot.location.lat != 0.0 || spot.location.lng != 0.0) "Nearby" else "",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items((spot.tags.ifEmpty { listOf(spot.category) }).take(2)) { tag ->
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = SageGreen.copy(alpha = 0.2f),
                        ) {
                            Text(
                                text = tag.uppercase(),
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall,
                                color = SageGreen,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoriesGrid(
    categories: List<CategoryItem>,
    onCategoryClick: () -> Unit = {},
) {
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
                            .clickable { onCategoryClick() },
                        shape = RoundedCornerShape(22.dp),
                        color = MaterialTheme.colorScheme.surface,
                    ) {
                        Column(
                            modifier = Modifier
                                .padding(horizontal = 16.dp, vertical = 20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = colorFromHex(category.color).copy(alpha = 0.28f),
                            ) {
                                Text(
                                    text = category.icon,
                                    style = MaterialTheme.typography.titleLarge,
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                )
                            }
                            Spacer(modifier = Modifier.height(14.dp))
                            Text(
                                text = category.name,
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                textAlign = TextAlign.Center,
                                maxLines = 2,
                                fontWeight = FontWeight.Medium,
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

private fun colorFromHex(hex: String): Color {
    val normalized = hex.trim().removePrefix("#")
    return try {
        when (normalized.length) {
            6 -> Color(normalized.toLong(16) or 0x00000000FF000000)
            8 -> Color(normalized.toLong(16))
            else -> Color(0xFF8AAE94)
        }
    } catch (_: Exception) {
        Color(0xFF8AAE94)
    }
}

@Composable
fun SectionHeader(
    title: String,
    seeAllText: String? = null,
    onSeeAll: () -> Unit = {},
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
            fontWeight = FontWeight.Medium,
        )
        if (!seeAllText.isNullOrBlank()) {
            TextButton(onClick = onSeeAll) {
                Text(
                    text = seeAllText,
                    color = SageGreen,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
    }
}
