package com.AuthenAvenue.config;

import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtProvider {
    
//    private static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRETE_KEY.getBytes());


    private static final SecretKey key = Keys.hmacShaKeyFor(
            JwtConstant.SECRETE_KEY.getBytes(StandardCharsets.UTF_8)
    );

    public static String generateToken(Authentication auth) {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        // 🐞 Debug: log the authorities
//        System.out.println("Authorities from auth object: " + authorities);

        String roles = populatedAuthoritirs(authorities);

        String jwt = Jwts.builder()
        .setIssuedAt(new Date())
        .setExpiration(new Date(new Date().getTime()+86400000))
        .claim("email", auth.getName())
        .claim("authorities", roles)
        .signWith(key, io.jsonwebtoken.SignatureAlgorithm.HS256)
        .compact();

//        System.out.println("Generated JWT Token: " + jwt);

        return jwt;
            }

            public static String getEmailFromToken(String token) {

//                System.out.println("Raw token: " + token);

                if (token != null && token.startsWith("Bearer ")) {
                    token = token.substring(7);
                }

//                System.out.println("Token after removing 'Bearer ': " + token);

                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();

                String email = String.valueOf(claims.get("email"));

                return email;
            }
        
            private static String populatedAuthoritirs(Collection<? extends GrantedAuthority> authorities) {
                Set<String> auth = new HashSet<>();
                for(GrantedAuthority ga:authorities) {
                    auth.add(ga.getAuthority());
                }

                if (auth.isEmpty()) {
                    auth.add("ROLE_CUSTOMER"); // default fallback
                }

                return String.join(",", auth);
            }
}
