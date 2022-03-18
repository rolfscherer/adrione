package one.adri.auth_server.service;

import lombok.RequiredArgsConstructor;
import one.adri.auth_server.domain.User;
import one.adri.auth_server.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Mono<Page<User>> getUsers(PageRequest pageRequest) {
        return this.userRepository.findAllBy(pageRequest)
                .collectList()
                .zipWith(this.userRepository.count())
                .map(t -> new PageImpl<>(t.getT1(), pageRequest, t.getT2()));
    }
}
