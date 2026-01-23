import { redirect } from 'next/navigation';
export default function Home() {
		// Check for TailwindCSS usage and configuration issues
		redirect('/dashboard');
}
