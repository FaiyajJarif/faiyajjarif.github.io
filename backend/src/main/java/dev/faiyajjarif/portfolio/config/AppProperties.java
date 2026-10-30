package dev.faiyajjarif.portfolio.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Cors cors, Admin admin, Contact contact) {

    public record Cors(List<String> allowedOrigins) {}

    public record Admin(String username, String password) {}

    public record Contact(String notifyEmail, int maxPerHour) {}
}
