import { AuthProvider } from "../features/auth";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
