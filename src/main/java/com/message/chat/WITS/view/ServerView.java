package com.message.chat.WITS.view;

import com.message.chat.WITS.model.Channel;
import com.message.chat.WITS.model.ChannelType;
import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.Permission;
import com.message.chat.WITS.service.ChannelService;
import com.message.chat.WITS.service.MessageService;
import com.message.chat.WITS.service.ServerService;
import com.message.chat.WITS.security.SecurityService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.OptionalParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

import java.util.List;

@Route(value = "server", layout = MainLayout.class)
@PageTitle("Server | WITS Chat")
@PermitAll
public class ServerView extends HorizontalLayout implements HasUrlParameter<String> {

    private final ServerService serverService;
    private final ChannelService channelService;
    private final MessageService messageService;
    private final SecurityService securityService;

    private String serverId;
    private String activeChannelId;

    private final VerticalLayout channelSidebar = new VerticalLayout();
    private final VerticalLayout chatArea = new VerticalLayout();
    private final VerticalLayout messagesLayout = new VerticalLayout();
    private final TextField messageInput = new TextField();
    private final H2 channelHeader = new H2("Select a channel");

    public ServerView(ServerService serverService, ChannelService channelService,
            MessageService messageService, SecurityService securityService) {
        this.serverService = serverService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.securityService = securityService;

        setSizeFull();
        setSpacing(false);

        setupSidebar();
        setupChatArea();

        add(channelSidebar, chatArea);
        setFlexGrow(1, chatArea);
    }

    private void setupSidebar() {
        channelSidebar.setWidth("260px");
        channelSidebar.setHeightFull();
        channelSidebar.addClassNames(LumoUtility.Background.CONTRAST_5, LumoUtility.Padding.SMALL);
    }

    private void setupChatArea() {
        chatArea.setSizeFull();
        messagesLayout.setSizeFull();
        messagesLayout.addClassNames(LumoUtility.Overflow.AUTO);

        Button snapBtn = new Button("📸", e -> getUI().ifPresent(ui -> ui.navigate(SnapView.class)));
        HorizontalLayout inputLayout = new HorizontalLayout(messageInput, snapBtn,
                new Button("Send", e -> sendMessage()));
        inputLayout.setWidthFull();
        inputLayout.expand(messageInput);

        chatArea.add(channelHeader, messagesLayout, inputLayout);
    }

    @Override
    public void setParameter(BeforeEvent event, @OptionalParameter String parameter) {
        if (parameter != null) {
            this.serverId = parameter;
            refreshSidebar();
        }
    }

    private void refreshSidebar() {
        channelSidebar.removeAll();
        serverService.findById(serverId).ifPresent(server -> {
            HorizontalLayout header = new HorizontalLayout(new H2(server.getName()));
            header.setWidthFull();
            header.setAlignItems(Alignment.CENTER);

            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                if (serverService.hasPermission(serverId, user.getId(), Permission.MANAGE_SERVER)) {
                    Button settingsBtn = new Button(VaadinIcon.COG.create(),
                            e -> getUI().ifPresent(ui -> ui.navigate(ServerSettingsView.class, serverId)));
                    header.add(settingsBtn);
                }
            });
            channelSidebar.add(header);

            List<Channel> channels = channelService.getChannels(serverId);
            for (Channel channel : channels) {
                Button channelBtn = new Button("# " + channel.getName(), e -> selectChannel(channel));
                channelBtn.setWidthFull();
                channelBtn.addClassNames(LumoUtility.JustifyContent.START);
                if (channel.getType() == ChannelType.VOICE) {
                    channelBtn.setIcon(VaadinIcon.PHONE.create());
                } else if (channel.getType() == ChannelType.STAGE) {
                    channelBtn.setIcon(VaadinIcon.MICROPHONE.create());
                }
                channelSidebar.add(channelBtn);
            }

            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                if (serverService.hasPermission(serverId, user.getId(), Permission.MANAGE_CHANNELS)) {
                    Button addChannelBtn = new Button("Add Channel", VaadinIcon.PLUS.create(),
                            e -> showAddChannelDialog());
                    addChannelBtn.setWidthFull();
                    channelSidebar.add(addChannelBtn);
                }
            });
        });
    }

    private void showAddChannelDialog() {
        com.vaadin.flow.component.dialog.Dialog dialog = new com.vaadin.flow.component.dialog.Dialog();
        TextField nameField = new TextField("Channel Name");
        com.vaadin.flow.component.select.Select<ChannelType> typeSelect = new com.vaadin.flow.component.select.Select<>();
        typeSelect.setLabel("Type");
        typeSelect.setItems(ChannelType.values());
        typeSelect.setValue(ChannelType.TEXT);

        Button createBtn = new Button("Create", e -> {
            channelService.createChannel(serverId, nameField.getValue(), typeSelect.getValue());
            dialog.close();
            refreshSidebar();
        });

        dialog.add(new VerticalLayout(nameField, typeSelect, createBtn));
        dialog.open();
    }

    private void selectChannel(Channel channel) {
        this.activeChannelId = channel.getId();
        channelHeader.setText("# " + channel.getName());
        refreshMessages();

        // Permissions check for sending messages
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            boolean canSend = channelService.hasPermission(activeChannelId, user.getId(), Permission.SEND_MESSAGES,
                    serverService);
            messageInput.setEnabled(canSend);
            messageInput.setPlaceholder(
                    canSend ? "Message #" + channel.getName() : "You do not have permission to send messages here.");
        });
    }

    private void sendMessage() {
        String content = messageInput.getValue();
        if (content == null || content.isEmpty() || activeChannelId == null)
            return;

        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            messageService.sendGroupMessage(user.getId(), activeChannelId, content, null);
            messageInput.clear();
            refreshMessages();
        });
    }

    private void refreshMessages() {
        messagesLayout.removeAll();
        if (activeChannelId == null)
            return;

        List<Message> messages = messageService.getGroupMessages(activeChannelId);
        for (Message msg : messages) {
            Span sender = new Span(msg.getSenderId() != null ? msg.getSenderId().toString() : "System"); // Should fetch username
            sender.addClassNames(LumoUtility.FontSize.SMALL, LumoUtility.TextColor.SECONDARY);
            VerticalLayout msgLayout = new VerticalLayout(sender, new Span(msg.getContent()));
            msgLayout.setSpacing(false);
            msgLayout.setPadding(false);
            messagesLayout.add(msgLayout);
        }
    }
}
