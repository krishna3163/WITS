
import Foundation

import FirebaseCore
import FirebaseDataConnect
public extension DataConnect {

  static let exampleConnector: ExampleConnector = {
    let dc = DataConnect.dataConnect(connectorConfig: ExampleConnector.connectorConfig, callerSDKType: .generated)
    return ExampleConnector(dataConnect: dc)
  }()

}

public class ExampleConnector {

  let dataConnect: DataConnect

  public static let connectorConfig = ConnectorConfig(serviceId: "wits", location: "us-east4", connector: "example")

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect

    // init operations 
    self.listAllCommunitiesQuery = ListAllCommunitiesQuery(dataConnect: dataConnect)
    self.getMyPostsQuery = GetMyPostsQuery(dataConnect: dataConnect)
    self.createNewChatMutation = CreateNewChatMutation(dataConnect: dataConnect)
    self.updateMyProfileMutation = UpdateMyProfileMutation(dataConnect: dataConnect)
    
  }

  public func useEmulator(host: String = DataConnect.EmulatorDefaults.host, port: Int = DataConnect.EmulatorDefaults.port) {
    self.dataConnect.useEmulator(host: host, port: port)
  }

  // MARK: Operations
public let listAllCommunitiesQuery: ListAllCommunitiesQuery
public let getMyPostsQuery: GetMyPostsQuery
public let createNewChatMutation: CreateNewChatMutation
public let updateMyProfileMutation: UpdateMyProfileMutation


}
