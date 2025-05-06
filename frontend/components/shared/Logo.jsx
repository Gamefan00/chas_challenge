import { Plus } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <>
      {/* Logo and site name  */}
      <div className="items-center">
        <Link href="/" className="flex items-center">
          <Plus className="text-background bg-primary mr-2 rounded-md" />
          <h3 className="text-primary">Ansökshjälpen</h3>
        </Link>
      </div>
    </>
  );
};

export default Logo;
