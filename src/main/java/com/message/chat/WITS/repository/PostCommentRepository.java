package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, UUID> {
    List<PostComment> findByPostIdOrderByCreatedAtAsc(UUID postId);
}
