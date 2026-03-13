import Foundation

import FirebaseCore
import FirebaseDataConnect




















// MARK: Common Enums

public enum OrderDirection: String, Codable, Sendable {
  case ASC = "ASC"
  case DESC = "DESC"
  }

public enum SearchQueryFormat: String, Codable, Sendable {
  case QUERY = "QUERY"
  case PLAIN = "PLAIN"
  case PHRASE = "PHRASE"
  case ADVANCED = "ADVANCED"
  }


// MARK: Connector Enums

// End enum definitions









public class ListAllCommunitiesQuery{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "ListAllCommunities"

  public typealias Ref = QueryRefObservation<ListAllCommunitiesQuery.Data,ListAllCommunitiesQuery.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {




public struct Community: Decodable, Sendable ,Hashable, Equatable, Identifiable {
  


public var 
id: UUID



public var 
name: String



public var 
description: String?



public var 
communityType: String



public var 
profilePictureUrl: String?





public struct User: Decodable, Sendable  {
  


public var 
displayName: String


  

  
  enum CodingKeys: String, CodingKey {
    
    case displayName
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.displayName = try codecHelper.decode(String.self, forKey: .displayName, container: &container)
    
    
  }
}
public var 
creator: User?


  
  public var communityKey: CommunityKey {
    return CommunityKey(
      
      id: id
    )
  }

  
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(id)
  
}
public static func == (lhs: Community, rhs: Community) -> Bool {
    
    return lhs.id == rhs.id 
        
  }

  

  
  enum CodingKeys: String, CodingKey {
    
    case id
    
    case name
    
    case description
    
    case communityType
    
    case profilePictureUrl
    
    case creator
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
    
    
    self.name = try codecHelper.decode(String.self, forKey: .name, container: &container)
    
    
    
    self.description = try codecHelper.decode(String?.self, forKey: .description, container: &container)
    
    
    
    self.communityType = try codecHelper.decode(String.self, forKey: .communityType, container: &container)
    
    
    
    self.profilePictureUrl = try codecHelper.decode(String?.self, forKey: .profilePictureUrl, container: &container)
    
    
    
    self.creator = try codecHelper.decode(User?.self, forKey: .creator, container: &container)
    
    
  }
}
public var 
communities: [Community]

  }

  public func ref(
        
        ) -> QueryRefObservation<ListAllCommunitiesQuery.Data,ListAllCommunitiesQuery.Variables>  {
        var variables = ListAllCommunitiesQuery.Variables()
        

        let ref = dataConnect.query(name: "ListAllCommunities", variables: variables, resultsDataType:ListAllCommunitiesQuery.Data.self, publisher: .observableMacro)
        return ref as! QueryRefObservation<ListAllCommunitiesQuery.Data,ListAllCommunitiesQuery.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<ListAllCommunitiesQuery.Data> {
        var variables = ListAllCommunitiesQuery.Variables()
        
        
        let ref = dataConnect.query(name: "ListAllCommunities", variables: variables, resultsDataType:ListAllCommunitiesQuery.Data.self, publisher: .observableMacro)
        
        let refCast = ref as! QueryRefObservation<ListAllCommunitiesQuery.Data,ListAllCommunitiesQuery.Variables>
        return try await refCast.execute()
        
   }
}






public class GetMyPostsQuery{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "GetMyPosts"

  public typealias Ref = QueryRefObservation<GetMyPostsQuery.Data,GetMyPostsQuery.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {




public struct Post: Decodable, Sendable ,Hashable, Equatable, Identifiable {
  


public var 
id: UUID



public var 
content: String



public var 
caption: String?



public var 
createdAt: Timestamp





public struct Community: Decodable, Sendable  {
  


public var 
name: String


  

  
  enum CodingKeys: String, CodingKey {
    
    case name
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.name = try codecHelper.decode(String.self, forKey: .name, container: &container)
    
    
  }
}
public var 
community: Community?


  
  public var postKey: PostKey {
    return PostKey(
      
      id: id
    )
  }

  
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(id)
  
}
public static func == (lhs: Post, rhs: Post) -> Bool {
    
    return lhs.id == rhs.id 
        
  }

  

  
  enum CodingKeys: String, CodingKey {
    
    case id
    
    case content
    
    case caption
    
    case createdAt
    
    case community
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
    
    
    self.content = try codecHelper.decode(String.self, forKey: .content, container: &container)
    
    
    
    self.caption = try codecHelper.decode(String?.self, forKey: .caption, container: &container)
    
    
    
    self.createdAt = try codecHelper.decode(Timestamp.self, forKey: .createdAt, container: &container)
    
    
    
    self.community = try codecHelper.decode(Community?.self, forKey: .community, container: &container)
    
    
  }
}
public var 
posts: [Post]

  }

  public func ref(
        
        ) -> QueryRefObservation<GetMyPostsQuery.Data,GetMyPostsQuery.Variables>  {
        var variables = GetMyPostsQuery.Variables()
        

        let ref = dataConnect.query(name: "GetMyPosts", variables: variables, resultsDataType:GetMyPostsQuery.Data.self, publisher: .observableMacro)
        return ref as! QueryRefObservation<GetMyPostsQuery.Data,GetMyPostsQuery.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<GetMyPostsQuery.Data> {
        var variables = GetMyPostsQuery.Variables()
        
        
        let ref = dataConnect.query(name: "GetMyPosts", variables: variables, resultsDataType:GetMyPostsQuery.Data.self, publisher: .observableMacro)
        
        let refCast = ref as! QueryRefObservation<GetMyPostsQuery.Data,GetMyPostsQuery.Variables>
        return try await refCast.execute()
        
   }
}






public class CreateNewChatMutation{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "CreateNewChat"

  public typealias Ref = MutationRef<CreateNewChatMutation.Data,CreateNewChatMutation.Variables>

  public struct Variables: OperationVariable {
  
        @OptionalVariable
        public var
name: String?

  
        @OptionalVariable
        public var
description: String?

  
        @OptionalVariable
        public var
profilePictureUrl: String?

  
        @OptionalVariable
        public var
isEphemeral: Bool?

  
        
        public var
chatType: String


    
    
    
    public init (
        
chatType: String

        
        
        ,
        _ optionalVars: ((inout Variables)->())? = nil
        ) {
        self.chatType = chatType
        

        
        if let optionalVars {
            optionalVars(&self)
        }
        
    }

    public static func == (lhs: Variables, rhs: Variables) -> Bool {
      
        return lhs.name == rhs.name && 
              lhs.description == rhs.description && 
              lhs.profilePictureUrl == rhs.profilePictureUrl && 
              lhs.isEphemeral == rhs.isEphemeral && 
              lhs.chatType == rhs.chatType
              
    }

    
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(name)
  
  hasher.combine(description)
  
  hasher.combine(profilePictureUrl)
  
  hasher.combine(isEphemeral)
  
  hasher.combine(chatType)
  
}

    enum CodingKeys: String, CodingKey {
      
      case name
      
      case description
      
      case profilePictureUrl
      
      case isEphemeral
      
      case chatType
      
    }

    public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      if $name.isSet { 
      try codecHelper.encode(name, forKey: .name, container: &container)
      }
      
      if $description.isSet { 
      try codecHelper.encode(description, forKey: .description, container: &container)
      }
      
      if $profilePictureUrl.isSet { 
      try codecHelper.encode(profilePictureUrl, forKey: .profilePictureUrl, container: &container)
      }
      
      if $isEphemeral.isSet { 
      try codecHelper.encode(isEphemeral, forKey: .isEphemeral, container: &container)
      }
      
      
      try codecHelper.encode(chatType, forKey: .chatType, container: &container)
      
      
    }

  }

  public struct Data: Decodable, Sendable {



public var 
chat: ChatKey

  }

  public func ref(
        
chatType: String

        
        ,
        _ optionalVars: ((inout CreateNewChatMutation.Variables)->())? = nil
        ) -> MutationRef<CreateNewChatMutation.Data,CreateNewChatMutation.Variables>  {
        var variables = CreateNewChatMutation.Variables(chatType:chatType)
        
        if let optionalVars {
            optionalVars(&variables)
        }
        

        let ref = dataConnect.mutation(name: "CreateNewChat", variables: variables, resultsDataType:CreateNewChatMutation.Data.self)
        return ref as MutationRef<CreateNewChatMutation.Data,CreateNewChatMutation.Variables>
   }

  @MainActor
   public func execute(
        
chatType: String

        
        ,
        _ optionalVars: (@MainActor (inout CreateNewChatMutation.Variables)->())? = nil
        ) async throws -> OperationResult<CreateNewChatMutation.Data> {
        var variables = CreateNewChatMutation.Variables(chatType:chatType)
        
        if let optionalVars {
            optionalVars(&variables)
        }
        
        
        let ref = dataConnect.mutation(name: "CreateNewChat", variables: variables, resultsDataType:CreateNewChatMutation.Data.self)
        
        return try await ref.execute()
        
   }
}






public class UpdateMyProfileMutation{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "UpdateMyProfile"

  public typealias Ref = MutationRef<UpdateMyProfileMutation.Data,UpdateMyProfileMutation.Variables>

  public struct Variables: OperationVariable {
  
        @OptionalVariable
        public var
bio: String?

  
        @OptionalVariable
        public var
location: String?

  
        @OptionalVariable
        public var
profilePictureUrl: String?

  
        @OptionalVariable
        public var
displayName: String?


    
    
    
    public init (
        
        
        
        _ optionalVars: ((inout Variables)->())? = nil
        ) {
        

        
        if let optionalVars {
            optionalVars(&self)
        }
        
    }

    public static func == (lhs: Variables, rhs: Variables) -> Bool {
      
        return lhs.bio == rhs.bio && 
              lhs.location == rhs.location && 
              lhs.profilePictureUrl == rhs.profilePictureUrl && 
              lhs.displayName == rhs.displayName
              
    }

    
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(bio)
  
  hasher.combine(location)
  
  hasher.combine(profilePictureUrl)
  
  hasher.combine(displayName)
  
}

    enum CodingKeys: String, CodingKey {
      
      case bio
      
      case location
      
      case profilePictureUrl
      
      case displayName
      
    }

    public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      if $bio.isSet { 
      try codecHelper.encode(bio, forKey: .bio, container: &container)
      }
      
      if $location.isSet { 
      try codecHelper.encode(location, forKey: .location, container: &container)
      }
      
      if $profilePictureUrl.isSet { 
      try codecHelper.encode(profilePictureUrl, forKey: .profilePictureUrl, container: &container)
      }
      
      if $displayName.isSet { 
      try codecHelper.encode(displayName, forKey: .displayName, container: &container)
      }
      
    }

  }

  public struct Data: Decodable, Sendable {



public var 
user_update: UserKey?

  }

  public func ref(
        
        
        
        _ optionalVars: ((inout UpdateMyProfileMutation.Variables)->())? = nil
        ) -> MutationRef<UpdateMyProfileMutation.Data,UpdateMyProfileMutation.Variables>  {
        var variables = UpdateMyProfileMutation.Variables()
        
        if let optionalVars {
            optionalVars(&variables)
        }
        

        let ref = dataConnect.mutation(name: "UpdateMyProfile", variables: variables, resultsDataType:UpdateMyProfileMutation.Data.self)
        return ref as MutationRef<UpdateMyProfileMutation.Data,UpdateMyProfileMutation.Variables>
   }

  @MainActor
   public func execute(
        
        
        
        _ optionalVars: (@MainActor (inout UpdateMyProfileMutation.Variables)->())? = nil
        ) async throws -> OperationResult<UpdateMyProfileMutation.Data> {
        var variables = UpdateMyProfileMutation.Variables()
        
        if let optionalVars {
            optionalVars(&variables)
        }
        
        
        let ref = dataConnect.mutation(name: "UpdateMyProfile", variables: variables, resultsDataType:UpdateMyProfileMutation.Data.self)
        
        return try await ref.execute()
        
   }
}


