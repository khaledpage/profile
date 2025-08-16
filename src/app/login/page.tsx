import { getSiteConfig } from '@/utils/content';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage() {
  const config = await getSiteConfig();

  return <LoginForm config={config} />;
}
