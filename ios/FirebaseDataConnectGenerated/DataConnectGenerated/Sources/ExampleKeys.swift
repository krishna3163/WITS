import Foundation

import FirebaseCore
import FirebaseDataConnect




public struct ChatParticipantKey {
  
  public private(set) var chatId: UUID
  
  public private(set) var userId: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  chatId
    
    case  userId
    
  }
}

extension ChatParticipantKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.chatId = try codecHelper.decode(UUID.self, forKey: .chatId, container: &container)
    
    self.userId = try codecHelper.decode(UUID.self, forKey: .userId, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(chatId, forKey: .chatId, container: &container)
      
      
      
      try codecHelper.encode(userId, forKey: .userId, container: &container)
      
      
    }
}

extension ChatParticipantKey : Equatable {
  public static func == (lhs: ChatParticipantKey, rhs: ChatParticipantKey) -> Bool {
    
    if lhs.chatId != rhs.chatId {
      return false
    }
    
    if lhs.userId != rhs.userId {
      return false
    }
    
    return true
  }
}

extension ChatParticipantKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.chatId)
    
    hasher.combine(self.userId)
    
  }
}

extension ChatParticipantKey : Sendable {}



public struct ChatKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension ChatKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension ChatKey : Equatable {
  public static func == (lhs: ChatKey, rhs: ChatKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension ChatKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension ChatKey : Sendable {}



public struct CommunityMemberKey {
  
  public private(set) var communityId: UUID
  
  public private(set) var userId: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  communityId
    
    case  userId
    
  }
}

extension CommunityMemberKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.communityId = try codecHelper.decode(UUID.self, forKey: .communityId, container: &container)
    
    self.userId = try codecHelper.decode(UUID.self, forKey: .userId, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(communityId, forKey: .communityId, container: &container)
      
      
      
      try codecHelper.encode(userId, forKey: .userId, container: &container)
      
      
    }
}

extension CommunityMemberKey : Equatable {
  public static func == (lhs: CommunityMemberKey, rhs: CommunityMemberKey) -> Bool {
    
    if lhs.communityId != rhs.communityId {
      return false
    }
    
    if lhs.userId != rhs.userId {
      return false
    }
    
    return true
  }
}

extension CommunityMemberKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.communityId)
    
    hasher.combine(self.userId)
    
  }
}

extension CommunityMemberKey : Sendable {}



public struct CommunityModeratorKey {
  
  public private(set) var communityId: UUID
  
  public private(set) var userId: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  communityId
    
    case  userId
    
  }
}

extension CommunityModeratorKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.communityId = try codecHelper.decode(UUID.self, forKey: .communityId, container: &container)
    
    self.userId = try codecHelper.decode(UUID.self, forKey: .userId, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(communityId, forKey: .communityId, container: &container)
      
      
      
      try codecHelper.encode(userId, forKey: .userId, container: &container)
      
      
    }
}

extension CommunityModeratorKey : Equatable {
  public static func == (lhs: CommunityModeratorKey, rhs: CommunityModeratorKey) -> Bool {
    
    if lhs.communityId != rhs.communityId {
      return false
    }
    
    if lhs.userId != rhs.userId {
      return false
    }
    
    return true
  }
}

extension CommunityModeratorKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.communityId)
    
    hasher.combine(self.userId)
    
  }
}

extension CommunityModeratorKey : Sendable {}



public struct CommunityKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension CommunityKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension CommunityKey : Equatable {
  public static func == (lhs: CommunityKey, rhs: CommunityKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension CommunityKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension CommunityKey : Sendable {}



public struct MessageReadStatusKey {
  
  public private(set) var messageId: UUID
  
  public private(set) var userId: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  messageId
    
    case  userId
    
  }
}

extension MessageReadStatusKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.messageId = try codecHelper.decode(UUID.self, forKey: .messageId, container: &container)
    
    self.userId = try codecHelper.decode(UUID.self, forKey: .userId, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(messageId, forKey: .messageId, container: &container)
      
      
      
      try codecHelper.encode(userId, forKey: .userId, container: &container)
      
      
    }
}

extension MessageReadStatusKey : Equatable {
  public static func == (lhs: MessageReadStatusKey, rhs: MessageReadStatusKey) -> Bool {
    
    if lhs.messageId != rhs.messageId {
      return false
    }
    
    if lhs.userId != rhs.userId {
      return false
    }
    
    return true
  }
}

extension MessageReadStatusKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.messageId)
    
    hasher.combine(self.userId)
    
  }
}

extension MessageReadStatusKey : Sendable {}



public struct MessageKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension MessageKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension MessageKey : Equatable {
  public static func == (lhs: MessageKey, rhs: MessageKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension MessageKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension MessageKey : Sendable {}



public struct PostKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension PostKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension PostKey : Equatable {
  public static func == (lhs: PostKey, rhs: PostKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension PostKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension PostKey : Sendable {}



public struct RelationshipKey {
  
  public private(set) var initiatorId: UUID
  
  public private(set) var targetId: UUID
  
  public private(set) var type: String
  

  enum CodingKeys: String, CodingKey {
    
    case  initiatorId
    
    case  targetId
    
    case  type
    
  }
}

extension RelationshipKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.initiatorId = try codecHelper.decode(UUID.self, forKey: .initiatorId, container: &container)
    
    self.targetId = try codecHelper.decode(UUID.self, forKey: .targetId, container: &container)
    
    self.type = try codecHelper.decode(String.self, forKey: .type, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(initiatorId, forKey: .initiatorId, container: &container)
      
      
      
      try codecHelper.encode(targetId, forKey: .targetId, container: &container)
      
      
      
      try codecHelper.encode(type, forKey: .type, container: &container)
      
      
    }
}

extension RelationshipKey : Equatable {
  public static func == (lhs: RelationshipKey, rhs: RelationshipKey) -> Bool {
    
    if lhs.initiatorId != rhs.initiatorId {
      return false
    }
    
    if lhs.targetId != rhs.targetId {
      return false
    }
    
    if lhs.type != rhs.type {
      return false
    }
    
    return true
  }
}

extension RelationshipKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.initiatorId)
    
    hasher.combine(self.targetId)
    
    hasher.combine(self.type)
    
  }
}

extension RelationshipKey : Sendable {}



public struct ServiceIntegrationKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension ServiceIntegrationKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension ServiceIntegrationKey : Equatable {
  public static func == (lhs: ServiceIntegrationKey, rhs: ServiceIntegrationKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension ServiceIntegrationKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension ServiceIntegrationKey : Sendable {}



public struct UserKey {
  
  public private(set) var id: UUID
  

  enum CodingKeys: String, CodingKey {
    
    case  id
    
  }
}

extension UserKey : Codable {
  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
  }

  public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(id, forKey: .id, container: &container)
      
      
    }
}

extension UserKey : Equatable {
  public static func == (lhs: UserKey, rhs: UserKey) -> Bool {
    
    if lhs.id != rhs.id {
      return false
    }
    
    return true
  }
}

extension UserKey : Hashable {
  public func hash(into hasher: inout Hasher) {
    
    hasher.combine(self.id)
    
  }
}

extension UserKey : Sendable {}


