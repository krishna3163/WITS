
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated


import kotlinx.coroutines.flow.filterNotNull as _flow_filterNotNull
import kotlinx.coroutines.flow.map as _flow_map


public interface GetMyPostsQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      ExampleConnector,
      GetMyPostsQuery.Data,
      Unit
    >
{
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val posts: List<PostsItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class PostsItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val content: String,
    val caption: String?,
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
    val community: Community?
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Community(
  
    val name: String
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "GetMyPosts"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Unit> =
      kotlinx.serialization.serializer()
  }
}

public fun GetMyPostsQuery.ref(
  
): com.google.firebase.dataconnect.QueryRef<
    GetMyPostsQuery.Data,
    Unit
  > =
  ref(
    
      Unit
    
  )

public suspend fun GetMyPostsQuery.execute(
  
  ): com.google.firebase.dataconnect.QueryResult<
    GetMyPostsQuery.Data,
    Unit
  > =
  ref(
    
  ).execute()


  public fun GetMyPostsQuery.flow(
    
    ): kotlinx.coroutines.flow.Flow<GetMyPostsQuery.Data> =
    ref(
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }

