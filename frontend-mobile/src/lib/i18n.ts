import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
    en: {
        translation: {
            "welcome": "Welcome",
            "chats": "Chats",
            "contacts": "Contacts",
            "moments": "Moments",
            "discover": "Discover",
            "miniapps": "MiniApps",
            "wallet": "Wallet",
            "profile": "Profile",
            "select_language": "Select Language",
            "login_title": "Login to WITS",
            "group_create": "Create Group",
            "group_name": "Group Name",
            "select_members": "Select Members",
            "save": "Save",
            "cancel": "Cancel"
        }
    },
    zh: {
        translation: {
            "welcome": "欢迎",
            "chats": "聊天",
            "contacts": "通讯录",
            "moments": "朋友圈",
            "discover": "发现",
            "miniapps": "小程序",
            "wallet": "钱包",
            "profile": "开发者",
            "select_language": "选择语言",
            "login_title": "登录 WITS",
            "group_create": "发起群聊",
            "group_name": "群聊名称",
            "select_members": "选择成员",
            "save": "保存",
            "cancel": "取消"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        }
    });

export default i18n;
