import { useAuth } from '../../hooks/useAuth';

export default function RequireAuthority({ authority, anyOf, children, fallback = null }) {
  const { hasAuthority, hasAnyAuthority } = useAuth();
  const allowed = anyOf
    ? hasAnyAuthority(...anyOf)
    : authority
      ? hasAuthority(authority)
      : true;
  if (!allowed) return fallback;
  return children;
}
