package dev.faiyajjarif.portfolio.stats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CounterRepository extends JpaRepository<Counter, String> {

    @Modifying(clearAutomatically = true)
    @Query("update Counter c set c.total = c.total + 1 where c.name = :name")
    int increment(@Param("name") String name);
}
