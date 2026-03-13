import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

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

/** Generated Node Admin SDK operation action function for the 'ListAllCommunities' Query. Allow users to execute without passing in DataConnect. */
export function listAllCommunities(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCommunitiesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllCommunities' Query. Allow users to pass in custom DataConnect instances. */
export function listAllCommunities(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCommunitiesData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyPosts' Query. Allow users to execute without passing in DataConnect. */
export function getMyPosts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyPostsData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyPosts' Query. Allow users to pass in custom DataConnect instances. */
export function getMyPosts(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyPostsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateNewChat' Mutation. Allow users to execute without passing in DataConnect. */
export function createNewChat(dc: DataConnect, vars: CreateNewChatVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewChatData>>;
/** Generated Node Admin SDK operation action function for the 'CreateNewChat' Mutation. Allow users to pass in custom DataConnect instances. */
export function createNewChat(vars: CreateNewChatVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewChatData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMyProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMyProfile(dc: DataConnect, vars?: UpdateMyProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMyProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMyProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMyProfile(vars?: UpdateMyProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMyProfileData>>;

