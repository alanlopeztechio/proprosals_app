import Link from 'next/link';
import { Doc } from '@/convex/_generated/dataModel';

interface NameCellProps {
  data: Doc<'clients'>;
}

export function NameCell({ data }: NameCellProps) {
  return (
    <Link
      href={`/clients/${data._id}`}
      className="font-bold text-[#F59F0A] cursor-pointer hover:underline"
    >
      {data.name}
    </Link>
  );
}
