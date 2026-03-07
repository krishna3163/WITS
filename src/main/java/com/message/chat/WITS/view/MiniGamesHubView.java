package com.message.chat.WITS.view;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Route(value = "mini-games", layout = MainLayout.class)
@PageTitle("Mini Games | WITS Chat")
@PermitAll
public class MiniGamesHubView extends VerticalLayout {

    private final List<String> GAMES = Arrays.asList(
            "Truth or Dare", "Spin the Wheel", "Would You Rather", "Never Have I Ever",
            "Rapid Fire Questions", "Guess the Word", "Emoji Guess", "5-Second Rule",
            "Random Challenge", "Dare Dice", "Lucky Number", "Secret Task", "Mystery Box",
            "Hot Seat", "Yes or No Game", "Act It Out", "Word Chain", "Tongue Twister Challenge",
            "Memory Match", "Quick Quiz", "Fake or Real", "Riddle Me This", "Who Am I",
            "Charades", "Story Builder", "Song Guess", "Odd One Out", "Picture Guess",
            "Last Letter Game", "Lucky Spin 🎡");

    public MiniGamesHubView() {
        setSizeFull();
        setAlignItems(Alignment.CENTER);

        H1 title = new H1("Mini Games Hub");
        title.addClassNames(LumoUtility.Margin.Top.XLARGE, LumoUtility.Margin.Bottom.MEDIUM);

        Paragraph subtitle = new Paragraph("Discover and play right from the Super App!");
        subtitle.addClassNames(LumoUtility.TextColor.SECONDARY, LumoUtility.Margin.Bottom.LARGE);

        FlexLayout gamesContainer = new FlexLayout();
        gamesContainer.setFlexWrap(FlexLayout.FlexWrap.WRAP);
        gamesContainer.setJustifyContentMode(JustifyContentMode.CENTER);
        gamesContainer.setWidth("100%");
        gamesContainer.setMaxWidth("1200px");
        gamesContainer.getStyle().set("gap", "20px");

        // Add scroll to make sure games container can scroll if there are many
        gamesContainer.addClassNames(LumoUtility.Overflow.AUTO);

        for (String game : GAMES) {
            gamesContainer.add(createGameCard(game));
        }

        add(title, subtitle, gamesContainer);
    }

    private VerticalLayout createGameCard(String gameName) {
        VerticalLayout card = new VerticalLayout();
        card.setWidth("200px");
        card.setHeight("180px");
        card.addClassNames(
                LumoUtility.Background.CONTRAST_5,
                LumoUtility.BorderRadius.LARGE,
                LumoUtility.Padding.LARGE,
                LumoUtility.BoxShadow.SMALL);
        card.setAlignItems(Alignment.CENTER);
        card.setJustifyContentMode(JustifyContentMode.CENTER);

        Span icon = new Span(getIconForGame(gameName));
        icon.addClassNames(LumoUtility.FontSize.XXLARGE, LumoUtility.Margin.Bottom.MEDIUM);

        H3 name = new H3(gameName);
        name.addClassNames(LumoUtility.Margin.NONE, LumoUtility.TextAlignment.CENTER);
        name.getStyle().set("font-size", "1.1rem");

        card.add(icon, name);

        // Hover and cursor effects
        card.getStyle().set("cursor", "pointer");
        card.getStyle().set("transition", "transform 0.2s, box-shadow 0.2s");

        card.addClickListener(e -> openGameDialog(gameName));

        return card;
    }

    private String getIconForGame(String name) {
        if (name.contains("Truth"))
            return "🎭";
        if (name.contains("Spin") || name.contains("Wheel"))
            return "🎡";
        if (name.contains("Card") || name.contains("Dare"))
            return "🏌️";
        if (name.contains("Guess") || name.contains("Quiz") || name.contains("Riddle"))
            return "🧠";
        if (name.contains("Emoji"))
            return "😎";
        if (name.contains("Word") || name.contains("Letter"))
            return "📚";
        if (name.contains("Memory"))
            return "🧩";
        return "🎮";
    }

    private void openGameDialog(String gameName) {
        Dialog dialog = new Dialog();
        dialog.setWidth("400px");
        dialog.setHeight("400px");

        VerticalLayout layout = new VerticalLayout();
        layout.setSizeFull();
        layout.setAlignItems(Alignment.CENTER);
        layout.setJustifyContentMode(JustifyContentMode.CENTER);

        H2 title = new H2(gameName);

        switch (gameName) {
            case "Truth or Dare":
                setupTruthOrDare(layout);
                break;
            case "Lucky Spin 🎡":
            case "Spin the Wheel":
                setupSpinTheWheel(layout, gameName);
                break;
            default:
                setupComingSoon(layout, gameName);
        }

        Button close = new Button("Close", e -> dialog.close());
        close.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

        dialog.add(title, layout, close);
        dialog.open();
    }

    private void setupComingSoon(VerticalLayout layout, String gameName) {
        Paragraph p = new Paragraph("This mini-app is currently under development!");
        Span icon = new Span("🚧");
        icon.addClassNames(LumoUtility.FontSize.XXLARGE);
        layout.add(icon, p);
    }

    private void setupTruthOrDare(VerticalLayout layout) {
        Paragraph result = new Paragraph("Select Truth or Dare!");
        result.addClassNames(LumoUtility.FontSize.LARGE, LumoUtility.FontWeight.BOLD, LumoUtility.TextAlignment.CENTER);

        Button truthBtn = new Button("Truth", e -> {
            String[] truths = {
                    "What is your biggest fear?", "What is an embarrassing secret?",
                    "Who do you have a crush on?", "What's the worst lie you've ever told?"
            };
            result.setText(truths[new Random().nextInt(truths.length)]);
        });
        truthBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        Button dareBtn = new Button("Dare", e -> {
            String[] dares = {
                    "Do 10 pushups right now.", "Send a random emoji to your 3rd contact.",
                    "Try to lick your elbow.", "Speak in an accent for the next 5 minutes."
            };
            result.setText(dares[new Random().nextInt(dares.length)]);
        });
        dareBtn.addThemeVariants(ButtonVariant.LUMO_ERROR, ButtonVariant.LUMO_PRIMARY);

        HorizontalLayout buttons = new HorizontalLayout(truthBtn, dareBtn);
        layout.add(result, buttons);
    }

    private void setupSpinTheWheel(VerticalLayout layout, String game) {
        Paragraph result = new Paragraph("Spin to win!");
        result.addClassNames(LumoUtility.FontSize.XLARGE, LumoUtility.FontWeight.BOLD);

        Button spinBtn = new Button("Spin!", e -> {
            String[] prizes = {
                    "100 WITS Coins!", "You got nothing.", "Free Mini-App Voucher!",
                    "Try again!", "Custom Profile Badge"
            };
            result.setText("Spinning...");
            UI.getCurrent().getPage().executeJs("setTimeout(function() { $0.innerText = $1; }, 1000);",
                    result.getElement(), prizes[new Random().nextInt(prizes.length)]);
        });
        spinBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SUCCESS);
        layout.add(result, spinBtn);
    }
}
