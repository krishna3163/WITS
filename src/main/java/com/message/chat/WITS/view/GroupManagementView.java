package com.message.chat.WITS.view;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.model.GroupRole;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.GroupService;
import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.textfield.TextField;
import jakarta.annotation.security.PermitAll;

import java.util.stream.Collectors;

@Route(value = "group-manage", layout = MainLayout.class)
@PageTitle("Manage Group | WITS Chat")
@PermitAll
public class GroupManagementView extends VerticalLayout implements HasUrlParameter<String> {

    private final GroupService groupService;
    private final UserService userService;
    private final SecurityService securityService;
    private String groupId;
    private final TextField nameField = new TextField("Group Name");
    private final TextField descField = new TextField("Description");
    private final TextField imgField = new TextField("Image URL");
    private final Button saveProfile = new Button("Save Profile");
    private final Button deleteGroup = new Button("Delete Group");
    private final Grid<User> membersGrid = new Grid<>(User.class, false);
    private final H2 header = new H2("Manage Group");

    public GroupManagementView(GroupService groupService, UserService userService, SecurityService securityService) {
        this.groupService = groupService;
        this.userService = userService;
        this.securityService = securityService;

        setSizeFull();
        configureMembersGrid();

        saveProfile.addClickListener(e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                groupService.updateGroupProfile(groupId, user.getId(), nameField.getValue(), descField.getValue(),
                        imgField.getValue());
                Notification.show("Profile updated!");
            });
        });

        deleteGroup.addClickListener(e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                groupService.deleteGroup(groupId, user.getId());
                Notification.show("Group deleted.");
                getUI().ifPresent(ui -> ui.navigate(ExploreUsersView.class));
            });
        });

        Button leaveAdmin = new Button("Resign as Admin", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                groupService.removeSelfAsAdmin(groupId, user.getId());
                Notification.show("You are no longer an admin.");
                refreshData();
            });
        });

        Button leaveGroup = new Button("Leave Group", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                groupService.leaveGroup(groupId, user.getId());
                Notification.show("You left the group.");
                getUI().ifPresent(ui -> ui.navigate(ExploreUsersView.class));
            });
        });

        VerticalLayout profileSide = new VerticalLayout(new H2("Group Profile"), nameField, descField, imgField,
                saveProfile, deleteGroup, leaveGroup);
        profileSide.setWidth("300px");

        HorizontalLayout mainContent = new HorizontalLayout(new VerticalLayout(header, membersGrid, leaveAdmin),
                profileSide);
        mainContent.setSizeFull();
        add(mainContent);
    }

    private void configureMembersGrid() {
        membersGrid.addColumn(User::getUsername).setHeader("Member");
        membersGrid.addComponentColumn(user -> {
            HorizontalLayout actions = new HorizontalLayout();

            ComboBox<GroupRole> roleBox = new ComboBox<>("Role", GroupRole.values());
            groupService.getGroup(groupId).ifPresent(group -> roleBox.setValue(group.getMembers().get(user.getId())));

            roleBox.addValueChangeListener(e -> {
                if (e.isFromClient()) {
                    securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
                        groupService.updateMemberRole(groupId, currentUser.getId(), user.getId(), e.getValue());
                        Notification.show("Role updated for " + user.getUsername());
                    });
                }
            });

            Button remove = new Button("Remove", e -> {
                securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
                    groupService.removeMember(groupId, currentUser.getId(), user.getId());
                    Notification.show(user.getUsername() + " removed.");
                    refreshData();
                });
            });

            securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
                ChatGroup group = groupService.getGroup(groupId).orElse(null);
                if (group != null) {
                    GroupRole myRole = group.getMembers().get(currentUser.getId());
                    roleBox.setEnabled(myRole == GroupRole.ADMIN);
                    remove.setEnabled(myRole == GroupRole.ADMIN || myRole == GroupRole.SUBADMIN);
                    // Don't allow removing self or higher/equal roles easily for now
                }
            });

            actions.add(roleBox, remove);
            return actions;
        }).setHeader("Actions");
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        this.groupId = parameter;
        groupService.getGroup(groupId).ifPresent(group -> {
            header.setText("Manage Group: " + group.getName());
            nameField.setValue(group.getName() != null ? group.getName() : "");
            descField.setValue(group.getDescription() != null ? group.getDescription() : "");
            imgField.setValue(group.getImageUrl() != null ? group.getImageUrl() : "");

            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                boolean isAdmin = group.getMembers().get(u.getId()) == GroupRole.ADMIN;
                nameField.setEnabled(isAdmin);
                descField.setEnabled(isAdmin);
                imgField.setEnabled(isAdmin);
                saveProfile.setEnabled(isAdmin);
                deleteGroup.setEnabled(isAdmin);
            });
        });
        refreshData();
    }

    private void refreshData() {
        groupService.getGroup(groupId).ifPresent(group -> {
            membersGrid.setItems(group.getMembers().keySet().stream()
                    .map(userService::findById)
                    .filter(java.util.Optional::isPresent)
                    .map(java.util.Optional::get)
                    .collect(Collectors.toList()));
        });
    }
}
