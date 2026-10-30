package dev.faiyajjarif.portfolio.stats;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitService {

    static final String VISITS = "visits";

    private final CounterRepository counters;

    public VisitService(CounterRepository counters) {
        this.counters = counters;
    }

    @Transactional
    public long recordVisit() {
        if (counters.increment(VISITS) == 0) {
            counters.save(new Counter(VISITS, 1));
            return 1;
        }
        return current();
    }

    @Transactional(readOnly = true)
    public long current() {
        return counters.findById(VISITS).map(Counter::getTotal).orElse(0L);
    }
}
