package one.adri.auth_server.controller;

import lombok.RequiredArgsConstructor;
import one.adri.auth_server.domain.User;
import one.adri.auth_server.model.Profile;
import one.adri.auth_server.repository.UserRepository;
import one.adri.auth_server.service.UserService;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.security.auth.login.AccountNotFoundException;
import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/user/{username}")
    @Transactional(readOnly = true)
    public Mono<Profile> get(@PathVariable() String username) {
        return this.userRepository.findProfileByUsername(username);
    }

    @PutMapping("/user/{username}")
    @Transactional
    public Mono<Profile> update(@Valid @RequestBody Profile profile, @PathVariable String username) {
        return this.userRepository.findByUsername(username).
                switchIfEmpty(Mono.error(new AccountNotFoundException("Current user account not found")))
                .map(user -> {
                    user.setFirstname(profile.getFirstname());
                    user.setLastname(profile.getLastname());
                    user.setEmail(profile.getEmail());
                    user.setAlias(profile.getAlias());
                    return user;
                })
                .flatMap(this.userRepository::save)
                .map(u ->
                        Profile.builder().id(u.getId()).username(u.getUsername())
                                .alias(u.getAlias())
                                .email(u.getEmail())
                                .lastname(u.getLastname())
                                .firstname(u.getFirstname())
                                .passwordExpirationDate(u.getPasswordExpirationDate())
                                .build()
                );
    }

    @GetMapping("/user/me")
    public Mono<Map<String, Object>> current(@AuthenticationPrincipal Mono<UserDetails> principal) {
        return principal.map(user -> Map.of(
                        "name", user.getUsername(),
                        "roles", AuthorityUtils.authorityListToSet(user.getAuthorities())
                )
        );
    }

    public Mono<Page<User>> getAll(@RequestParam("page") int page, @RequestParam("size") int size){
        return this.userService.getUsers(PageRequest.of(page, size));
    }
}
