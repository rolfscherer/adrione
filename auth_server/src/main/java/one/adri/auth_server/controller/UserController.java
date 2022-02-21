package one.adri.auth_server.controller;

import lombok.RequiredArgsConstructor;
import one.adri.auth_server.model.Profile;
import one.adri.auth_server.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository users;

    @GetMapping("/user/{username}")
    public Mono<Profile> get(@PathVariable() String username) throws InterruptedException {
        return this.users.findProfileByUsername(username);
    }

    @GetMapping("/user/me")
    public Mono<Map<String, Object>> current(@AuthenticationPrincipal Mono<UserDetails> principal) {
        return principal.map(user -> Map.of(
                        "name", user.getUsername(),
                        "roles", AuthorityUtils.authorityListToSet(user.getAuthorities())
                )
        );
    }
}
