package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Comment;
import com.message.chat.WITS.model.Moment;
import com.message.chat.WITS.model.User;
import com.message.chat.WITS.repository.MomentRepository;
import com.message.chat.WITS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MomentService {
    private final MomentRepository momentRepository;
    private final UserRepository userRepository;

    public Moment postMoment(String authorId, String caption, List<String> imageUrls, String location,
            boolean isPublic) {
        Moment moment = Moment.builder()
                .authorId(authorId)
                .caption(caption)
                .imageUrls(imageUrls != null ? imageUrls : new ArrayList<>())
                .timestamp(LocalDateTime.now())
                .location(location)
                .isPublic(isPublic)
                .build();
        return momentRepository.save(moment);
    }

    public List<Moment> getFriendMoments(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<String> authorIds = new ArrayList<>(user.getFriendIds());
        authorIds.add(userId); // include self

        return momentRepository.findByAuthorIdInOrderByTimestampDesc(authorIds).stream()
                .filter(m -> m.isPublic() || m.getAuthorId().equals(userId)
                        || user.getFriendIds().contains(m.getAuthorId()))
                .collect(Collectors.toList());
    }

    public void likeMoment(String momentId, String userId) {
        momentRepository.findById(momentId).ifPresent(moment -> {
            moment.getLikedBy().add(userId);
            momentRepository.save(moment);
        });
    }

    public void commentOnMoment(String momentId, String authorId, String text) {
        momentRepository.findById(momentId).ifPresent(moment -> {
            Comment comment = new Comment();
            comment.setId(UUID.randomUUID().toString());
            comment.setAuthorId(authorId);
            comment.setContent(text);
            comment.setTimestamp(LocalDateTime.now());
            moment.getComments().add(comment);
            momentRepository.save(moment);
        });
    }
}
