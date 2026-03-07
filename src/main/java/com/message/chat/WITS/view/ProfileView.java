package com.message.chat.WITS.view;

import com.message.chat.WITS.model.PrivacySetting;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.FriendService;
import com.message.chat.WITS.service.UserService;
import com.message.chat.WITS.view.MainLayout;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent.Alignment;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.HasValue;
import jakarta.annotation.security.PermitAll;

@Route(value = "profile", layout = MainLayout.class)
@PageTitle("User Profile | WITS Chat")
@PermitAll
public class ProfileView extends VerticalLayout implements HasUrlParameter<String> {

    private final UserService userService;
    private final SecurityService securityService;
    private final FriendService friendService;

    private final H2 usernameHeader = new H2("Profile");
    private final Image profileImage = new Image();
    private final Paragraph fullNamePara = new Paragraph();
    private final Paragraph emailPara = new Paragraph();
    private final Paragraph dobPara = new Paragraph();
    private final Paragraph bioPara = new Paragraph();
    private final HorizontalLayout statsRow = new HorizontalLayout();
    private final Paragraph educationPara = new Paragraph();
    private final Paragraph workPara = new Paragraph();
    private final HorizontalLayout highlightsRow = new HorizontalLayout();
    private final HorizontalLayout snapsRow = new HorizontalLayout();
    private final VerticalLayout galleryLayout = new VerticalLayout();

    private final VerticalLayout settingsLayout = new VerticalLayout();
    private String profileUserId;

    public ProfileView(UserService userService, SecurityService securityService, FriendService friendService) {
        this.userService = userService;
        this.securityService = securityService;
        this.friendService = friendService;

        addClassName("profile-view");
        setAlignItems(Alignment.CENTER);

        profileImage.setWidth("150px");
        profileImage.setHeight("150px");
        profileImage.addClassNames("rounded-full", "border-2", "border-primary");

        add(usernameHeader, profileImage, statsRow, fullNamePara, emailPara, dobPara, bioPara,
                new H3("Highlights"), highlightsRow, new H3("Recent Snaps"), snapsRow, settingsLayout);
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        this.profileUserId = parameter;
        refreshProfile();
    }

    private void refreshProfile() {
        userService.findById(profileUserId).ifPresent(user -> {
            securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
                boolean isOwner = currentUser.getId().equals(user.getId());
                boolean isFriend = currentUser.getFriendIds().contains(user.getId());

                usernameHeader.setText(user.getUsername());
                updateStatsRow(user);
                updateHighlightsRow(user);
                updateSnapsRow(user);

                // Visibility Logic
                fullNamePara.setText("Name: "
                        + (shouldShow(user.getPrivacy().getNamePrivacy(), isOwner, isFriend) ? user.getFullName()
                                : "[Private]"));
                emailPara.setText("Email: "
                        + (shouldShow(user.getPrivacy().getEmailPrivacy(), isOwner, isFriend) ? user.getEmail()
                                : "[Private]"));
                dobPara.setText("DOB: " + (shouldShow(user.getPrivacy().getDobPrivacy(), isOwner, isFriend)
                        ? (user.getDob() != null ? user.getDob().toString() : "N/A")
                        : "[Private]"));
                bioPara.setText("Bio: " + (shouldShow(user.getPrivacy().getBioPrivacy(), isOwner, isFriend)
                        ? (user.getBio() != null ? user.getBio() : "No bio.")
                        : "[Private]"));

                if (shouldShow(user.getPrivacy().getProfilePicPrivacy(), isOwner, isFriend)
                        && user.getProfilePictureUrl() != null) {
                    profileImage.setSrc(user.getProfilePictureUrl());
                } else {
                    profileImage.setSrc("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername());
                }

                if (isOwner) {
                    showSettings(user);
                } else {
                    settingsLayout.removeAll();
                }
            });
        });
    }

    private void updateStatsRow(User user) {
        statsRow.removeAll();
        statsRow.add(new VerticalLayout(new Span(String.valueOf(user.getFollowerIds().size())), new Span("followers")));
        statsRow.add(
                new VerticalLayout(new Span(String.valueOf(user.getFollowingIds().size())), new Span("following")));
        statsRow.add(new VerticalLayout(new Span("0"), new Span("posts"))); // Placeholder for post count
    }

    private void updateHighlightsRow(User user) {
        highlightsRow.removeAll();
        if (user.getHighlightIds().isEmpty()) {
            highlightsRow.add(new Span("No highlights."));
        } else {
            user.getHighlightIds().forEach(h -> highlightsRow.add(new Button("Highlight")));
        }
    }

    private void updateSnapsRow(User user) {
        snapsRow.removeAll();
        if (user.getSnapIds().isEmpty()) {
            snapsRow.add(new Span("No recent snaps."));
        } else {
            user.getSnapIds().forEach(s -> snapsRow.add(new Image("https://via.placeholder.com/100", "Snap")));
        }
    }

    private boolean shouldShow(PrivacySetting setting, boolean isOwner, boolean isFriend) {
        if (isOwner)
            return true;
        if (setting == null)
            return true;
        return switch (setting) {
            case PUBLIC -> true;
            case FRIENDS -> isFriend;
            case PRIVATE -> false;
        };
    }

    private void showSettings(User user) {
        settingsLayout.removeAll();
        settingsLayout.add(new H3("Privacy Settings"));

        settingsLayout.add(createPrivacyRow("Name Visibility", user.getPrivacy().getNamePrivacy(),
                val -> user.getPrivacy().setNamePrivacy(val)));
        settingsLayout.add(createPrivacyRow("Email Visibility", user.getPrivacy().getEmailPrivacy(),
                val -> user.getPrivacy().setEmailPrivacy(val)));
        settingsLayout.add(createPrivacyRow("DOB Visibility", user.getPrivacy().getDobPrivacy(),
                val -> user.getPrivacy().setDobPrivacy(val)));
        settingsLayout.add(createPrivacyRow("Bio Visibility", user.getPrivacy().getBioPrivacy(),
                val -> user.getPrivacy().setBioPrivacy(val)));

        Button save = new Button("Save Settings", e -> {
            userService.save(user);
            Notification.show("Settings saved!");
            refreshProfile();
        });
        settingsLayout.add(save);
    }

    private HorizontalLayout createPrivacyRow(String label, PrivacySetting current,
            java.util.function.Consumer<PrivacySetting> setter) {
        ComboBox<PrivacySetting> combo = new ComboBox<>(label, PrivacySetting.values());
        combo.setValue(current);
        combo.addValueChangeListener(e -> setter.accept(e.getValue()));
        return new HorizontalLayout(combo);
    }
}
