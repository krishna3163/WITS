package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.Friendship;
import com.message.chat.WITS.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private final FriendshipService friendshipService;

    @Autowired
    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    // 2. SOCIAL GRAPH -> Friends System -> Send request
    @PostMapping("/request")
    public ResponseEntity<String> sendFriendRequest(@RequestParam String fromUserId, @RequestParam String toUserId) {
        friendshipService.sendFriendRequest(fromUserId, toUserId);
        return ResponseEntity.ok("Friend request sent.");
    }

    // 2. SOCIAL GRAPH -> Friends System -> Accept request
    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriendRequest(@RequestParam String userId, @RequestParam String friendId) {
        friendshipService.acceptFriendRequest(userId, friendId);
        return ResponseEntity.ok("Friend request accepted.");
    }

    // 2. SOCIAL GRAPH -> Friends System -> Decline request
    @PostMapping("/decline")
    public ResponseEntity<String> declineFriendRequest(@RequestParam String userId, @RequestParam String friendId) {
        friendshipService.declineFriendRequest(userId, friendId);
        return ResponseEntity.ok("Friend request declined.");
    }

    // 2. SOCIAL GRAPH -> Friends System -> Cancel request
    @DeleteMapping("/cancel")
    public ResponseEntity<String> cancelFriendRequest(@RequestParam String userId, @RequestParam String friendId) {
        friendshipService.cancelFriendRequest(userId, friendId);
        return ResponseEntity.ok("Friend request cancelled.");
    }

    // Get all friends for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Friendship>> getFriends(@PathVariable String userId) {
        List<Friendship> friends = friendshipService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }
}
