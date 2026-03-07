package com.message.chat.WITS.view;

import com.message.chat.WITS.model.ChatGroup;
import com.message.chat.WITS.model.GroupRole;
import com.message.chat.WITS.model.Message;
import com.message.chat.WITS.model.Poll;
import com.message.chat.WITS.model.Event;
import com.message.chat.WITS.model.Reminder;
import com.message.chat.WITS.model.GroupActionRequest;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.GroupService;
import com.message.chat.WITS.service.MessageService;
import com.message.chat.WITS.service.GroupContentService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.datetimepicker.DateTimePicker;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.orderedlayout.FlexComponent.Alignment;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLink;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

import java.time.LocalDateTime;
import java.util.List;

@Route(value = "group-chat", layout = MainLayout.class)
@PageTitle("Group Chat | WITS Chat")
@PermitAll
public class GroupChatView extends VerticalLayout implements HasUrlParameter<String> {

    private final MessageService messageService;
    private final SecurityService securityService;
    private final GroupService groupService;
    private final GroupContentService contentService;
    private String groupId;
    private final VerticalLayout messagesLayout = new VerticalLayout();
    private final TextField messageInput = new TextField();
    private final TextField mediaInput = new TextField();
    private final H2 chatHeader = new H2("Group Chat");
    private final HorizontalLayout headerLayout = new HorizontalLayout();

    public GroupChatView(MessageService messageService, SecurityService securityService,
            GroupService groupService, GroupContentService contentService) {
        this.messageService = messageService;
        this.securityService = securityService;
        this.groupService = groupService;
        this.contentService = contentService;

        setSizeFull();
        messagesLayout.setSizeFull();
        messagesLayout.addClassNames(LumoUtility.Overflow.AUTO);

        messageInput.setPlaceholder("Message...");
        mediaInput.setPlaceholder("Media URL...");

        Button send = new Button("Send", e -> sendMessage());
        Button snapBtn = new Button("📸", e -> getUI().ifPresent(ui -> ui.navigate(SnapView.class)));
        Button requestBtn = new Button("Request Action", e -> showRequestDialog());
        Button manageContentBtn = new Button("Group Items", e -> showManageContentDialog());

        HorizontalLayout inputLayout = new HorizontalLayout(messageInput, mediaInput, snapBtn, send, requestBtn,
                manageContentBtn);
        inputLayout.setWidthFull();
        inputLayout.expand(messageInput);

        headerLayout.add(chatHeader);
        headerLayout.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        headerLayout.setWidthFull();

        add(headerLayout, messagesLayout, inputLayout);
    }

    private void showManageContentDialog() {
        Dialog dialog = new Dialog();
        dialog.add(new H2("Manage Group Content"));

        Button polls = new Button("Polls", e -> showContentGrid("POLLS"));
        Button events = new Button("Events", e -> showContentGrid("EVENTS"));
        Button reminders = new Button("Reminders", e -> showContentGrid("REMINDERS"));

        dialog.add(new HorizontalLayout(polls, events, reminders));
        dialog.open();
    }

    private void showContentGrid(String type) {
        Dialog dialog = new Dialog();
        dialog.setWidth("800px");
        VerticalLayout layout = new VerticalLayout(new H3(type));

        if (type.equals("POLLS")) {
            // Placeholder: In a real app, you'd fetch by groupId
            // Since we don't have getPollsByGroupId yet, we just show UI intent
            layout.add(new Paragraph("Poll management interface... (Needs Service extension)"));
        }
        // ... similar for events/reminders

        dialog.add(layout);
        dialog.open();
    }

    private void showRequestDialog() {
        Dialog dialog = new Dialog();
        ComboBox<String> type = new ComboBox<>("Type", "CREATE_POLL", "CREATE_EVENT", "CREATE_REMINDER");
        TextField details = new TextField("Details");
        Button submit = new Button("Submit Request", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                contentService.requestAction(groupId, u.getId(), type.getValue(), details.getValue());
                Notification.show("Request sent to admins!");
                dialog.close();
            });
        });
        dialog.add(new VerticalLayout(type, details, submit));
        dialog.open();
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        this.groupId = parameter;
        groupService.getGroup(groupId).ifPresent(group -> {
            chatHeader.setText("Group: " + group.getName());
            headerLayout.removeAll();
            headerLayout.add(chatHeader);
            headerLayout.add(new RouterLink("Manage Group", GroupManagementView.class, groupId));

            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                GroupRole role = group.getMembers().get(u.getId());
                if (role == GroupRole.ADMIN || role == GroupRole.SUBADMIN || role == GroupRole.SUBSUBADMIN) {
                    Button pollBtn = new Button("New Poll", e -> showPollDialog());
                    Button eventBtn = new Button("New Event", e -> showEventDialog());
                    headerLayout.add(pollBtn, eventBtn);

                    if (role == GroupRole.ADMIN || role == GroupRole.SUBADMIN) {
                        Button reminderBtn = new Button("New Reminder", e -> showReminderDialog());
                        headerLayout.add(reminderBtn);
                    }
                    headerLayout.add(new Button("View Requests", e -> showRequestsDialog()));
                }
            });
        });
        refreshMessages();
    }

    private void showPollDialog() {
        Dialog dialog = new Dialog();
        TextField question = new TextField("Question");
        TextField option1 = new TextField("Option 1");
        TextField option2 = new TextField("Option 2");
        Button create = new Button("Create Poll", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                contentService.createPoll(groupId, u.getId(), question.getValue(),
                        List.of(option1.getValue(), option2.getValue()));
                Notification.show("Poll created!");
                dialog.close();
            });
        });
        dialog.add(new VerticalLayout(new H3("Create Poll"), question, option1, option2, create));
        dialog.open();
    }

    private void showEventDialog() {
        Dialog dialog = new Dialog();
        TextField title = new TextField("Event Title");
        DateTimePicker time = new DateTimePicker("Date & Time");
        Button create = new Button("Create Event", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                contentService.createEvent(groupId, u.getId(), title.getValue(), time.getValue());
                Notification.show("Event created!");
                dialog.close();
            });
        });
        dialog.add(new VerticalLayout(new H3("Create Event"), title, time, create));
        dialog.open();
    }

    private void showReminderDialog() {
        Dialog dialog = new Dialog();
        TextField content = new TextField("Content");
        DateTimePicker time = new DateTimePicker("Time");
        Button create = new Button("Create Reminder", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(u -> {
                contentService.createReminder(groupId, u.getId(), content.getValue(), time.getValue());
                Notification.show("Reminder created!");
                dialog.close();
            });
        });
        dialog.add(new VerticalLayout(new H3("Create Reminder"), content, time, create));
        dialog.open();
    }

    private void showRequestsDialog() {
        Dialog dialog = new Dialog();
        Grid<GroupActionRequest> grid = new Grid<>(GroupActionRequest.class, false);
        grid.addColumn(GroupActionRequest::getRequesterId).setHeader("From");
        grid.addColumn(GroupActionRequest::getActionType).setHeader("Action");
        grid.addColumn(GroupActionRequest::getDetails).setHeader("Details");

        securityService.getAuthenticatedUserEntity().ifPresent(u -> {
            grid.setItems(contentService.getPendingRequests(groupId, u.getId()));
        });

        dialog.add(new VerticalLayout(new H2("Pending Requests"), grid));
        dialog.setWidth("600px");
        dialog.open();
    }

    private void sendMessage() {
        String content = messageInput.getValue();
        String media = mediaInput.getValue();
        if ((content == null || content.isEmpty()) && (media == null || media.isEmpty()))
            return;

        securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
            messageService.sendGroupMessage(currentUser.getId(), groupId, content, media);
            messageInput.clear();
            mediaInput.clear();
            refreshMessages();
        });
    }

    private void refreshMessages() {
        messagesLayout.removeAll();
        securityService.getAuthenticatedUserEntity().ifPresent(currentUser -> {
            List<Message> messages = messageService.getGroupMessages(groupId);
            for (Message msg : messages) {
                Div bubble = new Div(new Paragraph(msg.getContent()));
                bubble.addClassNames(LumoUtility.Padding.SMALL, LumoUtility.BorderRadius.MEDIUM,
                        LumoUtility.Margin.SMALL, LumoUtility.Position.RELATIVE);

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
