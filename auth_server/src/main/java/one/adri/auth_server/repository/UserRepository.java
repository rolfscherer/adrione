package one.adri.auth_server.repository;

import one.adri.auth_server.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveSortingRepository<User, Long>, CustomUserRepository {
    Mono<Integer> deleteByUsername(String username);

    Flux<User> findAllByActiveEquals(boolean active, Pageable pageable);

    Flux<User> findAllBy(Pageable pageable);
}
