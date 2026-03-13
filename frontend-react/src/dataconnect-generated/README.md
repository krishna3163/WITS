# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllCommunities*](#listallcommunities)
  - [*GetMyPosts*](#getmyposts)
- [**Mutations**](#mutations)
  - [*CreateNewChat*](#createnewchat)
  - [*UpdateMyProfile*](#updatemyprofile)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllCommunities
You can execute the `ListAllCommunities` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllCommunities(): QueryPromise<ListAllCommunitiesData, undefined>;

interface ListAllCommunitiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCommunitiesData, undefined>;
}
export const listAllCommunitiesRef: ListAllCommunitiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllCommunities(dc: DataConnect): QueryPromise<ListAllCommunitiesData, undefined>;

interface ListAllCommunitiesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllCommunitiesData, undefined>;
}
export const listAllCommunitiesRef: ListAllCommunitiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllCommunitiesRef:
```typescript
const name = listAllCommunitiesRef.operationName;
console.log(name);
```

### Variables
The `ListAllCommunities` query has no variables.
### Return Type
Recall that executing the `ListAllCommunities` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllCommunitiesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllCommunitiesData {
  communities: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    communityType: string;
    profilePictureUrl?: string | null;
    creator?: {
      displayName: string;
    };
  } & Community_Key)[];
}
```
### Using `ListAllCommunities`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllCommunities } from '@dataconnect/generated';


// Call the `listAllCommunities()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllCommunities();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllCommunities(dataConnect);

console.log(data.communities);

// Or, you can use the `Promise` API.
listAllCommunities().then((response) => {
  const data = response.data;
  console.log(data.communities);
});
```

### Using `ListAllCommunities`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllCommunitiesRef } from '@dataconnect/generated';


// Call the `listAllCommunitiesRef()` function to get a reference to the query.
const ref = listAllCommunitiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllCommunitiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.communities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.communities);
});
```

## GetMyPosts
You can execute the `GetMyPosts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyPosts(): QueryPromise<GetMyPostsData, undefined>;

interface GetMyPostsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPostsData, undefined>;
}
export const getMyPostsRef: GetMyPostsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyPosts(dc: DataConnect): QueryPromise<GetMyPostsData, undefined>;

interface GetMyPostsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyPostsData, undefined>;
}
export const getMyPostsRef: GetMyPostsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyPostsRef:
```typescript
const name = getMyPostsRef.operationName;
console.log(name);
```

### Variables
The `GetMyPosts` query has no variables.
### Return Type
Recall that executing the `GetMyPosts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyPostsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyPostsData {
  posts: ({
    id: UUIDString;
    content: string;
    caption?: string | null;
    createdAt: TimestampString;
    community?: {
      name: string;
    };
  } & Post_Key)[];
}
```
### Using `GetMyPosts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyPosts } from '@dataconnect/generated';


// Call the `getMyPosts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyPosts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyPosts(dataConnect);

console.log(data.posts);

// Or, you can use the `Promise` API.
getMyPosts().then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetMyPosts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyPostsRef } from '@dataconnect/generated';


// Call the `getMyPostsRef()` function to get a reference to the query.
const ref = getMyPostsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyPostsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewChat
You can execute the `CreateNewChat` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewChat(vars: CreateNewChatVariables): MutationPromise<CreateNewChatData, CreateNewChatVariables>;

interface CreateNewChatRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewChatVariables): MutationRef<CreateNewChatData, CreateNewChatVariables>;
}
export const createNewChatRef: CreateNewChatRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewChat(dc: DataConnect, vars: CreateNewChatVariables): MutationPromise<CreateNewChatData, CreateNewChatVariables>;

interface CreateNewChatRef {
  ...
  (dc: DataConnect, vars: CreateNewChatVariables): MutationRef<CreateNewChatData, CreateNewChatVariables>;
}
export const createNewChatRef: CreateNewChatRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewChatRef:
```typescript
const name = createNewChatRef.operationName;
console.log(name);
```

### Variables
The `CreateNewChat` mutation requires an argument of type `CreateNewChatVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewChatVariables {
  name?: string | null;
  description?: string | null;
  profilePictureUrl?: string | null;
  isEphemeral?: boolean | null;
  chatType: string;
}
```
### Return Type
Recall that executing the `CreateNewChat` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewChatData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewChatData {
  chat: Chat_Key;
}
```
### Using `CreateNewChat`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewChat, CreateNewChatVariables } from '@dataconnect/generated';

// The `CreateNewChat` mutation requires an argument of type `CreateNewChatVariables`:
const createNewChatVars: CreateNewChatVariables = {
  name: ..., // optional
  description: ..., // optional
  profilePictureUrl: ..., // optional
  isEphemeral: ..., // optional
  chatType: ..., 
};

// Call the `createNewChat()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewChat(createNewChatVars);
// Variables can be defined inline as well.
const { data } = await createNewChat({ name: ..., description: ..., profilePictureUrl: ..., isEphemeral: ..., chatType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewChat(dataConnect, createNewChatVars);

console.log(data.chat);

// Or, you can use the `Promise` API.
createNewChat(createNewChatVars).then((response) => {
  const data = response.data;
  console.log(data.chat);
});
```

### Using `CreateNewChat`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewChatRef, CreateNewChatVariables } from '@dataconnect/generated';

// The `CreateNewChat` mutation requires an argument of type `CreateNewChatVariables`:
const createNewChatVars: CreateNewChatVariables = {
  name: ..., // optional
  description: ..., // optional
  profilePictureUrl: ..., // optional
  isEphemeral: ..., // optional
  chatType: ..., 
};

// Call the `createNewChatRef()` function to get a reference to the mutation.
const ref = createNewChatRef(createNewChatVars);
// Variables can be defined inline as well.
const ref = createNewChatRef({ name: ..., description: ..., profilePictureUrl: ..., isEphemeral: ..., chatType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewChatRef(dataConnect, createNewChatVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.chat);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.chat);
});
```

## UpdateMyProfile
You can execute the `UpdateMyProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMyProfile(vars?: UpdateMyProfileVariables): MutationPromise<UpdateMyProfileData, UpdateMyProfileVariables>;

interface UpdateMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateMyProfileVariables): MutationRef<UpdateMyProfileData, UpdateMyProfileVariables>;
}
export const updateMyProfileRef: UpdateMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyProfile(dc: DataConnect, vars?: UpdateMyProfileVariables): MutationPromise<UpdateMyProfileData, UpdateMyProfileVariables>;

interface UpdateMyProfileRef {
  ...
  (dc: DataConnect, vars?: UpdateMyProfileVariables): MutationRef<UpdateMyProfileData, UpdateMyProfileVariables>;
}
export const updateMyProfileRef: UpdateMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyProfileRef:
```typescript
const name = updateMyProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyProfile` mutation has an optional argument of type `UpdateMyProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyProfileVariables {
  bio?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
  displayName?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMyProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyProfileData {
  user_update?: User_Key | null;
}
```
### Using `UpdateMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyProfile, UpdateMyProfileVariables } from '@dataconnect/generated';

// The `UpdateMyProfile` mutation has an optional argument of type `UpdateMyProfileVariables`:
const updateMyProfileVars: UpdateMyProfileVariables = {
  bio: ..., // optional
  location: ..., // optional
  profilePictureUrl: ..., // optional
  displayName: ..., // optional
};

// Call the `updateMyProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyProfile(updateMyProfileVars);
// Variables can be defined inline as well.
const { data } = await updateMyProfile({ bio: ..., location: ..., profilePictureUrl: ..., displayName: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateMyProfileVariables` argument.
const { data } = await updateMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyProfile(dataConnect, updateMyProfileVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateMyProfile(updateMyProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateMyProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyProfileRef, UpdateMyProfileVariables } from '@dataconnect/generated';

// The `UpdateMyProfile` mutation has an optional argument of type `UpdateMyProfileVariables`:
const updateMyProfileVars: UpdateMyProfileVariables = {
  bio: ..., // optional
  location: ..., // optional
  profilePictureUrl: ..., // optional
  displayName: ..., // optional
};

// Call the `updateMyProfileRef()` function to get a reference to the mutation.
const ref = updateMyProfileRef(updateMyProfileVars);
// Variables can be defined inline as well.
const ref = updateMyProfileRef({ bio: ..., location: ..., profilePictureUrl: ..., displayName: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateMyProfileVariables` argument.
const ref = updateMyProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyProfileRef(dataConnect, updateMyProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

