package com.message.chat.WITS.view;

import com.message.chat.WITS.model.FriendRequest;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.FriendService;
import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

import java.util.List;
import java.util.stream.Collectors;

@Route(value = "friends", layout = MainLayout.class)
@PageTitle("Friends | WITS Chat")
@PermitAll
public class FriendsView extends VerticalLayout {

    private final FriendService friendService;
    private final UserService userService;
    private final SecurityService securityService;
    private final com.message.chat.WITS.repository.FriendshipRepository friendshipRepository;
    private final Grid<FriendRequest> requestsGrid = new Grid<>(FriendRequest.class, false);
    private final Grid<User> friendsGrid = new Grid<>(User.class, false);

    public FriendsView(FriendService friendService, UserService userService, SecurityService securityService,
            com.message.chat.WITS.repository.FriendshipRepository friendshipRepository) {
        this.friendService = friendService;
        this.userService = userService;
        this.securityService = securityService;
        this.friendshipRepository = friendshipRepository;

        addClassNames("friends-view");
        setSizeFull();

        add(new H2("Friend Requests"));
        configureRequestsGrid();
        add(requestsGrid);

        add(new H2("My Friends"));
        configureFriendsGrid();
        add(friendsGrid);

        refreshData();
    }

    private void configureRequestsGrid() {
        requestsGrid.addColumn(req -> userService.findById(req.getSenderId()).map(User::getUsername).orElse("Unknown"))
                .setHeader("Sender");
        requestsGrid.addColumn(FriendRequest::getTimestamp).setHeader("Date");
        requestsGrid.addComponentColumn(req -> {
            Button accept = new Button("Accept", e -> {
                friendService.acceptFriendRequest(req.getId());
                refreshData();
            });
            Button reject = new Button("Reject", e -> {
                friendService.rejectFriendRequest(req.getId());
                refreshData();
            });
            return new HorizontalLayout(accept, reject);
        }).setHeader("Actions");
    }

    private void configureFriendsGrid() {
        friendsGrid.addColumn(User::getUsername).setHeader("Username");

        friendsGrid.addComponentColumn(user -> {
            String currentUserId = securityService.getAuthenticatedUserEntity().get().getId();
            String id1 = currentUserId.compareTo(user.getId()) < 0 ? currentUserId : user.getId();
            String id2 = currentUserId.compareTo(user.getId()) < 0 ? user.getId() : currentUserId;

            int streak = friendshipRepository.findByUserId1AndUserId2(id1, id2)
                    .map(com.message.chat.WITS.model.Friendship::getStreakCount)
                    .orElse(0);

            Span streakSpan = new Span();
            if (streak > 0) {
                streakSpan.setText("🔥 " + streak);
                streakSpan.getElement().getStyle().set("color", "orange");
                streakSpan.getElement().getStyle().set("font-weight", "bold");
            }
            return streakSpan;
        }).setHeader("Streak");

        friendsGrid.addComponentColumn(user -> {
            Button chat = new Button("Chat", e -> {
                getUI().ifPresent(ui -> ui.navigate(ChatView.class, user.getId()));
            });
            return chat;
        }).setHeader("Action");
    }

    private void refreshData() {
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            requestsGrid.setItems(friendService.getPendingRequests(user.getId()));
            List<User> friends = user.getFriendIds().stream()
                    .map(userService::findById)
                    .filter(java.util.Optional::isPresent)
                    .map(java.util.Optional::get)
                    .collect(Collectors.toList());
            friendsGrid.setItems(friends);
        });
    }
}
