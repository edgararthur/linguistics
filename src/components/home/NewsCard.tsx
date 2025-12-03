type NewsCardProps = {
  title: string;
  description: string;
};

export default function NewsCard({ title, description }: NewsCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
