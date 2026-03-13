import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ChatParticipant_Key {
  chatId: UUIDString;
  userId: UUIDString;
  __typename?: 'ChatParticipant_Key';
}

export interface Chat_Key {
  id: UUIDString;
  __typename?: 'Chat_Key';
}

export interface CommunityMember_Key {
  communityId: UUIDString;
  userId: UUIDString;
  __typename?: 'CommunityMember_Key';
}

export interface CommunityModerator_Key {
  communityId: UUIDString;
  userId: UUIDString;
  __typename?: 'CommunityModerator_Key';
}

export interface Community_Key {
  id: UUIDString;
  __typename?: 'Community_Key';
}

export interface CreateNewChatData {
  chat: Chat_Key;
}

export interface CreateNewChatVariables {
  name?: string | null;
  description?: string | null;
  profilePictureUrl?: string | null;
  isEphemeral?: boolean | null;
  chatType: string;
}

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

export interface MessageReadStatus_Key {
  messageId: UUIDString;
  userId: UUIDString;
  __typename?: 'MessageReadStatus_Key';
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface Post_Key {
  id: UUIDString;
  __typename?: 'Post_Key';
}

export interface Relationship_Key {
  initiatorId: UUIDString;
  targetId: UUIDString;
  type: string;
  __typename?: 'Relationship_Key';
}

export interface ServiceIntegration_Key {
  id: UUIDString;
  __typename?: 'ServiceIntegration_Key';
}

export interface UpdateMyProfileData {
  user_update?: User_Key | null;
}

export interface UpdateMyProfileVariables {
  bio?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
  displayName?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListAllCommunitiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCommunitiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllCommunitiesData, undefined>;
  operationName: string;
}
export const listAllCommunitiesRef: ListAllCommunitiesRef;

export function listAllCommunities(): QueryPromise<ListAllCommunitiesData, undefined>;
export function listAllCommunities(dc: DataConnect): QueryPromise<ListAllCommunitiesData, undefined>;

interface GetMyPostsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPostsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyPostsData, undefined>;
  operationName: string;
}
export const getMyPostsRef: GetMyPostsRef;

export function getMyPosts(): QueryPromise<GetMyPostsData, undefined>;
export function getMyPosts(dc: DataConnect): QueryPromise<GetMyPostsData, undefined>;

interface CreateNewChatRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewChatVariables): MutationRef<CreateNewChatData, CreateNewChatVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewChatVariables): MutationRef<CreateNewChatData, CreateNewChatVariables>;
  operationName: string;
}
export const createNewChatRef: CreateNewChatRef;

export function createNewChat(vars: CreateNewChatVariables): MutationPromise<CreateNewChatData, CreateNewChatVariables>;
export function createNewChat(dc: DataConnect, vars: CreateNewChatVariables): MutationPromise<CreateNewChatData, CreateNewChatVariables>;

interface UpdateMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateMyProfileVariables): MutationRef<UpdateMyProfileData, UpdateMyProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateMyProfileVariables): MutationRef<UpdateMyProfileData, UpdateMyProfileVariables>;
  operationName: string;
}
export const updateMyProfileRef: UpdateMyProfileRef;

export function updateMyProfile(vars?: UpdateMyProfileVariables): MutationPromise<UpdateMyProfileData, UpdateMyProfileVariables>;
export function updateMyProfile(dc: DataConnect, vars?: UpdateMyProfileVariables): MutationPromise<UpdateMyProfileData, UpdateMyProfileVariables>;

