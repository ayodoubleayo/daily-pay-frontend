import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
