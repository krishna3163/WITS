This Swift package contains the generated Swift code for the connector `example`.

You can use this package by adding it as a local Swift package dependency in your project.

# Accessing the connector

Add the necessary imports

```
import FirebaseDataConnect
import DataConnectGenerated

```

The connector can be accessed using the following code:

```
let connector = DataConnect.exampleConnector

```


## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code, which can be called from the `init` function of your SwiftUI app

```
connector.useEmulator()
```

# Queries

## ListAllCommunitiesQuery


### Using the Query Reference
```
struct MyView: View {
   var listAllCommunitiesQueryRef = DataConnect.exampleConnector.listAllCommunitiesQuery.ref(...)

  var body: some View {
    VStack {
      if let data = listAllCommunitiesQueryRef.data {
        // use data in View
      }
      else {
        Text("Loading...")
      }
    }
    .task {
        do {
          let _ = try await listAllCommunitiesQueryRef.execute()
        } catch {
        }
      }
  }
}
```

### One-shot execute
```
DataConnect.exampleConnector.listAllCommunitiesQuery.execute(...)
```


## GetMyPostsQuery


### Using the Query Reference
```
struct MyView: View {
   var getMyPostsQueryRef = DataConnect.exampleConnector.getMyPostsQuery.ref(...)

  var body: some View {
    VStack {
      if let data = getMyPostsQueryRef.data {
        // use data in View
      }
      else {
        Text("Loading...")
      }
    }
    .task {
        do {
          let _ = try await getMyPostsQueryRef.execute()
        } catch {
        }
      }
  }
}
```

### One-shot execute
```
DataConnect.exampleConnector.getMyPostsQuery.execute(...)
```


# Mutations
## CreateNewChatMutation

### Variables

#### Required
```swift

let chatType: String = ...
```
 

#### Optional
```swift

let name: String = ...
let description: String = ...
let profilePictureUrl: String = ...
let isEphemeral: Bool = ...
```

### One-shot execute
```
DataConnect.exampleConnector.createNewChatMutation.execute(...)
```

## UpdateMyProfileMutation

### Variables
 

#### Optional
```swift

let bio: String = ...
let location: String = ...
let profilePictureUrl: String = ...
let displayName: String = ...
```

### One-shot execute
```
DataConnect.exampleConnector.updateMyProfileMutation.execute(...)
```

