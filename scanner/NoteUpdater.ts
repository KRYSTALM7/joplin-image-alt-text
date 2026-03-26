import joplin from 'api';

function injectLabel(
  markdown: string,
  resourceId: string,
  label: string
): string {
  const pattern = new RegExp(
    `!\\[([^\\]]*?)\\]\\(:\/${resourceId}\\)`,
    'g'
  );
  return markdown.replace(pattern, (match, existingAlt) => {
    if (existingAlt.trim() !== '') return match;
    return `![${label}](:/${resourceId})`;
  });
}

export async function updateNoteAltText(
  resourceId: string,
  label: string
): Promise<void> {
  let page = 1;
  while (true) {
    const result = await joplin.data.get(
      ['resources', resourceId, 'notes'],
      { fields: ['id', 'body'], page, limit: 50 }
    );

    for (const note of result.items) {
      const updated = injectLabel(note.body, resourceId, label);
      if (updated !== note.body) {
        await joplin.data.put(['notes', note.id], null, { body: updated });
      }
    }

    if (!result.has_more) break;
    page++;
  }
}