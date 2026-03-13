package com.message.chat.WITS.controller;

import com.message.chat.WITS.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {
    private final AIService aiService;

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String question = request.get("message");
        String response = aiService.askAssistant(question);
        return Map.of("response", response);
    }
}
