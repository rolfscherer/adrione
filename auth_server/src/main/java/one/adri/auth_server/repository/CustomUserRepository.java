package one.adri.auth_server.repository;

import one.adri.auth_server.domain.User;
import one.adri.auth_server.model.Profile;
import reactor.core.publisher.Mono;

public interface CustomUserRepository {
    Mono<User> findByUsername(String username);
    Mono<Profile> findProfileByUsername(String username);
}
