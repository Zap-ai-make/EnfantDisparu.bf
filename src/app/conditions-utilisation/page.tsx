export default function ConditionsUtilisation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Conditions d'Utilisation</h1>

      <div className="prose prose-lg">
        <p className="text-gray-600 mb-4">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant EnfantDisparu.bf, vous acceptez d'être lié par ces
            conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas
            utiliser notre plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Mission de la plateforme</h2>
          <p>
            EnfantDisparu.bf est une plateforme d'alerte citoyenne à but non lucratif dédiée
            à la recherche d'enfants disparus au Burkina Faso. Notre mission est de faciliter
            la diffusion rapide d'alertes et de mobiliser la communauté pour retrouver les
            enfants disparus.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Utilisation de la plateforme</h2>
          <p>Vous vous engagez à :</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Fournir des informations exactes et véridiques lors de la création d'une alerte</li>
            <li>Ne pas utiliser la plateforme à des fins malveillantes ou frauduleuses</li>
            <li>Respecter la vie privée et la dignité des personnes concernées</li>
            <li>Signaler uniquement de véritables disparitions d'enfants</li>
            <li>Ne pas diffuser de fausses informations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Publication sur les réseaux sociaux</h2>
          <p>
            En créant une alerte, vous autorisez EnfantDisparu.bf à publier automatiquement
            les informations et photos fournies sur nos comptes de réseaux sociaux (Facebook,
            TikTok, etc.) dans le but de maximiser la diffusion de l'alerte et d'augmenter
            les chances de retrouver l'enfant disparu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
          <p>
            Les photos et informations soumises restent la propriété de leurs auteurs. En
            soumettant du contenu, vous accordez à EnfantDisparu.bf une licence non exclusive
            pour diffuser ce contenu dans le cadre de la mission de recherche d'enfants disparus.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Responsabilité</h2>
          <p>
            EnfantDisparu.bf fait de son mieux pour diffuser les alertes rapidement et
            efficacement, mais ne peut garantir la retrouvaille d'un enfant disparu. La
            plateforme agit comme un facilitateur de communication et ne remplace pas les
            services officiels des forces de l'ordre.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Suppression de contenu</h2>
          <p>
            Nous nous réservons le droit de supprimer tout contenu qui violerait ces conditions
            d'utilisation ou qui serait jugé inapproprié.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment.
            Les modifications entrent en vigueur dès leur publication sur cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter
            via les coordonnées disponibles sur notre plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Loi applicable</h2>
          <p>
            Ces conditions d'utilisation sont régies par les lois du Burkina Faso.
          </p>
        </section>
      </div>
    </div>
  );
}
