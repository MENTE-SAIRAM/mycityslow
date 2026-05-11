package com.mycityslow.app.presentation.screens.onboarding

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Image
import com.mycityslow.app.R
import com.mycityslow.app.presentation.theme.SageGreen
import com.mycityslow.app.presentation.theme.WarmBeige

@Composable
fun OnboardingWelcomeScreen(onGetStarted: () -> Unit) {
    var currentPage by remember { mutableIntStateOf(0) }

    val pages = listOf(
        OnboardingPage(
            title = "Discover the Slow Side of India",
            subtitle = "Escape the crowds and find peaceful spots only locals know about.",
            emoji = "🌿",
        ),
        OnboardingPage(
            title = "Authentic Local Experiences",
            subtitle = "Home dinners, heritage walks, pottery workshops — live like a local.",
            emoji = "🏡",
        ),
        OnboardingPage(
            title = "Your Personal Slow Travel Guide",
            subtitle = "Curated guides, local stories, and a peaceful pace for every city.",
            emoji = "🧘",
        ),
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween,
    ) {
        // App Logo
        Image(
            painter = painterResource(id = R.drawable.logo_icon),
            contentDescription = "My City Slow Logo",
            modifier = Modifier
                .size(120.dp)
                .clip(RoundedCornerShape(24.dp))
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Page content
        Column(
            modifier = Modifier.weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            AnimatedContent(
                targetState = currentPage,
                transitionSpec = {
                    slideInHorizontally { width -> width } + fadeIn() togetherWith
                        slideOutHorizontally { width -> -width } + fadeOut()
                },
                label = "onboarding_page"
            ) { page ->
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = pages[page].emoji,
                        style = MaterialTheme.typography.displayLarge,
                    )
                    Spacer(modifier = Modifier.height(32.dp))
                    Text(
                        text = pages[page].title,
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.onBackground,
                        textAlign = TextAlign.Center,
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = pages[page].subtitle,
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                    )
                }
            }
        }

        // Indicators
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            pages.indices.forEach { index ->
                Box(
                    modifier = Modifier
                        .width(if (index == currentPage) 32.dp else 8.dp)
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            if (index == currentPage) SageGreen
                            else MaterialTheme.colorScheme.outline
                        )
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Buttons
        if (currentPage < pages.size - 1) {
            Button(
                onClick = { currentPage++ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = SageGreen,
                ),
            ) {
                Text("Next", style = MaterialTheme.typography.titleMedium)
            }
            Spacer(modifier = Modifier.height(12.dp))
            TextButton(onClick = onGetStarted) {
                Text("Skip", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            Button(
                onClick = onGetStarted,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = SageGreen,
                ),
            ) {
                Text(
                    "Get Started",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onPrimary,
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

private data class OnboardingPage(val title: String, val subtitle: String, val emoji: String)
