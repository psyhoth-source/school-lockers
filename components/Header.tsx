import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <div className="header">
      <Link href="/">
        <Image 
          src="/images/logo.png"
          alt="Логотип"
          className="logo"
          width={45}
          height={45}
          priority
        />
      </Link>
    </div>
  );
}; 