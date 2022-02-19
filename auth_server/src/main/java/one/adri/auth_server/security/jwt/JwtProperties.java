package one.adri.auth_server.security.jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {

    private String secretKey = "594001a0-412f-4752-8b18-3f89f7bc5e3b";

    // validity in milliseconds
    private long validityInMs = 3600000; // 1h

}
