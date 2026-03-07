package com.message.chat.WITS.view;

import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.model.Server;
import com.message.chat.WITS.service.ServerService;
import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.RouterLink;
import com.vaadin.flow.theme.lumo.LumoUtility;

import java.util.List;

public class MainLayout extends AppLayout {
    private final SecurityService securityService;
    private final ServerService serverService;

    public MainLayout(SecurityService securityService, ServerService serverService) {
        this.securityService = securityService;
        this.serverService = serverService;
        createHeader();
        createDrawer();
    }

    private void createHeader() {
        H1 logo = new H1("WITS Chat");
        logo.addClassNames(
                LumoUtility.FontSize.LARGE,
                LumoUtility.Margin.MEDIUM);

        String username = securityService.getAuthenticatedUser().getUsername();
        Button logout = new Button("Log out " + username, e -> securityService.logout());

        HorizontalLayout header = new HorizontalLayout(new DrawerToggle(), logo, logout);
        header.setDefaultVerticalComponentAlignment(FlexComponent.Alignment.CENTER);
        header.expand(logo);
        header.setWidthFull();
        header.addClassNames(
                LumoUtility.Padding.Vertical.NONE,
                LumoUtility.Padding.Horizontal.MEDIUM);

        addToNavbar(header);
    }

    private void createDrawer() {
        VerticalLayout nav = new VerticalLayout();
        nav.add(new RouterLink("Feed", FeedView.class),
                new RouterLink("Notifications", NotificationView.class),
                new RouterLink("Snap", SnapView.class),
                new RouterLink("Snap Map", SnapMapView.class),
                new RouterLink("Discover", ExploreUsersView.class),
                new RouterLink("Friends", FriendsView.class),
                new RouterLink("Create Group", CreateGroupView.class),
                new RouterLink("Create Server", CreateServerView.class),
                new RouterLink("Join Server", JoinServerView.class),
                new RouterLink("Mini Games 🎮", MiniGamesHubView.class),
                new RouterLink("My Profile", ProfileView.class,
                        securityService.getAuthenticatedUserEntity().get().getId()),
                new RouterLink("Help", HelpView.class));

        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            List<Server> servers = serverService.getUserServers(user.getId());
            if (!servers.isEmpty()) {
                nav.add(new Span("SERVERS"));
                for (Server server : servers) {
                    nav.add(new RouterLink(server.getName(), ServerView.class, server.getId()));
                }
            }
        });
        addToDrawer(nav);
    }
}
