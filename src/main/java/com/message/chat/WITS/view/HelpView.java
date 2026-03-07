package com.message.chat.WITS.view;

import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

@Route(value = "help", layout = MainLayout.class)
@PageTitle("Help | WITS Chat")
@PermitAll
public class HelpView extends VerticalLayout {

    public HelpView() {
        setAlignItems(Alignment.START);
        setPadding(true);
        setMaxWidth("800px");
        getElement().getStyle().set("margin", "0 auto");

        add(new H1("WITS Chat Help System"));

        section("User Profiles & Privacy",
                "You can manage your personal information and who can see it. Go to 'My Profile' to set visibility for your Name, Email, DOB, and Bio. "
                        +
                        "Visibility options include PUBLIC, FRIENDS (only people you've added), and PRIVATE (only you).");

        section("Message Editing & Deletion",
                "Right-click on any message you've sent (or long-press on mobile) to see options to Edit or Delete it. "
                        +
                        "Edited messages will update for everyone in the chat.");

        section("Group Roles & Permissions",
                "Groups have a hierarchy: Admin -> Subadmin -> Subsubadmin -> Member. " +
                        "Admins and Subadmins can manage members and create group-wide items like Reminders. " +
                        "Subsubadmins can also create Polls and Events.");

        section("Collective Group Content",
                "In a group, anyone can view and interact with Polls, Events, and Reminders. " +
                        "To manage these items (Edit/Delete), use the 'Group Items' button in the chat interface. " +
                        "This allows for collective management of group tasks and gatherings.");
    }

    private void section(String title, String content) {
        VerticalLayout layout = new VerticalLayout();
        layout.setPadding(false);
        layout.setSpacing(false);
        layout.addClassNames(LumoUtility.Margin.Bottom.LARGE);

        H2 header = new H2(title);
        header.addClassNames(LumoUtility.FontSize.XLARGE, LumoUtility.TextColor.PRIMARY);

        Paragraph p = new Paragraph(content);
        p.addClassNames(LumoUtility.FontSize.MEDIUM);

        layout.add(header, p);
        add(layout);
    }
}
