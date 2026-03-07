package com.message.chat.WITS.view;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.SnapService;
import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JavaScript;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.select.Select;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

import java.util.List;

@Route(value = "snap", layout = MainLayout.class)
@PageTitle("Snap | WITS Chat")
@PermitAll
@JavaScript("./camera.js")
public class SnapView extends VerticalLayout {

    private final SnapService snapService;
    private final UserService userService;
    private final SecurityService securityService;

    private final Div cameraContainer = new Div();
    private String capturedImageData; // Base64

    public SnapView(SnapService snapService, UserService userService, SecurityService securityService) {
        this.snapService = snapService;
        this.userService = userService;
        this.securityService = securityService;

        setAlignItems(Alignment.CENTER);
        setupUI();
    }

    private void setupUI() {
        add(new H2("Take a Snap"));

        cameraContainer.setId("camera-container");
        cameraContainer.getElement().getStyle().set("width", "100%");
        cameraContainer.getElement().getStyle().set("max-width", "500px");
        cameraContainer.getElement().getStyle().set("aspect-ratio", "3/4");
        cameraContainer.getElement().getStyle().set("background", "#333");
        cameraContainer.getElement().getStyle().set("border-radius", "20px");
        cameraContainer.getElement().getStyle().set("overflow", "hidden");
        cameraContainer.getElement().setProperty("innerHTML",
                "<video id='video' autoplay playsinline style='width: 100%; height: 100%; object-fit: cover;'></video><canvas id='canvas' style='display:none;'></canvas>");

        Button captureBtn = new Button("Capture", e -> capture());
        Button sendBtn = new Button("Send to Friend", e -> showSendDialog());
        Button storyBtn = new Button("Post to Story", e -> postToStory());

        add(cameraContainer, new HorizontalLayout(captureBtn, sendBtn, storyBtn));

        UI.getCurrent().getPage().executeJs("startCamera();");
    }

    private void capture() {
        UI.getCurrent().getPage().executeJs("capturePhoto()").then(String.class, result -> {
            this.capturedImageData = result;
            Notification.show("Captured!");
            // Switch view to show preview with editing?
        });
    }

    private void showSendDialog() {
        if (capturedImageData == null) {
            Notification.show("Take a photo first!");
            return;
        }

        com.vaadin.flow.component.dialog.Dialog selectFriendDialog = new com.vaadin.flow.component.dialog.Dialog();
        VerticalLayout layout = new VerticalLayout();

        Select<String> friendSelect = new Select<>();
        friendSelect.setLabel("Select Friend");
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            List<String> friendIds = user.getFriendIds().stream().toList();
            friendSelect.setItems(friendIds);
            friendSelect.setItemLabelGenerator(id -> userService.findById(id).map(User::getUsername).orElse(id));
        });

        Select<Integer> expirySelect = new Select<>();
        expirySelect.setLabel("Disappearing Timer");
        expirySelect.setItems(1, 30, 1440, 10080, 43200); // Minutes: 1, 30, 24h, 1w, 1mo
        expirySelect.setItemLabelGenerator(m -> {
            if (m < 60)
                return m + " min";
            if (m < 10080)
                return (m / 60) + " hours";
            return (m / 10080) + " weeks";
        });
        expirySelect.setValue(1440);

        Button confirmSend = new Button("Send Snap", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(sender -> {
                String friendId = friendSelect.getValue();
                if (friendId != null) {
                    snapService.sendSnap(sender.getId(), friendId, capturedImageData, Message.MessageType.SNAP_PHOTO,
                            expirySelect.getValue());
                    Notification.show("Snap sent!");
                    selectFriendDialog.close();
                }
            });
        });

        layout.add(friendSelect, expirySelect, confirmSend);
        selectFriendDialog.add(layout);
        selectFriendDialog.open();
    }

    private void postToStory() {
        if (capturedImageData == null) {
            Notification.show("Take a photo first!");
            return;
        }
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            snapService.postStory(user.getId(), capturedImageData, "My Story", 24);
            Notification.show("Posted to Story!");
        });
    }
}
