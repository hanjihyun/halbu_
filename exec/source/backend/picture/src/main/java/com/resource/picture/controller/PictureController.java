package com.resource.picture.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.resource.picture.model.service.S3Service;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/picture")
public class PictureController {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());
	
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	private S3Service s3Service;
	
    @PostMapping("/upload")
    @ResponseBody
    public Object upload(String uid, MultipartFile multipartFile) throws IOException {
		logger.info("post - upload");
		try {
			String imgPath = s3Service.upload(uid, multipartFile);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
				put("filePath", imgPath);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
    
    @PutMapping("/change")
    @ResponseBody
    public Object change(String uid, String oldtitle, MultipartFile multipartFile) throws IOException {
		logger.info("put - change");
		try {
			String imgPath = s3Service.change(uid, oldtitle, multipartFile);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
				put("filePath", imgPath);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
    
    @GetMapping("/download/{uid}/{title}")
    public Object download(@PathVariable String uid, @PathVariable String title) throws IOException {
		logger.info("get - download");
		try {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
				put("file", s3Service.download(uid, title));
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
    
    @DeleteMapping("/remove/{uid}/{title}")
    public Object remove(@PathVariable String uid, @PathVariable String title) throws IOException {
		logger.info("delete - remove");
		try {
			s3Service.remove(uid, title);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    

}
