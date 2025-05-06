export default function Header({ title }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="text-2xl font-semibold">{title}</div>
    </div>
  );
}
