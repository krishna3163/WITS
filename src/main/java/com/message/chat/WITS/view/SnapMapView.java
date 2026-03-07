package com.message.chat.WITS.view;

import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JavaScript;
import com.vaadin.flow.component.dependency.StyleSheet;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

import java.util.stream.Collectors;

@Route(value = "snap-map", layout = MainLayout.class)
@PageTitle("Snap Map | WITS Chat")
@PermitAll
@JavaScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
@StyleSheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")
@JavaScript("./map-helper.js")
public class SnapMapView extends VerticalLayout {

    private final UserService userService;
    private final SecurityService securityService;

    public SnapMapView(UserService userService, SecurityService securityService) {
        this.userService = userService;
        this.securityService = securityService;

        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setupUI();
    }

    private void setupUI() {
        add(new H2("Snap Map"));

        Div mapDiv = new Div();
        mapDiv.setId("map-container");
        mapDiv.setSizeFull();
        mapDiv.getElement().getStyle().set("min-height", "500px");
        mapDiv.getElement().getStyle().set("width", "100%");
        mapDiv.getElement().getStyle().set("border-radius", "10px");
        mapDiv.getElement().getStyle().set("box-shadow", "0 4px 6px rgba(0,0,0,0.1)");

        add(mapDiv);

        Button updateLocBtn = new Button("Update My Location", e -> updateMyLocation());
        add(updateLocBtn);

        UI.getCurrent().getPage().executeJs("initMap();");
        refreshFriendMarkers();
    }

    private void updateMyLocation() {
        UI.getCurrent().getPage().executeJs("updateMyLocation()").then(String.class, res -> {
            // JS will handle the actual geolocation call and send it back via a server-side
            // method if needed
            // Or we just update the markers
            refreshFriendMarkers();
        });
    }

    private void refreshFriendMarkers() {
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            user.getFriendIds().forEach(friendId -> {
                userService.findById(friendId).ifPresent(friend -> {
                    if (friend.getLatitude() != 0 && friend.getLongitude() != 0) {
                        UI.getCurrent().getPage().executeJs("addFriendMarker($0, $1, $2)",
                                friend.getLatitude(), friend.getLongitude(), friend.getUsername());
                    }
                });
            });
        });
    }
}
