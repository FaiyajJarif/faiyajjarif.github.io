package dev.faiyajjarif.portfolio.contact;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.faiyajjarif.portfolio.config.AppProperties;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private static final Duration WINDOW = Duration.ofHours(1);

    private final MessageRepository messages;
    private final ObjectProvider<JavaMailSender> mailSender;
    private final AppProperties props;
    private final Map<String, Deque<Instant>> recentByClient = new ConcurrentHashMap<>();

    public ContactService(MessageRepository messages, ObjectProvider<JavaMailSender> mailSender, AppProperties props) {
        this.messages = messages;
        this.mailSender = mailSender;
        this.props = props;
    }

    /** @return false when this client has hit the hourly limit. */
    public boolean allow(String clientKey) {
        var now = Instant.now();
        var times = recentByClient.computeIfAbsent(clientKey, k -> new ArrayDeque<>());
        synchronized (times) {
            while (!times.isEmpty() && times.peekFirst().isBefore(now.minus(WINDOW))) {
                times.pollFirst();
            }
            if (times.size() >= props.contact().maxPerHour()) {
                return false;
            }
            times.addLast(now);
            return true;
        }
    }

    @Transactional
    public Message save(ContactRequest req) {
        var saved = messages.save(new Message(req.name().trim(), req.email().trim(), req.message().trim()));
        notifyOwner(saved);
        return saved;
    }

    private void notifyOwner(Message m) {
        var sender = mailSender.getIfAvailable();
        if (sender == null) {
            log.info("New contact message #{} from {} (email notifications not configured)", m.getId(), m.getEmail());
            return;
        }
        CompletableFuture.runAsync(() -> {
            try {
                var mail = new SimpleMailMessage();
                mail.setTo(props.contact().notifyEmail());
                mail.setReplyTo(m.getEmail());
                mail.setSubject("Portfolio message from " + m.getName());
                mail.setText(m.getBody() + "\n\n- " + m.getName() + " <" + m.getEmail() + ">");
                sender.send(mail);
            } catch (Exception e) {
                log.warn("Could not email contact message #{}: {}", m.getId(), e.getMessage());
            }
        });
    }
}
