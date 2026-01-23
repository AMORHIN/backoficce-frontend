
import ClientOnlyLayout from "./layout.client";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return <ClientOnlyLayout>{children}</ClientOnlyLayout>;
}
