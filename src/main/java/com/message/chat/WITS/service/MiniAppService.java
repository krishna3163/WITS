package com.message.chat.WITS.service;

import com.message.chat.WITS.model.MiniApp;
import com.message.chat.WITS.repository.MiniAppRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class MiniAppService {

    private final MiniAppRepository miniAppRepository;

    public MiniAppService(MiniAppRepository miniAppRepository) {
        this.miniAppRepository = miniAppRepository;
    }

    @Transactional
    public MiniApp publishMiniApp(UUID developerId, String name, String url) {

        MiniApp app = new MiniApp();
        app.setId(UUID.randomUUID());
        app.setDeveloperId(developerId);
        app.setName(name);
        app.setAppUrl(url);
        app.setCreatedAt(Instant.now());

        return miniAppRepository.save(app);
    }

    public List<MiniApp> listMiniApps() {
        return miniAppRepository.findAll();
    }
}
