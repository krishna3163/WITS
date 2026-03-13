package com.message.chat.WITS;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(MockMongoConfig.class)
class WitsApplicationTests {

	@Test
	void contextLoads() {
	}

}
