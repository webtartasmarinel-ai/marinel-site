import { PageHeader } from "@/components/admin/page-header";
import { LegalSettingsForm } from "@/components/admin/legal-settings-form";
import { getSiteSettings } from "@/services/settings";

export default async function AdminLegalPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        title="Datos legales"
        description="Datos de la titular que aparecen en el aviso legal y la política de privacidad."
      />
      <LegalSettingsForm settings={settings} />
    </div>
  );
}
