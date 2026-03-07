package com.message.chat.WITS.view;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.GroupService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

@Route(value = "create-group", layout = MainLayout.class)
@PageTitle("Create Group | WITS Chat")
@PermitAll
public class CreateGroupView extends VerticalLayout {

    public CreateGroupView(GroupService groupService, SecurityService securityService) {
        addClassName("create-group-view");
        setSizeFull();
        setAlignItems(Alignment.CENTER);

        TextField name = new TextField("Group Name");
        Button create = new Button("Create Group", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                ChatGroup group = groupService.createGroup(name.getValue(), user.getId());
                Notification.show("Group " + group.getName() + " created!");
                getUI().ifPresent(ui -> ui.navigate(GroupChatView.class, group.getId()));
            });
        });

        add(new H2("Create New Group"), name, create);
    }
}
