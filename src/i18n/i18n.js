import I18n from 'react-native-i18n';
import ja from './locales/ja';
import ko from './locales/ko';
import en from './locales/en';
import es from './locales/es';
import zh from './locales/zh';
import zh_tw from './locales/zh-tw';
import fr from './locales/fr';
import th from './locales/th';


I18n.fallbacks = true;

I18n.translations = {
  // ja,
  // zh,
  // 'zh-tw' : zh_tw,
  // ko,
  en,
  // fr,
  // th,
  // es
};

export default I18n; 