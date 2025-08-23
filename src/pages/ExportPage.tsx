import { useState } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { lexicalTransformer } from '../lib/transformer';
import { useFile } from '../providers/FileProvider';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export default function ExportPage() {
  const { content } = useFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportEpub = async () => {
    // Prevent multiple exports while already loading
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const epubContent = content
        ? await Promise.all(
            content.pages.map(async (page) => ({
              ...page,
              content: await lexicalTransformer(page.content),
            }))
          )
        : [];

      const book = { ...content, pages: epubContent };
      console.log(book);

      // Ask user where to save
      const filePath = await save({
        title: 'Save your EPUB',
        defaultPath: `${book.meta?.title || 'book'}.epub`,
        filters: [{ name: 'EPUB books', extensions: ['epub'] }],
      });

      if (!filePath) {
        console.log('Save canceled');
        return;
      }

      // Call Rust command
      await invoke<string>('generate_epub', {
        json: JSON.stringify(book),
        outputPath: filePath,
      });

      toast.success(`EPUB exported successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to export EPUB');
      toast.error(`Failed to export EPUB: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
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

      {error && <p className="text-sm text-red-500 mb-2">⚠️ {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exports.map((exportOption, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-shadow ${
              loading ? 'opacity-50 pointer-events-none' : 'hover:shadow-lg'
            }`}
            onClick={exportOption.onClick}
          >
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>{exportOption.title}</CardTitle>
                <CardDescription>{exportOption.description}</CardDescription>
              </div>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
