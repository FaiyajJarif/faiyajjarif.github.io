package dev.faiyajjarif.portfolio.stats;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "counters")
public class Counter {

    @Id
    @Column(length = 40)
    private String name;

    @Column(name = "counter_value", nullable = false)
    private long total;

    protected Counter() {}

    public Counter(String name, long value) {
        this.name = name;
        this.total = value;
    }

    public String getName() { return name; }
    public long getTotal() { return total; }
}
