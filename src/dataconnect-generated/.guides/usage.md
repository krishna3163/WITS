# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listAllCommunities, getMyPosts, createNewChat, updateMyProfile } from '@dataconnect/generated';


// Operation ListAllCommunities: 
const { data } = await ListAllCommunities(dataConnect);

// Operation GetMyPosts: 
const { data } = await GetMyPosts(dataConnect);

// Operation CreateNewChat:  For variables, look at type CreateNewChatVars in ../index.d.ts
const { data } = await CreateNewChat(dataConnect, createNewChatVars);

// Operation UpdateMyProfile:  For variables, look at type UpdateMyProfileVars in ../index.d.ts
const { data } = await UpdateMyProfile(dataConnect, updateMyProfileVars);


```