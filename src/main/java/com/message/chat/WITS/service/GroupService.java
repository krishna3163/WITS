package com.message.chat.WITS.service;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.model.GroupRole;
import com.message.chat.WITS.repository.ChatGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupService {
    private final ChatGroupRepository groupRepository;

    public ChatGroup createGroup(String name, String creatorId) {
        ChatGroup group = ChatGroup.builder()
                .name(name)
                .build();
        group.getMembers().put(creatorId, GroupRole.OWNER);
        return groupRepository.save(group);
    }

    public void addMember(String groupId, String adminId, String userId, GroupRole role) {
        groupRepository.findById(groupId).ifPresent(group -> {
            GroupRole requesterRole = group.getMembers().get(adminId);
            if (requesterRole == GroupRole.OWNER || requesterRole == GroupRole.ADMIN
                    || requesterRole == GroupRole.MODERATOR) {
                group.getMembers().put(userId, role);
                groupRepository.save(group);
            }
        });
    }

    public void removeMember(String groupId, String adminId, String targetUserId) {
        groupRepository.findById(groupId).ifPresent(group -> {
            GroupRole requesterRole = group.getMembers().get(adminId);
            if (requesterRole == GroupRole.OWNER || requesterRole == GroupRole.ADMIN
                    || requesterRole == GroupRole.MODERATOR) {
                group.getMembers().remove(targetUserId);
                groupRepository.save(group);
            }
        });
    }

    public void updateGroupProfile(String groupId, String adminId, String name, String sub, String imageUrl) {
        groupRepository.findById(groupId).ifPresent(group -> {
            if (group.getMembers().get(adminId) == GroupRole.ADMIN) {
                if (name != null)
                    group.setName(name);
                if (sub != null)
                    group.setDescription(sub);
                if (imageUrl != null)
                    group.setImageUrl(imageUrl);
                groupRepository.save(group);
            }
        });
    }

    public void deleteGroup(String groupId, String adminId) {
        groupRepository.findById(groupId).ifPresent(group -> {
            if (group.getMembers().get(adminId) == GroupRole.ADMIN) {
                groupRepository.delete(group);
            }
        });
    }

    public void updateMemberRole(String groupId, String adminId, String targetUserId, GroupRole newRole) {
        groupRepository.findById(groupId).ifPresent(group -> {
            GroupRole requesterRole = group.getMembers().get(adminId);
            if (requesterRole == GroupRole.ADMIN) {
                group.getMembers().put(targetUserId, newRole);
                groupRepository.save(group);
            }
        });
    }

    public void removeSelfAsAdmin(String groupId, String adminId) {
        groupRepository.findById(groupId).ifPresent(group -> {
            if (group.getMembers().get(adminId) == GroupRole.ADMIN) {
                group.getMembers().put(adminId, GroupRole.MEMBER);
                groupRepository.save(group);
            }
        });
    }

    public void requestToJoin(String groupId, String userId) {
        groupRepository.findById(groupId).ifPresent(group -> {
            if (group.isRequiresApproval()) {
                group.getPendingApprovalUserIds().add(userId);
                groupRepository.save(group);
            } else {
                group.getMembers().put(userId, GroupRole.MEMBER);
                groupRepository.save(group);
            }
        });
    }

    public void approveJoinRequest(String groupId, String adminId, String userId, boolean approve) {
        groupRepository.findById(groupId).ifPresent(group -> {
            GroupRole requesterRole = group.getMembers().get(adminId);
            if (requesterRole == GroupRole.ADMIN || requesterRole == GroupRole.SUBADMIN) {
                if (group.getPendingApprovalUserIds().contains(userId)) {
                    group.getPendingApprovalUserIds().remove(userId);
                    if (approve) {
                        group.getMembers().put(userId, GroupRole.MEMBER);
                    }
                    groupRepository.save(group);
                }
            }
        });
    }

    public void setMemberNickname(String groupId, String adminId, String targetUserId, String nickname) {
        groupRepository.findById(groupId).ifPresent(group -> {
            GroupRole requesterRole = group.getMembers().get(adminId);
            if (requesterRole == GroupRole.ADMIN || requesterRole == GroupRole.SUBADMIN) {
                if (nickname == null || nickname.isEmpty()) {
                    group.getMemberNicknames().remove(targetUserId);
                } else {
                    group.getMemberNicknames().put(targetUserId, nickname);
                }
                groupRepository.save(group);
            }
        });
    }

    public void setSlowMode(String groupId, String adminId, int seconds) {
        groupRepository.findById(groupId).ifPresent(group -> {
            if (group.getMembers().get(adminId) == GroupRole.ADMIN) {
                group.setSlowModeDelaySeconds(seconds);
                groupRepository.save(group);
            }
        });
    }

    public void addGroupTopic(String groupId, String adminId, String name, String description) {
        groupRepository.findById(groupId).ifPresent(group -> {
            if (group.getMembers().get(adminId) == GroupRole.ADMIN) {
                com.message.chat.WITS.model.Topic topic = com.message.chat.WITS.model.Topic.builder()
                        .id(java.util.UUID.randomUUID().toString())
                        .name(name)
                        .description(description)
                        .build();
                group.getTopics().add(topic);
                groupRepository.save(group);
            }
        });
    }

    public void leaveGroup(String groupId, String userId) {
        groupRepository.findById(groupId).ifPresent(group -> {
            group.getMembers().remove(userId);
            groupRepository.save(group);
        });
    }

    public Optional<ChatGroup> getGroup(String groupId) {
        return groupRepository.findById(groupId);
    }
}
