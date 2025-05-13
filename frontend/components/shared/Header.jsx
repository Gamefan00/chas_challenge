export default function Header({ title }) {
  return (
    <div className="mb-8 flex items-center justify-center md:justify-between">
      <div className="text-2xl font-semibold md:text-3xl">{title}</div>
    </div>
  );
}
