import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex justify-center items-center text-sm text-muted-foreground min-h-[12vh]">
      <Loader2 className="animate-spin mr-2" />
      加载中...
    </div>
  );
}
