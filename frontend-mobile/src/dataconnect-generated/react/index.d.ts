import { ListAllCommunitiesData, GetMyPostsData, CreateNewChatData, CreateNewChatVariables, UpdateMyProfileData, UpdateMyProfileVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllCommunities(options?: useDataConnectQueryOptions<ListAllCommunitiesData>): UseDataConnectQueryResult<ListAllCommunitiesData, undefined>;
export function useListAllCommunities(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllCommunitiesData>): UseDataConnectQueryResult<ListAllCommunitiesData, undefined>;

export function useGetMyPosts(options?: useDataConnectQueryOptions<GetMyPostsData>): UseDataConnectQueryResult<GetMyPostsData, undefined>;
export function useGetMyPosts(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyPostsData>): UseDataConnectQueryResult<GetMyPostsData, undefined>;

export function useCreateNewChat(options?: useDataConnectMutationOptions<CreateNewChatData, FirebaseError, CreateNewChatVariables>): UseDataConnectMutationResult<CreateNewChatData, CreateNewChatVariables>;
export function useCreateNewChat(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewChatData, FirebaseError, CreateNewChatVariables>): UseDataConnectMutationResult<CreateNewChatData, CreateNewChatVariables>;

export function useUpdateMyProfile(options?: useDataConnectMutationOptions<UpdateMyProfileData, FirebaseError, UpdateMyProfileVariables | void>): UseDataConnectMutationResult<UpdateMyProfileData, UpdateMyProfileVariables>;
export function useUpdateMyProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyProfileData, FirebaseError, UpdateMyProfileVariables | void>): UseDataConnectMutationResult<UpdateMyProfileData, UpdateMyProfileVariables>;
