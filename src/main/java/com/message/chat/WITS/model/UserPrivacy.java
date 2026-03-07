package com.message.chat.WITS.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPrivacy {
    @Builder.Default
    private PrivacySetting namePrivacy = PrivacySetting.PUBLIC;
    @Builder.Default
    private PrivacySetting emailPrivacy = PrivacySetting.FRIENDS;
    @Builder.Default
    private PrivacySetting dobPrivacy = PrivacySetting.PRIVATE;
    @Builder.Default
    private PrivacySetting bioPrivacy = PrivacySetting.PUBLIC;
    @Builder.Default
    private PrivacySetting profilePicPrivacy = PrivacySetting.PUBLIC;
}
