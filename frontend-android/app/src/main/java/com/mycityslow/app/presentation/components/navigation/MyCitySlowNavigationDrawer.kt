package com.mycityslow.app.presentation.components.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mycityslow.app.R
import com.mycityslow.app.domain.model.MenuItem
import com.mycityslow.app.presentation.theme.SageGreen
import com.mycityslow.app.presentation.theme.WarmBeige
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.clickable

@Composable
fun MyCitySlowNavigationDrawer(
    menuItems: List<MenuItem>,
    onMenuItemClick: (MenuItem) -> Unit,
    onCloseDrawer: () -> Unit,
    modifier: Modifier = Modifier,
    userName: String? = null,
    userEmail: String? = null
) {
    Column(
        modifier = modifier
            .fillMaxHeight()
            .width(280.dp)
            .background(Color.White)
    ) {
        // Header Section with Logo and App Name
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(SageGreen.copy(alpha = 0.05f))
                .padding(vertical = 24.dp, horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Close Button (top right)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(24.dp),
                contentAlignment = Alignment.TopEnd
            ) {
                IconButton(
                    onClick = onCloseDrawer,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close drawer",
                        tint = SageGreen,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // App Logo (larger)
            Image(
                painter = painterResource(id = R.drawable.logo_icon),
                contentDescription = "My City Slow Logo",
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(16.dp))
            )

            Spacer(modifier = Modifier.height(16.dp))

            // App Name
            Text(
                text = "My City Slow",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 20.sp
            )

            // Tagline
            Text(
                text = "Discover the Peaceful Side\nof Your City",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Normal,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                fontSize = 12.sp,
                modifier = Modifier.padding(top = 4.dp)
            )

            // User Profile Section (if logged in)
            if (!userName.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider(
                    color = SageGreen.copy(alpha = 0.2f),
                    thickness = 1.dp,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(12.dp))

                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp)),
                    color = WarmBeige.copy(alpha = 0.3f)
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = userName,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        if (!userEmail.isNullOrEmpty()) {
                            Text(
                                text = userEmail,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Menu Items
        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(4.dp),
            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 8.dp)
        ) {
            items(menuItems) { item ->
                when (item.type) {
                    "divider" -> {
                        HorizontalDivider(
                            color = SageGreen.copy(alpha = 0.15f),
                            thickness = 1.dp,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp)
                        )
                    }
                    "section" -> {
                        Text(
                            text = item.title,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = SageGreen,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(
                                horizontal = 16.dp,
                                vertical = 12.dp
                            )
                        )
                    }
                    else -> {
                        if (item.visible) {
                            NavigationMenuItem(
                                item = item,
                                onClick = {
                                    onMenuItemClick(item)
                                    onCloseDrawer()
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun NavigationMenuItem(
    item: MenuItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        color = Color.Transparent
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            // Icon (emoji or material icon)
            if (!item.icon.isNullOrEmpty()) {
                Text(
                    text = item.icon,
                    fontSize = 20.sp,
                    modifier = Modifier.width(24.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
            }

            // Title and Subtitle
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontSize = 14.sp
                )
                if (!item.subtitle.isNullOrEmpty()) {
                    Text(
                        text = item.subtitle,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}
