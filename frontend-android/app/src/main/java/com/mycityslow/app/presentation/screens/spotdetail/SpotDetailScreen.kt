package com.mycityslow.app.presentation.screens.spotdetail

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.outlined.AccessTime
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.rememberCameraPositionState
import com.mycityslow.app.presentation.theme.SageGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpotDetailScreen(
    spotId: String,
    onBack: () -> Unit,
    onOpenSpot: (String) -> Unit = {},
    viewModel: SpotDetailViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val uiText = state.uiText
    val pageBg = Color(0xFFF1EFEA)
    val sectionBg = Color(0xFFE8E4DD)

    Scaffold(
        containerColor = pageBg,
        bottomBar = {
            if (!state.isLoading && state.spot != null) {
                BottomActionBar(
                    isSaved = state.isSaved,
                    uiText = uiText,
                    onToggleSave = { viewModel.toggleSave() },
                    onStartWalk = { },
                )
            }
        },
    ) { padding ->
        when {
            state.isLoading -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator(color = SageGreen)
                }
            }
            state.spot == null -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center,
                ) {
                    if (!state.error.isNullOrBlank()) {
                        Text(state.error.orEmpty(), color = MaterialTheme.colorScheme.error)
                    }
                }
            }
            else -> {
                val spot = state.spot ?: return@Scaffold
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .background(pageBg)
                        .verticalScroll(rememberScrollState()),
                ) {
                    HeroSection(
                        spotName = spot.name,
                        locationText = listOf(spot.city.name, spot.location.address)
                            .filter { it.isNotBlank() }
                            .joinToString(separator = " • "),
                        images = spot.images,
                        isSaved = state.isSaved,
                        onBack = onBack,
                        onToggleSave = { viewModel.toggleSave() },
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .offset(y = (-30).dp)
                            .padding(horizontal = 14.dp),
                    ) {
                        PeaceScoreCard(
                            peaceScore = spot.peaceScore,
                            vibe = spot.vibe,
                            bestTime = spot.bestTime,
                            uiText = uiText,
                            background = sectionBg,
                        )
                    }

                    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                        val bodyText = if (spot.longDescription.isNotBlank()) spot.longDescription else spot.description
                        if (bodyText.isNotBlank()) {
                            Text(
                                text = bodyText,
                                style = MaterialTheme.typography.bodyLarge,
                                color = Color(0xFF2A2A2A),
                                lineHeight = MaterialTheme.typography.bodyLarge.lineHeight,
                            )
                            Spacer(modifier = Modifier.height(24.dp))
                        }

                        SectionTitle(title = uiText.sectionBestTimeForSilence)
                        Spacer(modifier = Modifier.height(10.dp))
                        BestTimeInsightsCard(
                            uiText = uiText,
                            background = sectionBg,
                            chartHeights = state.cardData.bestTimeHeights,
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            SectionTitle(title = uiText.sectionHowToReach)
                            val closestDistance = state.nearbySpots.firstOrNull()?.distanceKm
                            Text(
                                text = closestDistance?.let {
                                    applyValueTemplate(uiText.distanceAwayTemplate, String.format("%.1f", it))
                                } ?: uiText.mapFallbackDistanceLabel,
                                style = MaterialTheme.typography.labelMedium,
                                color = Color(0xFF5F5F5F),
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        ReachabilityMapCard(
                            lat = spot.location.lat,
                            lng = spot.location.lng,
                            spotName = spot.name,
                            nearbySpots = state.nearbySpots,
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        SectionTitle(title = uiText.sectionNearbySimilarSpots)
                        Spacer(modifier = Modifier.height(10.dp))
                        NearbySpotsRow(
                            spots = state.nearbySpots,
                            uiText = uiText,
                            onSpotClick = onOpenSpot,
                        )

                        Spacer(modifier = Modifier.height(100.dp))
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun HeroSection(
    spotName: String,
    locationText: String,
    images: List<String>,
    isSaved: Boolean,
    onBack: () -> Unit,
    onToggleSave: () -> Unit,
) {
    val validImages = images.filter { it.isNotBlank() }
    val displayImages = if (validImages.isEmpty()) listOf("") else validImages
    val pagerState = rememberPagerState(pageCount = { displayImages.size })

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(360.dp),
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize(),
        ) { page ->
            AsyncImage(
                model = displayImages[page],
                contentDescription = null,
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFF20201C)),
                contentScale = ContentScale.Crop,
            )
        }

        Box(
            modifier = Modifier
                .matchParentSize()
                .background(
                    brush = Brush.verticalGradient(
                        0f to Color.Black.copy(alpha = 0.05f),
                        0.55f to Color.Transparent,
                        1f to Color.Black.copy(alpha = 0.68f),
                    )
                ),
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 14.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CircleActionButton(icon = Icons.AutoMirrored.Filled.ArrowBack, onClick = onBack)

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CircleActionButton(
                    icon = if (isSaved) Icons.Filled.Bookmark else Icons.Filled.BookmarkBorder,
                    onClick = onToggleSave,
                )
                CircleActionButton(
                    icon = Icons.Outlined.Share,
                    onClick = { },
                )
            }
        }

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(horizontal = 16.dp, vertical = 14.dp),
        ) {
            Text(
                text = spotName,
                style = MaterialTheme.typography.headlineMedium,
                color = Color.White,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Outlined.LocationOn,
                    contentDescription = null,
                    tint = Color.White.copy(alpha = 0.9f),
                    modifier = Modifier.size(14.dp),
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = locationText,
                    style = MaterialTheme.typography.labelMedium,
                    color = Color.White.copy(alpha = 0.88f),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }

        if (displayImages.size > 1) {
            Row(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                displayImages.indices.forEach { index ->
                    Box(
                        modifier = Modifier
                            .size(if (pagerState.currentPage == index) 10.dp else 8.dp)
                            .clip(CircleShape)
                            .background(
                                if (pagerState.currentPage == index) Color.White
                                else Color.White.copy(alpha = 0.4f)
                            ),
                    )
                }
            }
        }

    }
}

@Composable
private fun CircleActionButton(
    icon: ImageVector,
    onClick: () -> Unit,
) {
    Surface(
        modifier = Modifier.size(36.dp),
        shape = CircleShape,
        color = Color(0x33000000),
        onClick = onClick,
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(18.dp),
            )
        }
    }
}

@Composable
private fun PeaceScoreCard(
    peaceScore: Double,
    vibe: String,
    bestTime: String,
    uiText: com.mycityslow.app.data.repository.SpotRepository.SpotDetailUiText,
    background: Color,
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(10.dp, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        color = background,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Column {
                Text(
                    text = uiText.peaceScoreLabel,
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF5D5D5D),
                )
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = String.format("%.1f", peaceScore),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF2F6A4F),
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = uiText.peaceScoreSuffix,
                        style = MaterialTheme.typography.labelMedium,
                        color = Color(0xFF7A7A7A),
                    )
                }
            }

            Box(
                modifier = Modifier
                    .size(54.dp)
                    .clip(CircleShape)
                    .border(3.dp, Color(0xFF2F6A4F), CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Outlined.Explore,
                    contentDescription = null,
                    tint = Color(0xFF2F6A4F),
                    modifier = Modifier.size(20.dp),
                )
            }
        }
    }

    Spacer(modifier = Modifier.height(10.dp))

    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        DetailChip(icon = Icons.Outlined.Explore, text = "${uiText.vibeLabelPrefix} $vibe".trim())
        DetailChip(icon = Icons.Outlined.AccessTime, text = "${uiText.bestTimeLabelPrefix} $bestTime".trim())
    }
}

@Composable
private fun DetailChip(icon: ImageVector, text: String) {
    Surface(shape = RoundedCornerShape(50), color = Color(0xFFD3DCCE)) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color(0xFF2B4738))
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF2B4738),
            )
        }
    }
}

@Composable
private fun SectionTitle(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleLarge,
        color = Color(0xFF1E1E1E),
        fontWeight = FontWeight.SemiBold,
    )
}

@Composable
private fun BestTimeInsightsCard(
    uiText: com.mycityslow.app.data.repository.SpotRepository.SpotDetailUiText,
    background: Color,
    chartHeights: List<Int> = emptyList(),
) {
    val labels = if (uiText.bestTimeChartLabels.isNotEmpty()) uiText.bestTimeChartLabels else emptyList()
    val heights = if (chartHeights.isNotEmpty()) {
        chartHeights.map { it.dp }
    } else {
        listOf(24.dp, 20.dp, 14.dp, 72.dp, 58.dp, 30.dp)
    }
    val highlightIndex = uiText.bestTimeChartHighlightIndex

    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        color = background,
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.Bottom,
            ) {
                labels.indices.forEach { index ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .width(22.dp)
                                .height(heights.getOrNull(index) ?: 24.dp)
                                .clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp, bottomStart = 3.dp, bottomEnd = 3.dp))
                                .background(if (index == highlightIndex) Color(0xFF8DB39E) else Color(0xFFCED8CC)),
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(labels[index], style = MaterialTheme.typography.labelSmall, color = Color(0xFF3E3E3E))
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(text = uiText.bestTimeInsightText, style = MaterialTheme.typography.bodySmall, color = Color(0xFF4E4E4E))
        }
    }
}

@Composable
private fun ReachabilityMapCard(
    lat: Double,
    lng: Double,
    spotName: String,
    nearbySpots: List<com.mycityslow.app.data.repository.SpotRepository.NearbySpotPreview> = emptyList(),
) {
    val location = LatLng(lat, lng)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(location, 14f)
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(150.dp)
            .clip(RoundedCornerShape(20.dp)),
    ) {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
        ) {
            Marker(
                state = MarkerState(position = location),
                title = spotName,
            )
            
            nearbySpots.forEach { spot ->
                if (spot.lat != 0.0 && spot.lng != 0.0) {
                    Marker(
                        state = MarkerState(position = LatLng(spot.lat, spot.lng)),
                        title = spot.title,
                    )
                }
            }
        }
    }
}

@Composable
private fun CommunityStoriesRow(
    stories: List<com.mycityslow.app.data.repository.SpotRepository.CommunityStoryPreview>,
) {
    val displayStories = stories

    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        items(displayStories) { story ->
            Box(
                modifier = Modifier
                    .width(150.dp)
                    .height(190.dp)
                    .clip(RoundedCornerShape(18.dp)),
            ) {
                AsyncImage(
                    model = story.imageUrl,
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop,
                )
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(8.dp)
                        .background(Color.Black.copy(alpha = 0.45f), RoundedCornerShape(20.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                ) {
                    Text(
                        text = story.authorName,
                        color = Color.White,
                        style = MaterialTheme.typography.labelSmall,
                    )
                }
            }
        }
    }
}

@Composable
private fun NearbySpotsRow(
    spots: List<com.mycityslow.app.data.repository.SpotRepository.NearbySpotPreview>,
    uiText: com.mycityslow.app.data.repository.SpotRepository.SpotDetailUiText,
    onSpotClick: (String) -> Unit,
) {
    if (spots.isEmpty()) {
        Text(
            text = uiText.noNearbySpotsText,
            style = MaterialTheme.typography.bodySmall,
            color = Color(0xFF666666),
        )
        return
    }

    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        items(spots) { item ->
            Column(
                modifier = Modifier
                    .width(118.dp)
                    .clickable { onSpotClick(item.id) },
            ) {
                AsyncImage(
                    model = item.imageUrl,
                    contentDescription = item.title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(112.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFFDCD8D0)),
                    contentScale = ContentScale.Crop,
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.labelLarge,
                    color = Color(0xFF222222),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = item.distanceKm?.let {
                        applyValueTemplate(uiText.distanceChipTemplate, String.format("%.1f", it))
                    } ?: uiText.nearbyFallbackDistanceLabel,
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF666666),
                )
            }
        }
    }
}

@Composable
private fun BottomActionBar(
    isSaved: Boolean,
    uiText: com.mycityslow.app.data.repository.SpotRepository.SpotDetailUiText,
    onToggleSave: () -> Unit,
    onStartWalk: () -> Unit,
) {
    Surface(color = Color(0xFFF1EFEA)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Button(
                onClick = onToggleSave,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF5E7D67)),
            ) {
                Icon(
                    imageVector = if (isSaved) Icons.Filled.Bookmark else Icons.Filled.BookmarkBorder,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.dp),
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isSaved) uiText.addedToSlowListText else uiText.addToSlowListText,
                    color = Color.White,
                    style = MaterialTheme.typography.labelLarge,
                )
            }

            OutlinedButton(
                onClick = onStartWalk,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.outlinedButtonColors(containerColor = Color.Transparent),
                border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp),
            ) {
                Icon(
                    imageVector = Icons.Outlined.Explore,
                    contentDescription = null,
                    tint = Color(0xFF1F3A2C),
                    modifier = Modifier.size(16.dp),
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(uiText.startWalkingText, color = Color(0xFF1F3A2C), style = MaterialTheme.typography.labelLarge)
            }
        }
    }
}

private fun applyValueTemplate(template: String, value: String): String {
    if (template.isBlank()) return value
    return template.replace("{value}", value)
}
