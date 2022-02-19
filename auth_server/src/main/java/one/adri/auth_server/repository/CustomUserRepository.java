package one.adri.auth_server.repository;

import one.adri.auth_server.domain.User;
import reactor.core.publisher.Mono;

public interface CustomUserRepository {
    Mono<User> findByUsername(String username);
}
