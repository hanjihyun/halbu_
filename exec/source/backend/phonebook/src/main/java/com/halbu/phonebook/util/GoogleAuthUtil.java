package com.halbu.phonebook.util;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.halbu.phonebook.model.dto.UserinfoDto;

@Component
public class GoogleAuthUtil {
	private final String url = "https://www.googleapis.com/oauth2/v2/userinfo";
	
	public UserinfoDto checkValid(String authToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer "+ authToken);
		
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(headers);
		
		RestTemplate rt = new RestTemplate();
		ResponseEntity<Map> response = rt.exchange(
					url,
					HttpMethod.GET,
					entity,
					Map.class
				);
		
		UserinfoDto userinfo = new UserinfoDto(
					(String)response.getBody().get("id"), 
					(String)response.getBody().get("email")
				);
		
		return userinfo;
	}
	
}
