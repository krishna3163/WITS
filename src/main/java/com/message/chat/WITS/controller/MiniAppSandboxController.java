package com.message.chat.WITS.controller;

import com.message.chat.WITS.service.MiniAppSandboxService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sandbox")
public class MiniAppSandboxController {

    private final MiniAppSandboxService sandboxService;

    public MiniAppSandboxController(MiniAppSandboxService sandboxService) {
        this.sandboxService = sandboxService;
    }

    @GetMapping("/manifest/{appId}")
    public ResponseEntity<Map<String, String>> getAppManifest(@PathVariable String appId) {
        String manifest = sandboxService.getSandboxManifest(appId);
        Map<String, String> response = new HashMap<>();
        response.put("manifest", manifest);
        response.put("runtime", "WITS_CORE_v1");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bridge.js")
    public ResponseEntity<String> getBridgeJS() {
        return ResponseEntity.ok(sandboxService.generateJSBridge());
    }
}
