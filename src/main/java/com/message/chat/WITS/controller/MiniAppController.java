package com.message.chat.WITS.controller;

import com.message.chat.WITS.model.MiniApp;
import com.message.chat.WITS.service.MiniAppService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/miniapps")
public class MiniAppController {

    private final MiniAppService miniAppService;

    public MiniAppController(MiniAppService miniAppService) {
        this.miniAppService = miniAppService;
    }

    @PostMapping("/publish")
    public ResponseEntity<MiniApp> publishMiniApp(
            @RequestParam UUID developerId,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String iconUrl,
            @RequestParam String url,
            @RequestParam(required = false) MiniApp.AppCategory category) {
        return ResponseEntity.ok(miniAppService.publishMiniApp(developerId, name, description, iconUrl, url, category));
    }

    @GetMapping
    public ResponseEntity<List<MiniApp>> listMiniApps() {
        return ResponseEntity.ok(miniAppService.listMiniApps());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MiniApp>> getMiniAppsByCategory(@PathVariable MiniApp.AppCategory category) {
        return ResponseEntity.ok(miniAppService.getMiniAppsByCategory(category));
    }

    @GetMapping("/developer/{developerId}")
    public ResponseEntity<List<MiniApp>> getDeveloperMiniApps(@PathVariable UUID developerId) {
        return ResponseEntity.ok(miniAppService.getDeveloperMiniApps(developerId));
    }

    @DeleteMapping("/{appId}")
    public ResponseEntity<Void> deleteMiniApp(
            @PathVariable UUID appId,
            @RequestParam UUID developerId) {
        miniAppService.deleteMiniApp(appId, developerId);
        return ResponseEntity.ok().build();
    }
}
