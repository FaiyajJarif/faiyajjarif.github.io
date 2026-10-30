package dev.faiyajjarif.portfolio.contact;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(nullable = false, length = 4000)
    private String body;

    @Column(nullable = false)
    private Instant createdAt;

    private boolean readByOwner;

    protected Message() {}

    public Message(String name, String email, String body) {
        this.name = name;
        this.email = email;
        this.body = body;
        this.createdAt = Instant.now();
    }

    public void markRead() { this.readByOwner = true; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getBody() { return body; }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isReadByOwner() { return readByOwner; }
}
