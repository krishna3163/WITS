package com.message.chat.WITS.view;

import com.message.chat.WITS.service.ServerService;
import com.message.chat.WITS.security.SecurityService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

@Route(value = "create-server", layout = MainLayout.class)
@PageTitle("Create Server | WITS Chat")
@PermitAll
public class CreateServerView extends VerticalLayout {

    public CreateServerView(ServerService serverService, SecurityService securityService) {
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);

        TextField name = new TextField("Server Name");
        TextArea description = new TextArea("Description");
        Button create = new Button("Create Server", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                serverService.createServer(name.getValue(), user.getId());
                Notification.show("Server created!");
                getUI().ifPresent(ui -> ui.navigate(ExploreUsersView.class)); // Refreshes MainLayout too
            });
        });

        add(name, description, create);
    }
}
