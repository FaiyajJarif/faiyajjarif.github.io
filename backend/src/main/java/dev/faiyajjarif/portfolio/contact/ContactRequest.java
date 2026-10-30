package dev.faiyajjarif.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * @param website honeypot field - hidden on the page, so only bots fill it in.
 */
public record ContactRequest(
    @NotBlank @Size(max = 80) String name,
    @NotBlank @Email @Size(max = 160) String email,
    @NotBlank @Size(min = 10, max = 4000) String message,
    String website
) {}
