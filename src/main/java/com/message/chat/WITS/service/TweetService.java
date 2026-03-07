package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Tweet;
import com.message.chat.WITS.model.TrendingTopic;
import com.message.chat.WITS.repository.TweetRepository;
import com.message.chat.WITS.repository.TrendingTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TweetService {

    private final TweetRepository tweetRepository;
    private final TrendingTopicRepository trendingTopicRepository;

    public Tweet postTweet(Tweet tweet) {
        tweet.setTimestamp(LocalDateTime.now());
        extractAndSaveHashtags(tweet);
        return tweetRepository.save(tweet);
    }

    private void extractAndSaveHashtags(Tweet tweet) {
        Pattern pattern = Pattern.compile("#(\\w+)");
        Matcher matcher = pattern.matcher(tweet.getContent());
        while (matcher.find()) {
            String tag = matcher.group(1);
            tweet.getHashtagNames().add(tag);
            updateTrendingTopic(tag);
        }
    }

    private void updateTrendingTopic(String tag) {
        trendingTopicRepository.findByHashtag(tag).ifPresentOrElse(topic -> {
            topic.setUsageCount(topic.getUsageCount() + 1);
            topic.setLastUsedAt(LocalDateTime.now());
            trendingTopicRepository.save(topic);
        }, () -> {
            trendingTopicRepository.save(TrendingTopic.builder()
                    .hashtag(tag)
                    .usageCount(1)
                    .windowStart(LocalDateTime.now())
                    .lastUsedAt(LocalDateTime.now())
                    .build());
        });
    }

    public void upvoteTweet(String tweetId, String userId) {
        tweetRepository.findById(tweetId).ifPresent(tweet -> {
            tweet.getUpvoterIds().add(userId);
            tweet.getDownvoterIds().remove(userId);
            tweetRepository.save(tweet);
        });
    }

    public void downvoteTweet(String tweetId, String userId) {
        tweetRepository.findById(tweetId).ifPresent(tweet -> {
            tweet.getDownvoterIds().add(userId);
            tweet.getUpvoterIds().remove(userId);
            tweetRepository.save(tweet);
        });
    }

    public void addComment(String tweetId, com.message.chat.WITS.model.Comment comment) {
        tweetRepository.findById(tweetId).ifPresent(tweet -> {
            if (comment.getId() == null)
                comment.setId(java.util.UUID.randomUUID().toString());
            comment.setTimestamp(LocalDateTime.now());
            tweet.getComments().add(comment);
            tweetRepository.save(tweet);
        });
    }

    public void addReplyToComment(String tweetId, String parentCommentId, com.message.chat.WITS.model.Comment reply) {
        tweetRepository.findById(tweetId).ifPresent(tweet -> {
            boolean found = addReplyRecursive(tweet.getComments(), parentCommentId, reply);
            if (found) {
                tweetRepository.save(tweet);
            }
        });
    }

    private boolean addReplyRecursive(List<com.message.chat.WITS.model.Comment> comments, String parentId,
            com.message.chat.WITS.model.Comment reply) {
        for (com.message.chat.WITS.model.Comment comment : comments) {
            if (comment.getId().equals(parentId)) {
                if (reply.getId() == null)
                    reply.setId(java.util.UUID.randomUUID().toString());
                reply.setTimestamp(LocalDateTime.now());
                comment.getReplies().add(reply);
                return true;
            }
            if (!comment.getReplies().isEmpty()) {
                boolean found = addReplyRecursive(comment.getReplies(), parentId, reply);
                if (found)
                    return true;
            }
        }
        return false;
    }

    public List<TrendingTopic> getTrendingTopics() {
        return trendingTopicRepository.findTop10ByOrderByUsageCountDesc();
    }
}
