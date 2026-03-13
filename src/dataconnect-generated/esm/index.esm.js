import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'wits',
  location: 'us-east4'
};

export const listAllCommunitiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllCommunities');
}
listAllCommunitiesRef.operationName = 'ListAllCommunities';

export function listAllCommunities(dc) {
  return executeQuery(listAllCommunitiesRef(dc));
}

export const getMyPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyPosts');
}
getMyPostsRef.operationName = 'GetMyPosts';

export function getMyPosts(dc) {
  return executeQuery(getMyPostsRef(dc));
}

export const createNewChatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewChat', inputVars);
}
createNewChatRef.operationName = 'CreateNewChat';

export function createNewChat(dcOrVars, vars) {
  return executeMutation(createNewChatRef(dcOrVars, vars));
}

export const updateMyProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyProfile', inputVars);
}
updateMyProfileRef.operationName = 'UpdateMyProfile';

export function updateMyProfile(dcOrVars, vars) {
  return executeMutation(updateMyProfileRef(dcOrVars, vars));
}

