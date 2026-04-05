import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

/**
 * API Route: Lookup SecureID bracelet
 *
 * Recherche un bracelet SecureID et retourne le profil associé.
 * Utilise Firebase Admin pour accéder aux données côté serveur.
 */
export async function POST(request: Request) {
  try {
    const { braceletCode } = await request.json();

    if (!braceletCode || typeof braceletCode !== "string") {
      return NextResponse.json(
        { error: "Code bracelet requis" },
        { status: 400 }
      );
    }

    const code = braceletCode.toUpperCase().trim();
    const db = getAdminDb();

    // Essayer plusieurs structures possibles

    // 1. Chercher directement par document ID dans "bracelets"
    let braceletDoc = await db.collection("bracelets").doc(code).get();

    // 2. Si pas trouvé, chercher par champ "code" dans "bracelets"
    if (!braceletDoc.exists) {
      const braceletQuery = await db.collection("bracelets")
        .where("code", "==", code)
        .limit(1)
        .get();

      if (!braceletQuery.empty) {
        braceletDoc = braceletQuery.docs[0];
      }
    }

    // 3. Si pas trouvé, chercher par champ "braceletId" dans "bracelets"
    if (!braceletDoc.exists) {
      const braceletQuery = await db.collection("bracelets")
        .where("braceletId", "==", code)
        .limit(1)
        .get();

      if (!braceletQuery.empty) {
        braceletDoc = braceletQuery.docs[0];
      }
    }

    // 4. Chercher directement dans "profiles" par braceletId
    if (!braceletDoc.exists) {
      const profileQuery = await db.collection("profiles")
        .where("braceletId", "==", code)
        .limit(1)
        .get();

      if (!profileQuery.empty) {
        const profileData = profileQuery.docs[0].data();
        return NextResponse.json({
          success: true,
          profile: {
            id: profileQuery.docs[0].id,
            childName: profileData.name || profileData.childName || "",
            childAge: profileData.age || profileData.childAge || 0,
            childGender: profileData.gender || profileData.childGender || "M",
            childPhotoURL: profileData.photoURL || profileData.childPhotoURL || profileData.photo || "",
            parentPhone: profileData.parentPhone || profileData.phone || "",
            braceletId: code,
          },
        });
      }
    }

    // 5. Chercher dans "children" par braceletId
    if (!braceletDoc.exists) {
      const childQuery = await db.collection("children")
        .where("braceletId", "==", code)
        .limit(1)
        .get();

      if (!childQuery.empty) {
        const childData = childQuery.docs[0].data();
        return NextResponse.json({
          success: true,
          profile: {
            id: childQuery.docs[0].id,
            childName: childData.name || childData.childName || childData.firstName || "",
            childAge: childData.age || childData.childAge || 0,
            childGender: childData.gender || childData.childGender || "M",
            childPhotoURL: childData.photoURL || childData.photo || "",
            parentPhone: childData.parentPhone || childData.phone || "",
            braceletId: code,
          },
        });
      }
    }

    if (!braceletDoc.exists) {
      // Debug: lister les collections disponibles pour diagnostic
      const collections = await db.listCollections();
      const collectionNames = collections.map(c => c.id);

      return NextResponse.json(
        {
          error: "Bracelet introuvable",
          debug: {
            searchedCode: code,
            availableCollections: collectionNames,
          }
        },
        { status: 404 }
      );
    }

    // Bracelet trouvé, récupérer le profil
    const braceletData = braceletDoc.data();
    const profileId = braceletData?.linkedProfileId || braceletData?.profileId || braceletData?.childId;

    if (!profileId) {
      return NextResponse.json(
        {
          error: "Ce bracelet n'est pas associé à un profil enfant",
          debug: { braceletData }
        },
        { status: 404 }
      );
    }

    // Chercher le profil dans plusieurs collections possibles
    let profileDoc = await db.collection("profiles").doc(profileId).get();

    if (!profileDoc.exists) {
      profileDoc = await db.collection("children").doc(profileId).get();
    }

    if (!profileDoc.exists) {
      profileDoc = await db.collection("users").doc(profileId).get();
    }

    // Chercher aussi dans une sous-collection profiles de l'utilisateur lié
    if (!profileDoc.exists && braceletData?.linkedUserId) {
      const userProfilesQuery = await db
        .collection("users")
        .doc(braceletData.linkedUserId)
        .collection("profiles")
        .doc(profileId)
        .get();

      if (userProfilesQuery.exists) {
        profileDoc = userProfilesQuery;
      }
    }

    // Chercher le profil directement par ID dans la collection profiles (sans user)
    if (!profileDoc.exists) {
      // Peut-être que le profileId contient un préfixe comme "profile_"
      const profilesQuery = await db.collection("profiles")
        .where("__name__", "==", profileId)
        .limit(1)
        .get();

      if (!profilesQuery.empty) {
        profileDoc = profilesQuery.docs[0];
      }
    }

    if (!profileDoc.exists) {
      return NextResponse.json(
        {
          error: "Profil enfant introuvable",
          debug: {
            profileId,
            linkedUserId: braceletData?.linkedUserId,
            braceletStatus: braceletData?.status
          }
        },
        { status: 404 }
      );
    }

    const profileData = profileDoc.data();

    return NextResponse.json({
      success: true,
      profile: {
        id: profileId,
        childName: profileData?.name || profileData?.childName || profileData?.firstName || profileData?.fullName || "",
        childAge: profileData?.age || profileData?.childAge || 0,
        childGender: profileData?.gender || profileData?.childGender || profileData?.sex || "M",
        childPhotoURL: profileData?.photoURL || profileData?.photo || profileData?.childPhotoURL || profileData?.imageUrl || "",
        parentPhone: profileData?.parentPhone || profileData?.phone || profileData?.contactPhone || "",
        braceletId: code,
      },
    });

  } catch (error) {
    console.error("Error looking up SecureID:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    );
  }
}
