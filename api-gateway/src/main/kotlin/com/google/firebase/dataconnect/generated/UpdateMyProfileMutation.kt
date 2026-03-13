
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



public interface UpdateMyProfileMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      UpdateMyProfileMutation.Data,
      UpdateMyProfileMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val bio: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val location: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val profilePictureUrl: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val displayName: com.google.firebase.dataconnect.OptionalVariable<String?>
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      @BuilderDsl
      public interface Builder {
        public var bio: String?
        public var location: String?
        public var profilePictureUrl: String?
        public var displayName: String?
        
      }

      public companion object {
        @Suppress("NAME_SHADOWING")
        public fun build(
          
          block_: Builder.() -> Unit
        ): Variables {
          var bio: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var location: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var profilePictureUrl: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var displayName: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            

          return object : Builder {
            override var bio: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { bio = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var location: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { location = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var profilePictureUrl: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { profilePictureUrl = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var displayName: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { displayName = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            
          }.apply(block_)
          .let {
            Variables(
              bio=bio,location=location,profilePictureUrl=profilePictureUrl,displayName=displayName,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val user_update: UserKey?
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "UpdateMyProfile"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun UpdateMyProfileMutation.ref(
  
    
  
    block_: UpdateMyProfileMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    UpdateMyProfileMutation.Data,
    UpdateMyProfileMutation.Variables
  > =
  ref(
    
      UpdateMyProfileMutation.Variables.build(
        
  
    block_
      )
    
  )

public suspend fun UpdateMyProfileMutation.execute(
  
    
  
    block_: UpdateMyProfileMutation.Variables.Builder.() -> Unit = {}
  
  ): com.google.firebase.dataconnect.MutationResult<
    UpdateMyProfileMutation.Data,
    UpdateMyProfileMutation.Variables
  > =
  ref(
    
      
  
    block_
    
  ).execute()


