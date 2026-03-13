package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Friendship;
import com.message.chat.WITS.service.FriendshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @GetMapping("/{friendshipId}")
    public ResponseEntity<Friendship> getFriendship(@PathVariable UUID friendshipId) {
        Optional<Friendship> friendshipOptional = friendshipService.getFriendship(friendshipId);
        return friendshipOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{friendshipId}")
    public ResponseEntity<Friendship> updateFriendship(@PathVariable UUID friendshipId, @RequestBody Friendship friendship) {
        friendship.setFriendship_id(friendshipId);
        Friendship updatedFriendship = friendshipService.updateFriendship(friendship);
        return ResponseEntity.ok(updatedFriendship);
    }
}
