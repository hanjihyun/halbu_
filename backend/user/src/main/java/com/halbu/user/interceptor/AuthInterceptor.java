package com.halbu.user.interceptor;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.halbu.user.model.dto.UserinfoDto;
import com.halbu.user.util.GoogleAuthUtil;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class AuthInterceptor implements HandlerInterceptor{

	private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());
	
	private GoogleAuthUtil googleAuthUtil;
	
	@Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("preHandle auth-token");
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        } else {
            String token = request.getHeader("auth-token");
            if (token != null && token.length() > 0) {
            	UserinfoDto userinfo = googleAuthUtil.checkValid(token);
            	if(userinfo == null) throw new RuntimeException("Invalid auth-token");
            	request.setAttribute("tokendata", userinfo);
                return true;
            } else {
                throw new RuntimeException("auth-token does not exist.");
            }
        }
    }
}
