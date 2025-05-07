import Image from "next/image"
import Link from "next/link"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image src="/logo.png" alt="CHECHE" width={120} height={40} priority className="h-8 w-auto" />
    </Link>
  )
}
