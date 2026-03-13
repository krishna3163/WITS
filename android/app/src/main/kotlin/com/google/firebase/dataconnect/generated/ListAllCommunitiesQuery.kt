
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


public interface ListAllCommunitiesQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      ExampleConnector,
      ListAllCommunitiesQuery.Data,
      Unit
    >
{
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val communities: List<CommunitiesItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class CommunitiesItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val name: String,
    val description: String?,
    val communityType: String,
    val profilePictureUrl: String?,
    val creator: Creator?
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Creator(
  
    val displayName: String
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "ListAllCommunities"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Unit> =
      kotlinx.serialization.serializer()
  }
}

public fun ListAllCommunitiesQuery.ref(
  
): com.google.firebase.dataconnect.QueryRef<
    ListAllCommunitiesQuery.Data,
    Unit
  > =
  ref(
    
      Unit
    
  )

public suspend fun ListAllCommunitiesQuery.execute(
  
  ): com.google.firebase.dataconnect.QueryResult<
    ListAllCommunitiesQuery.Data,
    Unit
  > =
  ref(
    
  ).execute()


  public fun ListAllCommunitiesQuery.flow(
    
    ): kotlinx.coroutines.flow.Flow<ListAllCommunitiesQuery.Data> =
    ref(
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }

