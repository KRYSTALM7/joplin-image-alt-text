import joplin from 'api';
import { registerSettings } from './ui/SettingsPanel';
import { runScan } from './scanner/ResourceScanner';

joplin.plugins.register({
  onStart: async function () {
    await registerSettings();

    await joplin.commands.register({
      name: 'scanImageAltText',
      label: 'Generate Alt Text for Images',
      execute: async () => {
        await runScan();
      }
    });

    await joplin.views.menuItems.create(
      'menuItemScan',
      'scanImageAltText',
      'tools'
    );
  }
});