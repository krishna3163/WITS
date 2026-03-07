package com.message.chat.WITS.view;

import com.message.chat.WITS.service.ServerService;
import com.message.chat.WITS.security.SecurityService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

@Route(value = "join-server", layout = MainLayout.class)
@PageTitle("Join Server | WITS Chat")
@PermitAll
public class JoinServerView extends VerticalLayout {

    public JoinServerView(ServerService serverService, SecurityService securityService) {
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);

        TextField serverIdField = new TextField("Server ID / Invite Code");
        Button joinBtn = new Button("Join Server", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                serverService.findById(serverIdField.getValue()).ifPresentOrElse(server -> {
                    if (server.getMemberIds().contains(user.getId())) {
                        Notification.show("You are already a member of this server.");
                    } else {
                        server.getMemberIds().add(user.getId());
                        serverService.save(server);
                        Notification.show("Joined " + server.getName());
                        getUI().ifPresent(ui -> ui.navigate(ServerView.class, server.getId()));
                    }
                }, () -> Notification.show("Server not found."));
            });
        });

        add(serverIdField, joinBtn);
    }
}
