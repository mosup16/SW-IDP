package com.iam.oauth.Service.Impl;

import com.iam.oauth.DTO.ClientAppdto.AddClientAppDto;
import com.iam.oauth.DTO.ClientAppdto.ClientResponsedto;
import com.iam.oauth.DTO.ClientAppdto.RotateSecretdto;
import com.iam.oauth.Entity.ClientApplication;
import com.iam.oauth.Entity.RedirectUri;
import com.iam.oauth.Enum.Status;
import com.iam.oauth.Repository.ClientAppRepository;
import com.iam.oauth.Service.Interface.ClientApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientApplicationServiceImpl implements ClientApplicationService {

    private final ClientAppRepository clientAppRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public String AddClient(AddClientAppDto dto) {
        if (clientAppRepository.existsByClientId(dto.clientId())) {
            throw new RuntimeException("Client already exists");
        }

        ClientApplication client = ClientApplication.builder()
                .clientId(dto.clientId())
                .name(dto.name())
                .description(dto.description())
                .clientSecretHash(passwordEncoder.encode(dto.clientSecret()))
                .status(Status.ACTIVE)
                .build();

        if (dto.redirectUris() != null && !dto.redirectUris().isEmpty()) {
            List<RedirectUri> uris = dto.redirectUris().stream()
                    .filter(u -> u != null && !u.isBlank())
                    .map(u -> RedirectUri.builder().clientApplication(client).uri(u).build())
                    .toList();
            client.setRedirectUris(new ArrayList<>(uris));
        }

        clientAppRepository.save(client);
        return "Client created successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponsedto> GetAll() {
        return clientAppRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponsedto GetById(String clientId) {
        ClientApplication client = clientAppRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return toDto(client);
    }

    @Override
    @Transactional
    public String Update(String clientId, AddClientAppDto dto) {
        ClientApplication client = clientAppRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setName(dto.name());
        client.setDescription(dto.description());
        client.setClientSecretHash(passwordEncoder.encode(dto.clientSecret()));

        if (dto.redirectUris() != null) {
            List<RedirectUri> existing = client.getRedirectUris();
            if (existing == null) {
                existing = new ArrayList<>();
                client.setRedirectUris(existing);
            } else {
                existing.clear();
            }
            dto.redirectUris().stream()
                    .filter(u -> u != null && !u.isBlank())
                    .map(u -> RedirectUri.builder().clientApplication(client).uri(u).build())
                    .forEach(existing::add);
        }

        return "Client updated successfully";
    }

    @Override
    @Transactional
    public String Delete(String clientId) {
        ClientApplication client = clientAppRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        clientAppRepository.delete(client);
        return "Client deleted successfully";
    }

    @Override
    @Transactional
    public String RotateSecret(String clientId, RotateSecretdto dto) {
        ClientApplication client = clientAppRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setClientSecretHash(passwordEncoder.encode(dto.newSecret()));
        client.setSecretRotatedAt(OffsetDateTime.now());

        return "Secret rotated successfully";
    }

    private ClientResponsedto toDto(ClientApplication client) {
        List<String> uris = client.getRedirectUris() == null ? List.of() :
                client.getRedirectUris().stream().map(RedirectUri::getUri).toList();
        return new ClientResponsedto(
                client.getClientId(),
                client.getName(),
                client.getDescription(),
                client.getStatus(),
                client.getCreatedAt(),
                client.getSecretRotatedAt(),
                client.getCreatedBy(),
                uris
        );
    }
}
