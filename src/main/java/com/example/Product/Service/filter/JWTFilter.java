package com.example.Product.Service.filter;

import com.example.Product.Service.repository.UserRepo;
import com.example.Product.Service.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jWTUtil;
    private final UserRepo userRepo;

    public JWTFilter(JWTUtil jWTUtil, UserRepo userRepo) {
        this.jWTUtil = jWTUtil;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String token = null;
        String username = null;
        if(header != null && header.startsWith("Bearer ")){
            token = header.substring(7);
        }
        if(token!=null && SecurityContextHolder.getContext().getAuthentication() == null){
            username = jWTUtil.extractUsername(token);
            if(!jWTUtil.isExpired(token,username)){
                UserDetails userDetails = userRepo.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User Not Found!!"));
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails
                        ,null,null);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request,response);
    }
}
