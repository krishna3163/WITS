package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Permission;
import com.message.chat.WITS.model.Server;
import com.message.chat.WITS.model.ServerRole;
import com.message.chat.WITS.repository.ServerRepository;
import com.message.chat.WITS.repository.ServerRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final ServerRepository serverRepository;
    private final ServerRoleRepository roleRepository;
    private final ChannelService channelService;

    public Server createServer(String name, String ownerId) {
        Server server = Server.builder()
                .name(name)
                .ownerId(ownerId)
                .memberIds(new ArrayList<>(Collections.singletonList(ownerId)))
                .userRoles(new HashMap<>())
                .build();
        server = serverRepository.save(server);

        // Create Admin role
        ServerRole adminRole = ServerRole.builder()
                .serverId(server.getId())
                .name("Admin")
                .permissions(new HashSet<>(Arrays.asList(Permission.values())))
                .position(0)
                .build();
        roleRepository.save(adminRole);

        // Assign to owner
        server.getUserRoles().put(ownerId, new ArrayList<>(Collections.singletonList(adminRole.getId())));
        serverRepository.save(server);

        // Create default channels
        channelService.createDefaultChannels(server.getId());

        return server;
    }

    public List<Server> getUserServers(String userId) {
        return serverRepository.findByMemberIdsContaining(userId);
    }

    public boolean hasPermission(String serverId, String userId, Permission permission) {
        return serverRepository.findById(serverId).map(server -> {
            if (server.getOwnerId().equals(userId))
                return true; // Owner is super-admin

            List<String> userRoleIds = server.getUserRoles().getOrDefault(userId, Collections.emptyList());
            for (String roleId : userRoleIds) {
                if (roleRepository.findById(roleId).map(role -> role.getPermissions().contains(permission))
                        .orElse(false)) {
                    return true;
                }
            }
            return false;
        }).orElse(false);
    }

    public void save(Server server) {
        serverRepository.save(server);
    }

    public Optional<ServerRole> findRoleById(String roleId) {
        return roleRepository.findById(roleId);
    }

    public Optional<Server> findById(String serverId) {
        return serverRepository.findById(serverId);
    }
}
