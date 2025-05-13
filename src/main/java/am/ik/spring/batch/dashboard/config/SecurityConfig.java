package am.ik.spring.batch.dashboard.config;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

	@Bean
	@Order(2)
	public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests((authorize) -> authorize.requestMatchers(EndpointRequest.toAnyEndpoint())
			.permitAll()
			.requestMatchers("/login", "/error")
			.permitAll()
			.anyRequest()
			.authenticated()).exceptionHandling(exceptionHandling -> {
				MediaTypeRequestMatcher mediaTypeRequestMatcher = new MediaTypeRequestMatcher(MediaType.TEXT_HTML);
				mediaTypeRequestMatcher.setUseEquals(true);
				exceptionHandling
					.defaultAuthenticationEntryPointFor(new LoginUrlAuthenticationEntryPoint("/login"),
							mediaTypeRequestMatcher)
					.defaultAuthenticationEntryPointFor(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
							antMatcher("/api/**"))
					.defaultAuthenticationEntryPointFor(new LoginUrlAuthenticationEntryPoint("/login"),
							antMatcher("/**"));
			})
			.formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/", true))
			.rememberMe(Customizer.withDefaults())
			.logout(logout -> logout.logoutUrl("/logout"));
		return http.build();
	}

}
