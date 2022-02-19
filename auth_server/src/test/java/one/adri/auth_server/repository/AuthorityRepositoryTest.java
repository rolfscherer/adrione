package one.adri.auth_server.repository;

import one.adri.auth_server.domain.Authority;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.r2dbc.DataR2dbcTest;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.assertj.core.api.Assertions.assertThat;

@DataR2dbcTest
class AuthorityRepositoryTest {

    @Autowired
    AuthorityRepository authorityRepository;

    @Test
    void findByAuthority() throws InterruptedException {

        final String ROLE = "ROLE_ADMIN";
        AtomicReference<Authority> authority = new AtomicReference<>();

        CountDownLatch latch = new CountDownLatch(1);
        authorityRepository.findByAuthority(ROLE)
                .log()
                .doOnTerminate(latch::countDown)
                .subscribe(authority::set);

        latch.await(1000, TimeUnit.MILLISECONDS);
        assertThat(authority.get().getAuthority()).isEqualTo(ROLE);
    }

    @Test
    void findByAuthoritiesBayUserId() throws InterruptedException {
        List<Authority> list = new ArrayList<>();
        CountDownLatch latch = new CountDownLatch(1);
        authorityRepository.findByAuthoritiesBayUserId(2)
                .log()
                .doOnTerminate(latch::countDown)
                .subscribe(list::add);

        latch.await(1000, TimeUnit.MILLISECONDS);
        assertThat(list).isNotEmpty();
    }

}
