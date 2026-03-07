package com.message.chat.WITS.view;

import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.FriendService;
import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

@Route(value = "", layout = MainLayout.class)
@PageTitle("Explore Users | WITS Chat")
@PermitAll
public class ExploreUsersView extends VerticalLayout {

    private final UserService userService;
    private final FriendService friendService;
    private final SecurityService securityService;

    public ExploreUsersView(UserService userService, FriendService friendService, SecurityService securityService) {
        this.userService = userService;
        this.friendService = friendService;
        this.securityService = securityService;

        addClassName("explore-users-view");
        setSizeFull();

        add(new H2("Discover & Add Friends"));

        Grid<User> grid = new Grid<>(User.class, false);
        grid.addColumn(User::getUsername).setHeader("Username");
        grid.addColumn(User::getEmail).setHeader("Email");
        grid.addComponentColumn(user -> {
            Button sendRequest = new Button("Send Friend Request");
            sendRequest.addClickListener(e -> {
                String currentUserId = securityService.getAuthenticatedUserEntity().get().getId();
                friendService.sendFriendRequest(currentUserId, user.getId());
                Notification.show("Request sent to " + user.getUsername());
            });
            // Disable if already friends or self
            String currentUserId = securityService.getAuthenticatedUserEntity().get().getId();
            if (user.getId().equals(currentUserId) ||
                    securityService.getAuthenticatedUserEntity().get().getFriendIds().contains(user.getId())) {
                sendRequest.setEnabled(false);
            }
            return sendRequest;
        }).setHeader("Action");

        grid.setItems(userService.findAllUsers());
        add(grid);
    }
}
