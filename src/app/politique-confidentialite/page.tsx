export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>

      <div className="prose prose-lg">
        <p className="text-gray-600 mb-4">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            EnfantDisparu.bf s'engage à protéger la vie privée de ses utilisateurs. Cette
            politique de confidentialité explique comment nous collectons, utilisons et
            protégeons vos données personnelles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc ml-6 mt-2">
            <li>
              <strong>Informations sur l'enfant disparu :</strong> nom, prénom, âge, photo,
              description physique, lieu de disparition, circonstances
            </li>
            <li>
              <strong>Informations de contact :</strong> nom du déclarant, numéro de téléphone,
              email (optionnel)
            </li>
            <li>
              <strong>Données de localisation :</strong> lieu de disparition, zone de recherche
            </li>
            <li>
              <strong>Données techniques :</strong> adresse IP, type de navigateur, données
              d'utilisation (pour améliorer le service)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Créer et diffuser des alertes de disparition</li>
            <li>Publier automatiquement sur les réseaux sociaux (Facebook, TikTok, etc.)</li>
            <li>Coordonner les recherches avec les Vigies citoyennes</li>
            <li>Contacter les déclarants en cas de nouvelle information</li>
            <li>Améliorer le fonctionnement de la plateforme</li>
            <li>Générer des statistiques anonymes sur les disparitions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
          <p>
            Les informations sur les enfants disparus sont <strong>publiques par nature</strong>{' '}
            car l'objectif est de maximiser la diffusion pour retrouver l'enfant. Ces données
            sont partagées :
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Sur notre site web public</li>
            <li>Sur nos comptes de réseaux sociaux (Facebook, TikTok)</li>
            <li>Avec les Vigies citoyennes inscrites dans les zones concernées</li>
            <li>
              Avec les autorités compétentes (police, gendarmerie) si nécessaire
            </li>
          </ul>
          <p className="mt-4">
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Conservation des données</h2>
          <p>
            Les données des alertes actives sont conservées tant que l'enfant n'est pas
            retrouvé. Une fois l'enfant retrouvé, l'alerte est archivée mais peut être
            consultée à des fins statistiques. Les données de contact sont conservées
            pendant 2 ans après la résolution du cas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos
            données contre tout accès non autorisé :
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Chiffrement des communications (HTTPS)</li>
            <li>Base de données sécurisée (Firebase)</li>
            <li>Accès restreint aux données sensibles</li>
            <li>Sauvegardes régulières</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Vos droits</h2>
          <p>Vous avez le droit de :</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger des informations inexactes</li>
            <li>Demander la suppression d'une alerte (avec justification)</li>
            <li>Retirer votre consentement à tout moment</li>
            <li>Vous opposer au traitement de vos données</li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, contactez-nous via les coordonnées disponibles sur
            notre plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies et technologies similaires</h2>
          <p>
            Nous utilisons des cookies essentiels pour le fonctionnement du site et des
            cookies analytiques pour améliorer nos services. Vous pouvez configurer votre
            navigateur pour refuser les cookies, mais cela peut affecter certaines
            fonctionnalités du site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Services tiers</h2>
          <p>Nous utilisons les services suivants qui ont leurs propres politiques de confidentialité :</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Firebase (Google) - Hébergement et base de données</li>
            <li>Vercel - Hébergement du site web</li>
            <li>Facebook - Publication d'alertes</li>
            <li>TikTok - Publication d'alertes</li>
            <li>Leaflet/OpenStreetMap - Cartographie</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Mineurs</h2>
          <p>
            Notre plateforme concerne principalement les enfants disparus. Les alertes
            peuvent être créées par des adultes (parents, tuteurs) au nom de mineurs. Les
            photos et informations sur les mineurs sont publiées uniquement dans le but
            légitime de les retrouver.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Modifications de cette politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à
            tout moment. Les modifications entrent en vigueur dès leur publication sur
            cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou pour exercer
            vos droits, veuillez nous contacter via les coordonnées disponibles sur notre
            plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Juridiction</h2>
          <p>
            Cette politique de confidentialité est régie par les lois du Burkina Faso en
            matière de protection des données personnelles.
          </p>
        </section>
      </div>
    </div>
  );
}
