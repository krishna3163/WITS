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
    public MiniApp publishMiniApp(UUID developerId, String name, String description, String iconUrl, String url, MiniApp.AppCategory category) {

        MiniApp app = new MiniApp();
        app.setId(UUID.randomUUID());
        app.setDeveloperId(developerId);
        app.setName(name);
        app.setDescription(description);
        app.setIconUrl(iconUrl);
        app.setAppUrl(url);
        app.setCategory(category != null ? category : MiniApp.AppCategory.OTHER);
        app.setCreatedAt(Instant.now());

        return miniAppRepository.save(app);
    }

    public List<MiniApp> getMiniAppsByCategory(MiniApp.AppCategory category) {
        return miniAppRepository.findByCategory(category);
    }

    public List<MiniApp> getDeveloperMiniApps(UUID developerId) {
        return miniAppRepository.findByDeveloperId(developerId);
    }

    @Transactional
    public void deleteMiniApp(UUID appId, UUID developerId) {
        MiniApp app = miniAppRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("App not found"));

        if (!app.getDeveloperId().equals(developerId)) {
            throw new RuntimeException("Only the developer can delete this app");
        }

        miniAppRepository.delete(app);
    }

    public List<MiniApp> listMiniApps() {
        return miniAppRepository.findAll();
    }
}
