package one.adri.auth_server.repository;

import one.adri.auth_server.domain.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, Long>, CustomUserRepository {
    Mono<Integer> deleteByUsername(String username);

}
