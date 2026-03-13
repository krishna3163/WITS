const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'wits',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const listAllCommunitiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllCommunities');
}
listAllCommunitiesRef.operationName = 'ListAllCommunities';
exports.listAllCommunitiesRef = listAllCommunitiesRef;

exports.listAllCommunities = function listAllCommunities(dc) {
  return executeQuery(listAllCommunitiesRef(dc));
};

const getMyPostsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyPosts');
}
getMyPostsRef.operationName = 'GetMyPosts';
exports.getMyPostsRef = getMyPostsRef;

exports.getMyPosts = function getMyPosts(dc) {
  return executeQuery(getMyPostsRef(dc));
};

const createNewChatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewChat', inputVars);
}
createNewChatRef.operationName = 'CreateNewChat';
exports.createNewChatRef = createNewChatRef;

exports.createNewChat = function createNewChat(dcOrVars, vars) {
  return executeMutation(createNewChatRef(dcOrVars, vars));
};

const updateMyProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyProfile', inputVars);
}
updateMyProfileRef.operationName = 'UpdateMyProfile';
exports.updateMyProfileRef = updateMyProfileRef;

exports.updateMyProfile = function updateMyProfile(dcOrVars, vars) {
  return executeMutation(updateMyProfileRef(dcOrVars, vars));
};
