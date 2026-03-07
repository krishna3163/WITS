package com.message.chat.WITS.service;

import com.message.chat.WITS.model.Permission;
import com.message.chat.WITS.model.ServerRole;
import com.message.chat.WITS.repository.ServerRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final ServerRoleRepository roleRepository;

    public ServerRole createRole(String serverId, String name, Set<Permission> permissions, int position) {
        ServerRole role = ServerRole.builder()
                .serverId(serverId)
                .name(name)
                .permissions(permissions)
                .position(position)
                .build();
        return roleRepository.save(role);
    }

    public List<ServerRole> getServerRoles(String serverId) {
        return roleRepository.findByServerIdOrderByPositionAsc(serverId);
    }

    public void updateRole(ServerRole role) {
        roleRepository.save(role);
    }

    public void deleteRole(String roleId) {
        roleRepository.deleteById(roleId);
    }
}
