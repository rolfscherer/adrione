package one.adri.auth_server.controller;

import lombok.RequiredArgsConstructor;
import one.adri.auth_server.domain.User;
import one.adri.auth_server.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository users;

    @GetMapping("/user/{username}")
    public Mono<User> get(@PathVariable() String username) {
        return this.users.findByUsername(username);
    }

}
