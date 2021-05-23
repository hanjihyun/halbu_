package com.halbu.phonebook.model.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.halbu.phonebook.util.ImageUtil;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PictureService {
	
	@Value("${adr.picture}")
	private String adrPicture;
	
	private final ImageUtil imageUtil;
	
	public String upload(String uid, MultipartFile multipartFile) throws IOException{
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);
		
		MultiValueMap<String, Object> params = new LinkedMultiValueMap<String, Object>();
		params.add("uid", uid);
		params.add("multipartFile", multipartFile.getResource());
		
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(params, headers);
	
		RestTemplate rt = new RestTemplate();
		ResponseEntity<Map> response = rt.exchange(
				adrPicture + "/upload",
				HttpMethod.POST,
				entity,
				Map.class
			);
		
		return (String)response.getBody().get("filePath");
	}
	
	
	
	public String change(String uid, String oldtitle, MultipartFile multipartFile) {
		HttpHeaders headers = new HttpHeaders();
		
		MultiValueMap<String, Object> params = new LinkedMultiValueMap<String, Object>();
		params.add("uid", uid);
		params.add("oldtitle", oldtitle);
		params.add("multipartFile", multipartFile.getResource());
		
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(params, headers);
		
		RestTemplate rt = new RestTemplate();
		ResponseEntity<Map> response = rt.exchange(
					adrPicture + "/change",
					HttpMethod.PUT,
					entity,
					Map.class
				);
		
		return (String)response.getBody().get("filePath");
	}
	
	
	
	public String download(String uid, String title) throws IOException {
		HttpHeaders headers = new HttpHeaders();
		
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(headers);
		
		RestTemplate rt = new RestTemplate();
		ResponseEntity<Map> response = rt.exchange(
					adrPicture + "/download/" + uid + "/" + title,
					HttpMethod.GET,
					entity,
					Map.class
				);
		
		String encodedString = (String)(response.getBody().get("file"));
//		byte[] imageByteArr = imageUtil.base64Decoding(encodedString);
//		FileUtils.writeByteArrayToFile(new File("test11.png"), imageUtil.base64Decoding(encodedString));
//		
//		MultipartFile multipartFile = null;
//		try(ByteArrayOutputStream bos = new ByteArrayOutputStream(imageByteArr.length)) {
//			IOUtils.write(imageByteArr, bos);
//			multipartFile = new MockMultipartFile(title, bos.toByteArray());
//		}
//		try(FileOutputStream fos = new FileOutputStream(new File(title))){
//			fos.write(multipartFile.getBytes());
//		}
		return encodedString;
	}
	
	
	
	public boolean remove(String uid, String title) {
		HttpHeaders headers = new HttpHeaders();
		
		HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(headers);
		
		RestTemplate rt = new RestTemplate();
		ResponseEntity<Map> response = rt.exchange(
					adrPicture + "/remove/" + uid + "/" + title,
					HttpMethod.DELETE,
					entity,
					Map.class
				);
		
		return true;
	}
	
}
