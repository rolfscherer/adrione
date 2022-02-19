package one.adri.auth_server.service;

import lombok.RequiredArgsConstructor;
import one.adri.auth_server.domain.Authority;
import one.adri.auth_server.repository.AuthorityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityRepository authorityRepository;

    public Mono<Authority> createAuthority(Authority authority) {
        return authorityRepository.save(authority);
    }

}
