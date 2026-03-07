package com.message.chat.WITS.view;

import com.message.chat.WITS.model.Post;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.model.Notification.NotificationType;
import com.message.chat.WITS.security.SecurityService;
import com.message.chat.WITS.service.FeedService;
import com.message.chat.WITS.service.UserService;
import com.message.chat.WITS.service.NotificationService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.PermitAll;

import java.time.LocalDateTime;
import java.util.List;

@Route(value = "feed", layout = MainLayout.class)
@PageTitle("Feed | WITS Chat")
@PermitAll
public class FeedView extends VerticalLayout {

    private final SecurityService securityService;
    private final UserService userService;
    private final FeedService feedService;
    private final NotificationService notificationService;
    private final VerticalLayout feedContainer = new VerticalLayout();

    public FeedView(SecurityService securityService, UserService userService,
            FeedService feedService, NotificationService notificationService) {
        this.securityService = securityService;
        this.userService = userService;
        this.feedService = feedService;
        this.notificationService = notificationService;

        addClassNames("feed-view");
        setAlignItems(Alignment.CENTER);

        Div createPostCard = createCreatePostCard();
        createPostCard.setWidth("600px");

        feedContainer.setWidth("600px");
        feedContainer.setPadding(false);

        add(createPostCard, feedContainer);

        refreshFeed();
    }

    private Div createCreatePostCard() {
        Div card = new Div();
        card.addClassNames(LumoUtility.Background.BASE, LumoUtility.BoxShadow.SMALL,
                LumoUtility.Padding.MEDIUM, LumoUtility.BorderRadius.MEDIUM, LumoUtility.Margin.Bottom.MEDIUM);

        TextArea postInput = new TextArea();
        postInput.setPlaceholder("What's on your mind?");
        postInput.setWidthFull();

        Button postBtn = new Button("Post", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                Post post = Post.builder()
                        .authorId(user.getId())
                        .authorType(Post.PostAuthorType.USER)
                        .content(postInput.getValue())
                        .type(Post.PostType.TEXT)
                        .timestamp(LocalDateTime.now())
                        .build();
                feedService.createPost(post);
                postInput.clear();
                refreshFeed();
            });
        });
        postBtn.addClassNames(LumoUtility.Background.PRIMARY, LumoUtility.TextColor.PRIMARY_CONTRAST);

        HorizontalLayout actions = new HorizontalLayout(
                new Button("📷 Photo"),
                new Button("🎥 Video"),
                new Button("📊 Poll"));

        card.add(postInput, new HorizontalLayout(actions, postBtn));
        return card;
    }

    private void refreshFeed() {
        feedContainer.removeAll();
        securityService.getAuthenticatedUserEntity().ifPresent(user -> {
            List<Post> posts = feedService.getFeedForUser(user);
            posts.forEach(post -> feedContainer.add(createPostEntry(post)));
        });
    }

    private Div createPostEntry(Post post) {
        Div card = new Div();
        card.addClassNames(LumoUtility.Background.BASE, LumoUtility.BoxShadow.SMALL,
                LumoUtility.Padding.MEDIUM, LumoUtility.BorderRadius.MEDIUM, LumoUtility.Margin.Bottom.SMALL);
        card.setWidthFull();

        String authorName = post.getAuthorId(); // Should fetch real username
        if (post.getAuthorType() == Post.PostAuthorType.GROUP)
            authorName = "[Group] " + authorName;

        HorizontalLayout header = new HorizontalLayout(new Div(),
                new VerticalLayout(new Span(authorName), new Span(post.getTimestamp().toString())));
        header.setSpacing(true);

        Div body = new Div(new Span(post.getContent()));
        body.addClassNames(LumoUtility.Margin.Vertical.SMALL);

        if (post.getMediaUrls() != null && !post.getMediaUrls().isEmpty()) {
            Image img = new Image(post.getMediaUrls().get(0), "Post Image");
            img.setWidthFull();
            img.addClassNames(LumoUtility.BorderRadius.SMALL);
            body.add(img);
        }

        Button likeBtn = new Button("👍 Like (" + post.getLikerIds().size() + ")", e -> {
            securityService.getAuthenticatedUserEntity().ifPresent(user -> {
                if (!post.getLikerIds().contains(java.util.UUID.fromString(user.getId()))) {
                    post.getLikerIds().add(java.util.UUID.fromString(user.getId()));
                    feedService.createPost(post);
                    // Notify author
                    notificationService.sendNotification(
                            java.util.UUID.fromString(post.getAuthorId()),
                            NotificationType.LIKE,
                            "New Like",
                            user.getUsername() + " liked your post",
                            post.getId());
                    refreshFeed();
                }
            });
        });

        HorizontalLayout footer = new HorizontalLayout(likeBtn, new Button("💬 Comment"), new Button("🔗 Share"));
        card.add(header, body, footer);
        return card;
    }
}
