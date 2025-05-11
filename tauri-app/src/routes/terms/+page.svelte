<script>
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../renamer-website/src/lib/components/ui/accordion";
    import { Button } from "../../../../renamer-website/src/lib/components/ui/button/index.js";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../renamer-website/src/lib/components/ui/card/index.js";
    import { Checkbox } from "../../../../renamer-website/src/lib/components/ui/checkbox/index.ts";

    let accepted = $state(false);

    const handleAccept = () => {
        if (accepted) {
            // Logic for acceptance
            console.log("Terms accepted");
        }
    };
</script>

<div class="container mx-auto py-8 px-4 max-w-3xl">
    <Card>
        <CardHeader>
            <CardTitle class="text-2xl font-bold">Conditions d'Utilisation - Renamer</CardTitle>
            <CardDescription>Veuillez lire attentivement les conditions suivantes avant d'utiliser le logiciel</CardDescription>
        </CardHeader>

        <CardContent>
            <div class="prose prose-sm max-w-none">
                <p class="text-sm text-gray-500">Dernière mise à jour : 11 mai 2025</p>

                <Accordion type="single" class="w-full">
                    <AccordionItem value="section-1">
                        <AccordionTrigger>1. Introduction et Définitions</AccordionTrigger>
                        <AccordionContent>
                            <p>Le présent Contrat de Licence Utilisateur Final (« CLUF ») constitue un accord légal entre vous (« l'Utilisateur ») et [Votre Nom ou Société] (« le Concédant ») concernant l'utilisation du logiciel Renamer (« le Logiciel »).</p>
                            <p>En installant, en accédant ou en utilisant le Logiciel, vous acceptez d'être lié par les termes de ce CLUF. Si vous n'acceptez pas ces termes, vous ne devez pas installer, accéder ou utiliser le Logiciel.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-2">
                        <AccordionTrigger>2. Octroi de Licence</AccordionTrigger>
                        <AccordionContent>
                            <p>Sous réserve du paiement des frais de licence applicables et du respect des termes de ce CLUF, le Concédant vous accorde une licence non exclusive, non transférable et révocable pour utiliser le Logiciel conformément à la documentation associée.</p>
                            <p>Cette licence permet d'installer et d'utiliser le Logiciel sur un nombre d'appareils conforme au type de licence achetée :</p>
                            <ul class="list-disc pl-5 space-y-1">
                                <li>Licence Individuelle : installation sur un (1) appareil à usage personnel</li>
                                <li>Licence Professionnelle : installation sur jusqu'à cinq (5) appareils au sein d'une même organisation</li>
                                <li>Licence Entreprise : installation sur un nombre illimité d'appareils au sein d'une même organisation</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-3">
                        <AccordionTrigger>3. Droits de Propriété Intellectuelle</AccordionTrigger>
                        <AccordionContent>
                            <p>Le Logiciel est protégé par les lois sur le droit d'auteur et autres lois et traités sur la propriété intellectuelle. Le Concédant détient tous les droits, titres et intérêts relatifs au Logiciel, y compris tous les droits d'auteur, brevets, secrets commerciaux, marques commerciales et autres droits de propriété intellectuelle.</p>
                            <p>Vous reconnaissez que la licence accordée ne vous confère aucun titre ou droit de propriété sur le Logiciel et ne constitue pas une vente de droits sur le Logiciel.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-4">
                        <AccordionTrigger>4. Restrictions</AccordionTrigger>
                        <AccordionContent>
                            <p>Vous vous engagez à ne pas :</p>
                            <ul class="list-disc pl-5 space-y-1">
                                <li>Copier, modifier, adapter ou traduire le Logiciel</li>
                                <li>Décompiler, désassembler ou tenter de découvrir le code source du Logiciel</li>
                                <li>Créer des œuvres dérivées basées sur le Logiciel</li>
                                <li>Louer, prêter, vendre, distribuer ou sous-licencier le Logiciel</li>
                                <li>Supprimer ou modifier toute mention de droit d'auteur ou de propriété du Logiciel</li>
                                <li>Utiliser le Logiciel à des fins illégales ou non autorisées</li>
                                <li>Contourner les mesures techniques de protection intégrées au Logiciel</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-5">
                        <AccordionTrigger>5. Mises à Jour et Support</AccordionTrigger>
                        <AccordionContent>
                            <p>Le Concédant peut, à sa discrétion, fournir des mises à jour, des améliorations ou de nouvelles versions du Logiciel. Les termes de ce CLUF s'appliqueront à ces mises à jour, sauf si elles sont accompagnées de conditions distinctes.</p>
                            <p>Le support technique est fourni selon les modalités définies dans le type de licence acheté et pour la durée spécifiée lors de l'achat.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-6">
                        <AccordionTrigger>6. Collecte de Données</AccordionTrigger>
                        <AccordionContent>
                            <p>Le Logiciel peut collecter certaines données d'utilisation pour améliorer les performances, diagnostiquer des problèmes ou fournir des mises à jour. Ces données sont collectées de manière anonyme et conformément à notre Politique de Confidentialité disponible sur notre site web.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-7">
                        <AccordionTrigger>7. Résiliation</AccordionTrigger>
                        <AccordionContent>
                            <p>Cette licence est valable jusqu'à sa résiliation. Vous pouvez la résilier à tout moment en désinstallant le Logiciel et en détruisant toutes ses copies.</p>
                            <p>Le Concédant peut résilier cette licence immédiatement si vous ne respectez pas l'une des conditions du présent CLUF. Dans ce cas, vous devez cesser toute utilisation du Logiciel et détruire toutes ses copies.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-8">
                        <AccordionTrigger>8. Exclusion de Garantie</AccordionTrigger>
                        <AccordionContent>
                            <p>LE LOGICIEL EST FOURNI « TEL QUEL » SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU IMPLICITE, Y COMPRIS, MAIS SANS S'Y LIMITER, LES GARANTIES DE QUALITÉ MARCHANDE, D'ADÉQUATION À UN USAGE PARTICULIER ET DE NON-VIOLATION.</p>
                            <p>LE CONCÉDANT NE GARANTIT PAS QUE LE LOGICIEL RÉPONDRA À VOS EXIGENCES OU QUE SON FONCTIONNEMENT SERA ININTERROMPU OU EXEMPT D'ERREURS.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-9">
                        <AccordionTrigger>9. Limitation de Responsabilité</AccordionTrigger>
                        <AccordionContent>
                            <p>EN AUCUN CAS, LE CONCÉDANT NE SERA RESPONSABLE DE DOMMAGES PARTICULIERS, ACCESSOIRES, INDIRECTS OU CONSÉCUTIFS, Y COMPRIS, MAIS SANS S'Y LIMITER, LES PERTES DE BÉNÉFICES, DE DONNÉES OU D'UTILISATION, DÉCOULANT DE L'UTILISATION OU DE L'IMPOSSIBILITÉ D'UTILISER LE LOGICIEL.</p>
                            <p>LA RESPONSABILITÉ TOTALE DU CONCÉDANT POUR TOUTE RÉCLAMATION EN VERTU DE CE CLUF NE DÉPASSERA PAS LE MONTANT QUE VOUS AVEZ PAYÉ POUR LE LOGICIEL.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="section-10">
                        <AccordionTrigger>10. Droit Applicable</AccordionTrigger>
                        <AccordionContent>
                            <p>Ce CLUF est régi par les lois de la France, sans égard aux principes de conflit de lois. Tout litige découlant de ce CLUF sera soumis à la compétence exclusive des tribunaux de [Votre Juridiction].</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </CardContent>

        <CardFooter class="flex flex-col items-start space-y-4">
            <div class="flex items-center space-x-2">
                <Checkbox id="terms" checked={accepted} onCheckedChange={(checked) => accepted = !!checked} />
                <label for="terms" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    J'ai lu et j'accepte les conditions d'utilisation
                </label>
            </div>

            <Button disabled={!accepted} onclick={handleAccept} class="w-full sm:w-auto">
                Accepter et Continuer
            </Button>
        </CardFooter>
    </Card>
</div>
