package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.CloseFriend;
import com.message.chat.WITS.service.CloseFriendService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/close-friends")
public class CloseFriendController {

    private final CloseFriendService closeFriendService;

    public CloseFriendController(CloseFriendService closeFriendService) {
        this.closeFriendService = closeFriendService;
    }

    @GetMapping("/{friendshipId}")
    public ResponseEntity<CloseFriend> getCloseFriend(@PathVariable UUID friendshipId) {
        Optional<CloseFriend> closeFriendOptional = closeFriendService.getCloseFriend(friendshipId);
        return closeFriendOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{friendshipId}")
    public ResponseEntity<CloseFriend> updateCloseFriend(@PathVariable UUID friendshipId, @RequestBody CloseFriend closeFriend) {
        closeFriend.setFriendship_id(friendshipId);
        CloseFriend updatedCloseFriend = closeFriendService.updateCloseFriend(closeFriend);
        return ResponseEntity.ok(updatedCloseFriend);
    }
}
