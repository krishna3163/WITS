package com.message.chat.WITS.view;

import com.message.chat.WITS.model.*;
import com.message.chat.WITS.service.RoleService;
import com.message.chat.WITS.service.ServerService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.checkbox.CheckboxGroup;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.tabs.Tab;
import com.vaadin.flow.component.tabs.Tabs;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Set;
import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.html.Span;

@Route(value = "server-settings", layout = MainLayout.class)
@PageTitle("Server Settings | WITS Chat")
@PermitAll
public class ServerSettingsView extends VerticalLayout implements HasUrlParameter<String> {

    private final ServerService serverService;
    private final RoleService roleService;
    private final UserService userService;
    private String serverId;

    private final VerticalLayout content = new VerticalLayout();
    private final Tabs tabs = new Tabs();

    public ServerSettingsView(ServerService serverService, RoleService roleService, UserService userService) {
        this.serverService = serverService;
        this.roleService = roleService;
        this.userService = userService;

        setSizeFull();
        setupTabs();
        add(tabs, content);
    }

    private void setupTabs() {
        Tab overview = new Tab("Overview");
        Tab roles = new Tab("Roles");
        Tab members = new Tab("Members");
        tabs.add(overview, roles, members);

        tabs.addSelectedChangeListener(e -> {
            content.removeAll();
            if (e.getSelectedTab().getLabel().equals("Overview"))
                showOverview();
            else if (e.getSelectedTab().getLabel().equals("Roles"))
                showRoles();
            else if (e.getSelectedTab().getLabel().equals("Members"))
                showMembers();
        });
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        this.serverId = parameter;
        showOverview(); // Default
    }

    private void showOverview() {
        serverService.findById(serverId).ifPresent(server -> {
            TextField name = new TextField("Server Name", server.getName(), "");
            Button save = new Button("Save Changes", e -> {
                server.setName(name.getValue());
                // Save logic here (need save in ServerService)
                Notification.show("Saved!");
            });
            content.add(new H3("Server Overview"), name, save);
        });
    }

    private void showRoles() {
        content.add(new H3("Server Roles"));
        Grid<ServerRole> roleGrid = new Grid<>(ServerRole.class, false);
        roleGrid.addColumn(ServerRole::getName).setHeader("Name");
        roleGrid.addColumn(r -> r.getPermissions().size()).setHeader("Permissions");

        roleGrid.addComponentColumn(role -> new Button("Edit", e -> openRoleDialog(role)));

        List<ServerRole> roles = roleService.getServerRoles(serverId);
        roleGrid.setItems(roles);

        Button addRole = new Button("Add Role", e -> openRoleDialog(null));
        content.add(roleGrid, addRole);
    }

    private void openRoleDialog(ServerRole existingRole) {
        com.vaadin.flow.component.dialog.Dialog dialog = new com.vaadin.flow.component.dialog.Dialog();
        TextField nameField = new TextField("Role Name", existingRole != null ? existingRole.getName() : "", "");
        CheckboxGroup<Permission> permissionGroup = new CheckboxGroup<>("Permissions");
        permissionGroup.setItems(Permission.values());
        if (existingRole != null)
            permissionGroup.setValue(existingRole.getPermissions());

        Button save = new Button("Save", e -> {
            if (existingRole == null) {
                roleService.createRole(serverId, nameField.getValue(), new HashSet<>(permissionGroup.getValue()), 0);
            } else {
                existingRole.setName(nameField.getValue());
                existingRole.setPermissions(new HashSet<>(permissionGroup.getValue()));
                roleService.updateRole(existingRole);
            }
            dialog.close();
            showRoles(); // Refresh
        });

        dialog.add(new VerticalLayout(nameField, permissionGroup, save));
        dialog.open();
    }

    private void showMembers() {
        content.add(new H3("Manage Members"));
        serverService.findById(serverId).ifPresent(server -> {
            Grid<String> memberGrid = new Grid<>();
            memberGrid.addColumn(userId -> userService.findById(userId).map(User::getUsername).orElse(userId))
                    .setHeader("Username");

            memberGrid.addComponentColumn(userId -> {
                List<String> userRoleIds = server.getUserRoles().getOrDefault(userId, new ArrayList<>());
                String roleNames = userRoleIds.stream()
                        .map(roleId -> serverService.findRoleById(roleId).map(ServerRole::getName).orElse("Unknown"))
                        .collect(Collectors.joining(", "));
                return new Span(roleNames.isEmpty() ? "No Roles" : roleNames);
            }).setHeader("Roles");

            memberGrid
                    .addComponentColumn(userId -> new Button("Edit Roles", e -> openMemberRolesDialog(userId, server)));

            memberGrid.setItems(server.getMemberIds());
            content.add(memberGrid);
        });
    }

    private void openMemberRolesDialog(String userId, Server server) {
        com.vaadin.flow.component.dialog.Dialog dialog = new com.vaadin.flow.component.dialog.Dialog();
        CheckboxGroup<ServerRole> roleSelect = new CheckboxGroup<>("Assign Roles");
        List<ServerRole> availableRoles = roleService.getServerRoles(serverId);
        roleSelect.setItems(availableRoles);
        roleSelect.setItemLabelGenerator(ServerRole::getName);

        List<String> currentRoleIds = server.getUserRoles().getOrDefault(userId, new ArrayList<>());
        Set<ServerRole> currentRoles = new HashSet<>();
        for (String id : currentRoleIds) {
            serverService.findRoleById(id).ifPresent(currentRoles::add);
        }
        roleSelect.setValue(currentRoles);

        Button save = new Button("Save", e -> {
            List<String> newRoleIds = roleSelect.getValue().stream().map(ServerRole::getId)
                    .collect(Collectors.toList());
            server.getUserRoles().put(userId, newRoleIds);
            serverService.save(server);
            dialog.close();
            showMembers();
        });

        dialog.add(new VerticalLayout(new H3("Edit Roles for Member"), roleSelect, save));
        dialog.open();
    }
}
