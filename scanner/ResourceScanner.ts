import joplin from 'api';
import * as crypto from 'crypto';
import { LabelCache } from '../cache/LabelCache';
import { getAdapter } from '../api/VisionAdapter';
import { updateNoteAltText } from './NoteUpdater';

interface Resource {
  id: string;
  title: string;
  mime: string;
  updated_time: number;
}

async function* enumerateImageResources(): AsyncGenerator<Resource> {
  let page = 1;
  while (true) {
    const result = await joplin.data.get(['resources'], {
      fields: ['id', 'title', 'mime', 'updated_time'],
      page,
      limit: 100
    });
    const images = result.items.filter((r: Resource) =>
      r.mime.startsWith('image/')
    );
    for (const img of images) yield img;
    if (!result.has_more) break;
    page++;
  }
}

export async function runScan(): Promise<void> {
  const settings = await joplin.settings.values([
    'apiKey',
    'selectedModel'
  ]);

  const cache = new LabelCache();
  const adapter = getAdapter(
    settings.selectedModel as string,
    settings.apiKey as string
  );

  for await (const resource of enumerateImageResources()) {
    try {
      const fileData: ArrayBuffer = await joplin.data.get(
        ['resources', resource.id, 'file'],
        {}
      );
      const buffer = Buffer.from(fileData);
      const hash = crypto
        .createHash('sha256')
        .update(buffer)
        .digest('hex');

      const cached = cache.get(hash, settings.selectedModel as string);
      if (cached) continue;

      const base64 = buffer.toString('base64');
      const label = await adapter.describe(base64, resource.mime);

      cache.set(hash, label, settings.selectedModel as string);
      await updateNoteAltText(resource.id, label);
    } catch (err) {
      console.error(`Failed to process resource ${resource.id}:`, err);
    }
  }
}