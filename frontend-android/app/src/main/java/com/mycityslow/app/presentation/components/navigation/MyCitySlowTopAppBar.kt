package com.mycityslow.app.presentation.components.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mycityslow.app.R
import com.mycityslow.app.presentation.theme.SageGreen
import com.valentinilk.shimmer.ShimmerBounds
import com.valentinilk.shimmer.shimmer
import com.valentinilk.shimmer.rememberShimmer

@Composable
fun MyCitySlowTopAppBar(
    onMenuClick: () -> Unit,
    modifier: Modifier = Modifier,
    showTagline: Boolean = true
) {
    val shimmerInstance = rememberShimmer(shimmerBounds = ShimmerBounds.View)

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .height(if (showTagline) 80.dp else 64.dp),
        color = MaterialTheme.colorScheme.background,
        tonalElevation = 0.dp,
        shadowElevation = 0.dp,
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .shimmer(shimmerInstance)
            )
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
            IconButton(
                onClick = onMenuClick,
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .size(48.dp)
                    .clip(MaterialTheme.shapes.small)
                    .background(SageGreen.copy(alpha = 0.08f))
            ) {
                Icon(
                    imageVector = Icons.Outlined.Menu,
                    contentDescription = "Open menu",
                    tint = SageGreen,
                    modifier = Modifier.size(24.dp)
                )
            }

            Row(
                modifier = Modifier.align(Alignment.Center),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.logo_icon),
                    contentDescription = "My City Slow Logo",
                    modifier = Modifier
                        .size(48.dp)
                        .clip(MaterialTheme.shapes.medium)
                )

                Spacer(modifier = Modifier.width(12.dp))

                Column(
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.Start
                ) {
                    Text(
                        text = "My City Slow",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onBackground,
                        fontSize = 16.sp
                    )
                    if (showTagline) {
                        Text(
                            text = "Discover the Peaceful Side",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.72f),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Normal
                        )
                    }
                }
            }
        }
    }
}
}
