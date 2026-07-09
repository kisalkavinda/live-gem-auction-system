package com.gemhaven.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(
                    "http://localhost:5173",
                    "http://localhost:4173"
                )
                .withSockJS(); // SockJS fallback for broader client compatibility
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        // Client subscribes to: /topic/auctions/{id}, /user/queue/outbid
        registry.enableSimpleBroker("/topic", "/user");

        // Client sends to: /app/auctions/{id}/bid
        registry.setApplicationDestinationPrefixes("/app");

        // Required for targeted /user/queue/** messages
        registry.setUserDestinationPrefix("/user");
    }
}
