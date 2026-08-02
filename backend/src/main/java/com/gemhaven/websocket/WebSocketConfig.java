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
                    "http://localhost:4173",
                    "http://localhost:3000"
                )
                .withSockJS(); // SockJS fallback for broader client compatibility
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        // Client subscribes to: /topic/auctions/{id}  and  /user/queue/outbid
        // NOTE: /queue is in the simple broker so user-targeted queue messages work.
        // /user is a DESTINATION PREFIX (handled by setUserDestinationPrefix), NOT a broker path.
        registry.enableSimpleBroker("/topic", "/queue");

        // Client sends to: /app/auctions/{id}/bid
        registry.setApplicationDestinationPrefixes("/app");

        // Required for targeted /user/queue/** messages via convertAndSendToUser
        registry.setUserDestinationPrefix("/user");
    }
}
