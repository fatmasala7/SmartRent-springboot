package com.smartrent.property.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String gatewayUserId = req.getHeader("X-User-Id");
        String gatewayRole = req.getHeader("X-User-Role");
        if (gatewayUserId != null && gatewayRole != null && !gatewayUserId.isBlank() && !gatewayRole.isBlank()) {
            var auth = new UsernamePasswordAuthenticationToken(
                Integer.valueOf(gatewayUserId), null, List.of(new SimpleGrantedAuthority(gatewayRole)));
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token)) {
                Claims claims = jwtUtil.parseToken(token);
                Integer userId = claims.get("userId", Integer.class);
                String role = claims.get("role", String.class);
                var auth = new UsernamePasswordAuthenticationToken(
                    userId, null, List.of(new SimpleGrantedAuthority(role)));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }
}
