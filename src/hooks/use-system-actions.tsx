
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSystemActions = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const verifyAdminPassword = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const password = prompt('Veuillez entrer le mot de passe administrateur pour continuer :');
      
      if (password === 'Mindi/S3n@teur!') {
        resolve(true);
      } else {
        toast({
          title: "Accès refusé",
          description: "Mot de passe administrateur incorrect.",
          variant: "destructive",
        });
        resolve(false);
      }
    });
  };

  const exportContacts = async (): Promise<boolean> => {
    try {
      // Vérification du mot de passe admin
      const isAuthorized = await verifyAdminPassword();
      if (!isAuthorized) return false;

      setIsExporting(true);
      
      // Récupérer les vrais messages de contact depuis Supabase
      const { data: contacts, error } = await supabase
        .from('contact_messages')
        .select('name, email, phone, subject, message, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des contacts:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de contact.",
          variant: "destructive",
        });
        return false;
      }

      if (!contacts || contacts.length === 0) {
        toast({
          title: "Aucune donnée",
          description: "Aucun message de contact à exporter.",
          variant: "destructive",
        });
        return false;
      }

      // Créer le contenu CSV avec les vraies données
      const csvHeaders = "Nom,Email,Téléphone,Sujet,Message,Date de création";
      const csvRows = contacts.map(contact => {
        const formatDate = new Date(contact.created_at).toLocaleDateString('fr-FR');
        return `"${contact.name}","${contact.email}","${contact.phone || 'N/A'}","${contact.subject}","${contact.message.replace(/"/g, '""')}","${formatDate}"`;
      });
      
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      
      // Télécharger le fichier CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Contacts exportés",
        description: `${contacts.length} contacts ont été exportés avec succès.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'exportation des contacts:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exportation des contacts.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const generateReport = async (): Promise<boolean> => {
    try {
      // Vérification du mot de passe admin
      const isAuthorized = await verifyAdminPassword();
      if (!isAuthorized) return false;

      setIsGenerating(true);
      
      // Récupérer les statistiques réelles depuis Supabase
      const [newsResult, programsResult, activitiesResult, documentsResult, contactsResult] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact' }),
        supabase.from('programs').select('*', { count: 'exact' }),
        supabase.from('activities').select('*', { count: 'exact' }),
        supabase.from('documents').select('*', { count: 'exact' }),
        supabase.from('contact_messages').select('*', { count: 'exact' })
      ]);

      const newsCount = newsResult.count || 0;
      const programsCount = programsResult.count || 0;
      const activitiesCount = activitiesResult.count || 0;
      const documentsCount = documentsResult.count || 0;
      const contactsCount = contactsResult.count || 0;

      // Récupérer les messages récents
      const { data: recentContacts } = await supabase
        .from('contact_messages')
        .select('created_at, is_read')
        .order('created_at', { ascending: false })
        .limit(10);

      const unreadMessages = recentContacts?.filter(msg => !msg.is_read).length || 0;

      // Générer le rapport avec les vraies données
      const reportContent = `RAPPORT D'ACTIVITÉ DU SITE WEB
===============================================

Date de génération: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

STATISTIQUES GÉNÉRALES
----------------------
• Actualités publiées: ${newsCount}
• Programmes disponibles: ${programsCount}
• Activités planifiées: ${activitiesCount}
• Documents en ligne: ${documentsCount}
• Messages de contact: ${contactsCount}
• Messages non lus: ${unreadMessages}

CONTENU TOTAL: ${newsCount + programsCount + activitiesCount + documentsCount} éléments

ACTIVITÉ RÉCENTE
----------------
${recentContacts?.slice(0, 5).map(contact => 
  `• Message reçu le ${new Date(contact.created_at).toLocaleDateString('fr-FR')} ${contact.is_read ? '(lu)' : '(non lu)'}`
).join('\n') || 'Aucune activité récente'}

RECOMMANDATIONS
---------------
${unreadMessages > 0 ? `• ${unreadMessages} message(s) en attente de lecture` : '• Tous les messages ont été traités'}
${newsCount === 0 ? '• Ajouter des actualités pour maintenir l\'engagement' : ''}
${programsCount === 0 ? '• Publier des programmes pour informer les citoyens' : ''}

---
Rapport généré automatiquement par le système d'administration
`;

      // Télécharger le rapport
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `rapport_activite_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Rapport généré",
        description: "Le rapport d'activité complet a été généré avec les données actuelles.",
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du rapport.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    exportContacts,
    generateReport,
    isExporting,
    isGenerating
  };
};
