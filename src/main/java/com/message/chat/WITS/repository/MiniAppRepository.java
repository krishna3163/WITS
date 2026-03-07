package com.message.chat.WITS.repository;

import com.message.chat.WITS.model.MiniApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MiniAppRepository extends JpaRepository<MiniApp, UUID> {
    List<MiniApp> findByDeveloperId(UUID developerId);
    List<MiniApp> findByCategory(MiniApp.AppCategory category);
}
