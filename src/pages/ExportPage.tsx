import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function ExportPage() {
  const exports = [
    {
      title: 'EPUB',
      description: 'Export your project as an EPUB file.',
      onClick: () => alert('We are working on it!'),
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
