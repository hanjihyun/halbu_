package com.halbu.phonebook.util;

import java.io.IOException;
import java.util.Base64;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ImageUtil {
	public String base64Encoding(MultipartFile multipartFile) throws IOException {
		return Base64.getEncoder().encodeToString(multipartFile.getBytes());
	}
	
	public String base64Encoding(byte[] imageByteArr) {
		return Base64.getEncoder().encodeToString(imageByteArr);
	}
	
	public byte[] base64Decoding(String encodedString) {
		return Base64.getDecoder().decode(encodedString);
	}
}
