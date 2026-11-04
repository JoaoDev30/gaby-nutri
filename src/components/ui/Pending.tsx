import { siteConfig } from "@/config/site";

/**
 * Marca conteúdo que ainda precisa ser confirmado pela nutricionista.
 * Com `showPendingMarkers: false`, o texto aparece sem o destaque.
 */
export function Pending({
  children,
  label = "a confirmar",
  block = false,
}: {
  children: React.ReactNode;
  label?: string;
  block?: boolean;
}) {
  if (!siteConfig.showPendingMarkers) return <>{children}</>;
  const Tag = block ? "div" : "span";
  return (
    <Tag className={block ? "pending block p-4" : "pending px-1"} data-pending="">
      {block ? (
        <span className="pending-tag mb-2 ml-0">{label}</span>
      ) : null}
      {block ? <div>{children}</div> : children}
      {!block ? <span className="pending-tag">{label}</span> : null}
    </Tag>
  );
}
