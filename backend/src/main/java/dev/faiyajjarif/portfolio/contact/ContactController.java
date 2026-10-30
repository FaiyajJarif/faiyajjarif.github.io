package dev.faiyajjarif.portfolio.contact;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contact;

    public ContactController(ContactService contact) {
        this.contact = contact;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> send(@Valid @RequestBody ContactRequest req, HttpServletRequest http) {
        // Honeypot filled in: pretend it worked so bots don't retry.
        if (req.website() != null && !req.website().isBlank()) {
            return ResponseEntity.accepted().body(Map.of("ok", true));
        }
        if (!contact.allow(http.getRemoteAddr())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of("ok", false, "error", "Too many messages - please try again in an hour."));
        }
        contact.save(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
    }
}
