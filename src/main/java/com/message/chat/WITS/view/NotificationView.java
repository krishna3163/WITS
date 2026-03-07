package com.message.chat.WITS.view;

import com.message.chat.WITS.model.Notification;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.NotificationService;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

import java.util.List;

@Route(value = "notifications", layout = MainLayout.class)
@PageTitle("Notifications | WITS Chat")
@PermitAll
public class NotificationView extends VerticalLayout {

    private final NotificationService notificationService;
    private final SecurityService securityService;
    private final VerticalLayout container = new VerticalLayout();

    public NotificationView(NotificationService notificationService, SecurityService securityService) {
        this.notificationService = notificationService;
        this.securityService = securityService;

        addClassNames("notifications-view");
        setAlignItems(Alignment.CENTER);

        H2 header = new H2("Notifications");
        container.setWidth("600px");

        add(header, container);

        refreshNotifications();

        // Mark all as read when user opens this page
        securityService.getAuthenticatedUserEntity().ifPresent(user -> notificationService.markAllRead(user.getId()));
    }

    private void refreshNotifications() {
        container.removeAll();
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            List<Notification> notifications = notificationService.getUserNotifications(java.util.UUID.fromString(user.getId()));
            if (notifications.isEmpty()) {
                container.add(new Span("No notifications yet!"));
            } else {
                notifications.forEach(n -> container.add(createNotificationItem(n)));
            }
        });
    }

    private Div createNotificationItem(Notification n) {
        Div item = new Div();
        item.addClassNames(LumoUtility.Background.BASE, LumoUtility.BoxShadow.SMALL,
                LumoUtility.Padding.MEDIUM, LumoUtility.BorderRadius.MEDIUM, LumoUtility.Margin.Bottom.SMALL);
        item.setWidthFull();

        if (!n.getIsRead()) {
            item.addClassNames(LumoUtility.Background.CONTRAST_5);
        }

        Span message = new Span(n.getContent());
        Span time = new Span(n.getCreatedAt().toString());
        time.addClassNames(LumoUtility.FontSize.SMALL, LumoUtility.TextColor.SECONDARY);

        VerticalLayout content = new VerticalLayout(message, time);
        content.setPadding(false);
        content.setSpacing(false);

        item.add(content);
        return item;
    }
}
