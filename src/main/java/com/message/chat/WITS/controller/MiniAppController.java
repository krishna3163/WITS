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
            @RequestParam String url) {
        return ResponseEntity.ok(miniAppService.publishMiniApp(developerId, name, url));
    }

    @GetMapping
    public ResponseEntity<List<MiniApp>> listMiniApps() {
        return ResponseEntity.ok(miniAppService.listMiniApps());
    }
}
