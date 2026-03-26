import joplin from 'api';
import { SettingItemType } from 'api/types';

export async function registerSettings(): Promise<void> {
  await joplin.settings.registerSection('imageAltText', {
    label: 'Image Alt Text',
    iconName: 'fas fa-image'
  });

  await joplin.settings.registerSettings({
    apiKey: {
      value: '',
      type: SettingItemType.String,
      secure: true,
      section: 'imageAltText',
      public: true,
      label: 'API Key (OpenAI or Google)'
    },
    selectedModel: {
      value: 'gpt-4o',
      type: SettingItemType.String,
      isEnum: true,
      options: {
        'gpt-4o': 'GPT-4o (OpenAI)',
        'gemini-1.5-flash': 'Gemini 1.5 Flash (Google)'
      },
      section: 'imageAltText',
      public: true,
      label: 'Vision Model'
    }
  });
}
