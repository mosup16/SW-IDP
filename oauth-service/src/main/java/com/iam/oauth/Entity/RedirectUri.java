package com.iam.oauth.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "redirect_uri", schema = "oauth")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedirectUri {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientApplication clientApplication;

    private String uri;
}