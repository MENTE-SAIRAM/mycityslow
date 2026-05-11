package com.mycityslow.app.navigation

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.navigation.NavController
import com.mycityslow.app.MainActivity

object DeepLinkHandler {
    
    sealed class DeepLinkAction {
        object Home : DeepLinkAction()
        object Discover : DeepLinkAction()
        object Experiences : DeepLinkAction()
        object Collection : DeepLinkAction()
        object FirstTimeGuide : DeepLinkAction()
        object Submit : DeepLinkAction()
        object Stories : DeepLinkAction()
        object About : DeepLinkAction()
        object Privacy : DeepLinkAction()
        data class Share(val appName: String = "My City Slow", val appUrl: String = "https://mycityslow.com") : DeepLinkAction()
        data class Rate(val packageName: String = "com.mycityslow.app") : DeepLinkAction()
        data class CustomAction(val deeplink: String) : DeepLinkAction()
    }

    fun handleDeepLink(
        deeplink: String,
        navController: NavController? = null,
        context: Context? = null
    ): DeepLinkAction {
        return when {
            deeplink.contains("home") -> DeepLinkAction.Home
            deeplink.contains("discover") -> DeepLinkAction.Discover
            deeplink.contains("experiences") -> DeepLinkAction.Experiences
            deeplink.contains("collection") -> DeepLinkAction.Collection
            deeplink.contains("guide") -> DeepLinkAction.FirstTimeGuide
            deeplink.contains("submit") -> DeepLinkAction.Submit
            deeplink.contains("stories") -> DeepLinkAction.Stories
            deeplink.contains("about") -> DeepLinkAction.About
            deeplink.contains("privacy") -> DeepLinkAction.Privacy
            deeplink.contains("share") -> {
                if (context != null) {
                    executeShare(context)
                }
                DeepLinkAction.Share()
            }
            deeplink.contains("rate") -> {
                if (context != null) {
                    executeRate(context)
                }
                DeepLinkAction.Rate()
            }
            else -> DeepLinkAction.CustomAction(deeplink)
        }
    }

    fun executeDeepLinkAction(
        action: DeepLinkAction,
        navController: NavController,
        context: Context? = null
    ) {
        when (action) {
            is DeepLinkAction.Home -> {
                navController.navigate("home") {
                    popUpTo("home") { inclusive = true }
                }
            }
            is DeepLinkAction.Discover -> {
                navController.navigate("discover")
            }
            is DeepLinkAction.Experiences -> {
                navController.navigate("experiences")
            }
            is DeepLinkAction.Collection -> {
                navController.navigate("collection")
            }
            is DeepLinkAction.FirstTimeGuide -> {
                navController.navigate("first_time_guide")
            }
            is DeepLinkAction.Submit -> {
                navController.navigate("submit")
            }
            is DeepLinkAction.Stories -> {
                navController.navigate("stories")
            }
            is DeepLinkAction.About -> {
                navController.navigate("about")
            }
            is DeepLinkAction.Privacy -> {
                navController.navigate("privacy")
            }
            is DeepLinkAction.Share -> {
                if (context != null) executeShare(context)
            }
            is DeepLinkAction.Rate -> {
                if (context != null) executeRate(context, action.packageName)
            }
            is DeepLinkAction.CustomAction -> {
                // Handle custom actions as needed
            }
        }
    }

    private fun executeShare(context: Context) {
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_SUBJECT, "My City Slow App")
            putExtra(
                Intent.EXTRA_TEXT,
                "Discover the peaceful side of your city with My City Slow. Download now: https://mycityslow.com"
            )
            type = "text/plain"
        }
        context.startActivity(Intent.createChooser(shareIntent, "Share My City Slow"))
    }

    private fun executeRate(context: Context, packageName: String = "com.mycityslow.app") {
        try {
            context.startActivity(
                Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName"))
            )
        } catch (e: Exception) {
            // If Play Store app is not available, open in browser
            context.startActivity(
                Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=$packageName"))
            )
        }
    }
}
