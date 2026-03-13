
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



public interface CreateNewChatMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      CreateNewChatMutation.Data,
      CreateNewChatMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val name: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val description: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val profilePictureUrl: com.google.firebase.dataconnect.OptionalVariable<String?>,
    val isEphemeral: com.google.firebase.dataconnect.OptionalVariable<Boolean?>,
    val chatType: String
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      @BuilderDsl
      public interface Builder {
        public var name: String?
        public var description: String?
        public var profilePictureUrl: String?
        public var isEphemeral: Boolean?
        public var chatType: String
        
      }

      public companion object {
        @Suppress("NAME_SHADOWING")
        public fun build(
          chatType: String,
          block_: Builder.() -> Unit
        ): Variables {
          var name: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var description: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var profilePictureUrl: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var isEphemeral: com.google.firebase.dataconnect.OptionalVariable<Boolean?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var chatType= chatType
            

          return object : Builder {
            override var name: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { name = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var description: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { description = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var profilePictureUrl: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { profilePictureUrl = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var isEphemeral: Boolean?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { isEphemeral = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var chatType: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { chatType = value_ }
              
            
          }.apply(block_)
          .let {
            Variables(
              name=name,description=description,profilePictureUrl=profilePictureUrl,isEphemeral=isEphemeral,chatType=chatType,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val chat: ChatKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "CreateNewChat"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun CreateNewChatMutation.ref(
  
    chatType: String,
  
    block_: CreateNewChatMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    CreateNewChatMutation.Data,
    CreateNewChatMutation.Variables
  > =
  ref(
    
      CreateNewChatMutation.Variables.build(
        chatType=chatType,
  
    block_
      )
    
  )

public suspend fun CreateNewChatMutation.execute(
  
    chatType: String,
  
    block_: CreateNewChatMutation.Variables.Builder.() -> Unit = {}
  
  ): com.google.firebase.dataconnect.MutationResult<
    CreateNewChatMutation.Data,
    CreateNewChatMutation.Variables
  > =
  ref(
    
      chatType=chatType,
  
    block_
    
  ).execute()


