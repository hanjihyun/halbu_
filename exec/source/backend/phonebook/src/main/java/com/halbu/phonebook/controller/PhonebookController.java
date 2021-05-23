package com.halbu.phonebook.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
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
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.halbu.phonebook.model.dto.PhonebookDto;
import com.halbu.phonebook.model.dto.UserinfoDto;
import com.halbu.phonebook.model.service.PhonebookService;
import com.halbu.phonebook.model.service.PictureService;

import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/phonebook")
public class PhonebookController {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());
	
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";

	private PhonebookService phonebookService;
	private PictureService pictureService;
	
	@ApiOperation(value="connection test", notes="connection test")
	@GetMapping
	public Object connectionTest(@RequestAttribute UserinfoDto userinfo, PhonebookDto phonebookDto) {
		logger.info("get - connection test");
		try {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@ApiOperation(value="getTexts", notes="get header(auth-token) / return data(msg)")
	@GetMapping("/list")
	public Object getTexts(@RequestAttribute UserinfoDto userinfo, PhonebookDto phonebookDto) {
		logger.info("get - getPhonebooks");
		try {
			List<PhonebookDto> texts = phonebookService.selectTexts(userinfo.getId());
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
				put("texts", texts);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@ApiOperation(value="upload", notes="post header(auth-token) body(name, mobile, picture) / return data(msg)")
    @PostMapping("/upload")
    @ResponseBody
    public Object upload(@RequestAttribute UserinfoDto userinfo, PhonebookDto phonebookDto, MultipartFile multipartFile) throws IOException {
		logger.info("post - upload");
		try {
			phonebookDto.setUid(userinfo.getId());
			phonebookDto.setTitle(multipartFile.getOriginalFilename());
			phonebookDto.setFilePath(pictureService.upload(phonebookDto.getUid(), multipartFile));
			phonebookDto.setFavorite("0");
			phonebookService.insert(phonebookDto);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
	
	@ApiOperation(value="changeText", notes="put header(auth-token) body(name, title, mobile) / return data(msg)")
    @PutMapping("/change/text")
    @ResponseBody
    public Object changeText(@RequestAttribute UserinfoDto userinfo, PhonebookDto phonebookDto) {
    	logger.info("put - changeText");
		try {
			phonebookDto.setUid(userinfo.getId());
			phonebookService.updateText(phonebookDto);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
	
	@ApiOperation(value="changePic", notes="put header(auth-token) body(oldtitle, picture) / return data(msg)")
    @PutMapping("/change/pic")
    @ResponseBody
    public Object changePic(@RequestAttribute UserinfoDto userinfo, String oldtitle, MultipartFile multipartFile) throws IOException {
		logger.info("put - changePic");
		try {
			PhonebookDto phonebookDto = new PhonebookDto();
			phonebookDto.setUid(userinfo.getId());
			phonebookDto.setTitle(multipartFile.getOriginalFilename());
			phonebookDto.setFilePath(pictureService.change(userinfo.getId(), oldtitle, multipartFile));
			phonebookDto.setFavorite("0");
			phonebookService.updatePic(phonebookDto, oldtitle);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
	
	@ApiOperation(value="downloadPic", notes="get path(title) header(auth-token) / return data(msg, picture)")
    @GetMapping("/download/pic/{title}")
    public Object downloadPic(@RequestAttribute UserinfoDto userinfo, @PathVariable String title) throws IOException {
		logger.info("get - downloadPic");
		try {
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
				put("file", pictureService.download(userinfo.getId(), title));
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
    
	@ApiOperation(value="remove", notes="get path(title) header(auth-token) / return data(msg)")
    @DeleteMapping("/remove/{title}")
    public Object remove(@RequestAttribute UserinfoDto userinfo, @PathVariable String title) throws IOException {
		logger.info("delete - remove");
		try {
			pictureService.remove(userinfo.getId(), title);
			phonebookService.delete(userinfo.getId(), title);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
	
	
	@PutMapping("/favorite/{title}")
	public Object favoriteOnOff(@RequestAttribute UserinfoDto userinfo, @PathVariable String title) throws IOException {
		logger.info("put - favorite on/off");
		try {
			phonebookService.favoriteOnOff(userinfo.getId(), title);
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", SUCCESS);
			}}, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String, Object>>(new HashMap<String, Object>() {{
				put("msg", FAIL);
			}}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
}
