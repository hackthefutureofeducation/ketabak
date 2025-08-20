import { save } from '@tauri-apps/plugin-dialog';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { lexicalTransformer } from '../lib/transformer';
import { useFile } from '../providers/FileProvider';
import { invoke } from '@tauri-apps/api/core';

export default function ExportPage() {
  const { content } = useFile();
  const exportEpub = async () => {
    const epubContent = content
      ? await Promise.all(
          content.pages.map(async (page) => ({
            ...page,
            content: await lexicalTransformer(page.content),
          }))
        )
      : [];
    const book = { ...content, pages: epubContent };

    // Ask user where to save
    const filePath = await save({
      title: 'Save your EPUB',
      defaultPath: `${book.meta?.title}.epub`,
      filters: [{ name: 'EPUB books', extensions: ['epub'] }],
    });

    if (!filePath) {
      console.log('Save canceled');
      return;
    }

    // Call Rust command
    const output = await invoke<string>('generate_epub', {
      json: JSON.stringify(book),
      outputPath: filePath,
    });
    console.log('✅ EPUB written to:', output);
  };

  const exports = [
    {
      title: 'EPUB',
      description: 'Export your project as an EPUB file.',
      onClick: exportEpub,
    },
  ];

  return (
    <section className="w-full text-left p-6">
      <h1 className="text-2xl text-primary mb-4">Export</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exports.map((exportOption, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={exportOption.onClick}
          >
            <CardHeader>
              <CardTitle>{exportOption.title}</CardTitle>
              <CardDescription>{exportOption.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
