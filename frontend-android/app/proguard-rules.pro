# Retrofit
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.mycityslow.app.data.remote.dto.** { *; }
-keep class com.mycityslow.app.domain.model.** { *; }

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
