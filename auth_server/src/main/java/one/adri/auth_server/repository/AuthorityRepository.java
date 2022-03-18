package one.adri.auth_server.repository;

import one.adri.auth_server.domain.Authority;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AuthorityRepository extends ReactiveCrudRepository<Authority, Long> {
    Mono<Authority> findByAuthority(String authority);
    Mono<Integer> deleteByAuthority(String authority);

    @Query("SELECT a.* FROM authority a JOIN user_authority u ON a.id = u.authority_id WHERE user_id = :userId")
    Flux<Authority> findByAuthoritiesBayUserId (long userId);


}
