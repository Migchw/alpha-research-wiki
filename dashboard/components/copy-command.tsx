'use client';

import { useState } from 'react';
import { Check, ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// dashboard แก้ไฟล์ใน vault ไม่ได้ ปุ่มนี้แค่คัดลอกคำสั่งไปวางใน agent
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      title={command}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(command);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt('คัดลอกคำสั่งนี้', command);
        }
      }}
    >
      {copied ? <Check aria-hidden /> : <ClipboardCopy aria-hidden />}
      {copied ? 'คัดลอกแล้ว' : 'คัดลอก /find-paper'}
    </Button>
  );
}
