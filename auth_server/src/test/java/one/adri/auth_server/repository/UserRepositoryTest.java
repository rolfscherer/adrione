package one.adri.auth_server.repository;

import one.adri.auth_server.domain.User;
import one.adri.auth_server.model.Profile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
    }

    @Test
    void findByUsername() throws InterruptedException {
        final String USERNAME = "admin";

        AtomicReference<User> user = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        userRepository.findByUsername(USERNAME).doOnTerminate(latch::countDown).subscribe(user::set);
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertThat(user.get().getUsername()).isEqualTo(USERNAME);

    }

    @Test
    void createUsers() {
        var users = Arrays.asList("user", "admin");

        Flux.fromIterable(users).doOnNext(username -> userRepository.deleteByUsername(username))
                .thenMany(Flux.fromIterable(users)).subscribe(
                        username -> {
                            var authorities = "user".equals(username) ?
                                    List.of("ROLE_USER") : Arrays.asList("ROLE_USER", "ROLE_ADMIN");

                            User user = User.builder()
                                    .authorities(authorities)
                                    .username(username)
                                    .password(passwordEncoder.encode(username))
                                    .email(username + "@example.com")
                                    .build();

                            this.userRepository.save(user);
                        }
                );
    }

    @Test
    void findProfileByUsername() throws InterruptedException {
        final String USERNAME = "admin";

        AtomicReference<Profile> profile = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        userRepository.findProfileByUsername(USERNAME).doOnTerminate(latch::countDown).subscribe(profile::set);
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertThat(profile.get().getUsername()).isEqualTo(USERNAME);

    }

    @Test
    void findAllByActiveEquals() throws InterruptedException {

        var list = new ArrayList<User>();
        CountDownLatch latch = new CountDownLatch(1);
        userRepository.findAllByActiveEquals(true, PageRequest.of(0, 20))
                .doOnNext(list::add)
                .doOnTerminate(latch::countDown).blockLast();
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertThat(list).isNotEmpty();


        var pageRequest = PageRequest.of(0, 20);
        latch = new CountDownLatch(1);
        var res = userRepository.findAllBy(pageRequest)
                .collectList()
                .doOnTerminate(latch::countDown)
                .zipWith(userRepository.count())
                .block();
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertThat(res.getT1()).isNotEmpty();
        assertThat(res.getT2()).isGreaterThan(0);

        var page = new PageImpl<>(res.getT1(), pageRequest, res.getT2());
        assertThat(page.getTotalElements()).isEqualTo(res.getT1().size());
    }
}
