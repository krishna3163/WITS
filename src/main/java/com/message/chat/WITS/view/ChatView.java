package com.message.chat.WITS.view;

import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.Story;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.MessageService;
import com.message.chat.WITS.service.SnapService;
import com.message.chat.WITS.service.UserService;
import com.message.chat.WITS.repository.StoryRepository;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

import java.time.LocalDateTime;
import java.util.List;

@Route(value = "chat", layout = MainLayout.class)
@PageTitle("Chat | WITS Chat")
@PermitAll
public class ChatView extends VerticalLayout implements HasUrlParameter<String> {

    private final MessageService messageService;
    private final SecurityService securityService;
    private final UserService userService;
    private final SnapService snapService;
    private final StoryRepository storyRepository;

    private String recipientId;
    private final VerticalLayout messagesLayout = new VerticalLayout();
    private final TextField messageInput = new TextField();
    private final H2 chatHeader = new H2("Chat");
    private final HorizontalLayout storyBar = new HorizontalLayout();

    public ChatView(MessageService messageService, SecurityService securityService,
            UserService userService, SnapService snapService, StoryRepository storyRepository) {
        this.messageService = messageService;
        this.securityService = securityService;
        this.userService = userService;
        this.snapService = snapService;
        this.storyRepository = storyRepository;

        setSizeFull();
        addClassNames("chat-view");

        storyBar.setWidthFull();
        storyBar.setPadding(true);
        storyBar.addClassNames(LumoUtility.Background.CONTRAST_5, LumoUtility.BorderRadius.SMALL);
        storyBar.getStyle().set("overflow-x", "auto");

        messagesLayout.setSizeFull();
        messagesLayout.addClassNames(LumoUtility.Overflow.AUTO);

        messageInput.setWidthFull();
        Button send = new Button("Send", e -> sendMessage());
        Button snapBtn = new Button("📸", e -> getUI().ifPresent(ui -> ui.navigate(SnapView.class)));

        HorizontalLayout inputLayout = new HorizontalLayout(messageInput, snapBtn, send);
        inputLayout.setWidthFull();
        inputLayout.expand(messageInput);

        add(chatHeader, storyBar, messagesLayout, inputLayout);
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        this.recipientId = parameter;
        userService.findById(recipientId).ifPresent(user -> chatHeader.setText("Chat with " + user.getUsername()));
        refreshMessages();
        refreshStories();
    }

    private void refreshStories() {
        storyBar.removeAll();
        securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
            currentUser.getFriendIds().forEach(friendId -> {
                List<Story> activeStories = storyRepository.findByAuthorIdAndExpiryTimeAfter(friendId,
                        LocalDateTime.now());
                if (!activeStories.isEmpty()) {
                    userService.findById(friendId).ifPresent(friend -> {
                        Div bubble = new Div();
                        bubble.addClassNames(LumoUtility.Display.FLEX, LumoUtility.FlexDirection.COLUMN,
                                LumoUtility.AlignItems.CENTER);

                        Div icon = new Div();
                        icon.setWidth("50px");
                        icon.setHeight("50px");
                        icon.getStyle().set("border", "2px solid #ff4081");
                        icon.getStyle().set("border-radius", "50%");
                        icon.getStyle().set("background", "#eee");
                        icon.addClickListener(e -> showStory(activeStories.get(0)));

                        bubble.add(icon, new Span(friend.getUsername()));
                        storyBar.add(bubble);
                    });
                }
            });
        });
    }

    private void showStory(Story story) {
        Dialog dialog = new Dialog();
        Image img = new Image(story.getMediaUrl(), "Story");
        img.setMaxWidth("100%");
        dialog.add(new VerticalLayout(new H2(story.getCaption()), img));
        dialog.open();
    }

    private void sendMessage() {
        String content = messageInput.getValue();
        if (content == null || content.isEmpty())
            return;

        securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
            messageService.sendPrivateMessage(currentUser.getId(), recipientId, content, null);
            messageInput.clear();
            refreshMessages();
        });
    }

    private void refreshMessages() {
        messagesLayout.removeAll();
        securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
            List<Message> messages = messageService.getPrivateMessages(currentUser.getId(), recipientId);
            for (Message msg : messages) {
                Div bubble = new Div();
                bubble.addClassNames(LumoUtility.Padding.SMALL, LumoUtility.BorderRadius.MEDIUM,
                        LumoUtility.Margin.SMALL, LumoUtility.Position.RELATIVE);

                if (msg.isSnap()) {
                    Button viewSnap = new Button("View Snap 📸");
                    viewSnap.addClickListener(e -> {
                        showSnap(msg);
                        // Mock screenshot detection simulation
                        // snapService.notifyScreenshot(msg.getId());
                    });
                    bubble.add(viewSnap);
                    if (msg.isScreenshotDetected()) {
                        bubble.add(new Span(" (Screenshot detected! ⚠️)"));
                    }
                } else {
                    bubble.add(new Paragraph(msg.getContent()));
                }

                if (msg.getSenderId().equals(currentUser.getId())) {
                    bubble.addClassNames(LumoUtility.Background.PRIMARY_10, LumoUtility.AlignSelf.END);
                    ContextMenu menu = new ContextMenu(bubble);
                    menu.addItem("Edit", e -> showEditMessageDialog(msg));
                    menu.addItem("Delete", e -> {
                        messageService.deleteMessage(msg.getId(), currentUser.getId());
                        refreshMessages();
                    });
                } else {
                    bubble.addClassNames(LumoUtility.Background.CONTRAST_5, LumoUtility.AlignSelf.START);
                }
                messagesLayout.add(bubble);
            }
        });
    }

    private void showSnap(Message msg) {
        Dialog dialog = new Dialog();
        Image img = new Image(msg.getMediaUrl(), "Snap");
        img.setMaxWidth("100%");
        dialog.add(img);
        dialog.open();
        // Snap should disappear after closing?
        // In this demo, SnapService cleanup is scheduled, but we can also delete on
        // close
        dialog.addOpenedChangeListener(e -> {
            if (!e.isOpened()) {
                // messageService.deleteMessage(msg.getId(),
                // securityService.getAuthenticatedUserEntity().get().getId());
                // refreshMessages();
            }
        });
    }

    private void showEditMessageDialog(Message msg) {
        Dialog dialog = new Dialog();
        TextField editInput = new TextField("Edit Message", msg.getContent());
        Button save = new Button("Save", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                messageService.updateMessage(msg.getId(), u.getId(), editInput.getValue());
                refreshMessages();
                dialog.close();
            });
        });
        dialog.add(new VerticalLayout(editInput, save));
        dialog.open();
    }
}
